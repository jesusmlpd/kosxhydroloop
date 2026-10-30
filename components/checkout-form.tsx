"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { FreeShippingBar } from "@/components/free-shipping-bar";
import { PaymentBadges } from "@/components/payment-badges";
import { OfferCountdown } from "@/components/offer-countdown";
import { ReservationTimer } from "@/components/reservation-timer";
import { cart, useCart } from "@/lib/cart";
import { useNow } from "@/lib/clock";
import { formatMoney } from "@/lib/commerce";
import type { Dict } from "@/lib/dict";
import { localePath, type Locale } from "@/lib/i18n";
import { findProduct, findProductById } from "@/lib/site";
import { metaBrowserIds, storePendingPurchase, trackInitiateCheckout } from "@/lib/track";

type Method = "stripe" | "mercadopago" | "manual";

export function CheckoutForm({
  locale,
  dict,
  prefill,
}: {
  locale: Locale;
  dict: Dict;
  /** Datos de quien regresa desde un correo de recuperacion (?r=). */
  prefill?: { name?: string; email?: string; phone?: string };
}) {
  const now = useNow();
  const { state, totals, reservationMsLeft, reservationExpired } = useCart(now);
  const [method, setMethod] = useState<Method>("stripe");
  const leadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastLead = useRef("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [notice, setNotice] = useState<string | null>(null);

  if (totals.itemCount === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-ink-2">{dict.checkout.emptyCart}</p>
        <Link href={localePath(locale, "/products")} className="btn btn-primary mt-5">
          {dict.cart.emptyCta}
        </Link>
      </div>
    );
  }

  // Lead: en cuanto hay un correo valido se guarda (aunque no pague), con lo que
  // lleva en el carrito. La casilla de consentimiento decide si se le escribe.
  function captureLead(form: HTMLFormElement) {
    if (leadTimer.current) clearTimeout(leadTimer.current);
    leadTimer.current = setTimeout(() => {
      const data = new FormData(form);
      const email = String(data.get("email") ?? "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || !state.lines.length) return;
      const payload = JSON.stringify({
        email,
        name: data.get("name"),
        phone: data.get("phone"),
        locale,
        lines: state.lines,
        coupon: state.coupon,
        consent: data.get("marketing") === "on",
      });
      if (payload === lastLead.current) return;
      lastLead.current = payload;
      void fetch("/api/recovery/lead", { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
    }, 600);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setNotice(null);

    const form = new FormData(event.currentTarget);
    const customer = Object.fromEntries(form) as Record<string, string>;

    // Eventos de marketing: los articulos con nombre legible y el total real.
    const names = dict.products.items as Record<string, { name: string }>;
    const trackItems = totals.lines.map((line) => ({
      id: line.id,
      name: names[line.slug]?.name ?? line.slug,
      qty: line.qty,
      priceCents: line.unitCents,
    }));
    trackInitiateCheckout(trackItems, totals.totalCents);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          // Solo ids y cantidades: el servidor vuelve a poner los precios.
          lines: state.lines,
          coupon: state.coupon,
          customer,
          locale,
          tracking: metaBrowserIds(),
        }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        url?: string;
        mock?: boolean;
        ref?: string;
      };
      if (!result.ok || !result.url) throw new Error("checkout");

      // La pantalla de exito dispara Purchase con esto, ya sin carrito.
      if (result.ref) {
        storePendingPurchase({ ref: result.ref, totalCents: totals.totalCents, items: trackItems });
      }

      if (result.mock) {
        setNotice(
          locale === "en"
            ? "No payment keys configured yet, so this run is a simulation."
            : "Todavía no hay llaves de pago configuradas, así que este cobro es una simulación.",
        );
      }

      // El carrito NO se vacia aqui: si alguien cancela en Stripe o en Mercado
      // Pago y regresa, tiene que encontrar su pedido intacto. Se limpia en la
      // pantalla de exito.
      window.location.href = result.url;
    } catch {
      setStatus("error");
    }
  }

  // Mercado Pago queda oculto hasta tener MERCADOPAGO_ACCESS_TOKEN y validar la
  // firma de su webhook. Para prenderlo: NEXT_PUBLIC_MERCADOPAGO_ENABLED=true.
  const mercadoPagoOn = process.env.NEXT_PUBLIC_MERCADOPAGO_ENABLED === "true";
  const methods: Array<{ id: Method; title: string; body: string }> = [
    { id: "stripe", title: dict.checkout.methods.stripe, body: dict.checkout.methods.stripeBody },
    ...(mercadoPagoOn
      ? [
          {
            id: "mercadopago" as const,
            title: dict.checkout.methods.mercadopago,
            body: dict.checkout.methods.mercadopagoBody,
          },
        ]
      : []),
    { id: "manual", title: dict.checkout.methods.manual, body: dict.checkout.methods.manualBody },
  ];

  return (
    <form
      onSubmit={onSubmit}
      onBlur={(event) => captureLead(event.currentTarget)}
      onChange={(event) => {
        if ((event.target as unknown as HTMLInputElement).name === "marketing") captureLead(event.currentTarget);
      }}
      className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-start"
    >
      <div className="space-y-8">
        <fieldset className="card p-6">
          <legend className="eyebrow px-1">{dict.checkout.contactTitle}</legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field name="name" label={dict.checkout.fields.name} autoComplete="name" required defaultValue={prefill?.name} />
            <Field
              name="email"
              type="email"
              label={dict.checkout.fields.email}
              autoComplete="email"
              required
              defaultValue={prefill?.email}
            />
            <Field name="phone" label={dict.checkout.fields.phone} autoComplete="tel" required defaultValue={prefill?.phone} />
          </div>
        </fieldset>

        <fieldset className="card p-6">
          <legend className="eyebrow px-1">{dict.checkout.shippingTitle}</legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field
              name="street"
              label={dict.checkout.fields.street}
              autoComplete="address-line1"
              required
              className="sm:col-span-2"
            />
            <Field name="interior" label={dict.checkout.fields.interior} autoComplete="address-line2" />
            <Field
              name="neighborhood"
              label={dict.checkout.fields.neighborhood}
              autoComplete="address-level3"
              required
            />
            <Field name="city" label={dict.checkout.fields.city} autoComplete="address-level2" required />
            <Field name="state" label={dict.checkout.fields.state} autoComplete="address-level1" required />
            <Field
              name="zip"
              label={dict.checkout.fields.zip}
              autoComplete="postal-code"
              inputMode="numeric"
              required
            />
            <label className="block sm:col-span-2">
              <span className="text-[13px] font-medium text-ink-2">{dict.checkout.fields.notes}</span>
              <textarea name="notes" rows={3} className="field mt-1.5 resize-y" />
            </label>
          </div>
          <p className="mt-3 text-[12px] text-ink-3">{dict.checkout.requiredNote}</p>
        </fieldset>

        <fieldset className="card p-6">
          <legend className="eyebrow px-1">{dict.checkout.paymentTitle}</legend>
          <div className="mt-3 space-y-3">
            {methods.map((option) => (
              <label
                key={option.id}
                className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors ${
                  method === option.id ? "border-teal bg-surface-2" : "border-line hover:border-line-strong"
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value={option.id}
                  checked={method === option.id}
                  onChange={() => setMethod(option.id)}
                  className="mt-1 accent-[#0a5f78]"
                />
                <span>
                  <span className="block font-display text-[15px] font-semibold">{option.title}</span>
                  <span className="mt-0.5 block text-[14px] text-ink-2">{option.body}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="mt-4 text-[12px] text-ink-3">{dict.checkout.secure}</p>
        </fieldset>
      </div>

      <aside className="card p-6 lg:sticky lg:top-[88px]">
        <h2 className="font-display text-[17px] font-bold">{dict.checkout.summaryTitle}</h2>

        <div className="mt-4 space-y-3">
          <ReservationTimer msLeft={reservationMsLeft} expired={reservationExpired} dict={dict.cart} />
          <OfferCountdown dict={dict.urgency} variant="inline" />
        </div>

        <ul className="mt-4 space-y-3 border-t border-line pt-4">
          {totals.lines.map((line) => {
            const product = findProductById(line.id);
            if (!product) return null;
            const copy = dict.products.items[line.slug as keyof Dict["products"]["items"]];
            return (
              <li key={line.id} className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-line">
                  <Image src={product.image} alt={copy.name} fill sizes="48px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium">{copy.name}</p>
                  <p className="text-[13px] text-ink-3">x{line.qty}</p>
                </div>
                <p className="text-[14px] tabular-nums">{formatMoney(line.lineCents, locale)}</p>
              </li>
            );
          })}
        </ul>

        {(() => {
          // Order bump clasico: el kit, una linea, un clic, antes de pagar.
          const kit = findProduct("kit-caja-de-instalacion");
          const hasUnit = totals.lines.some((line) => {
            const item = findProductById(line.id);
            return item && !item.accessory;
          });
          const inCart = kit ? totals.lines.some((line) => line.id === kit.id) : true;
          if (!kit || !hasUnit || inCart || kit.stock <= 0) return null;
          return (
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-line-strong bg-mist p-3.5">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-line bg-white">
                <Image src={kit.image} alt="" fill sizes="44px" className="object-contain p-0.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold leading-tight">{dict.pdp.bundleAdd}</p>
                <p className="text-[12.5px] text-ink-3">
                  +{formatMoney(kit.priceCents, locale, kit.currency)} · {dict.pdp.bundleHint}
                </p>
              </div>
              <button
                type="button"
                onClick={() => cart.add(kit.id, 1, { open: false })}
                className="btn btn-ghost btn-sm shrink-0"
              >
                {dict.cart.addonAdd}
              </button>
            </div>
          );
        })()}

        <div className="mt-4 border-t border-line pt-4">
          <FreeShippingBar
            missingCents={totals.freeShippingMissingCents}
            locale={locale}
            dict={dict.cart}
          />
        </div>

        <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-[14px]">
          <div className="flex justify-between">
            <dt className="text-ink-2">{dict.cart.subtotal}</dt>
            <dd className="tabular-nums">{formatMoney(totals.subtotalCents, locale)}</dd>
          </div>
          {totals.discountCents > 0 ? (
            <div className="flex justify-between text-[#0f7a5f] dark:text-[#5fd6b0]">
              <dt>
                {dict.cart.discount} {totals.couponCode ? `(${totals.couponCode})` : null}
              </dt>
              <dd className="tabular-nums">-{formatMoney(totals.discountCents, locale)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between">
            <dt className="text-ink-2">{dict.cart.shipping}</dt>
            <dd className="tabular-nums">
              {totals.shippingCents === 0
                ? dict.cart.shippingFree
                : formatMoney(totals.shippingCents, locale)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-line pt-2 font-display text-[18px] font-bold">
            <dt>{dict.cart.total}</dt>
            <dd className="tabular-nums">{formatMoney(totals.totalCents, locale)}</dd>
          </div>
          {totals.taxIncludedCents > 0 ? (
            <p className="text-right text-[12px] text-ink-3">
              {dict.cart.taxIncluded}: {formatMoney(totals.taxIncludedCents, locale)}
            </p>
          ) : null}
        </dl>

        {/* Consentimiento para recordatorios de carrito abandonado y ofertas. Va
            SIN marcar (consentimiento expreso) y enlaza el aviso de privacidad. */}
        <label className="mt-5 flex items-start gap-2.5 text-[13px] leading-snug text-ink-2">
          <input type="checkbox" name="marketing" className="mt-0.5 h-4 w-4 shrink-0 accent-[#0a7f94]" />
          <span>
            {dict.checkout.reminders}{" "}
            <Link href={localePath(locale, "/legal/privacidad")} target="_blank" className="underline">
              {dict.footer.privacy}
            </Link>
          </span>
        </label>

        <button
          type="submit"
          disabled={status === "sending"}
          className="btn btn-primary mt-4 w-full disabled:opacity-60"
        >
          {status === "sending"
            ? dict.checkout.processing
            : dict.checkout.pay.replace("{amount}", formatMoney(totals.totalCents, locale))}
        </button>

        {status === "error" ? (
          <p role="alert" className="mt-3 text-[13px] text-ink-2">
            {dict.checkout.error}
          </p>
        ) : null}
        {notice ? <p className="mt-3 text-[13px] text-ink-2">{notice}</p> : null}

        <div className="mt-4 border-t border-line pt-4">
          <PaymentBadges />
          <p className="mt-3 flex items-start gap-2 text-[12px] text-ink-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0 text-teal">
              <path d="M12 3.5 4.5 7v5.2c0 4.3 3 8 7.5 9.3 4.5-1.3 7.5-5 7.5-9.3V7L12 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="m8.6 12.2 2.5 2.5 4.6-4.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {dict.checkout.secure}
          </p>
        </div>

        <Link
          href={localePath(locale, "/products")}
          className="mt-3 block text-center text-[13px] text-ink-3 transition-colors hover:text-ink"
        >
          {dict.cart.keepShopping}
        </Link>
      </aside>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
  autoComplete,
  inputMode,
  className = "",
  defaultValue,
}: {
  defaultValue?: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "numeric" | "text" | "tel";
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[13px] font-medium text-ink-2">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        defaultValue={defaultValue}
        className="field mt-1.5"
      />
    </label>
  );
}
