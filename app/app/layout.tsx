import { SupporterWalletProvider } from "@/components/app/supporter-wallet-provider";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SupporterWalletProvider>{children}</SupporterWalletProvider>;
}
