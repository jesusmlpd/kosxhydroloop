import type { Dict } from "./es";

/**
 * English mirror of lib/dict/es.ts. Product facts, savings figures, the box
 * contents, dimensions, warranty and coverage all come from hydroloop.com.mx.
 */
export const en: Dict = {
  meta: {
    home: {
      title: "Hydroloop® | Hot water on demand without wasting the cold",
      description:
        "Hydroloop® is the Mexican hydro-return that sends the cold water you waste waiting for hot back to the heater. Save up to 50% of your shower water, 7,300 liters and 18 hours per person a year. From $3,799 MXN with nationwide shipping.",
    },
    products: {
      title: "Buy Hydroloop®: Manual and WiFi model prices",
      description:
        "Hydroloop® pricing: Manual $3,799 and WiFi $3,999 MXN tax included. A hydro-return recirculation pump made in Mexico, nationwide shipping, card, installments, OXXO and SPEI, warranty up to 2 years.",
    },
    about: {
      title: "About",
      description:
        "We are a Mexican team with one purpose: leave our drop of water in the world. Technology that saves water without giving up comfort.",
    },
    contact: {
      title: "Contact and dealers",
      description:
        "Write to us or find your nearest Hydroloop dealer. Points of sale in Guanajuato, Coahuila, San Luis Potosí, Estado de México and Baja California Sur.",
    },
    blog: {
      title: "Water blog",
      description:
        "How a hydro-return works, how much water really goes down the drain while you wait, installation, heater compatibility and real savings on your bill.",
    },
    thankYou: {
      title: "Thank you",
      description: "We got your message. We will reach out within 24 business hours.",
    },
  },

  nav: {
    home: "Home",
    products: "Buy",
    how: "How it works",
    about: "About",
    blog: "Blog",
    contact: "Contact",
    cta: "Buy now",
    menu: "Menu",
    close: "Close",
    theme: "Switch theme",
    language: "Language",
    skip: "Skip to content",
  },

  hero: {
    eyebrow: "Hydro-return · Made in Mexico",
    title: "Instant hot water.",
    titleAccent: "Without wasting a drop.",
    body: "Press a button and the cold water that runs down the drain today goes back to the heater. No construction, no new heater, no change to your routine.",
    ctaPrimary: "Buy from",
    ctaSecondary: "See how it works",
    note: "Shipping across Mexico · Up to 2 year warranty · Card, installments, OXXO and SPEI",
    scroll: "Scroll to see the savings",
    chips: [
      "Save up to 50% of your shower water",
      "Uses less energy than an LED bulb",
      "Pays for itself through the water bill",
    ],
    proof: "{rating} out of 5 · {n} reviews",
  },

  ticker: [
    "Save up to 50% of your shower water",
    "7,300 liters a year per person",
    "18 hours a year you stop waiting",
    "Uses less energy than an LED bulb",
    "Works with any water heater",
    "20 year service life",
    "Mexican engineering",
  ],

  stats: [
    { value: "50%", label: "less water consumed in your shower" },
    { value: "7,300 L", label: "of water a year per person in the house" },
    { value: "18 h", label: "a year you stop waiting for hot water" },
    { value: "20 years", label: "of service life with no maintenance" },
  ],

  problem: {
    eyebrow: "The problem",
    title: "Nobody wastes water on purpose, it goes while you wait",
    body: "In a normal installation the hot water lives in the heater and the pipe is full of cold water. Open the tap and all of that cold water goes down the drain before the hot arrives. It happens on every shower, every day, in every bathroom of the house.",
    items: [
      {
        title: "It leaves clean",
        body: "This is not greywater. It is drinking water you already paid for that never got used for anything.",
      },
      {
        title: "And it bills you twice",
        body: "You pay for it on the water bill, then pay again in the time you spend standing there waiting.",
      },
      {
        title: "Dry season makes it worse",
        body: "Where water arrives on a schedule or by truck, every liter down the drain is a liter you will miss later.",
      },
    ],
  },

  how: {
    eyebrow: "How it works",
    title: "Hydroloop® is a hydro-return",
    body: "You press the button, or trigger it from your phone. An internal 12 V pump pushes the cold water trapped in the hot line back to the heater through the cold line. When hot water reaches the unit thermostat, the pump shuts itself off. Open the tap and it runs hot.",
    note: "Hydroloop® does not save gas: gas consumption stays the same. It saves water, time and money.",
    diagramAlt: "Animated diagram of how a Hydroloop hydro-return works",
    autoplay: "The sequence plays on its own. Tap any step to see it.",
    labels: {
      feed: "Supply line",
      coldLine: "Cold water line",
      hotLine: "Hot water line",
      heater: "Water heater",
      button: "Start button",
      device: "Hydroloop®",
      noWaste: "Nothing wasted",
    },
    steps: [
      "Press the start button.",
      "The water starts to move.",
      "While the water runs cold, it returns to the heater through the cold line.",
      "Once the water runs hot, the unit shuts off and lets it through.",
      "Open the tap and get hot water at the right moment, with nothing wasted.",
    ],
  },

  video: {
    how: {
      title: "Watch it work in 90 seconds",
      body: "The official Hydroloop video: what happens inside the pipe and why not a single drop is wasted.",
      cta: "Play video",
    },
    install: {
      title: "Install it in 10 minutes",
      body: "The official step by step tutorial. If your plumber has an afternoon, they have plenty.",
      cta: "Watch tutorial",
    },
    consent: "The video loads from YouTube when you play it.",
  },

  buyBar: {
    from: "From",
  },

  models: {
    eyebrow: "Models",
    title: "Which Hydroloop is yours?",
    body: "All three deliver the same core experience. The difference is how you trigger it and how much technology you want in your bathroom.",
    compare: "Compare models",
    soonBadge: "Coming soon",
    from: "From",
  },

  savings: {
    eyebrow: "Calculator",
    title: "How much water your house is throwing away",
    body: "Move the values to match your reality. The defaults are the figures Hydroloop publishes: 7,300 liters and 18 hours a year per person.",
    fields: {
      people: "People in the house",
      uses: "Hot water uses per day, per person",
      liters: "Liters lost while waiting, per use",
      seconds: "Seconds you wait, per use",
      price: "Water price per cubic meter",
    },
    presets: [
      { label: "Apartment (2)", people: 2, uses: 2 },
      { label: "House (4)", people: 4, uses: 2 },
      { label: "Big house (6)", people: 6, uses: 3 },
    ],
    results: {
      liters: "Liters a year going down the drain",
      hours: "Hours a year spent waiting",
      money: "Pesos a year in wasted water",
      payback: "Months to pay the unit back",
      paybackNote: "Against the price of Hydroloop® Manual, with these values.",
      paybackLong: "over 2 years",
      showers: "That is",
      showersUnit: "full 8 minute showers",
      tanks: "or {n} rooftop tanks of 1,100 liters",
    },
    disclaimer:
      "This is an estimate, not a promise. Real savings depend on the distance to the heater, the pipe diameter and your water rate. The price per cubic meter changes in every city, so use the one on your bill.",
    cta: "Buy Hydroloop",
    perYear: "a year",
  },

  trust: {
    eyebrow: "Why trust us",
    title: "What comes with your unit",
    badges: [
      { title: "Made in Mexico", body: "Mexican engineering, our own design and technical support in Spanish." },
      { title: "One year warranty", body: "Manufacturing defects on the unit and the control module. Up to two years when our certified crew installs it." },
      { title: "Protected checkout", body: "Payments processed by Stripe and Mercado Pago. Hydroloop never sees or stores your card details." },
      { title: "Remote support", body: "We walk you through the install and answer questions remotely if your plumber needs a hand." },
      { title: "Shipping across Mexico", body: "In several zones shipping is free depending on our distribution network. Otherwise we quote it with your postal code." },
      { title: "Certified installation", body: "In the north and central zones our own crew installs it and extends the warranty." },
    ],
    paymentsTitle: "Payment methods accepted",
    paymentsNote: "Credit and debit cards, Apple Pay, Google Pay, installments, OXXO, SPEI and bank transfer. Cash at authorized points of sale.",
  },

  reviews: {
    eyebrow: "Reviews",
    title: "What people who own one say",
    of5: "out of 5",
    basedOn: "{n} reviews",
    recommend: "{percent}% recommend it",
    verified: "Verified purchase",
    installedBy: "Certified installation",
    filterAll: "All",
    filterStars: "{n} stars",
    sortRecent: "Most recent",
    sortHelpful: "Most helpful",
    sortHigh: "Highest rated",
    sortLow: "Lowest rated",
    empty: "No reviews match that filter yet.",
    helpful: "Was this helpful?",
    helpfulCount: "{n} people say yes",
    showMore: "See more reviews",
    showLess: "See fewer",
    write: "Write a review",
    distribution: "Breakdown",
  },

  products: {
    eyebrow: "Store",
    title: "Buy your Hydroloop",
    body: "Prices in Mexican pesos, tax included. Shipping across Mexico and factory warranty.",
    cta: "See details",
    all: "See all",
    price: "From",
    soldOut: "Sold out",
    available: "In stock",
    comingSoon: "Coming soon",
    accessory: "Accessory",
    quote: "Ask for details",
    addToCart: "Add to cart",
    buyNow: "Buy now",
    specsTitle: "Specs",
    includesTitle: "In the box",
    idealTitle: "Best for",
    notifyTitle: "Tell me when it ships",
    galleryPrev: "Previous",
    galleryNext: "Next",
    galleryThumb: "See image {n}",
    readReviews: "Read all {n} reviews",
    madeInMx: "Made in Mexico",
    backToProducts: "Back to the store",
    sku: "SKU",
    ivaIncluded: "Tax included",
    items: {
      "hydroloop-manual": {
        name: "Hydroloop® Manual",
        metaDescription:
          "Hydroloop® Manual: $3,799 MXN tax included. A hydro-return recirculation pump with a wall button that sends cold water back to the heater and saves up to 50% of your shower water. Ships across Mexico, up to 2 year warranty.",
        seo: {
          title: "The recirculation pump that saves water with no construction",
          paragraphs: [
            "Hydroloop® Manual is a hydro-return: a hot water recirculation pump that works the opposite way you are picturing. Instead of letting the tap run, you press a button next to the light switch and the internal 12 V pump pushes the cold water trapped in the pipe back to the heater through the cold line. When the 40 degree thermostat detects hot water, the unit shuts itself off. Open the shower and it runs hot from the first second.",
            "The difference against imported recirculators is the install and the price: Hydroloop® mounts under the sink or inside the vanity with no construction, no dedicated return line and no heater replacement, whether yours is tank, tankless or solar. That stops up to 7,300 liters per person per year from going down the drain and cuts up to half of your shower's consumption.",
            "It is the option for anyone who wants to save shower water without configuring anything: zero apps, zero scheduling, one button. Made in Mexico, with a one year warranty that extends to two with certified installation, local parts and remote support in Spanish.",
          ],
        },
        tagline: "Simple activation, direct control",
        body: "The most practical option: one button on the wall and that is it. It starts when you want and stops on its own once the temperature arrives. It ships without a faceplate and with a plain button, so you can match the switches you already have.",
        ideal: "Anyone who wants to save water without configuring anything.",
        specs: [
          { label: "Activation", value: "Wall button" },
          { label: "Pump", value: "12 V, internal" },
          { label: "Thermostat", value: "40 degrees, automatic cutoff" },
          { label: "Safety timer", value: "15 minutes" },
          { label: "Weight", value: "1.4 kg" },
          { label: "Unit size", value: "11 x 7.5 x 13 cm" },
          { label: "Box size", value: "34 x 23 x 20 cm" },
          { label: "Warranty", value: "1 year, 2 with certified installation" },
        ],
        includes: [
          "Hydroloop® hydro-return unit",
          "2 flexible hoses",
          "Transformer",
          "Signal cable",
          "Control module with button",
          "40 degree thermostat module",
          "Flow laminator",
          "Quick guide and manual",
        ],
      },
      "hydroloop-wifi": {
        name: "Hydroloop® WiFi",
        metaDescription:
          "Hydroloop® WiFi: $3,999 MXN tax included. Hot water recirculator with app, Alexa, Google Assistant and SmartThings. Schedule hot water by day and time and stop wasting a single liter waiting.",
        seo: {
          title: "Hot water scheduled from your phone",
          paragraphs: [
            "Hydroloop® WiFi is the smart hydro-return of the family: the same 12 V recirculation pump and automatic-cutoff thermostat as the Manual model, plus full control from your phone. Schedule start times by day and hour so hot water is ready before the alarm rings, or trigger it remotely on your way home.",
            "It joins the smart home without drama: it works with Alexa, Google Assistant and SmartThings, so hot water can enter your good-morning routine along with the coffee maker and the lights. It only needs WiFi signal at the point where the unit is installed.",
            "For hotels, Airbnbs and vacation rentals it is the direct fix for the most repeated guest complaint: waiting for hot water. Schedule it around bookings, save up to 50% of shower water and install it in one afternoon with no construction. Made in Mexico with up to a 2 year warranty.",
          ],
        },
        tagline: "Smart comfort on your terms",
        body: "Everything the Manual does, plus control from your phone. Schedule it by day and time, or trigger it remotely before you get home. Works with Alexa, Google Assistant and SmartThings. It needs WiFi signal where the unit is installed.",
        ideal: "Anyone who wants hot water ready before they walk into the bathroom.",
        specs: [
          { label: "Activation", value: "Button, app or voice" },
          { label: "Scheduling", value: "By day and time" },
          { label: "Assistants", value: "Alexa, Google Assistant, SmartThings" },
          { label: "Requirement", value: "WiFi signal at the install point" },
          { label: "Pump", value: "12 V, internal" },
          { label: "Thermostat", value: "40 degrees, automatic cutoff" },
          { label: "Weight", value: "1.4 kg" },
          { label: "Unit size", value: "11 x 7.5 x 13 cm" },
          { label: "Warranty", value: "1 year, 2 with certified installation" },
        ],
        includes: [
          "Hydroloop® hydro-return unit",
          "2 flexible hoses",
          "Transformer",
          "Signal cable",
          "Control module with button",
          "40 degree thermostat module",
          "Flow laminator",
          "Quick guide and WiFi manual",
        ],
      },
      "kit-caja-de-instalacion": {
        name: "Installation box kit",
        metaDescription:
          "Installation box kit for Hydroloop®: $139.20 MXN tax included. Surface mount box and blank faceplate cut to the exact size of the control module, for bathrooms with a full electrical box.",
        seo: {
          title: "The accessory for full electrical boxes",
          paragraphs: [
            "In houses with some history, the bathroom electrical box tends to be full and the Hydroloop® control module no longer fits inside. This kit solves it in five minutes: a white surface mount box with the module's exact measurements and a blank faceplate with the button hole already drilled.",
            "The installers' advice is simple: if your house is over ten years old, add it to the order along with your unit and skip a second shipping wait. Compatible with Hydroloop® Manual and WiFi.",
          ],
        },
        tagline: "For bathrooms with no room in the electrical box",
        body: "You only need this if the electrical box in your bathroom has no room for the control module inside. It includes the surface mount box cut to size and the blank faceplate drilled for the button.",
        ideal: "Bathrooms where the electrical box is already full.",
        specs: [
          { label: "Compatible with", value: "Hydroloop Manual and WiFi" },
          { label: "Color", value: "White" },
          { label: "Contents", value: "Surface mount box and blank faceplate" },
        ],
        includes: [
          "White plastic surface mount box, sized for the control module",
          "White blank faceplate drilled for the button",
        ],
      },
      "hydroloop-bateria": {
        name: "Hydroloop® Battery",
        metaDescription:
          "Hydroloop® Battery, coming soon: a hydro-return with a rechargeable battery and a button, to save hot water in bathrooms with no outlet nearby. Write to us and we will tell you when it ships.",
        seo: {
          title: "A hydro-return with no electrical hookup",
          paragraphs: [
            "The Battery version is built for the bathroom with no outlet nearby: the recirculation pump runs on a rechargeable battery and starts with a button, so it installs almost anywhere with no electrical work.",
            "It is in development and shipping soon. If you want a heads-up when it goes on sale, message us on WhatsApp or through the contact page.",
          ],
        },
        tagline: "Coming soon, more freedom to install",
        body: "A version built for spots with no direct power connection. Rechargeable battery and manual button start, so it goes into almost any bathroom with no electrical work.",
        ideal: "Bathrooms with no outlet nearby.",
        specs: [
          { label: "Activation", value: "Button" },
          { label: "Power", value: "Rechargeable battery" },
          { label: "Availability", value: "Coming soon" },
        ],
        includes: ["To be confirmed at launch"],
      },
    },
  },

  pdp: {
    msi: "or up to 12 payments of {monthly} with participating cards",
    delivery: "Get it between {from} and {to}",
    deliveryNote: "ordering today, standard shipping",
    risk: "7 day returns and up to a 2 year warranty. Zero-risk purchase.",
    riskLink: "See terms",
    waBuy: "Questions? Buy it over WhatsApp",
    waMessage: "Hi, I want to buy the {product}",
    bundleAdd: "Add the installation box kit",
    bundleHint: "Only if your electrical box is already full",
    topReview: "Featured review",
  },

  quiz: {
    eyebrow: "30 second test",
    title: "Not sure which one is yours?",
    body: "Three questions and we tell you exactly what to add to the cart.",
    steps: [
      {
        q: "Where will you use it?",
        a: ["At my house or apartment", "At a business or vacation rental"],
      },
      {
        q: "How do you prefer to switch it on?",
        a: ["A button, that is it", "From my phone, on a schedule"],
      },
      {
        q: "Does your bathroom's electrical box have room?",
        a: ["Yes, there is room", "It is full, or I am not sure"],
      },
    ],
    back: "Back",
    resultTitle: "Your Hydroloop® is:",
    withKit: "plus the installation box kit",
    reason: {
      wifi: "With schedules and remote control on your list, the WiFi is yours.",
      manual: "No apps, no setup: the Manual does exactly what you need.",
      kit: "Since your electrical box is full (or you are not sure), the kit saves you a second order.",
    },
    add: "Add to cart",
    see: "See details",
    restart: "Start over",
  },

  socialProof: {
    viewing: "{n} people are looking at this right now",
    sold: "{n} sold in the last 30 days",
    stockBar: "{n} left in stock",
    toast: "{name} from {city} added {product} to their cart",
    toastAgo: "{n} min ago",
    close: "Close",
  },

  variants: {
    title: "Pick your model",
  },

  bundles: {
    eyebrow: "Popular bundles",
    title: "The ones that leave together",
    body: "One click and the full bundle lands in your cart.",
    includes: "Includes",
    add: "Add bundle",
  },

  announcement: {
    shipping: "Free shipping on orders over {amount}",
    mx: "Made in Mexico · Warranty up to 2 years",
  },

  recentlyViewed: {
    title: "Recently viewed",
  },

  compare: {
    eyebrow: "Comparison",
    title: "Manual or WiFi?",
    body: "Both save the same water. The difference is how you switch it on.",
    feature: "Feature",
    rows: [
      { label: "Activation", manual: "Wall button", wifi: "Button, app or voice" },
      { label: "Scheduling", manual: "No", wifi: "Yes, by day and time" },
      { label: "Alexa, Google and SmartThings", manual: "No", wifi: "Yes" },
      { label: "Needs WiFi signal", manual: "No", wifi: "Yes, at the install point" },
      { label: "Water savings", manual: "Up to 50% in the shower", wifi: "Up to 50% in the shower" },
      { label: "Warranty", manual: "1 year, 2 certified", wifi: "1 year, 2 certified" },
    ],
    cta: "See the other model",
  },

  faq: {
    eyebrow: "FAQ",
    title: "What everyone asks before buying",
    items: [
      {
        q: "Do I need one unit per bathroom?",
        a: "It depends on your plumbing. If the fixtures run in line, one unit at the last point can be enough as long as the secondary branches are short. If the plumbing is branched, where each fixture gets water from its own line, every point that wants instant hot water needs its own unit. A plumber can tell you which one you have, or our support team can assess it remotely.",
      },
      {
        q: "Which heaters is it compatible with?",
        a: "Any of them. On high flow tankless heaters you may need a 1/6 hp booster pump to guarantee ignition. It does not apply in every case, so the sensible order is install first and evaluate.",
      },
      {
        q: "Does it save gas?",
        a: "No. Gas consumption stays the same. What it saves is water, time and money.",
      },
      {
        q: "Manual or WiFi?",
        a: "Manual is for anyone who wants simplicity: one click and the system stops on its own at temperature. WiFi is for anyone who wants scheduled start times and phone control, even from outside the house. WiFi needs a good signal where the unit is installed.",
      },
      {
        q: "Are there similar products?",
        a: "Similar yes, identical no. The goal is the same but they get there another way, almost always at a higher price because they are imported, and with a harder install.",
      },
      {
        q: "Do you ship anywhere?",
        a: "Yes. In some cases shipping is free depending on our distribution network and your location. If it does not apply, we quote it with your postal code.",
      },
      {
        q: "What payment methods do you take?",
        a: "Credit and debit cards, Apple Pay, Google Pay, installments, OXXO, SPEI and bank transfer. Cash at authorized points of sale.",
      },
      {
        q: "What does the warranty cover?",
        a: "One year on manufacturing defects for the recirculation unit and the control module, with proof of purchase. It goes up to two years when our certified crew installs it, and in that case it also covers the installation. It does not cover incorrect installation, electrical or plumbing faults in the building, sudden pressure swings, impacts, unauthorized service or accessories we do not manufacture.",
      },
    ],
    more: "See all questions",
  },

  coverage: {
    eyebrow: "Installation",
    title: "Where our own crew installs",
    body: "In these areas our certified team handles the install and your warranty goes up to two years. If your city is not listed, write to us: we look at your location and find a way to cover you.",
    zones: { norte: "North zone", centro: "Central zone" },
    cta: "Ask about my area",
  },

  distributors: {
    eyebrow: "Dealers",
    title: "Points of sale",
    body: "Hydroloop® is also sold in hardware and building supply stores in Mexico's main cities, plus a point of sale in Guatemala City. If you would rather see it in person or pay cash, this is the map.",
    call: "Call",
    website: "Website",
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
    addonTitle: "Complete it with",
    addonAdd: "Add",
    addonHint: "Only needed if your electrical box is already full.",
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

  blog: {
    eyebrow: "Blog",
    title: "Everything about the water that leaves unused",
    body: "How a hydro-return works, how much water really goes down the drain, what to check before installing and how all of it lands on your bill.",
    readMore: "Read",
    by: "By",
    readingTime: "{n} min read",
    published: "Published on",
    updated: "Updated on",
    related: "Keep reading",
    backToBlog: "Back to the blog",
    empty: "No articles published yet.",
    cta: "Buy Hydroloop",
    ctaBody: "Stop paying for water that goes down the drain while you wait.",
  },

  about: {
    eyebrow: "About",
    title: "Leave your drop of water in the world",
    lead: "Hydroloop is a multidisciplinary team that joined forces around a cause bigger than us: protecting water and keeping it available for the generations coming next.",
    body: [
      "We work with commitment and constant innovation to build technology that saves thousands of liters at home without giving up comfort or efficiency.",
      "Every project starts from a sustainable view, designed to turn daily consumption into a conscious, responsible act.",
      "At Hydroloop we do not just build technology: we push a real change in how we take care of one of the most valuable resources on the planet.",
    ],
    missionTitle: "Our mission",
    mission:
      "Build technology that lets people optimize water use from the comfort of their home, encouraging more conscious, efficient and responsible consumption.",
    visionTitle: "Our vision",
    vision:
      "To be a reference in smart technology for water care, with global presence and measurable impact in every home we reach.",
    valuesTitle: "What we do not bend on",
    values: [
      { title: "Our own engineering", body: "Mexican creation, with an engineering team that handles every adaptation." },
      { title: "Installation with support", body: "Remote technical support and certified crews in the areas where we operate." },
      { title: "Honest numbers", body: "We publish the estimated savings and the conditions where they apply, with no inflated promises." },
    ],
  },

  contact: {
    eyebrow: "Contact and dealers",
    title: "Hydroloop® is close to you",
    body: "If you are not sure how many units you need or what kind of plumbing you have, write to us. We answer within 24 business hours.",
    doubtsTitle: "Still have questions?",
    doubtsBody: "No worries, we are here to help. Reach us through whichever channel you prefer and we will gladly assist.",
    whatsappCta: "Message us on WhatsApp",
    emailCta: "Write to us at",
    followUs: "Follow us",
    form: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      type: "Project type",
      typeOptions: ["House", "Apartment", "Hotel or restaurant", "New construction", "Dealer", "Other"],
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
    body: "We will reach out within 24 business hours. In the meantime, take a look at the models.",
    cta: "See products",
  },

  footer: {
    tagline: "Mexican hydro-return. Hot water at the right moment, with nothing wasted.",
    nav: "Navigation",
    contact: "Contact",
    social: "Social",
    legal: "Legal",
    terms: "Terms and refunds",
    privacy: "Privacy notice",
    shippingPolicy: "Shipping policy",
    rights: "All rights reserved.",
    builtBy: "Site built by",
  },

  notFound: {
    title: "This page does not exist",
    body: "The link changed or it never existed. Head back home and keep going.",
    cta: "Go home",
  },
};
