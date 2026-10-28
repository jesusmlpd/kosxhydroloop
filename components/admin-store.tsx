"use client";

import { useState } from "react";
import type { PromoCopy, StoreSettings } from "@/lib/store-settings";

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
export function StoreEditor({
  initial,
  items,
  canSave,
  usingMemory,
}: {
  initial: StoreSettings;
  items: Item[];
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
    const payload: StoreSettings = {
      shipping: {
        flatCents: toCents(flat || "0"),
        freeFromCents: toCents(freeFrom || "0"),
        freeUntil: endOfDay(freeUntil),
      },
      promo: { endsAt: endOfDay(endsAt), bannerEnabled, bannerEs, bannerEn, popupEnabled, popupEs, popupEn },
      products: productsPayload,
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

  return (
    <div className="mt-8 space-y-8">
      {usingMemory && canSave ? (
        <p className="text-[13px] text-ink-3">Modo desarrollo: los cambios viven en memoria y se pierden al reiniciar.</p>
      ) : null}

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
