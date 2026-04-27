"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { initialSupporterWalletState, type SupporterWalletState } from "@/lib/supporter-v1";

function cloneInitialState() {
  return JSON.parse(JSON.stringify(initialSupporterWalletState)) as SupporterWalletState;
}

export type WalletActionResult = {
  ok: boolean;
  message: string;
};

type WalletResponse = {
  ok: boolean;
  message?: string;
  authenticated: boolean;
  state: SupporterWalletState;
};

type ActionResponse = {
  ok: boolean;
  message: string;
  state: SupporterWalletState;
};

type ActionMessageFallbacks = {
  requestCompleted: string;
  requestFailed: string;
};

type WalletContextValue = {
  state: SupporterWalletState;
  hasLinkedSupporter: boolean;
  isLoading: boolean;
  registerOrLinkSupporter: (input: { displayName: string; email: string }) => Promise<WalletActionResult>;
  loginSupporter: (input: { email: string }) => Promise<WalletActionResult>;
  topUpCredits: (input: { usdAmount: number; methodId: string }) => Promise<WalletActionResult>;
  redeemProduct: (input: { productId: string; units: number }) => Promise<WalletActionResult>;
  signOutSupporter: () => Promise<WalletActionResult>;
  refreshWallet: () => Promise<void>;
};

const WalletContext = createContext<WalletContextValue | null>(null);

async function parseResponseJson<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    return {} as T;
  }
}

async function readActionResult(
  response: Response,
  fallbacks: ActionMessageFallbacks,
): Promise<{ action: WalletActionResult; state?: SupporterWalletState }> {
  const payload = await parseResponseJson<Partial<ActionResponse>>(response);
  const message = payload.message || (response.ok ? fallbacks.requestCompleted : fallbacks.requestFailed);

  if (!response.ok || !payload.ok) {
    return {
      action: {
        ok: false,
        message,
      },
      state: payload.state,
    };
  }

  return {
    action: {
      ok: true,
      message,
    },
    state: payload.state,
  };
}

export function SupporterWalletProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations("walletProvider");
  const [state, setState] = useState<SupporterWalletState>(() => cloneInitialState());
  const [isLoading, setIsLoading] = useState(true);

  const hasLinkedSupporter = state.account.authState === "registered";

  const refreshWallet = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/supporter/wallet", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const payload = await parseResponseJson<Partial<WalletResponse>>(response);
      if (payload.state) {
        setState(payload.state);
      } else {
        setState(cloneInitialState());
      }
    } catch {
      setState(cloneInitialState());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshWallet();
  }, [refreshWallet]);

  const registerOrLinkSupporter = useCallback(
    async ({ displayName, email }: { displayName: string; email: string }): Promise<WalletActionResult> => {
      try {
        const response = await fetch("/api/supporter/session/register", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ displayName, email }),
        });

        const { action, state: nextState } = await readActionResult(response, {
          requestCompleted: t("messages.requestCompleted"),
          requestFailed: t("messages.requestFailed"),
        });
        if (nextState) {
          setState(nextState);
        }
        return action;
      } catch {
        return { ok: false, message: t("messages.unableToRegisterNow") };
      }
    },
    [t],
  );

  const loginSupporter = useCallback(async ({ email }: { email: string }): Promise<WalletActionResult> => {
    try {
      const response = await fetch("/api/supporter/session/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { action, state: nextState } = await readActionResult(response, {
        requestCompleted: t("messages.requestCompleted"),
        requestFailed: t("messages.requestFailed"),
      });
      if (nextState) {
        setState(nextState);
      }
      return action;
    } catch {
      return { ok: false, message: t("messages.unableToSignInNow") };
    }
  }, [t]);

  const topUpCredits = useCallback(
    async ({ usdAmount, methodId }: { usdAmount: number; methodId: string }): Promise<WalletActionResult> => {
      try {
        const response = await fetch("/api/supporter/wallet/top-up", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ usdAmount, methodId }),
        });

        const { action, state: nextState } = await readActionResult(response, {
          requestCompleted: t("messages.requestCompleted"),
          requestFailed: t("messages.requestFailed"),
        });
        if (nextState) {
          setState(nextState);
        }
        return action;
      } catch {
        return { ok: false, message: t("messages.unableToTopUpNow") };
      }
    },
    [t],
  );

  const redeemProduct = useCallback(
    async ({ productId, units }: { productId: string; units: number }): Promise<WalletActionResult> => {
      try {
        const response = await fetch("/api/supporter/wallet/redeem", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId, units }),
        });

        const { action, state: nextState } = await readActionResult(response, {
          requestCompleted: t("messages.requestCompleted"),
          requestFailed: t("messages.requestFailed"),
        });
        if (nextState) {
          setState(nextState);
        }
        return action;
      } catch {
        return { ok: false, message: t("messages.unableToRedeemNow") };
      }
    },
    [t],
  );

  const signOutSupporter = useCallback(async (): Promise<WalletActionResult> => {
    try {
      const response = await fetch("/api/supporter/session/logout", {
        method: "POST",
        credentials: "include",
      });

      const payload = await parseResponseJson<Partial<ActionResponse>>(response);
      setState(payload.state ?? cloneInitialState());

      return {
        ok: response.ok,
        message: payload.message || (response.ok ? t("messages.signedOut") : t("messages.unableToSignOut")),
      };
    } catch {
      return { ok: false, message: t("messages.unableToSignOutNow") };
    }
  }, [t]);

  const value = useMemo<WalletContextValue>(
    () => ({
      state,
      hasLinkedSupporter,
      isLoading,
      registerOrLinkSupporter,
      loginSupporter,
      topUpCredits,
      redeemProduct,
      signOutSupporter,
      refreshWallet,
    }),
    [
      hasLinkedSupporter,
      isLoading,
      loginSupporter,
      redeemProduct,
      refreshWallet,
      registerOrLinkSupporter,
      signOutSupporter,
      state,
      topUpCredits,
    ],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useSupporterWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useSupporterWallet must be used inside SupporterWalletProvider");
  }

  return context;
}
