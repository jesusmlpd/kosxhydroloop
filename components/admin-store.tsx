"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/commerce";
import { HERO_FIELDS, type HeroCopy, type HeroField, type PromoCopy, type StoreSettings } from "@/lib/store-settings";

const HERO_LABELS: Record<HeroField, string> = {
  eyebrow: "Etiqueta de arriba",
  title: "Título",
  titleAccent: "Título resaltado",
  body: "Texto",
  ctaPrimary: "Botón principal (antes del precio)",
  ctaSecondary: "Botón secundario",
  note: "Línea de confianza (debajo de los botones)",
};

type Item = {
  id: string;
  name: string;
  base: { priceCents: number; compareAtCents: number | null; stock: number };
};

type ProductForm = { price: string; compareAt: string; stock: string };

const pesos = (cents: number) => String(cents / 100);
const toCents = (value: string) => Math.round(Number(value.replace(/[$,\s]/g, "")) * 100);
// Las fechas del panel son dias; el sitio las cierra al final del dia en hora del Centro.
const dayOf = (iso: string | null) => (iso ? iso.slice(0, 10) : "");
const endOfDay = (day: string) => (day ? `${day}T23:59:59-06:00` : null);

/**
 * Editor de los ajustes de la tienda. Lo guardado aqui lo lee el sitio en vivo:
 * envio, barra y ventana de promo, y precios e inventario por producto.
 */
export type StoreSection = "productos" | "envio-promos" | "inicio" | "descuentos";

export function StoreEditor({
  section,
  initial,
  items,
  heroDefaults,
  canSave,
  usingMemory,
}: {
  /** Que parte de la tienda se edita en esta pagina; solo eso se guarda. */
  section: StoreSection;
  initial: StoreSettings;
  items: Item[];
  /** Textos de fabrica del hero, para mostrarlos de ejemplo en cada campo. */
  heroDefaults: { es: HeroCopy; en: HeroCopy };
  canSave: boolean;
  /** Sin Redis real: solo desarrollo, se pierde al reiniciar. */
  usingMemory: boolean;
}) {
  const [flat, setFlat] = useState(pesos(initial.shipping.flatCents));
  const [freeFrom, setFreeFrom] = useState(pesos(initial.shipping.freeFromCents));
  const [freeUntil, setFreeUntil] = useState(dayOf(initial.shipping.freeUntil));

  const [endsAt, setEndsAt] = useState(dayOf(initial.promo.endsAt));
  const [bannerEnabled, setBannerEnabled] = useState(initial.promo.bannerEnabled);
  const [bannerEs, setBannerEs] = useState(initial.promo.bannerEs);
  const [bannerEn, setBannerEn] = useState(initial.promo.bannerEn);
  const [popupEnabled, setPopupEnabled] = useState(initial.promo.popupEnabled);
  const [popupEs, setPopupEs] = useState<PromoCopy>(initial.promo.popupEs);
  const [popupEn, setPopupEn] = useState<PromoCopy>(initial.promo.popupEn);

  const [hero, setHero] = useState(initial.hero);

  const [coupons, setCoupons] = useState(
    initial.coupons.map((coupon) => ({ ...coupon, endsAt: dayOf(coupon.endsAt), percentOff: String(coupon.percentOff) })),
  );
  const setCoupon = (index: number, patch: Partial<(typeof coupons)[number]>) =>
    setCoupons((current) => current.map((coupon, i) => (i === index ? { ...coupon, ...patch } : coupon)));

  const [forms, setForms] = useState<Record<string, ProductForm>>(() =>
    Object.fromEntries(
      items.map((item) => {
        const over = initial.products[item.id] ?? {};
        return [
          item.id,
          {
            price: over.priceCents !== undefined ? pesos(over.priceCents) : "",
            compareAt: over.compareAtCents ? pesos(over.compareAtCents) : "",
            stock: over.stock !== undefined ? String(over.stock) : "",
          },
        ];
      }),
    ),
  );

  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);

  const setForm = (id: string, patch: Partial<ProductForm>) =>
    setForms((current) => ({ ...current, [id]: { ...current[id], ...patch } }));

  async function save() {
    setSaving(true);
    setNotice(null);
    const productsPayload: StoreSettings["products"] = {};
    for (const item of items) {
      const form = forms[item.id];
      const entry: StoreSettings["products"][string] = {};
      if (form.price.trim() !== "") entry.priceCents = toCents(form.price);
      if (form.compareAt.trim() !== "") entry.compareAtCents = toCents(form.compareAt);
      if (form.stock.trim() !== "") entry.stock = Math.round(Number(form.stock));
      if (Object.keys(entry).length) productsPayload[item.id] = entry;
    }
    // Solo se manda lo de esta pagina: el servidor lo mezcla con lo ya guardado.
    const payload: Partial<StoreSettings> =
      section === "envio-promos"
        ? {
            shipping: {
              flatCents: toCents(flat || "0"),
              freeFromCents: toCents(freeFrom || "0"),
              freeUntil: endOfDay(freeUntil),
            },
            promo: { endsAt: endOfDay(endsAt), bannerEnabled, bannerEs, bannerEn, popupEnabled, popupEs, popupEn },
          }
        : section === "productos"
          ? { products: productsPayload }
          : section === "inicio"
            ? { hero }
            : {
                coupons: coupons.map((coupon) => ({
                  code: coupon.code,
                  percentOff: Number(coupon.percentOff),
                  endsAt: endOfDay(coupon.endsAt),
                  enabled: coupon.enabled,
                })),
              };
    try {
      const response = await fetch("/api/admin/tienda", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      setNotice(
        response.ok && data.ok
          ? { ok: true, text: "Guardado. El sitio lo muestra de inmediato." }
          : {
              ok: false,
              text: data.error === "no_database" ? "Conecta la base de datos para guardar." : "No se pudo guardar. Intenta de nuevo.",
            },
      );
    } catch {
      setNotice({ ok: false, text: "No se pudo guardar. Revisa tu conexión." });
    } finally {
      setSaving(false);
    }
  }

  const flatNumber = Number(flat || "0");

  const showPreview = section !== "descuentos";

  return (
    <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
    <div className="space-y-8">
      {usingMemory && canSave ? (
        <p className="text-[13px] text-ink-3">Modo desarrollo: los cambios viven en memoria y se pierden al reiniciar.</p>
      ) : null}

      {section === "envio-promos" ? (
      <section className="card p-6">
        <h2 className="text-[18px]">Envío</h2>
        <p className="mt-1 text-[14px] text-ink-2">
          Con costo en $0 el envío es gratis para todos y desaparece la barra de “te faltan $X”. Si le pones costo,
          puedes dar envío gratis desde un monto o hasta una fecha.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Num label="Costo de envío (MXN)" value={flat} onChange={setFlat} hint={flatNumber === 0 ? "Envío gratis a todos" : undefined} />
          <Num label="Envío gratis desde (MXN)" value={freeFrom} onChange={setFreeFrom} disabled={flatNumber === 0} hint="Solo si hay costo de envío" />
          <label className="block">
            <span className="text-[13px] font-medium text-ink-2">Envío gratis para todos hasta</span>
            <input
              type="date"
              value={freeUntil}
              onChange={(event) => setFreeUntil(event.target.value)}
              disabled={flatNumber === 0}
              className="field mt-1.5"
            />
            <span className="mt-1 block text-[12px] text-ink-3">Vacío = sin fecha. Solo si hay costo de envío.</span>
          </label>
        </div>
      </section>
      ) : null}

      {section === "envio-promos" ? (
      <section className="card p-6">
        <h2 className="text-[18px]">Promoción: barra y ventana emergente</h2>
        <p className="mt-1 text-[14px] text-ink-2">
          La barra de arriba y la ventana (una vez por visita, a los 8 segundos, nunca en el pago) se apagan solas al
          pasar la fecha.
        </p>
        <label className="mt-4 block max-w-xs">
          <span className="text-[13px] font-medium text-ink-2">Termina el</span>
          <input type="date" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} className="field mt-1.5" />
          <span className="mt-1 block text-[12px] text-ink-3">Vacío = sin fecha de fin.</span>
        </label>

        <div className="mt-6 space-y-3">
          <Toggle label="Mostrar barra de promoción" checked={bannerEnabled} onChange={setBannerEnabled} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Txt label="Texto de la barra (español)" value={bannerEs} onChange={setBannerEs} max={200} />
            <Txt label="Texto de la barra (inglés)" value={bannerEn} onChange={setBannerEn} max={200} />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Toggle label="Mostrar ventana emergente" checked={popupEnabled} onChange={setPopupEnabled} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Popup title="Ventana (español)" value={popupEs} onChange={setPopupEs} />
            <Popup title="Ventana (inglés)" value={popupEn} onChange={setPopupEn} />
          </div>
        </div>
      </section>
      ) : null}

      {section === "inicio" ? (
      <section className="card p-6">
        <h2 className="text-[18px]">Textos del inicio (hero)</h2>
        <p className="mt-1 text-[14px] text-ink-2">
          Lo primero que se ve en la página de inicio. Deja un campo vacío para usar el texto de fábrica (aparece de
          ejemplo en gris). El título y el título resaltado van juntos: el resaltado sale en color.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {(["es", "en"] as const).map((locale) => (
            <div key={locale} className="space-y-3 rounded-2xl border border-line p-4">
              <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-3">
                {locale === "es" ? "Español" : "Inglés"}
              </p>
              {HERO_FIELDS.map((field) => (
                <label key={field} className="block">
                  <span className="text-[13px] font-medium text-ink-2">{HERO_LABELS[field]}</span>
                  {field === "body" ? (
                    <textarea
                      rows={3}
                      maxLength={400}
                      value={hero[locale][field]}
                      placeholder={heroDefaults[locale][field]}
                      onChange={(event) => setHero((cur) => ({ ...cur, [locale]: { ...cur[locale], [field]: event.target.value } }))}
                      className="field mt-1.5 resize-y"
                    />
                  ) : (
                    <input
                      type="text"
                      maxLength={120}
                      value={hero[locale][field]}
                      placeholder={heroDefaults[locale][field]}
                      onChange={(event) => setHero((cur) => ({ ...cur, [locale]: { ...cur[locale], [field]: event.target.value } }))}
                      className="field mt-1.5"
                    />
                  )}
                </label>
              ))}
            </div>
          ))}
        </div>
      </section>
      ) : null}

      {section === "descuentos" ? (
      <section className="card p-6">
        <h2 className="text-[18px]">Cupones de descuento</h2>
        <p className="mt-1 text-[14px] text-ink-2">
          El cliente los escribe en el carrito y también se aplican con el enlace de los correos de recuperación. Un
          cupón apagado o vencido deja de funcionar al instante. Los porcentajes van de 1 a 90.
        </p>
        <div className="mt-4 space-y-4">
          {coupons.map((coupon, index) => (
            <div key={index} className="grid items-end gap-4 border-t border-line pt-4 first:border-0 first:pt-0 sm:grid-cols-[1.2fr_1fr_1fr_auto_auto]">
              <Txt label="Código" value={coupon.code} onChange={(code) => setCoupon(index, { code: code.toUpperCase() })} max={24} />
              <Num label="Descuento (%)" value={coupon.percentOff} onChange={(percentOff) => setCoupon(index, { percentOff })} />
              <label className="block">
                <span className="text-[13px] font-medium text-ink-2">Vence el</span>
                <input
                  type="date"
                  value={coupon.endsAt}
                  onChange={(event) => setCoupon(index, { endsAt: event.target.value })}
                  className="field mt-1.5"
                />
              </label>
              <Toggle label="Activo" checked={coupon.enabled} onChange={(enabled) => setCoupon(index, { enabled })} />
              <button
                type="button"
                onClick={() => setCoupons((current) => current.filter((_, i) => i !== index))}
                className="text-[13px] font-medium text-[#a1332f]"
              >
                Quitar
              </button>
            </div>
          ))}
          {coupons.length === 0 ? <p className="text-[14px] text-ink-3">Sin cupones: el campo del carrito no acepta ningún código.</p> : null}
        </div>
        <button
          type="button"
          onClick={() => setCoupons((current) => [...current, { code: "", percentOff: "10", endsAt: "", enabled: true }])}
          className="btn btn-ghost mt-4"
        >
          Agregar cupón
        </button>
        <p className="mt-2 text-[12px] text-ink-3">Vacío en “Vence el” = sin fecha de fin. Los cupones sin código se ignoran al guardar.</p>
      </section>
      ) : null}

      {section === "productos" ? (
      <section className="card p-6">
        <h2 className="text-[18px]">Precios e inventario</h2>
        <p className="mt-1 text-[14px] text-ink-2">
          Deja un campo vacío para usar el valor de fábrica. Precios con IVA incluido. El precio tachado solo se muestra
          si es mayor al precio. Las piezas disponibles salen como “Quedan N” cuando son 10 o menos.
        </p>
        <div className="mt-4 space-y-5">
          {items.map((item) => (
            <div key={item.id} className="grid gap-4 border-t border-line pt-4 first:border-0 first:pt-0 sm:grid-cols-4">
              <p className="font-display text-[15px] font-semibold sm:pt-7">{item.name}</p>
              <Num
                label="Precio (MXN)"
                value={forms[item.id].price}
                onChange={(price) => setForm(item.id, { price })}
                placeholder={pesos(item.base.priceCents)}
              />
              <Num
                label="Precio tachado (MXN)"
                value={forms[item.id].compareAt}
                onChange={(compareAt) => setForm(item.id, { compareAt })}
                placeholder={item.base.compareAtCents ? pesos(item.base.compareAtCents) : "ninguno"}
              />
              <Num
                label="Piezas disponibles"
                value={forms[item.id].stock}
                onChange={(stock) => setForm(item.id, { stock })}
                placeholder={String(item.base.stock)}
              />
            </div>
          ))}
        </div>
      </section>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <button type="button" onClick={save} disabled={saving || !canSave} className="btn btn-primary disabled:opacity-60">
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
        {notice ? (
          <p role="status" className={`text-[14px] ${notice.ok ? "text-[#0f7a5f]" : "text-[#a1332f]"}`}>
            {notice.text}
          </p>
        ) : null}
      </div>
    </div>
    {showPreview ? (
      <aside className="xl:sticky xl:top-6">
        <StorePreview
          section={section}
          hero={hero}
          heroDefaults={heroDefaults}
          banner={{ enabled: bannerEnabled, es: bannerEs, en: bannerEn }}
          popup={{ enabled: popupEnabled, es: popupEs, en: popupEn }}
          shipping={{ flat, freeFrom, freeUntil }}
          items={items}
          forms={forms}
        />
      </aside>
    ) : null}
    </div>
  );
}

function Num({
  label,
  value,
  onChange,
  placeholder,
  hint,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-ink-2">{label}</span>
      <input
        type="number"
        min={0}
        step="any"
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="field mt-1.5 disabled:opacity-50"
      />
      {hint ? <span className="mt-1 block text-[12px] text-ink-3">{hint}</span> : null}
    </label>
  );
}

function Txt({ label, value, onChange, max }: { label: string; value: string; onChange: (value: string) => void; max: number }) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-ink-2">{label}</span>
      <input type="text" value={value} maxLength={max} onChange={(event) => onChange(event.target.value)} className="field mt-1.5" />
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-[14px] font-medium">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 accent-[#006781]" />
      {label}
    </label>
  );
}

function Popup({ title, value, onChange }: { title: string; value: PromoCopy; onChange: (value: PromoCopy) => void }) {
  return (
    <div className="space-y-3 rounded-2xl border border-line p-4">
      <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-3">{title}</p>
      <Txt label="Título" value={value.title} onChange={(next) => onChange({ ...value, title: next })} max={90} />
      <label className="block">
        <span className="text-[13px] font-medium text-ink-2">Texto</span>
        <textarea
          rows={3}
          maxLength={300}
          value={value.body}
          onChange={(event) => onChange({ ...value, body: event.target.value })}
          className="field mt-1.5 resize-y"
        />
      </label>
      <Txt label="Botón" value={value.cta} onChange={(next) => onChange({ ...value, cta: next })} max={40} />
    </div>
  );
}

/**
 * Vista previa aproximada de lo que se edita: se actualiza al escribir, sin
 * guardar. No es el sitio real (para eso esta el enlace "Ver en el sitio"),
 * sirve para entender que pieza se esta cambiando y como queda el texto.
 */
function StorePreview({
  section,
  hero,
  heroDefaults,
  banner,
  popup,
  shipping,
  items,
  forms,
}: {
  section: StoreSection;
  hero: { es: HeroCopy; en: HeroCopy };
  heroDefaults: { es: HeroCopy; en: HeroCopy };
  banner: { enabled: boolean; es: string; en: string };
  popup: { enabled: boolean; es: PromoCopy; en: PromoCopy };
  shipping: { flat: string; freeFrom: string; freeUntil: string };
  items: Item[];
  forms: Record<string, ProductForm>;
}) {
  const [locale, setLocale] = useState<"es" | "en">("es");
  const pick = (field: HeroField) => hero[locale][field] || heroDefaults[locale][field];
  // El hero muestra el precio del Manual ("Comprar desde"), como el sitio.
  const manual = items.find((item) => item.id === "hl-manual") ?? items[0];
  const typed = manual ? forms[manual.id]?.price.trim() : "";
  const lowest = manual ? (typed ? toCents(typed) : manual.base.priceCents) : 0;
  const flat = Number(shipping.flat || "0");
  const link = section === "inicio" ? "/es" : section === "productos" ? "/es/products" : "/es";

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <p className="text-[13px] font-semibold">Vista previa</p>
        <div className="flex gap-1 text-[12px] font-semibold">
          {(["es", "en"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setLocale(value)}
              className={`rounded-full px-2.5 py-1 ${locale === value ? "bg-invert text-invert-fg" : "text-ink-2"}`}
            >
              {value.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 p-4">
        {section === "inicio" ? (
          <div className="rounded-2xl bg-invert p-5 text-invert-fg">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] opacity-70">{pick("eyebrow")}</p>
            <p className="mt-2 font-display text-[22px] font-bold leading-tight">
              {pick("title")} <span className="text-aqua">{pick("titleAccent")}</span>
            </p>
            <p className="mt-2 text-[12.5px] leading-relaxed opacity-85">{pick("body")}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-[12px] font-semibold">
              <span className="rounded-full bg-white px-3 py-1.5 text-[#071b23]">
                {pick("ctaPrimary")} {formatMoney(lowest, locale)}
              </span>
              <span className="rounded-full border border-white/40 px-3 py-1.5">{pick("ctaSecondary")}</span>
            </div>
            <p className="mt-3 text-[11px] opacity-70">{pick("note")}</p>
          </div>
        ) : null}

        {section === "envio-promos" ? (
          <>
            <div>
              <p className="mb-1.5 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">Barra de arriba</p>
              {banner.enabled && banner[locale].trim() ? (
                <div className="rounded-lg bg-invert px-3 py-2 text-center text-[12px] font-semibold text-invert-fg">
                  {banner[locale]}
                </div>
              ) : (
                <p className="rounded-lg border border-dashed border-line px-3 py-2 text-[12.5px] text-ink-3">
                  Apagada o sin texto: no se muestra.
                </p>
              )}
            </div>
            <div>
              <p className="mb-1.5 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">Ventana emergente</p>
              {popup.enabled ? (
                <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
                  <p className="font-display text-[16px] font-bold">{popup[locale].title}</p>
                  <p className="mt-1.5 text-[12.5px] text-ink-2">{popup[locale].body}</p>
                  <span className="mt-3 inline-block rounded-full bg-invert px-3.5 py-1.5 text-[12px] font-semibold text-invert-fg">
                    {popup[locale].cta}
                  </span>
                </div>
              ) : (
                <p className="rounded-lg border border-dashed border-line px-3 py-2 text-[12.5px] text-ink-3">Apagada: no se muestra.</p>
              )}
            </div>
            <div>
              <p className="mb-1.5 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">Envío en el carrito</p>
              <p className="rounded-lg bg-mist px-3 py-2 text-[12.5px]">
                {flat === 0
                  ? locale === "es"
                    ? "Envío gratis a todo México"
                    : "Free shipping across Mexico"
                  : `${locale === "es" ? "Envío" : "Shipping"} ${formatMoney(toCents(shipping.flat), locale)}${
                      Number(shipping.freeFrom || "0") > 0
                        ? ` · ${locale === "es" ? "gratis desde" : "free from"} ${formatMoney(toCents(shipping.freeFrom), locale)}`
                        : ""
                    }${shipping.freeUntil ? ` · ${locale === "es" ? "gratis hasta" : "free until"} ${shipping.freeUntil}` : ""}`}
              </p>
            </div>
          </>
        ) : null}

        {section === "productos" ? (
          <ul className="space-y-3">
            {items.map((item) => {
              const form = forms[item.id];
              const price = form.price.trim() ? toCents(form.price) : item.base.priceCents;
              const compare = form.compareAt.trim() ? toCents(form.compareAt) : item.base.compareAtCents;
              const stock = form.stock.trim() ? Math.round(Number(form.stock)) : item.base.stock;
              return (
                <li key={item.id} className="rounded-2xl border border-line p-3">
                  <p className="font-display text-[14px] font-bold">{item.name}</p>
                  <p className="mt-1 text-[13px] tabular-nums">
                    <strong>{formatMoney(price, locale)}</strong>
                    {compare && compare > price ? (
                      <span className="ml-2 text-ink-3 line-through">{formatMoney(compare, locale)}</span>
                    ) : null}
                  </p>
                  {stock <= 10 ? (
                    <p className="mt-1 text-[12px] font-semibold text-[#a1332f]">
                      {stock === 0 ? (locale === "es" ? "Agotado" : "Sold out") : locale === "es" ? `Quedan ${stock}` : `Only ${stock} left`}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : null}

        <a href={link} target="_blank" rel="noreferrer" className="block text-center text-[12.5px] font-semibold text-deep underline">
          Ver en el sitio ↗
        </a>
      </div>
    </div>
  );
}
