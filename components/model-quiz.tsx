"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cart } from "@/lib/cart";
import { formatMoney } from "@/lib/commerce";
import type { Dict } from "@/lib/dict";
import { localePath, type Locale } from "@/lib/i18n";
import { findProduct } from "@/lib/site";

/**
 * Recomendador de 30 segundos. Tres preguntas, cero magia: negocio u
 * horarios -> WiFi; boton y ya -> Manual; caja electrica llena -> kit.
 * El resultado agrega al carrito con un clic, que es el punto de todo esto.
 */
export function ModelQuiz({ locale, dict }: { locale: Locale; dict: Dict }) {
  const [answers, setAnswers] = useState<number[]>([]);
  const step = answers.length;
  const done = step >= dict.quiz.steps.length;

  const wantsWifi = done && (answers[0] === 1 || answers[1] === 1);
  const needsKit = done && answers[2] === 1;
  const product = findProduct(wantsWifi ? "hydroloop-wifi" : "hydroloop-manual");
  const kit = findProduct("kit-caja-de-instalacion");
  const copy = product
    ? dict.products.items[product.slug as keyof Dict["products"]["items"]]
    : null;
  const totalCents = product
    ? product.priceCents + (needsKit && kit ? kit.priceCents : 0)
    : 0;

  function pick(index: number) {
    setAnswers((prev) => [...prev, index]);
  }

  function addResult() {
    if (!product) return;
    cart.add(product.id, 1, { open: false });
    if (needsKit && kit) cart.add(kit.id, 1, { open: false });
    cart.open();
  }

  return (
    <div className="card mx-auto max-w-2xl overflow-hidden">
      {/* barra de progreso */}
      <div className="h-1.5 bg-mist">
        <div
          className="h-full rounded-r-full bg-aqua transition-[width] duration-500 ease-out"
          style={{ width: `${(Math.min(step, 3) / 3) * 100}%` }}
        />
      </div>

      {!done ? (
        <div className="p-7 md:p-9">
          <p className="font-display text-[13px] font-semibold text-ink-3">
            {step + 1} / {dict.quiz.steps.length}
          </p>
          <h3 className="mt-2 text-[clamp(20px,2.6vw,27px)]">{dict.quiz.steps[step].q}</h3>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {dict.quiz.steps[step].a.map((answer, index) => (
              <button
                key={answer}
                type="button"
                onClick={() => pick(index)}
                className="btn btn-ghost justify-start px-5 text-left"
              >
                {answer}
              </button>
            ))}
          </div>
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setAnswers((prev) => prev.slice(0, -1))}
              className="mt-5 text-[13px] font-semibold text-ink-3 underline transition-colors hover:text-ink"
            >
              {dict.quiz.back}
            </button>
          ) : null}
        </div>
      ) : product && copy ? (
        <div className="grid gap-6 p-7 md:grid-cols-[150px_1fr] md:p-9">
          <div className="relative mx-auto h-[130px] w-[130px] md:h-[150px] md:w-[150px]">
            <Image src={product.image} alt={copy.name} fill sizes="150px" className="object-contain" />
          </div>
          <div>
            <p className="eyebrow">{dict.quiz.resultTitle}</p>
            <h3 className="mt-2 text-[clamp(22px,3vw,30px)]">
              {copy.name}
              {needsKit ? (
                <span className="block text-[15px] font-semibold text-ink-2">
                  {dict.quiz.withKit}
                </span>
              ) : null}
            </h3>
            <p className="mt-2 text-[14.5px] text-ink-2">
              {wantsWifi ? dict.quiz.reason.wifi : dict.quiz.reason.manual}
              {needsKit ? ` ${dict.quiz.reason.kit}` : ""}
            </p>
            <p className="mt-4 font-display text-[24px] font-bold tabular-nums">
              {formatMoney(totalCents, locale)}{" "}
              <span className="text-[13px] font-medium text-ink-3">{dict.products.ivaIncluded}</span>
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button type="button" onClick={addResult} className="btn btn-primary">
                {dict.quiz.add}
              </button>
              <Link href={localePath(locale, `/products/${product.slug}`)} className="btn btn-ghost">
                {dict.quiz.see}
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setAnswers([])}
              className="mt-4 text-[13px] font-semibold text-ink-3 underline transition-colors hover:text-ink"
            >
              {dict.quiz.restart}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
