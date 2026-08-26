/**
 * Metodos de pago aceptados.
 *
 * PLACEHOLDER GRAFICO: son representaciones simplificadas hechas a mano, no
 * los archivos oficiales de cada marca. Antes de publicar conviene cambiarlas
 * por los kits oficiales (Stripe y Mercado Pago publican los suyos, y cada red
 * tiene sus reglas de uso de logo).
 */
const CARD = "h-[26px] w-[40px] shrink-0 rounded-[5px] border border-line bg-white";

function Visa() {
  return (
    <svg viewBox="0 0 40 26" className={CARD} role="img" aria-label="Visa">
      <text
        x="20"
        y="17.5"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="11"
        fontWeight="700"
        fontStyle="italic"
        fill="#1434CB"
      >
        VISA
      </text>
    </svg>
  );
}

function Mastercard() {
  return (
    <svg viewBox="0 0 40 26" className={CARD} role="img" aria-label="Mastercard">
      <circle cx="16.5" cy="13" r="7" fill="#EB001B" />
      <circle cx="23.5" cy="13" r="7" fill="#F79E1B" />
      <path d="M20 7.4a7 7 0 0 0 0 11.2 7 7 0 0 0 0-11.2Z" fill="#FF5F00" />
    </svg>
  );
}

function Amex() {
  return (
    <svg viewBox="0 0 40 26" className={CARD} role="img" aria-label="American Express">
      <rect x="1" y="1" width="38" height="24" rx="4" fill="#2E77BC" />
      <text
        x="20"
        y="16.5"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="8"
        fontWeight="700"
        fill="#ffffff"
      >
        AMEX
      </text>
    </svg>
  );
}

function ApplePay() {
  return (
    <svg viewBox="0 0 40 26" className={CARD} role="img" aria-label="Apple Pay">
      <path
        d="M13.9 9.1c.5-.6.8-1.4.7-2.2-.8 0-1.7.5-2.2 1.1-.5.6-.9 1.4-.7 2.2.8.1 1.7-.4 2.2-1.1Zm.7 1.2c-1.2-.1-2.2.7-2.8.7-.6 0-1.4-.6-2.4-.6-1.2 0-2.4.7-3 1.9-1.3 2.2-.3 5.6 1 7.4.6.9 1.4 1.9 2.4 1.8.9 0 1.3-.6 2.4-.6 1.1 0 1.4.6 2.4.6 1 0 1.6-.9 2.3-1.8.4-.6.6-1 .9-1.6-2.3-.9-2.7-4.2-.4-5.5-.6-.8-1.5-1.3-2.8-1.3Z"
        transform="translate(0 -3) scale(0.62)"
        fill="#0b0b0b"
      />
      <text
        x="27"
        y="17"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="9"
        fontWeight="600"
        fill="#0b0b0b"
      >
        Pay
      </text>
    </svg>
  );
}

function GooglePay() {
  return (
    <svg viewBox="0 0 40 26" className={CARD} role="img" aria-label="Google Pay">
      <path d="M12.6 12.3v2.1h3a2.6 2.6 0 0 1-2.9 2 3.4 3.4 0 0 1 0-6.8 3 3 0 0 1 2.1.8l1.5-1.5a5.3 5.3 0 0 0-3.6-1.4 5.5 5.5 0 1 0 .1 11c3.1 0 5.2-2.2 5.2-5.3 0-.4 0-.7-.1-1h-5.3Z" fill="#4285F4" />
      <text
        x="28"
        y="17"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="9"
        fontWeight="600"
        fill="#3c4043"
      >
        Pay
      </text>
    </svg>
  );
}

function MercadoPago() {
  return (
    <svg viewBox="0 0 40 26" className={CARD} role="img" aria-label="Mercado Pago">
      <rect x="1" y="1" width="38" height="24" rx="4" fill="#009EE3" />
      <text
        x="20"
        y="12"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="6.4"
        fontWeight="700"
        fill="#ffffff"
      >
        mercado
      </text>
      <text
        x="20"
        y="19.5"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="6.4"
        fontWeight="700"
        fill="#FFE600"
      >
        pago
      </text>
    </svg>
  );
}

function Oxxo() {
  return (
    <svg viewBox="0 0 40 26" className={CARD} role="img" aria-label="OXXO">
      <rect x="1" y="1" width="38" height="24" rx="4" fill="#E10600" />
      <text
        x="20"
        y="17"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="9"
        fontWeight="700"
        fill="#FFE600"
      >
        OXXO
      </text>
    </svg>
  );
}

function Spei() {
  return (
    <svg viewBox="0 0 40 26" className={CARD} role="img" aria-label="SPEI">
      <text
        x="20"
        y="17"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="9"
        fontWeight="700"
        fill="#1f3a5f"
      >
        SPEI
      </text>
    </svg>
  );
}

function Msi() {
  return (
    <svg viewBox="0 0 40 26" className={CARD} role="img" aria-label="Meses sin intereses">
      <text
        x="20"
        y="12.5"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="7"
        fontWeight="700"
        fill="#0b3c49"
      >
        MSI
      </text>
      <text
        x="20"
        y="20"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="5.4"
        fill="#5b7b86"
      >
        3 a 12
      </text>
    </svg>
  );
}

export function PaymentBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <Visa />
      <Mastercard />
      <Amex />
      <ApplePay />
      <GooglePay />
      <MercadoPago />
      <Oxxo />
      <Spei />
      <Msi />
    </div>
  );
}
