"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function FaqAccordion({
  items,
  compact = false,
}: {
  items?: readonly { question: string; answer: string }[];
  compact?: boolean;
}) {
  const t = useTranslations("faqAccordion");
  const defaultItems = [0, 1, 2, 3, 4, 5, 6, 7].map((index) => ({
    question: t(`items.${index}.question`),
    answer: t(`items.${index}.answer`),
  }));
  const activeItems = items || defaultItems;
  const [openItem, setOpenItem] = useState(0);

  return (
    <div className="space-y-3">
      {activeItems.map((item, index) => {
        const open = index === openItem;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-trigger-${index}`;

        return (
          <div
            key={item.question}
            className={cn(
              "rounded-[24px] border border-white/10 bg-white/4",
              compact ? "p-1" : "p-2",
            )}
          >
            <button
              id={buttonId}
              type="button"
              className="flex w-full items-center justify-between gap-4 rounded-[20px] px-4 py-4 text-left sm:px-5"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenItem(open ? -1 : index)}
            >
              <span className="text-sm font-semibold text-white sm:text-base">{item.question}</span>
              <span className="text-xl leading-none text-[var(--muted)]">{open ? "−" : "+"}</span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out",
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-70",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-4 pb-4 text-sm leading-6 text-[var(--muted)] sm:px-5 sm:text-[15px]">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
