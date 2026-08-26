"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FreeShippingBar } from "@/components/free-shipping-bar";
import { QuantityStepper } from "@/components/quantity-stepper";
import { ReservationTimer } from "@/components/reservation-timer";
import { cart, useCart } from "@/lib/cart";
import { useNow } from "@/lib/clock";
import { commerce, findCoupon, formatMoney } from "@/lib/commerce";
import type { Dict } from "@/lib/dict";
import { fill, localePath, type Locale } from "@/lib/i18n";
import { findProductById, products } from "@/lib/site";

export function CartDrawer({ locale, dict }: { locale: Locale; dict: Dict }) {
  const now = useNow();
  const { state, totals, reservationMsLeft, reservationExpired } = useCart(now);
  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState(false);
  const open = state.open;

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") cart.close();
    };
    document.addEventListener("keydown", onKey);

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  // clearOnExpire vive en la config: si alguien lo prende, el carrito se vacia
  // al vencer la reserva. Por default solo avisa.
  useEffect(() => {
    if (reservationExpired && commerce.reservation.clearOnExpire) cart.clear();
  }, [reservationExpired]);

  function onApplyCoupon() {
    const found = findCoupon(coupon, now || 0);
    if (!found) {
      setCouponError(true);
      return;
    }
    setCouponError(false);
    cart.applyCoupon(found.code);
    setCoupon("");
  }

  const appliedPercent = findCoupon(totals.couponCode, now)?.percentOff ?? 0;

  return (
    <>
      <div
        aria-hidden="true"
        onClick={() => cart.close()}
        className={`fixed inset-0 z-[60] bg-[#04141b]/45 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={dict.cart.title}
        className={`fixed right-0 top-0 z-[61] flex h-dvh w-full max-w-[420px] flex-col border-l border-line bg-paper transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-[17px] font-bold">{dict.cart.title}</h2>
          <button
            type="button"
            onClick={() => cart.close()}
            aria-label={dict.cart.close}
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:text-ink"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {totals.itemCount === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-ink-2">{dict.cart.empty}</p>
            <Link
              href={localePath(locale, "/products")}
              onClick={() => cart.close()}
              className="btn btn-ghost"
            >
              {dict.cart.emptyCta}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ReservationTimer
                msLeft={reservationMsLeft}
                expired={reservationExpired}
                dict={dict.cart}
              />

              <ul className="mt-4 space-y-4">
                {totals.lines.map((line) => {
                  const product = findProductById(line.id);
                  if (!product) return null;
                  const copy = dict.products.items[line.slug as keyof Dict["products"]["items"]];

                  return (
                    <li key={line.id} className="flex gap-3">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-line">
                        <Image src={product.image} alt={copy.name} fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={localePath(locale, `/products/${line.slug}`)}
                            onClick={() => cart.close()}
                            className="font-display text-[15px] font-semibold leading-tight hover:underline"
                          >
                            {copy.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => cart.remove(line.id)}
                            aria-label={dict.cart.remove}
                            className="text-ink-3 transition-colors hover:text-ink"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                            </svg>
                          </button>
                        </div>
                        <p className="mt-1 text-[13px] text-ink-3">
                          {formatMoney(line.unitCents, locale, product.currency)}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <QuantityStepper
                            value={line.qty}
                            max={product.stock}
                            label={dict.cart.qty}
                            onChange={(next) => cart.setQty(line.id, next)}
                          />
                          <span className="font-display text-[15px] font-bold tabular-nums">
                            {formatMoney(line.lineCents, locale, product.currency)}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Upsell de accesorios: solo si hay un equipo en el carrito y
                  el accesorio todavia no esta. Una linea, no un catalogo. */}
              {(() => {
                const ids = new Set(totals.lines.map((line) => line.id));
                const hasUnit = totals.lines.some((line) => {
                  const product = findProductById(line.id);
                  return product && !product.accessory;
                });
                const addons = hasUnit
                  ? products.filter(
                      (product) =>
                        product.accessory &&
                        product.buyable &&
                        product.stock > 0 &&
                        !ids.has(product.id),
                    )
                  : [];
                if (!addons.length) return null;
                return (
                  <div className="mt-6 rounded-2xl border border-dashed border-line-strong bg-mist p-4">
                    <p className="eyebrow">{dict.cart.addonTitle}</p>
                    <ul className="mt-3 space-y-3">
                      {addons.map((addon) => {
                        const copy =
                          dict.products.items[addon.slug as keyof Dict["products"]["items"]];
                        return (
                          <li key={addon.id} className="flex items-center gap-3">
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-line bg-white">
                              <Image src={addon.image} alt={copy.name} fill sizes="56px" className="object-contain p-1" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[14px] font-semibold">{copy.name}</p>
                              <p className="text-[12px] text-ink-3">{dict.cart.addonHint}</p>
                              <p className="mt-0.5 text-[13px] font-semibold tabular-nums">
                                {formatMoney(addon.priceCents, locale, addon.currency)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => cart.add(addon.id, 1, { open: true })}
                              className="btn btn-ghost shrink-0 px-4 py-2 text-[13px]"
                            >
                              {dict.cart.addonAdd}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })()}

              <div className="mt-6 border-t border-line pt-5">
                <FreeShippingBar
                  missingCents={totals.freeShippingMissingCents}
                  locale={locale}
                  dict={dict.cart}
                />
              </div>

              <div className="mt-5">
                {totals.couponCode ? (
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-mist px-4 py-3">
                    <p className="text-[13px] text-ink-2">
                      {fill(dict.cart.couponApplied, {
                        code: totals.couponCode,
                        percent: appliedPercent,
                      })}
                    </p>
                    <button
                      type="button"
                      onClick={() => cart.applyCoupon(null)}
                      className="text-[13px] font-semibold text-ink-3 underline transition-colors hover:text-ink"
                    >
                      {dict.cart.couponRemove}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={coupon}
                      onChange={(event) => {
                        setCoupon(event.target.value);
                        setCouponError(false);
                      }}
                      placeholder={dict.cart.couponPlaceholder}
                      aria-label={dict.cart.couponPlaceholder}
                      className="field"
                    />
                    <button type="button" onClick={onApplyCoupon} className="btn btn-ghost shrink-0">
                      {dict.cart.couponApply}
                    </button>
                  </div>
                )}
                {couponError ? (
                  <p role="alert" className="mt-2 text-[13px] text-ink-2">
                    {dict.cart.couponInvalid}
                  </p>
                ) : null}
              </div>
            </div>

            <footer className="border-t border-line px-5 py-4">
              <dl className="space-y-1.5 text-[14px]">
                <div className="flex justify-between">
                  <dt className="text-ink-2">{dict.cart.subtotal}</dt>
                  <dd className="tabular-nums">{formatMoney(totals.subtotalCents, locale)}</dd>
                </div>
                {totals.discountCents > 0 ? (
                  <div className="flex justify-between text-[#0f7a5f] dark:text-[#5fd6b0]">
                    <dt>{dict.cart.discount}</dt>
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
                <div className="flex justify-between border-t border-line pt-2 font-display text-[17px] font-bold">
                  <dt>{dict.cart.total}</dt>
                  <dd className="tabular-nums">{formatMoney(totals.totalCents, locale)}</dd>
                </div>
                {totals.taxIncludedCents > 0 ? (
                  <p className="text-right text-[12px] text-ink-3">
                    {dict.cart.taxIncluded}: {formatMoney(totals.taxIncludedCents, locale)}
                  </p>
                ) : null}
              </dl>

              <Link
                href={localePath(locale, "/checkout")}
                onClick={() => cart.close()}
                className="btn btn-primary mt-4 w-full"
              >
                {dict.cart.checkout}
              </Link>
              <button
                type="button"
                onClick={() => cart.close()}
                className="mt-2 w-full text-center text-[13px] text-ink-3 transition-colors hover:text-ink"
              >
                {dict.cart.keepShopping}
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
