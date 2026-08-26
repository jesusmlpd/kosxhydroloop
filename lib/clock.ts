"use client";

import { useSyncExternalStore } from "react";

/**
 * Un solo reloj compartido para todas las cuentas regresivas. Si cada timer
 * abriera su propio setInterval, cinco componentes serian cinco renders por
 * segundo desfasados entre si.
 */
let now = 0;
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function tick() {
  now = Date.now();
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    now = Date.now();
    timer = setInterval(tick, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

function getSnapshot() {
  // La primera lectura pasa antes del primer tick.
  if (now === 0) now = Date.now();
  return now;
}

/** 0 en el servidor: asi el HTML nunca trae una cuenta regresiva congelada. */
function getServerSnapshot() {
  return 0;
}

export function useNow() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Parte los milisegundos en dias, horas, minutos y segundos. */
export function splitDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export function pad(value: number) {
  return String(value).padStart(2, "0");
}
