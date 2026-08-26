"use client";

import { useMemo, useState } from "react";
import { Stars } from "@/components/stars";
import type { Dict } from "@/lib/dict";
import { fill, type Locale } from "@/lib/i18n";
import { summarize, type Review } from "@/lib/reviews";

type Sort = "recent" | "helpful" | "high" | "low";

export function ReviewsBlock({
  reviews,
  locale,
  dict,
  compact = false,
}: {
  reviews: Review[];
  locale: Locale;
  dict: Dict;
  compact?: boolean;
}) {
  const [stars, setStars] = useState<number | null>(null);
  const [sort, setSort] = useState<Sort>("helpful");
  const [expanded, setExpanded] = useState(false);

  const summary = useMemo(() => summarize(reviews), [reviews]);

  const visible = useMemo(() => {
    const filtered = stars ? reviews.filter((review) => review.rating === stars) : [...reviews];
    filtered.sort((a, b) => {
      if (sort === "helpful") return b.helpful - a.helpful;
      if (sort === "high") return b.rating - a.rating || b.helpful - a.helpful;
      if (sort === "low") return a.rating - b.rating || b.helpful - a.helpful;
      return a.date < b.date ? 1 : -1;
    });
    return filtered;
  }, [reviews, stars, sort]);

  const shown = expanded ? visible : visible.slice(0, compact ? 3 : 6);
  const dateFormat = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sorts: Array<{ id: Sort; label: string }> = [
    { id: "helpful", label: dict.reviews.sortHelpful },
    { id: "recent", label: dict.reviews.sortRecent },
    { id: "high", label: dict.reviews.sortHigh },
    { id: "low", label: dict.reviews.sortLow },
  ];

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:items-start">
        <aside className="card p-6 lg:sticky lg:top-[88px]">
          <p className="font-display text-[52px] font-bold leading-none tabular-nums">
            {summary.average.toLocaleString(locale === "en" ? "en-US" : "es-MX", {
              minimumFractionDigits: 1,
            })}
          </p>
          <div className="mt-2">
            <Stars rating={summary.average} size={18} />
          </div>
          <p className="mt-2 text-[14px] text-ink-2">
            {fill(dict.reviews.basedOn, { n: summary.count })}
          </p>
          <p className="text-[14px] text-ink-2">
            {fill(dict.reviews.recommend, { percent: summary.recommendPercent })}
          </p>

          <h3 className="eyebrow mt-6">{dict.reviews.distribution}</h3>
          <ul className="mt-3 space-y-1.5">
            {([5, 4, 3, 2, 1] as const).map((value) => {
              const count = summary.distribution[value];
              const percent = summary.count ? (count / summary.count) * 100 : 0;
              const active = stars === value;
              return (
                <li key={value}>
                  <button
                    type="button"
                    onClick={() => setStars(active ? null : value)}
                    aria-pressed={active}
                    className={`flex w-full items-center gap-2 rounded-lg px-1.5 py-1.5 text-left transition-colors ${
                      active ? "bg-mist" : "hover:bg-mist"
                    }`}
                  >
                    <span className="w-3 text-[13px] tabular-nums text-ink-2">{value}</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-mist">
                      <span
                        className="block h-full rounded-full bg-[#f0a92b]"
                        style={{ width: `${percent}%` }}
                      />
                    </span>
                    <span className="w-6 text-right text-[12px] tabular-nums text-ink-3">
                      {count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {stars ? (
            <button
              type="button"
              onClick={() => setStars(null)}
              className="mt-4 text-[13px] font-semibold text-teal underline"
            >
              {dict.reviews.filterAll}
            </button>
          ) : null}
        </aside>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {sorts.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSort(option.id)}
                aria-pressed={sort === option.id}
                className={`min-h-[40px] rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors ${
                  sort === option.id
                    ? "border-teal bg-foam text-deep dark:bg-[#0d3a45] dark:text-aqua"
                    : "border-line text-ink-2 hover:border-line-strong hover:text-ink"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {shown.length === 0 ? (
            <p className="mt-6 text-ink-2">{dict.reviews.empty}</p>
          ) : (
            <ul className="mt-6 space-y-4">
              {shown.map((review) => (
                <li key={review.id} className="card p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-foam font-display text-[13px] font-bold text-deep dark:bg-[#0d3a45] dark:text-aqua">
                        {review.author.slice(0, 1)}
                      </span>
                      <div>
                        <p className="text-[14px] font-semibold">{review.author}</p>
                        <p className="text-[12px] text-ink-3">
                          {review.city} · {dateFormat.format(new Date(review.date))}
                        </p>
                      </div>
                    </div>
                    <Stars rating={review.rating} size={15} />
                  </div>

                  <h3 className="mt-4 text-[17px]">{review.title}</h3>
                  <p className="mt-1.5 text-[15px] text-ink-2">{review.body}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-ink-3">
                    {review.verified ? (
                      <span className="inline-flex items-center gap-1.5 font-medium text-[#0f7a5f] dark:text-[#5fd6b0]">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="m5 12.5 4.5 4.5L19 7.5"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {dict.reviews.verified}
                      </span>
                    ) : null}
                    {review.certifiedInstall ? <span>{dict.reviews.installedBy}</span> : null}
                    <span>{fill(dict.reviews.helpfulCount, { n: review.helpful })}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {visible.length > shown.length || expanded ? (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="btn btn-ghost mt-6"
            >
              {expanded ? dict.reviews.showLess : dict.reviews.showMore}
            </button>
          ) : null}

        </div>
      </div>
    </div>
  );
}
