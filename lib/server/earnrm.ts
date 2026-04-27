import "server-only";

type EarnrmDispatchResult = {
  attempted: boolean;
  ok: boolean;
  detail: string;
};

type EarnrmTaskPriority = "low" | "medium" | "high";

type EarnrmTaskPayload = {
  title: string;
  description: string;
  status: "todo";
  priority: EarnrmTaskPriority;
  due_date: string;
  assigned_to?: string;
  project_id?: string;
};

function buildEndpoint(baseUrl: string, pathOrUrl: string) {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  return `${baseUrl.replace(/\/+$/, "")}/${pathOrUrl.replace(/^\/+/, "")}`;
}

async function postTakoLeadEvent(payload: unknown): Promise<EarnrmDispatchResult> {
  const endpoint = process.env.TAKO_LEADS_ENDPOINT;
  if (!endpoint) {
    return {
      attempted: false,
      ok: false,
      detail: "TAKO_LEADS_ENDPOINT is not configured.",
    };
  }

  const apiKey = process.env.TAKO_API_KEY;
  const apiKeyHeader = process.env.TAKO_API_KEY_HEADER || "x-api-key";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey
          ? {
              [apiKeyHeader]: apiKey,
              ...(apiKeyHeader.toLowerCase() === "authorization"
                ? {}
                : { Authorization: `Bearer ${apiKey}` }),
            }
          : {}),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        attempted: true,
        ok: false,
        detail: `TAKO endpoint responded with ${response.status}.`,
      };
    }

    return {
      attempted: true,
      ok: true,
      detail: "Lead forwarded to TAKO.",
    };
  } catch {
    return {
      attempted: true,
      ok: false,
      detail: "Failed to reach TAKO endpoint.",
    };
  }
}

async function postEarnrmEvent(pathOrUrl: string, payload: unknown): Promise<EarnrmDispatchResult> {
  const baseUrl = process.env.EARNRM_API_BASE_URL;
  if (!baseUrl) {
    return {
      attempted: false,
      ok: false,
      detail: "EARNRM_API_BASE_URL is not configured. Stored follow-up task internally only.",
    };
  }

  const endpoint = buildEndpoint(baseUrl, pathOrUrl);
  const apiKey = process.env.EARNRM_API_KEY || process.env.EARNRM_API_TOKEN;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey
          ? {
              "X-API-Key": apiKey,
              Authorization: `Bearer ${apiKey}`,
            }
          : {}),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        attempted: true,
        ok: false,
        detail: `EarnRM endpoint responded with ${response.status}.`,
      };
    }

    return {
      attempted: true,
      ok: true,
      detail: "Event forwarded to EarnRM.",
    };
  } catch {
    return {
      attempted: true,
      ok: false,
      detail: "Failed to reach EarnRM endpoint.",
    };
  }
}

function buildTaskPayload(input: {
  title: string;
  description: string;
  dueAt: string;
  priority: EarnrmTaskPriority;
}): EarnrmTaskPayload {
  const payload: EarnrmTaskPayload = {
    title: input.title,
    description: input.description,
    status: "todo",
    priority: input.priority,
    due_date: input.dueAt,
  };

  if (process.env.EARNRM_TASK_ASSIGNEE_ID) {
    payload.assigned_to = process.env.EARNRM_TASK_ASSIGNEE_ID;
  }

  if (process.env.EARNRM_TASK_PROJECT_ID) {
    payload.project_id = process.env.EARNRM_TASK_PROJECT_ID;
  }

  return payload;
}

export async function sendEarnrmFollowUpTask(payload: {
  taskId: string;
  title: string;
  detail: string;
  supporterEmail: string;
  supporterId: string;
  walletId: string;
  dueAt: string;
  sourceEvent: "registration" | "top_up" | "redeem";
}) {
  const taskPath = process.env.EARNRM_TASKS_ENDPOINT || "v1/tasks";
  return postEarnrmEvent(
    taskPath,
    buildTaskPayload({
      title: `[UNYT] ${payload.title}`,
      description: `${payload.detail}

Task ID: ${payload.taskId}
Source Event: ${payload.sourceEvent}
Supporter: ${payload.supporterEmail}
Supporter ID: ${payload.supporterId}
Wallet ID: ${payload.walletId}`,
      dueAt: payload.dueAt,
      priority: payload.sourceEvent === "redeem" ? "high" : "medium",
    }),
  );
}

export async function sendEarnrmRedemption(payload: {
  grantId: string;
  supporterEmail: string;
  supporterId: string;
  walletId: string;
  productId: string;
  units: number;
  redeemedAt: string;
}) {
  const redemptionPath = process.env.EARNRM_REDEMPTION_ENDPOINT || process.env.EARNRM_TASKS_ENDPOINT || "v1/tasks";
  return postEarnrmEvent(
    redemptionPath,
    buildTaskPayload({
      title: "[UNYT] Apply redemption entitlement",
      description: `Apply redemption grant in EarnRM.

Grant ID: ${payload.grantId}
Product ID: ${payload.productId}
Units: ${payload.units}
Redeemed At: ${payload.redeemedAt}
Supporter: ${payload.supporterEmail}
Supporter ID: ${payload.supporterId}
Wallet ID: ${payload.walletId}`,
      dueAt: payload.redeemedAt,
      priority: "high",
    }),
  );
}

export async function sendEarnrmInterestLead(payload: {
  leadId: string;
  sourcePage: "unytbot.com" | "unyt.exchange";
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  countryRegion: string;
  interestIn: "unytbot" | "unyt-exchange" | "both";
  interestFocus: Array<
    "early_access" | "product_updates" | "commercial_use" | "partnership" | "backer_ecosystem"
  >;
  message: string;
}) {
  const sourcePath =
    payload.sourcePage === "unyt.exchange" ? "/unyt-exchange" : "/unytbot";
  const takoResult = await postTakoLeadEvent({
    source: process.env.TAKO_SOURCE || "unyt-interest",
    submittedAt: payload.createdAt,
    lead: {
      name: `${payload.firstName} ${payload.lastName}`.trim(),
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      company: payload.company,
      message: payload.message,
      sourceDomain: payload.sourcePage,
      sourcePage: sourcePath,
      formId: "unyt-interest-form",
      formType: "interest_registration",
      context: `interestIn:${payload.interestIn}`,
      consent: true,
    },
    raw: payload,
  });

  if (takoResult.ok) {
    return takoResult;
  }

  const taskPath = process.env.EARNRM_TASKS_ENDPOINT || "v1/tasks";
  const earnrmResult = await postEarnrmEvent(
    taskPath,
    buildTaskPayload({
      title: `[UNYT Lead] ${payload.sourcePage} interest`,
      description: `New interest lead captured.

Lead ID: ${payload.leadId}
Source Page: ${payload.sourcePage}
Created At: ${payload.createdAt}
Interest In: ${payload.interestIn}
Interest Focus: ${payload.interestFocus.join(", ")}
Name: ${payload.firstName} ${payload.lastName}
Email: ${payload.email}
Company: ${payload.company || "(not provided)"}
Country / Region: ${payload.countryRegion}
Message: ${payload.message || "(not provided)"}`,
      dueAt: payload.createdAt,
      priority: "medium",
    }),
  );

  if (takoResult.attempted && !takoResult.ok && earnrmResult.ok) {
    return {
      attempted: true,
      ok: true,
      detail: `TAKO failed (${takoResult.detail}). Fallback succeeded in EarnRM.`,
    };
  }

  return earnrmResult;
}
