"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Marca el pedido como enviado y guarda la guia en Stripe. */
export function ShipForm({ paymentIntent }: { paymentIntent: string }) {
  const router = useRouter();
  const [tracking, setTracking] = useState("");
  const [carrier, setCarrier] = useState("Skydropx");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("/api/admin/ship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntent, tracking, carrier }),
      });
      const result = (await response.json()) as { ok?: boolean };
      if (!result.ok) throw new Error("ship");
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
      <select
        value={carrier}
        onChange={(event) => setCarrier(event.target.value)}
        className="field h-11 w-auto"
        aria-label="Paquetería"
      >
        <option>Skydropx</option>
        <option>Estafeta</option>
        <option>FedEx</option>
        <option>DHL</option>
        <option>Paquetexpress</option>
        <option>Otra</option>
      </select>
      <input
        value={tracking}
        onChange={(event) => setTracking(event.target.value)}
        placeholder="Número de guía"
        className="field h-11 min-w-[180px] flex-1"
        aria-label="Número de guía"
      />
      <button type="submit" disabled={status === "sending"} className="btn btn-primary btn-sm">
        {status === "sending" ? "Guardando" : "Marcar enviado"}
      </button>
      {status === "error" ? (
        <p role="alert" className="w-full text-[13px] text-[#a1332f]">
          No se pudo guardar. Revisa la conexión con Stripe.
        </p>
      ) : null}
    </form>
  );
}
