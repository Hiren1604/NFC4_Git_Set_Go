import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Zap, ShieldCheck, AlertTriangle, Radio, CheckCircle2, DollarSign } from "lucide-react";

interface TickerItem {
  id: string;
  type: "urgent" | "security" | "finance" | "infra";
  label: string;
  detail: string;
}

const defaultItems: TickerItem[] = [
  {
    id: "1",
    type: "urgent",
    label: "URGENT DISPATCH",
    detail: "Water Seepage Flat A-501 • Mike Wilson matched in 12s • ETA 18m",
  },
  {
    id: "2",
    type: "security",
    label: "GATE 1 CLEARED",
    detail: "Amazon Logistics MH 02 CK • Resident A-501 pre-approved • Barrier raised",
  },
  {
    id: "3",
    type: "finance",
    label: "FINANCIAL INTERCEPT",
    detail: "₹2,500 duplicate maintenance charge blocked on Flat B-304",
  },
  {
    id: "4",
    type: "infra",
    label: "TELEMETRY NOMINAL",
    detail: "Tower B Elevator cycle #1,024 checked • Grid load 4.2 Bar normal",
  },
  {
    id: "5",
    type: "urgent",
    label: "AI TRIAGE COMPLETED",
    detail: "Elevator power fluctuation triaged as High Priority (Score 94)",
  },
  {
    id: "6",
    type: "security",
    label: "SAFETY MESH",
    detail: "Gatehouse 24/7 emergency intercom live across all 240 units",
  },
];

export function InfiniteTicker({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current || !containerRef.current) return;

    const track = trackRef.current;
    // Clone width for seamless loop
    const totalWidth = track.scrollWidth / 2;

    const ctx = gsap.context(() => {
      const anim = gsap.to(track, {
        x: `-=${totalWidth}`,
        duration: 35,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
        },
      });

      // Pause on hover
      const el = containerRef.current;
      if (el) {
        const onEnter = () => anim.pause();
        const onLeave = () => anim.play();
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);

        return () => {
          el.removeEventListener("mouseenter", onEnter);
          el.removeEventListener("mouseleave", onLeave);
        };
      }
    });

    return () => ctx.revert();
  }, []);

  const renderBadge = (type: TickerItem["type"]) => {
    switch (type) {
      case "urgent":
        return <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse shrink-0" />;
      case "security":
        return <span className="h-2 w-2 rounded-full bg-sky-500 shrink-0" />;
      case "finance":
        return <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />;
      case "infra":
        return <span className="h-2 w-2 rounded-full bg-primary shrink-0" />;
    }
  };

  // Double items for infinite looping
  const duplicatedItems = [...defaultItems, ...defaultItems];

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden border-y border-border/80 bg-secondary/40 py-4 sm:py-5 select-none ${className || ""}`}
    >
      {/* Edge gradient masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-background to-transparent z-10" />

      <div ref={trackRef} className="flex items-center gap-6 sm:gap-8 whitespace-nowrap will-change-transform">
        {duplicatedItems.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/70 dark:border-white/10 bg-card/95 dark:bg-slate-900/90 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm shadow-sm backdrop-blur-md hover:border-primary/50 transition-colors"
          >
            {renderBadge(item.type)}
            <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {item.label}
            </span>
            <span className="text-muted-foreground/60">•</span>
            <span className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">{item.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
