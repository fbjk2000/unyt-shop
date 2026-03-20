import { walletSnapshot } from "@/lib/content";
import { Card, SubtleCard } from "@/components/ui/card";

export function WalletDestinations() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Spend destinations</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            A quick view of where the balance is already useful.
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-3">
        {walletSnapshot.spendDestinations.map((destination) => (
          <SubtleCard
            key={destination.name}
            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-base font-semibold text-white">{destination.name}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{destination.detail}</p>
            </div>
            <p className="text-sm text-white">{destination.amount}</p>
          </SubtleCard>
        ))}
      </div>
    </Card>
  );
}

