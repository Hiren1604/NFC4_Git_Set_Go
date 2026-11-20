import { useState } from "react";
import { AlertTriangle, BellRing, ArrowRight, X, ShieldAlert, Sparkles, CreditCard, Wrench, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CriticalAlertBannerProps {
  role: "admin" | "resident" | "technician";
  onAction?: (actionId: string) => void;
}

export function CriticalAlertBanner({ role, onAction }: CriticalAlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (role === "admin") {
    return (
      <div className="rounded-xl border border-rose-500/30 bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent p-3 sm:p-4 shadow-subtle relative overflow-hidden transition-all">
        {/* Ambient warning strobe */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-500/10 blur-2xl" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
            <div className="h-8 w-8 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 ring-4 ring-rose-500/10">
              <AlertTriangle className="h-4 w-4 animate-bounce" />
            </div>

            <div className="space-y-0.5 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <Badge variant="destructive" className="text-[10px] font-mono uppercase tracking-wider py-0 px-1.5 h-4">
                  2 Alarming Incidents
                </Badge>
                <span className="text-xs font-bold text-foreground truncate">
                  High-Risk Water Main Seepage (Flat A-501)
                </span>
                <span className="text-[10px] font-mono text-rose-500 font-bold hidden sm:inline">
                  • AI Urgency 96/100
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug truncate sm:whitespace-normal">
                Automated diagnostic audit flagged structural ceiling risk & 1 duplicate ₹2,500 maintenance bill dispute awaits your arbitration.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <Button
              size="sm"
              onClick={() => onAction?.("ai-issues")}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs h-7 sm:h-8 px-2.5 sm:px-3 shadow-subtle gap-1 font-medium"
            >
              <span>Review Triage</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDismissed(true)}
              className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
              title="Dismiss banner"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (role === "resident") {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-3 sm:p-4 shadow-subtle relative overflow-hidden transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 ring-4 ring-amber-500/10">
              <BellRing className="h-4 w-4" />
            </div>

            <div className="space-y-0.5 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <Badge variant="outline" className="text-[10px] font-mono uppercase tracking-wider py-0 px-1.5 h-4 border-amber-500/40 text-amber-600">
                  Scheduled Maintenance Notice
                </Badge>
                <span className="text-xs font-bold text-foreground">
                  Tower A Elevator Testing (2:00 PM – 4:00 PM Today)
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Please use Service Lift #2 during inspection. Your active ticket #ISS-1049 is currently being repaired by Mike Wilson.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAction?.("my-issues")}
              className="border-amber-500/30 hover:bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs h-7 sm:h-8 px-2.5 sm:px-3"
            >
              Track Repair
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDismissed(true)}
              className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Technician
  return (
    <div className="rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-3 sm:p-4 shadow-subtle relative overflow-hidden transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0 ring-4 ring-primary/10">
            <Wrench className="h-4 w-4 animate-pulse" />
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <Badge className="bg-primary text-white text-[10px] font-mono uppercase tracking-wider py-0 px-1.5 h-4">
                Active Job Dispatched
              </Badge>
              <span className="text-xs font-bold text-foreground">
                Flat A-501 • Water Main Pipe Leakage (Urgent)
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Resident Sarah Johnson is at the flat. Tower A lift is functional. Standard plumbing toolkit required.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <Button
            size="sm"
            onClick={() => onAction?.("assigned-tasks")}
            className="bg-primary hover:bg-primary/90 text-white text-xs h-7 sm:h-8 px-2.5 sm:px-3 shadow-subtle gap-1"
          >
            <span>Open Job Card</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDismissed(true)}
            className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
