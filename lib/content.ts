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
    description: "Supported commerce journeys where prepaid credits reduce checkout friction.",
    useCase: "Redeem UNYTs for selected purchases, upgrades, and supporter offers.",
    ctaLabel: "View supported checkout",
    href: "/ecosystem#fintery",
    highlight: "Supported checkout",
  },
  {
    name: "Alakai",
    category: "Services",
    description: "Service workflows where account-level credits can be applied clearly.",
    useCase: "Use UNYTs for scoped service access as integrations move from planned to live.",
    ctaLabel: "See service rollout",
    href: "/ecosystem#alakai",
    highlight: "Planned rollout",
  },
  {
    name: "TechSelec",
    category: "Tools",
    description: "Tooling and subscription surfaces designed for repeat account usage.",
    useCase: "Use UNYTs for supported tool packages, renewals, and account services.",
    ctaLabel: "Explore tooling use",
    href: "/ecosystem#techselec",
    highlight: "Scoped support",
  },
  {
    name: "unyted.online",
    category: "Community",
    description: "Community and access experiences with one shared utility balance.",
    useCase: "Use UNYTs for supported passes, event access, and community rights.",
    ctaLabel: "Review access uses",
    href: "/ecosystem#unyted-online",
    highlight: "Access utility",
  },
  {
    name: "unyted.chat",
    category: "Communication",
    description: "Communication products where one account balance simplifies upgrades.",
    useCase: "Use UNYTs for supported premium features and account-level communication services.",
    ctaLabel: "Open communication uses",
    href: "/ecosystem#unyted-chat",
    highlight: "Premium features",
  },
  {
    name: "EarnRM",
    category: "Utility",
    description: "The first live redemption path in supporter v1.",
    useCase: "Redeem UNYTs into EarnRM user-month usage rights today.",
    ctaLabel: "See live redemption",
    href: "/ecosystem#earnrm",
    highlight: "Live now",
  },
] as const;

export const howItWorksSteps = [
  {
    title: "Buy prepaid credits",
    body: "Top up with supported payment methods and add UNYTs to your account balance.",
    stat: "Supporter-ready funding",
  },
  {
    title: "Track balance and activity",
    body: "See available credits, pending amounts, and a clear ledger of each top-up and redemption.",
    stat: "Visible ledger history",
  },
  {
    title: "Redeem supported usage rights",
    body: "Use credits for live product rights, starting with EarnRM user-month access, while additional products roll out in planned phases.",
    stat: "Live plus planned clarity",
  },
] as const;

export const homepageFeatures = [
  {
    eyebrow: "PRACTICAL BY DEFAULT",
    title: "A wallet experience supporters can understand quickly.",
    body: "UNYT.shop v1 is built around prepaid ecosystem utility credits, not abstract token claims. Top up, hold a visible balance, and redeem into supported product usage rights.",
    ctaLabel: "See supported products",
    href: "/ecosystem",
    bullets: [
      "Prepaid credits with clear account-level visibility",
      "One balance model across participating products",
      "Practical scope that avoids feature overclaiming",
    ],
  },
  {
    eyebrow: "COMMERCIAL CLARITY",
    title: "Every action has clear status and next steps.",
    body: "Supporters should always know what is live, what is preview-only, and what happens after each action. The interface keeps balance, activity, and redemption status easy to verify.",
    ctaLabel: "See how it works",
    href: "/how-it-works",
    bullets: [
      "Live and planned features are labeled directly",
      "Activity history confirms top-ups and redemptions",
      "Support language is concise and operational",
    ],
  },
  {
    eyebrow: "ROADMAP PREVIEW",
    title: "Swap remains preview-only until rails are production-ready.",
    body: "Swap UX can be explored in supporter v1, but execution remains intentionally offline until routing, compliance checks, and settlement controls are fully hardened.",
    ctaLabel: "Open swap preview",
    href: "/app/swap",
    bullets: [
      "No live swap execution claims",
      "Clear roadmap framing for future utility",
      "Premium UI without overstating availability",
    ],
  },
] as const;

export const faqItems = [
  {
    question: "What are UNYTs?",
    answer:
      "UNYTs are prepaid ecosystem utility credits used for supported products and services inside the UNYT network.",
  },
  {
    question: "What is live now in supporter v1?",
    answer:
      "Supporter v1 is live for credit top-up scaffolding, visible balance, activity history, and EarnRM redemption into usage rights.",
  },
  {
    question: "Where can I use UNYTs today?",
    answer:
      "Current supporter-ready redemption starts with EarnRM user-month credit. Additional product routes are listed with clear live or planned status.",
  },
  {
    question: "How do I top up credits?",
    answer:
      "You select an amount, choose a supported method, and confirm. The completed top-up appears in your balance and activity ledger.",
  },
  {
    question: "Can I see my balance and activity history?",
    answer:
      "Yes. The wallet shows available credits, pending credits, and a timestamped ledger of top-ups and redemptions.",
  },
  {
    question: "Is swap live?",
    answer:
      "No. Swap remains a roadmap preview in supporter v1 while execution, compliance, and settlement rails are completed.",
  },
  {
    question: "Are UNYTs e-money or an investment product?",
    answer:
      "No. UNYTs are positioned as utility credits for supported product usage rights, not as an investment or speculative financial instrument.",
  },
  {
    question: "How do I get support?",
    answer:
      "Use the wallet support path for account and redemption questions. Responses focus on practical resolution steps and clear timing expectations.",
  },
] as const;

export const trustPrinciples = [
  {
    title: "Clear scope",
    body: "The product states exactly what is live now and what remains preview-only.",
  },
  {
    title: "Visible balance and ledger",
    body: "Supporters can verify credits, pending amounts, and completed activity without ambiguity.",
  },
  {
    title: "Operational support",
    body: "Support and recovery guidance is written for practical resolution, not marketing language.",
  },
] as const;

export const walletSnapshot = {
  totalBalance: "18,420.00 UNYTs",
  fiatEquivalent: "Approx. $18,420.00 prepaid credit value",
  availableBalance: "15,980.00 UNYTs available",
  pendingBalance: "2,440.00 UNYTs pending settlement",
  quickActions: [
    { label: "Top up credits", detail: "Add prepaid UNYTs with supported methods." },
    { label: "Redeem rights", detail: "Redeem credits into supported product usage rights." },
    { label: "View activity", detail: "Review top-up and redemption history in one feed." },
    { label: "Get support", detail: "Open account and redemption support paths." },
  ],
  spendDestinations: [
    { name: "EarnRM", detail: "Live user-month redemption", amount: "240 UNYTs redeemed this month" },
    { name: "Alakai", detail: "Planned service credit route", amount: "Pilot scope in progress" },
    { name: "TechSelec", detail: "Scoped tooling integrations", amount: "Integration path active" },
  ],
  activity: [
    { title: "Card top-up", status: "Completed", amount: "+500 UNYTs" },
    { title: "EarnRM user-month redemption", status: "Completed", amount: "-240 UNYTs" },
    { title: "Supporter account created", status: "Completed", amount: "+980 UNYTs" },
  ],
  paymentMethods: [
    "Primary Visa ending in 2048",
    "Business Mastercard ending in 1860",
    "Additional payment routes listed as planned",
  ],
} as const;

export const swapSnapshot = {
  pair: "UNYTs to USDC (preview)",
  input: "2,500.00 UNYTs",
  output: "2,487.10 USDC",
  fee: "4.80 UNYTs",
  route: "Preview routing estimate",
  completion: "Execution not live in supporter v1",
  popularPairs: ["UNYTs / USDC", "UNYTs / ETH", "UNYTs / ARB"],
  recentActivity: [
    { pair: "UNYTs / USDC", amount: "1,200", status: "Preview sample" },
    { pair: "UNYTs / ETH", amount: "850", status: "Preview sample" },
    { pair: "UNYTs / ARB", amount: "430", status: "Preview sample" },
  ],
  safetyNotes: [
    "Swap is shown as preview-only in supporter v1.",
    "Live availability depends on production compliance and routing rails.",
    "All future execution surfaces will show fees before confirmation.",
  ],
} as const;

export const securityNotes = [
  {
    title: "Account protection",
    body: "Use strong credentials and verified recovery methods. Sensitive actions should always be easy to review before confirmation.",
  },
  {
    title: "Activity visibility",
    body: "Balances, pending states, and completed redemptions are visible in one ledger so supporters can verify account history quickly.",
  },
  {
    title: "Support and recovery",
    body: "When issues occur, support routes should provide clear identity checks, realistic timing, and practical next steps.",
  },
] as const;
