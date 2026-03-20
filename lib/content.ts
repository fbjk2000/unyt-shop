export type EcosystemItem = {
  name: string;
  category: string;
  description: string;
  useCase: string;
  ctaLabel: string;
  href: string;
  highlight: string;
};

export const ecosystemItems: EcosystemItem[] = [
  {
    name: "Fintery",
    category: "Commerce",
    description: "Premium commerce experiences, services, and curated buying journeys.",
    useCase: "Use UNYTs for selected purchases, upgrades, and member offers.",
    ctaLabel: "View commerce uses",
    href: "/ecosystem#fintery",
    highlight: "Structured purchasing",
  },
  {
    name: "Alakai",
    category: "Services",
    description: "Operational and advisory workflows where fast, unified payments matter.",
    useCase: "Use UNYTs for supported service access and account-level billing.",
    ctaLabel: "See service access",
    href: "/ecosystem#alakai",
    highlight: "Clear service settlement",
  },
  {
    name: "TechSelec",
    category: "Tools",
    description: "Technology procurement and utility layers designed for repeat use.",
    useCase: "Use UNYTs for tooling packages, supported subscriptions, and renewals.",
    ctaLabel: "Explore tooling",
    href: "/ecosystem#techselec",
    highlight: "Business-ready billing",
  },
  {
    name: "Unyted.world",
    category: "Community",
    description: "Community and access experiences with one shared utility balance.",
    useCase: "Use UNYTs for passes, access, and supported ecosystem experiences.",
    ctaLabel: "Review access",
    href: "/ecosystem#unyted-world",
    highlight: "Network-wide access",
  },
  {
    name: "Unyted.Chat",
    category: "Communication",
    description: "Communication products where one balance removes payment friction.",
    useCase: "Use UNYTs for premium features, upgrades, and account services.",
    ctaLabel: "Open communication uses",
    href: "/ecosystem#unyted-chat",
    highlight: "Frictionless upgrades",
  },
  {
    name: "Earnrm.com",
    category: "Utility",
    description: "Ecosystem utility endpoints and future services where supported.",
    useCase: "Use UNYTs for supported actions, credits, and future utility programs.",
    ctaLabel: "See supported utility",
    href: "/ecosystem#earnrm",
    highlight: "Future-ready utility",
  },
] as const;

export const howItWorksSteps = [
  {
    title: "Add UNYTs",
    body: "Start with a simple top-up flow using supported payment methods, including card where available.",
    stat: "Fast account funding",
  },
  {
    title: "Spend across the ecosystem",
    body: "Use one balance across participating products and services without switching accounts or payment flows.",
    stat: "One shared balance",
  },
  {
    title: "Access wallet utility when available",
    body: "Keep things simple by default, then use wallet-level features where supported.",
    stat: "Clear optionality",
  },
] as const;

export const homepageFeatures = [
  {
    eyebrow: "USEFUL BY DESIGN",
    title: "One balance across the brands you already use.",
    body: "UNYTs are built for utility, not noise. Instead of fragmenting payments across different products, unyt.shop gives your users one clear balance they can use across the network.",
    ctaLabel: "See every supported product",
    href: "/ecosystem",
    bullets: [
      "One balance visible across supported products",
      "Cleaner account reconciliation for users and teams",
      "A calmer payment experience from first use",
    ],
  },
  {
    eyebrow: "PAY YOUR WAY",
    title: "A premium checkout experience on every screen.",
    body: "Whether users prefer card payments, mobile-first flows, or supported wallet interactions, the experience should feel fast, deliberate, and trustworthy from first click to confirmation.",
    ctaLabel: "See how it works",
    href: "/how-it-works",
    bullets: [
      "Strong hierarchy for mobile checkout",
      "Supportive status messaging at each step",
      "Designed for repeat payments without friction",
    ],
  },
  {
    eyebrow: "MOBILE-FIRST SWAPS",
    title: "Convert with clarity.",
    body: "When users want to move into major supported digital assets, the swap experience should feel precise and transparent — with clear quotes, visible fees, and strong status feedback throughout.",
    ctaLabel: "Open swap",
    href: "/app/swap",
    bullets: [
      "Readable quote details before confirmation",
      "Visible fees and availability notes",
      "Strong mobile ergonomics for approval flows",
    ],
  },
] as const;

export const faqItems = [
  {
    question: "What are UNYTs?",
    answer:
      "UNYTs are the ecosystem utility balance used across participating products and services. They are designed for access, payments, and supported wallet actions.",
  },
  {
    question: "Where can I use UNYTs?",
    answer:
      "UNYTs can be used across supported experiences in Fintery, Alakai, TechSelec, Unyted.world, Unyted.Chat, Earnrm.com, and future ecosystem services.",
  },
  {
    question: "How do I get UNYTs?",
    answer:
      "You start with a top-up flow using supported payment methods, including card where available. Some regions or account states may require additional checks.",
  },
  {
    question: "Can I pay on mobile?",
    answer:
      "Yes. The product is designed to work well on mobile, with large tap targets, simple confirmations, and a wallet experience built for smaller screens first.",
  },
  {
    question: "Are wallet features available everywhere?",
    answer:
      "No. Some wallet and on-chain utility features depend on region, account requirements, and product availability. The interface should make that clear before use.",
  },
  {
    question: "How does swap work?",
    answer:
      "Swap shows a clear quote, supported pair, visible fees, and expected output before confirmation. Availability depends on supported assets and account state.",
  },
  {
    question: "What products accept UNYTs?",
    answer:
      "Current examples include Fintery, Alakai, TechSelec, Unyted.world, Unyted.Chat, and Earnrm.com, with room for new partners over time.",
  },
  {
    question: "How do I get support?",
    answer:
      "Support should be available from inside the wallet and through product support routes, with clear guidance for account issues, payment questions, and recovery requests.",
  },
] as const;

export const trustPrinciples = [
  {
    title: "Clear balances",
    body: "Users should always understand what they hold, what is available to spend, and which actions are supported.",
  },
  {
    title: "Visible transaction status",
    body: "Quotes, payments, and wallet actions should communicate progress, completion, and availability without ambiguity.",
  },
  {
    title: "Support by design",
    body: "Recovery and support guidance should be easy to find, written calmly, and grounded in real operational paths.",
  },
] as const;

export const walletSnapshot = {
  totalBalance: "18,420.00 UNYTs",
  fiatEquivalent: "Approx. $18,420.00 equivalent",
  availableBalance: "15,980.00 UNYTs available",
  pendingBalance: "2,440.00 UNYTs pending settlement",
  quickActions: [
    { label: "Add funds", detail: "Top up with supported payment methods." },
    { label: "Pay with UNYTs", detail: "Use balance at supported ecosystem products." },
    { label: "Withdraw", detail: "Move balance where supported and available." },
    { label: "Swap", detail: "Convert into major supported digital assets." },
  ],
  spendDestinations: [
    { name: "Fintery", detail: "Commerce and upgrades", amount: "4,200 UNYTs used this month" },
    { name: "TechSelec", detail: "Tools and subscriptions", amount: "2,400 UNYTs scheduled" },
    { name: "Unyted.Chat", detail: "Premium communication access", amount: "320 UNYTs active" },
  ],
  activity: [
    { title: "TechSelec annual tools plan", status: "Confirmed", amount: "-2,400 UNYTs" },
    { title: "Card top-up", status: "Processing", amount: "+5,000 UNYTs" },
    { title: "Fintery checkout", status: "Confirmed", amount: "-860 UNYTs" },
  ],
  paymentMethods: [
    "Primary Visa ending in 2048",
    "Business Mastercard ending in 1860",
    "Supported wallet route available",
  ],
} as const;

export const swapSnapshot = {
  pair: "UNYTs to USDC",
  input: "2,500.00 UNYTs",
  output: "2,487.10 USDC",
  fee: "4.80 UNYTs",
  route: "Best supported route",
  completion: "Estimated completion under 2 minutes",
  popularPairs: ["UNYTs / USDC", "UNYTs / ETH", "UNYTs / ARB"],
  recentActivity: [
    { pair: "UNYTs / USDC", amount: "1,200", status: "Completed" },
    { pair: "UNYTs / ETH", amount: "850", status: "Pending review" },
    { pair: "UNYTs / ARB", amount: "430", status: "Completed" },
  ],
  safetyNotes: [
    "Quotes refresh before confirmation.",
    "Availability depends on region and account status.",
    "Visible fees are shown before final approval.",
  ],
} as const;

export const securityNotes = [
  {
    title: "Account protection",
    body: "Use strong credentials, supported recovery methods, and clear device hygiene. Sensitive actions should be easy to review before approval.",
  },
  {
    title: "Transaction visibility",
    body: "Balances, confirmations, and pending states should be visible without reading through dense technical detail.",
  },
  {
    title: "Support and recovery",
    body: "When something goes wrong, users need clear escalation paths, identity checks where required, and transparent timing expectations.",
  },
] as const;
