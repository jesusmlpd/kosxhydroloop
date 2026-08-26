import type { Dict } from "./es";

/**
 * PLACEHOLDER: starter copy, not verified Hydroloop facts.
 * Anything marked TODO gets replaced once the client brief lands.
 */
export const en: Dict = {
  meta: {
    home: {
      title: "Hydroloop | Water systems for homes and business",
      description:
        "Hydroloop designs, installs and services water treatment and reuse systems. Lower consumption, lower bills, reliable water all year.",
    },
    about: {
      title: "About | Hydroloop",
      description:
        "Who we are, how we work and why water is the best place to invest in your home or your operation.",
    },
    products: {
      title: "Products | Hydroloop",
      description:
        "Hydroloop equipment and systems: treatment, filtration and water reuse for homes, business and industry.",
    },
    contact: {
      title: "Contact | Hydroloop",
      description: "Tell us what you need and we answer within 24 business hours.",
    },
    thankYou: {
      title: "Thank you | Hydroloop",
      description: "We got your message. We will reach out within 24 business hours.",
    },
  },

  nav: {
    home: "Home",
    about: "About",
    products: "Products",
    contact: "Contact",
    cta: "Get a quote",
    menu: "Menu",
    close: "Close",
    theme: "Switch theme",
    language: "Language",
    skip: "Skip to content",
  },

  hero: {
    eyebrow: "Treated, filtered, reused",
    title: "The water you already used",
    titleAccent: "can work one more time",
    body: "Hydroloop installs systems that treat, filter and return water to your home or your operation. Less consumption, smaller bills, less dependence on deliveries.",
    ctaPrimary: "Quote your system",
    ctaSecondary: "See products",
    note: "Installation, warranty and service included.",
  },

  stats: [
    { value: "45%", label: "less potable water used" },
    { value: "24 h", label: "response to every request" },
    { value: "10 years", label: "of service life per unit" },
    { value: "100%", label: "certified installation" },
  ],

  value: {
    eyebrow: "Why Hydroloop",
    title: "One system, three problems solved",
    items: [
      {
        title: "You spend less",
        body: "Treated water goes back into the building, so you buy less and pay less every month.",
      },
      {
        title: "You never run dry",
        body: "When the grid fails or the delivery truck does not show up, your treated reserve is still there for what matters.",
      },
      {
        title: "Compliance stops hurting",
        body: "We document quality, discharge and maintenance, so inspections stop being a fire drill.",
      },
    ],
  },

  products: {
    eyebrow: "Catalog",
    title: "Equipment sized to the problem in front of you",
    body: "From a single house to a full plant. If you are not sure which one fits, a site visit settles it.",
    cta: "See details",
    all: "See the full catalog",
    price: "From",
    soldOut: "Made to order",
    available: "In stock",
    quote: "Request a quote",
    addToCart: "Add to cart",
    buyNow: "Buy now",
    specsTitle: "Specs",
    includesTitle: "What is included",
    backToProducts: "Back to catalog",
    items: {
      "producto-uno": {
        name: "Hydroloop Home",
        tagline: "Greywater reuse for a single household",
        body: "Treats shower and laundry water and returns it clean for toilets, irrigation and cleaning. It goes in over a weekend and nobody has to change their routine.",
        specs: [
          { label: "Capacity", value: "600 liters per day" },
          { label: "Installation", value: "1 to 2 days" },
          { label: "Power draw", value: "0.8 kWh per day" },
          { label: "Warranty", value: "3 years" },
        ],
        includes: [
          "Equipment and on-site startup",
          "First year of filters",
          "Two maintenance visits",
          "Manual and hands-on training",
        ],
      },
      "producto-dos": {
        name: "Hydroloop Commercial",
        tagline: "Treatment for restaurants, hotels and laundries",
        body: "High volume, continuous duty. Built for businesses where stopping the water means stopping the sale.",
        specs: [
          { label: "Capacity", value: "3,000 liters per day" },
          { label: "Installation", value: "3 to 5 days" },
          { label: "Power draw", value: "2.4 kWh per day" },
          { label: "Warranty", value: "5 years" },
        ],
        includes: [
          "Custom hydraulic design",
          "Monthly quality monitoring",
          "Critical spares kept in stock",
          "Reporting for permits and audits",
        ],
      },
      "producto-tres": {
        name: "Hydroloop Filter",
        tagline: "Point of entry for water you can trust",
        body: "The first step when the problem is taste, sediment or hardness. It can grow into a full reuse system later.",
        specs: [
          { label: "Capacity", value: "1,200 liters per day" },
          { label: "Installation", value: "Same day" },
          { label: "Power draw", value: "No electricity needed" },
          { label: "Warranty", value: "2 years" },
        ],
        includes: [
          "Starter cartridges",
          "Water test before and after",
          "Basic installation included",
        ],
      },
    },
  },

  process: {
    eyebrow: "How we work",
    title: "From the first visit to running water",
    steps: [
      {
        title: "Diagnosis",
        body: "We visit the site, measure consumption, pressure and quality, and tell you what can actually be recovered.",
      },
      {
        title: "Proposal",
        body: "One system, one price, one install window. No fine print and no extras that show up later.",
      },
      {
        title: "Installation",
        body: "Our crew mounts it, starts it and trains whoever is going to run it.",
      },
      {
        title: "Service",
        body: "Scheduled visits, filters on time and support when a reading goes out of range.",
      },
    ],
  },

  cta: {
    title: "How much water are you throwing away today?",
    body: "Tell us about your home or your operation and we will tell you what can be recovered and how fast it pays for itself.",
    button: "Quote your system",
    secondary: "Message us on WhatsApp",
  },

  about: {
    eyebrow: "About",
    title: "Hydroloop exists because water turned into a luxury",
    lead: "We are an engineering and service team focused on keeping the water that already entered a building from going down the drain on the first pass.",
    body: [
      "TODO: real company story, founding year, founders and why they started.",
      "TODO: technical capabilities, certifications and the kind of projects delivered.",
      "TODO: who they sell to today and which cities they operate in.",
    ],
    valuesTitle: "What we do not bend on",
    values: [
      { title: "Measure before selling", body: "If the savings are not there, we say so. An oversized system is an expense, not an investment." },
      { title: "Real service", body: "Equipment installed and forgotten turns into expensive scrap. We come back." },
      { title: "Clear numbers", body: "Consumption, savings and payback on one page anyone can check." },
    ],
  },

  contact: {
    eyebrow: "Contact",
    title: "Tell us what you need",
    body: "We answer within 24 business hours. If it is urgent, message us on WhatsApp.",
    form: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      type: "Project type",
      typeOptions: ["Home", "Business", "Industry", "Other"],
      message: "Tell us about the project",
      submit: "Send",
      sending: "Sending",
      error: "That did not send. Try again or write to us directly.",
      required: "Required",
    },
    directTitle: "Direct",
    hoursTitle: "Hours",
    hours: "Monday to Friday, 9:00 to 18:00",
  },

  thankYou: {
    title: "Thanks, we have it",
    body: "We will reach out within 24 business hours. In the meantime, take a look at the catalog.",
    cta: "See products",
  },

  cart: {
    open: "Open cart",
    title: "Your cart",
    close: "Close",
    empty: "Nothing here yet.",
    emptyCta: "See products",
    qty: "Quantity",
    remove: "Remove",
    subtotal: "Subtotal",
    discount: "Discount",
    shipping: "Shipping",
    shippingFree: "Free",
    taxIncluded: "Tax included",
    total: "Total",
    checkout: "Go to checkout",
    keepShopping: "Keep browsing",
    couponPlaceholder: "Discount code",
    couponApply: "Apply",
    couponRemove: "Remove code",
    couponInvalid: "That code does not exist or it expired.",
    couponApplied: "Code {code} applied, {percent}% off.",
    maxStock: "That is all the stock we have.",
    freeShippingMissing: "You are {amount} away from free shipping.",
    freeShippingGot: "You have free shipping.",
    reservedFor: "We are holding your cart {time}",
    reservationExpired: "The hold expired. Your cart is still here, but the stock is no longer reserved.",
    extend: "Hold it 15 more minutes",
  },

  urgency: {
    offerEnds: "The offer ends in",
    offerCode: "Use code {code} for {percent}% off",
    days: "d",
    hours: "h",
    minutes: "m",
    seconds: "s",
    lowStock: "Only {n} left",
    lastOne: "Last one left",
    outOfStock: "Sold out",
    notifyMe: "Tell me when it is back",
  },

  checkout: {
    title: "Checkout",
    back: "Back to cart",
    contactTitle: "Your details",
    shippingTitle: "Shipping address",
    paymentTitle: "How you want to pay",
    summaryTitle: "Summary",
    fields: {
      name: "Full name",
      email: "Email",
      phone: "Phone",
      street: "Street and number",
      interior: "Unit (optional)",
      neighborhood: "Neighborhood",
      city: "City",
      state: "State",
      zip: "Postal code",
      notes: "Delivery notes (optional)",
    },
    methods: {
      stripe: "Card, Apple Pay and Google Pay",
      stripeBody: "Debit, credit, Apple Pay, Google Pay and whatever else is enabled in Stripe, such as OXXO, SPEI and installments.",
      mercadopago: "Mercado Pago",
      mercadopagoBody: "Cards with installments, Mercado Pago balance and cash payments.",
      manual: "Order with email confirmation",
      manualBody: "We create the order and send you payment details by email. No online charge.",
    },
    pay: "Pay {amount}",
    processing: "Processing",
    error: "We could not start the payment. Try again or write to us.",
    emptyCart: "Your cart is empty.",
    secure: "Encrypted connection. Hydroloop never stores your card details.",
    requiredNote: "Every field is required except the ones marked optional.",
  },

  order: {
    successTitle: "Payment received, thank you",
    successBody: "We sent the confirmation by email with the details and delivery times.",
    pendingTitle: "Your payment is being processed",
    pendingBody: "As soon as the bank or the store confirms it we will email you. Cash payments can take a few hours.",
    failureTitle: "The payment did not go through",
    failureBody: "Nothing was charged. Your cart is still here, you can try another method.",
    reference: "Reference",
    backToStore: "Back to the store",
    retry: "Try again",
  },

  footer: {
    tagline: "Water treatment and reuse systems.",
    nav: "Navigation",
    contact: "Contact",
    social: "Social",
    rights: "All rights reserved.",
    builtBy: "Site built by",
  },

  notFound: {
    title: "This page does not exist",
    body: "The link changed or it never existed. Head back home and keep going.",
    cta: "Go home",
  },
};
