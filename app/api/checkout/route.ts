import { NextResponse } from "next/server";
import { commerce, priceCart, type CartLine } from "@/lib/commerce";
import { getDict } from "@/lib/dict";
import { isLocale, type Locale } from "@/lib/i18n";
import { notifyOrder, orderRef, type Customer, type PaymentMethod } from "@/lib/orders";
import { products, site } from "@/lib/site";

/**
 * Un solo endpoint para los tres caminos de pago.
 *
 * Regla que no se rompe: el navegador manda ids, cantidades y cupon. Los
 * precios se vuelven a calcular aqui desde el catalogo. Si el cliente manda
 * montos, se ignoran. Es la diferencia entre una tienda y una alcancia abierta.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | {
        method?: PaymentMethod;
        lines?: CartLine[];
        coupon?: string | null;
        customer?: Customer;
        locale?: string;
        tracking?: { fbp?: string | null; fbc?: string | null };
      }
    | null;

  if (!body?.lines?.length || !body.customer || !body.method) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const locale: Locale = isLocale(body.locale ?? "") ? (body.locale as Locale) : "es";
  const customer = body.customer;
  const missing = (["name", "email", "phone", "street", "neighborhood", "city", "state", "zip"] as const).filter(
    (field) => !String(customer[field] ?? "").trim(),
  );
  if (missing.length || !customer.email.includes("@")) {
    return NextResponse.json({ ok: false, error: "invalid_customer", missing }, { status: 422 });
  }

  const totals = priceCart(body.lines, products, { couponCode: body.coupon });
  if (totals.itemCount === 0 || totals.totalCents <= 0) {
    return NextResponse.json({ ok: false, error: "empty_cart" }, { status: 422 });
  }

  const dict = getDict(locale);
  const names = Object.fromEntries(
    totals.lines.map((line) => [
      line.slug,
      dict.products.items[line.slug as keyof typeof dict.products.items].name,
    ]),
  );

  const origin = request.headers.get("origin") ?? site.url;
  const ref = orderRef();
  const base = `${origin}/${locale}`;

  try {
    if (body.method === "stripe") {
      const key = process.env.STRIPE_SECRET_KEY;
      if (!key) return notConfigured("stripe", base, ref);

      const { default: Stripe } = await import("stripe");
      const stripe = new Stripe(key);

      // Los line_items van a precio de lista y el descuento entra como cupon
      // de Stripe: asi el cliente ve el desglose real y los centavos cuadran
      // sin repartir el redondeo a mano linea por linea.
      const discounts = totals.discountCents
        ? [
            {
              coupon: (
                await stripe.coupons.create({
                  percent_off: Math.round((totals.discountCents / totals.subtotalCents) * 10000) / 100,
                  duration: "once",
                  name: totals.couponCode ?? "Descuento",
                })
              ).id,
            },
          ]
        : undefined;

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        // Sin payment_method_types explicito, Stripe usa los metodos activos en
        // el dashboard: tarjeta, Apple Pay, Google Pay, OXXO, SPEI, MSI.
        customer_email: customer.email,
        client_reference_id: ref,
        locale: locale === "en" ? "en" : "es",
        line_items: totals.lines.map((line) => ({
          quantity: line.qty,
          price_data: {
            currency: commerce.currency.toLowerCase(),
            unit_amount: line.unitCents,
            product_data: { name: names[line.slug] ?? line.slug },
          },
        })),
        discounts,
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: totals.shippingCents, currency: commerce.currency.toLowerCase() },
              display_name: totals.shippingCents === 0 ? "Envio gratis" : "Envio",
            },
          },
        ],
        metadata: {
          ref,
          // Para el Purchase del webhook (API de conversiones). Los limites de
          // Stripe son 500 caracteres por valor, por eso van compactos.
          items: totals.lines.map((line) => `${line.id}:${line.qty}:${line.unitCents}`).join(",").slice(0, 500),
          fbp: (body.tracking?.fbp ?? "").slice(0, 200),
          fbc: (body.tracking?.fbc ?? "").slice(0, 300),
          ip: (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim(),
          ua: (request.headers.get("user-agent") ?? "").slice(0, 300),
          src: `${base}/checkout`,
          locale,
          coupon: totals.couponCode ?? "",
          name: customer.name,
          city: customer.city,
          state: customer.state,
          zip: customer.zip,
          phone: customer.phone,
          address: `${customer.street} ${customer.interior ?? ""}, ${customer.neighborhood}, ${customer.city}, ${customer.state}, CP ${customer.zip}`,
          notes: customer.notes ?? "",
        },
        success_url: `${base}/order/success?ref=${ref}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/order/failure?ref=${ref}`,
      });

      await notifyOrder({
        ref,
        method: "stripe",
        status: "iniciado",
        customer,
        totals,
        names,
        locale,
        origin,
      }).catch(() => false);

      return NextResponse.json({ ok: true, url: session.url, ref });
    }

    if (body.method === "mercadopago") {
      const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
      if (!token) return notConfigured("mercadopago", base, ref);

      const { MercadoPagoConfig, Preference } = await import("mercadopago");
      const client = new MercadoPagoConfig({ accessToken: token });

      // Mercado Pago no acepta partidas negativas ni cupones en la
      // preferencia, asi que el descuento se aplica al precio unitario de cada
      // articulo. El desglose sigue siendo honesto y el total cuadra con el
      // que vio el cliente.
      const discountFactor = totals.subtotalCents
        ? 1 - totals.discountCents / totals.subtotalCents
        : 1;

      const preference = await new Preference(client).create({
        body: {
          external_reference: ref,
          items: totals.lines.map((line) => ({
            id: line.id,
            title: names[line.slug] ?? line.slug,
            quantity: line.qty,
            unit_price: Math.round(line.unitCents * discountFactor) / 100,
            currency_id: commerce.currency,
          })),
          shipments: { cost: totals.shippingCents / 100, mode: "not_specified" as const },
          payer: {
            name: customer.name,
            email: customer.email,
            phone: { number: customer.phone },
          },
          back_urls: {
            success: `${base}/order/success?ref=${ref}`,
            pending: `${base}/order/pending?ref=${ref}`,
            failure: `${base}/order/failure?ref=${ref}`,
          },
          auto_return: "approved",
          statement_descriptor: site.name,
        },
      });

      await notifyOrder({
        ref,
        method: "mercadopago",
        status: "iniciado",
        customer,
        totals,
        names,
        locale,
        origin,
      }).catch(() => false);

      return NextResponse.json({ ok: true, url: preference.init_point, ref });
    }

    // Pedido sin cobro en linea: se avisa por correo y se cierra el ciclo.
    const delivered = await notifyOrder({
      ref,
      method: "manual",
      status: "por confirmar",
      customer,
      totals,
      names,
      locale,
      origin,
    });

    // Si el correo no salio, no se manda al cliente a una pantalla de exito
    // que promete un pedido que nadie recibio.
    if (!delivered) {
      return NextResponse.json({ ok: false, error: "order_not_delivered" }, { status: 503 });
    }

    return NextResponse.json({
      ok: true,
      url: `${base}/order/success?ref=${ref}&mode=manual`,
      ref,
    });
  } catch (error) {
    console.error("checkout", error);
    return NextResponse.json({ ok: false, error: "gateway" }, { status: 502 });
  }
}

/**
 * Sin llaves configuradas. En desarrollo se deja pasar a una pantalla de
 * simulacion para poder recorrer el flujo completo; en produccion se responde
 * un error claro en vez de fingir un cobro que nunca ocurrio.
 */
function notConfigured(method: string, base: string, ref: string) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: false, error: `${method}_not_configured` }, { status: 503 });
  }
  return NextResponse.json({
    ok: true,
    mock: true,
    ref,
    url: `${base}/order/success?ref=${ref}&mock=${method}`,
  });
}
