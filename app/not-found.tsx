import { PagePlaceholder } from "@/components/marketing/page-placeholder";

export default function NotFound() {
  return (
    <PagePlaceholder
      eyebrow="NOT FOUND"
      title="This page is not available."
      body="Use the main routes to explore the ecosystem, review security details, or open the wallet surface."
      ctaHref="/"
      ctaLabel="Back to homepage"
    />
  );
}
