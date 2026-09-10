"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Shield, Star, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { pricingPlans, BRAND } from "@/lib/data";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    q: "Can I switch plans at any time?",
    a: "Yes. You can upgrade or downgrade your plan at any time. Changes take effect immediately and we prorate any billing differences.",
  },
  {
    q: "Is there a free trial for Pro or Elite?",
    a: "Absolutely. Both Pro and Elite plans come with a 7-day free trial. No credit card required to start.",
  },
  {
    q: "How many devices can I stream on simultaneously?",
    a: "Starter allows 1 device. Pro supports up to 3 simultaneous streams. Elite gives you unlimited screens across all your devices.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards, PayPal, and Apple Pay. All transactions are secured with 256-bit SSL encryption.",
  },
  {
    q: "Can I download matches to watch offline?",
    a: "Downloadable replays are available on Pro and Elite plans. You can store up to 25 replays on Pro and unlimited on Elite.",
  },
  {
    q: "What happens if I cancel my subscription?",
    a: "You keep access until the end of your billing period. After that, your account reverts to the free Starter tier with no data loss.",
  },
];

const TRUST_BADGES = [
  { icon: Shield, label: "256-bit SSL Encryption" },
  { icon: Zap, label: "99.9% Uptime Guarantee" },
  { icon: Star, label: "4.9/5 Customer Rating" },
];

const COMPARISON_FEATURES = [
  { feature: "Live sports streams", free: false, pro: true, elite: true },
  { feature: "On-demand replays", free: "Highlights only", pro: true, elite: true },
  { feature: "Stream quality", free: "480p", pro: "1080p HD", elite: "4K Ultra HD" },
  { feature: "Simultaneous screens", free: "1", pro: "3", elite: "Unlimited" },
  { feature: "Ad-free viewing", free: false, pro: true, elite: true },
  { feature: "Downloadable replays", free: false, pro: "Up to 25", elite: "Unlimited" },
  { feature: "Behind-the-scenes content", free: false, pro: false, elite: true },
  { feature: "PPV early access", free: false, pro: false, elite: true },
  { feature: "Priority support", free: false, pro: false, elite: true },
  { feature: "Sports categories", free: "3", pro: "All", elite: "All + Exclusive" },
];

type BillingCycle = "monthly" | "annual";

function FeatureValue({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="mx-auto h-5 w-5 text-[var(--accent)]" />;
  if (value === false)
    return <span className="mx-auto block h-0.5 w-4 rounded-full bg-white/20" />;
  return <span className="text-sm text-white/80">{value}</span>;
}

export default function PricingPage() {
  const t = useTranslations();
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Hero */}
      <Reveal>
        <section className="relative overflow-hidden px-4 pb-16 pt-24 text-center sm:pt-32">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% -10%, color-mix(in srgb, var(--accent) 18%, transparent), transparent)",
            }}
          />
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            {t("pricing.eyebrow")}
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t("pricing.hero.title")}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/60">
            {t("pricing.hero.subtitle")}
          </p>

          {/* Billing toggle */}
          <div className="mt-10 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-sm">
            <button
              onClick={() => setBilling("monthly")}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300",
                billing === "monthly"
                  ? "bg-[var(--accent)] text-black shadow"
                  : "text-white/60 hover:text-white",
              )}
            >
              {t("pricing.toggle.monthly")}
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300",
                billing === "annual"
                  ? "bg-[var(--accent)] text-black shadow"
                  : "text-white/60 hover:text-white",
              )}
            >
              {t("pricing.toggle.annual")}
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  billing === "annual"
                    ? "bg-black/20 text-black"
                    : "bg-[var(--accent)]/20 text-[var(--accent)]",
                )}
              >
                {t("pricing.toggle.saveBadge")}
              </span>
            </button>
          </div>
        </section>
      </Reveal>

      {/* Pricing cards */}
      <Reveal>
        <section className="px-4 pb-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3"
          >
            {pricingPlans.map((plan) => {
              const price =
                billing === "monthly" ? plan.monthlyPrice : plan.annualPrice;
              const perLabel =
                billing === "monthly"
                  ? t("pricing.card.perMonth")
                  : t("pricing.card.perYear");

              return (
                <motion.div
                  key={plan.key}
                  variants={scaleIn}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className={cn(
                    "relative flex flex-col rounded-2xl border p-7 transition-shadow duration-300",
                    plan.highlighted
                      ? "border-[var(--accent)] bg-gradient-to-b from-[var(--accent)]/10 to-[var(--accent)]/5 shadow-[0_0_40px_-8px_color-mix(in_srgb,var(--accent)_40%,transparent)]"
                      : "border-white/10 bg-white/5",
                  )}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent)] px-4 py-1 text-xs font-bold uppercase tracking-widest text-black">
                      {t("pricing.card.mostPopular")}
                    </span>
                  )}

                  <div>
                    <h2 className="text-lg font-bold text-white">{plan.name}</h2>
                    <div className="mt-4 flex items-end gap-1">
                      <span className="text-4xl font-extrabold tracking-tight text-white">
                        {price === 0 ? t("pricing.card.free") : `$${price}`}
                      </span>
                      {price > 0 && (
                        <span className="mb-1 text-sm text-white/50">{perLabel}</span>
                      )}
                    </div>
                    {billing === "annual" && plan.monthlyPrice > 0 && (
                      <p className="mt-1 text-xs text-[var(--accent)]">
                        {t("pricing.card.annualNote", {
                          monthly: `$${(plan.annualPrice / 12).toFixed(2)}`,
                        })}
                      </p>
                    )}
                  </div>

                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 text-sm text-white/75">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      "mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-300",
                      plan.highlighted
                        ? "bg-[var(--accent)] text-black hover:brightness-110"
                        : "border border-white/20 bg-white/5 text-white hover:bg-white/10",
                    )}
                  >
                    {plan.key === "free"
                      ? t("pricing.card.ctaFree")
                      : t("pricing.card.ctaPaid")}
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      </Reveal>

      {/* Trust badges */}
      <Reveal>
        <section className="border-y border-white/8 bg-white/3 px-4 py-10">
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-white/60">
                <Icon className="h-5 w-5 text-[var(--accent)]" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Feature comparison table */}
      <Reveal>
        <section className="px-4 py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {t("pricing.comparison.title")}
              </h2>
              <p className="mt-3 text-white/55">{t("pricing.comparison.subtitle")}</p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-left font-semibold text-white/70">
                      {t("pricing.comparison.featureCol")}
                    </th>
                    {pricingPlans.map((p) => (
                      <th
                        key={p.key}
                        className={cn(
                          "px-6 py-4 text-center font-bold",
                          p.highlighted ? "text-[var(--accent)]" : "text-white",
                        )}
                      >
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_FEATURES.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={cn(
                        "border-b border-white/5 transition-colors hover:bg-white/3",
                        i % 2 === 0 ? "bg-transparent" : "bg-white/2",
                      )}
                    >
                      <td className="px-6 py-4 text-white/70">{row.feature}</td>
                      <td className="px-6 py-4 text-center">
                        <FeatureValue value={row.free} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <FeatureValue value={row.pro} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <FeatureValue value={row.elite} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Stats strip */}
      <Reveal>
        <section className="bg-[var(--accent)]/8 px-4 py-16">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {(
              [
                { value: "2M+", label: t("pricing.stats.subscribers") },
                { value: "180+", label: t("pricing.stats.countries") },
                { value: "50K+", label: t("pricing.stats.events") },
                { value: "4.9★", label: t("pricing.stats.rating") },
              ] as { value: string; label: string }[]
            ).map((stat) => (
              <motion.div key={stat.label} variants={fadeInUp} className="text-center">
                <div className="text-3xl font-extrabold text-[var(--accent)]">{stat.value}</div>
                <div className="mt-1 text-sm text-white/55">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </Reveal>

      {/* FAQ */}
      <Reveal>
        <section className="px-4 py-24">
          <div className="mx-auto max-w-2xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {t("pricing.faq.title")}
              </h2>
              <p className="mt-3 text-white/55">{t("pricing.faq.subtitle")}</p>
            </div>

            <div className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  className="overflow-hidden rounded-xl border border-white/10 bg-white/5"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-semibold text-white transition-colors hover:bg-white/5"
                  >
                    {item.q}
                    {openFaq === i ? (
                      <ChevronUp className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-white/40" />
                    )}
                  </button>
                  <motion.div
                    initial={false}
                    animate={
                      openFaq === i
                        ? { height: "auto", opacity: 1 }
                        : { height: 0, opacity: 0 }
                    }
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm leading-relaxed text-white/60">{item.a}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* CTA banner */}
      <Reveal>
        <section className="px-4 pb-28">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-[var(--accent)]/25 bg-gradient-to-br from-[var(--accent)]/15 via-[var(--accent)]/5 to-transparent p-12 text-center">
            <div
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(ellipse 70% 80% at 50% 50%, color-mix(in srgb, var(--accent) 12%, transparent), transparent)",
              }}
            />
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {t("pricing.cta.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-white/60">
              {t("pricing.cta.subtitle")}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <motion.a
                href="/sign-in-sign-up"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-8 py-3.5 text-sm font-bold text-black transition-all hover:brightness-110"
              >
                {t("pricing.cta.primary")}
                <ArrowRight className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="/live"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/10"
              >
                {t("pricing.cta.secondary")}
              </motion.a>
            </div>
            <p className="mt-5 text-xs text-white/35">{t("pricing.cta.disclaimer")}</p>
          </div>
        </section>
      </Reveal>
    </main>
  );
}