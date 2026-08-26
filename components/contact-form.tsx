"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Dict } from "@/lib/dict";
import { localePath, type Locale } from "@/lib/i18n";

export function ContactForm({ locale, dict }: { locale: Locale; dict: Dict }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const copy = dict.contact.form;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as { ok?: boolean };
      if (!result.ok) throw new Error("rejected");
      router.push(localePath(locale, "/thank-you"));
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="card p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-[13px] font-medium text-ink-2">{copy.name}</span>
          <input name="name" required autoComplete="name" className="field mt-1.5" />
        </label>
        <label className="block">
          <span className="text-[13px] font-medium text-ink-2">{copy.email}</span>
          <input name="email" type="email" required autoComplete="email" className="field mt-1.5" />
        </label>
        <label className="block">
          <span className="text-[13px] font-medium text-ink-2">{copy.phone}</span>
          <input name="phone" autoComplete="tel" className="field mt-1.5" />
        </label>
        <label className="block">
          <span className="text-[13px] font-medium text-ink-2">{copy.type}</span>
          <select name="type" className="field mt-1.5" defaultValue={copy.typeOptions[0]}>
            {copy.typeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-[13px] font-medium text-ink-2">{copy.message}</span>
        <textarea name="message" required rows={5} className="field mt-1.5 resize-y" />
      </label>

      {/* Honeypot, oculto para personas y visible para bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <button type="submit" disabled={state === "sending"} className="btn btn-primary mt-6 w-full sm:w-auto">
        {state === "sending" ? copy.sending : copy.submit}
      </button>

      {state === "error" ? (
        <p role="alert" className="mt-3 text-[14px] text-ink-2">
          {copy.error}
        </p>
      ) : null}
    </form>
  );
}
