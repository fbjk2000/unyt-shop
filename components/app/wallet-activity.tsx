import { walletSnapshot } from "@/lib/content";
import { Card, SubtleCard } from "@/components/ui/card";

export function WalletActivity() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-white">Recent activity</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Realistic static activity states to show clarity, not noise.
      </p>
      <div className="mt-6 space-y-3">
        {walletSnapshot.activity.map((item) => (
          <SubtleCard
            key={item.title}
            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                {item.status}
              </p>
            </div>
            <p className="text-sm font-medium text-white">{item.amount}</p>
          </SubtleCard>
        ))}
      </div>
    </Card>
  );
}

