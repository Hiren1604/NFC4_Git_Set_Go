import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Building2,
  ArrowDownRight,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Filter,
  DollarSign,
  PieChart,
} from "lucide-react";

interface Transaction {
  id: string;
  vendor: string;
  category: string;
  date: string;
  amount: number;
  type: "inflow" | "outflow";
  status: "successful" | "flagged" | "pending";
  ref: string;
}

const defaultTransactions: Transaction[] = [
  {
    id: "TX-901",
    vendor: "Kone Elevators India",
    category: "Annual Maintenance (AMC)",
    date: "12 Oct at 14:20",
    amount: -32000,
    type: "outflow",
    status: "successful",
    ref: "HDFC-NEFT-8812",
  },
  {
    id: "TX-902",
    vendor: "Torrent Power Common Grid",
    category: "Substation & Street Lighting",
    date: "11 Oct at 09:15",
    amount: -45500,
    type: "outflow",
    status: "successful",
    ref: "UPI-GRID-0941",
  },
  {
    id: "TX-903",
    vendor: "Flat A-501 (Sarah Johnson)",
    category: "Monthly Maintenance Dues",
    date: "10 Oct at 18:30",
    amount: 2500,
    type: "inflow",
    status: "successful",
    ref: "UPI-HDFC-3321",
  },
  {
    id: "TX-904",
    vendor: "Flat B-304 (Duplicate Levy)",
    category: "AI Forensic Intercept",
    date: "09 Oct at 11:45",
    amount: 2500,
    type: "inflow",
    status: "flagged",
    ref: "FLAG-LEDG-9982",
  },
  {
    id: "TX-905",
    vendor: "Hydro Aqua Water Tanker Supply",
    category: "Emergency Backup Supply",
    date: "08 Oct at 16:00",
    amount: -12800,
    type: "outflow",
    status: "successful",
    ref: "IMPS-AQUA-5510",
  },
];

export function SocietyTreasuryLedger({ className }: { className?: string }) {
  const [activeMonth, setActiveMonth] = useState("Aug");
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);

  const monthlyFlow = [
    { month: "Apr", amount: 4100, height: 50 },
    { month: "May", amount: 2200, height: 35 },
    { month: "Jun", amount: 3500, height: 60 },
    { month: "Jul", amount: 1200, height: 25 },
    { month: "Aug", amount: 2456, height: 80, active: true },
  ];

  const expenseCategories = [
    { name: "Elevators AMC", percent: 30, color: "#F59E0B", amount: "₹1,07,400" },
    { name: "Security Gatehouse", percent: 25, color: "#0080FF", amount: "₹89,500" },
    { name: "DG Generator Fuel", percent: 20, color: "#EC4899", amount: "₹71,600" },
    { name: "Water & Plumbing", percent: 15, color: "#10B981", amount: "₹53,700" },
    { name: "Housekeeping", percent: 10, color: "#8B5CF6", amount: "₹35,800" },
  ];

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* 1. Top Section: Radiant Hero Balance Card + Stacked Inflow/Outflow KPIs (Inspired by inspos 6 & 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Radiant Emerald/Lime Total Balance Card (from 7.png) */}
        <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-emerald-300 via-teal-200 to-lime-300 p-6 text-slate-900 shadow-elevated relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          {/* Subtle soft backdrop curve */}
          <div className="pointer-events-none absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/20 blur-xl" />

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-800/80 font-mono flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                Society Reserve & Maintenance Escrow
              </span>
              <Badge className="bg-slate-900 text-white font-mono text-[10px] px-2 py-0.5">
                AUDITED • OCT 2026
              </Badge>
            </div>

            <div className="mt-3">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black font-mono tracking-tight text-slate-950">
                ₹12,45,650<span className="text-xl sm:text-2xl text-slate-700">.00</span>
              </div>
              <p className="text-xs font-medium text-slate-800/90 mt-1 flex items-center gap-1">
                <span className="text-emerald-950 font-bold">+₹42,500</span> revenue collected this billing cycle • 98.4% on-time
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-4">
            <button className="px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-semibold hover:bg-slate-900 transition-colors shadow-subtle flex items-center gap-1.5">
              <span>Disburse Vendor</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
            <button className="px-4 py-2 rounded-xl bg-white/90 text-slate-900 text-xs font-semibold hover:bg-white transition-colors shadow-subtle flex items-center gap-1.5">
              <span>Reconcile Ledger</span>
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
            <button className="h-8 w-8 rounded-full bg-slate-900/10 hover:bg-slate-900/20 text-slate-950 flex items-center justify-center transition-colors ml-auto" title="Auto Audit">
              <Zap className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stacked Inflow & Outflow KPI Cards (from 7.png) */}
        <div className="flex flex-col gap-4 justify-between">
          {/* Income KPI Card */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-subtle flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Monthly Inflow (Dues)</span>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-mono">
                +15.7%
              </Badge>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold font-mono text-foreground">+₹4,45,000</div>
              <p className="text-[11px] text-muted-foreground mt-0.5">232 of 240 units cleared</p>
            </div>
          </div>

          {/* Expense KPI Card */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-subtle flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Monthly Outflow (Repairs & AMC)</span>
              <Badge variant="outline" className="text-rose-500 border-rose-500/20 text-[10px] font-mono">
                -10.7%
              </Badge>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold font-mono text-foreground">-₹1,12,400</div>
              <p className="text-[11px] text-muted-foreground mt-0.5">6 vendor invoices settled</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Middle Row: Revenue Flow Bar Chart + Expense Split Donut Chart (from inspos 6 & 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Flow Bar Chart Card (inspos 6 & 7 style) */}
        <div className="lg:col-span-1 rounded-2xl border border-border/80 bg-card p-5 shadow-subtle space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Revenue Flow</h3>
              <p className="text-xs text-muted-foreground">Monthly billing velocity</p>
            </div>
            <Badge variant="outline" className="font-mono text-[10px]">Monthly</Badge>
          </div>

          {/* Vertical Bar Visual with Highlighted Month */}
          <div className="flex items-end justify-between h-40 pt-4 px-2 relative">
            {monthlyFlow.map((bar) => (
              <div key={bar.month} className="flex flex-col items-center gap-2 flex-1">
                {bar.active && (
                  <div className="absolute top-2 right-6 rounded-lg bg-slate-900 dark:bg-card border border-border px-2 py-0.5 text-[10px] font-mono text-white shadow-elevated">
                    <span className="text-emerald-400">↗ +16%</span> ₹2,45,600
                  </div>
                )}
                <div
                  className={`w-10 rounded-xl transition-all ${
                    bar.active
                      ? "bg-primary ring-4 ring-primary/20"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                  style={{ height: `${bar.height}%` }}
                />
                <span className="text-[10px] font-mono text-muted-foreground">{bar.month}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>Cycle SLA: 100%</span>
            <span className="text-emerald-600 font-semibold">₹14,500 Saved</span>
          </div>
        </div>

        {/* Expense Split Donut Chart Card (inspos 6 & 7 style) */}
        <div className="lg:col-span-1 rounded-2xl border border-border/80 bg-card p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Expense Categories</h3>
              <p className="text-xs text-muted-foreground">Society outflow distribution</p>
            </div>
            <Badge variant="outline" className="font-mono text-[10px]">Aug 2026</Badge>
          </div>

          {/* SVG Donut Ring Visual */}
          <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
            <div className="relative w-32 h-32 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" stroke="#F59E0B" strokeWidth="12" fill="none" strokeDasharray="75.4 251.2" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" stroke="#0080FF" strokeWidth="12" fill="none" strokeDasharray="62.8 251.2" strokeDashoffset="-75.4" />
                <circle cx="50" cy="50" r="40" stroke="#EC4899" strokeWidth="12" fill="none" strokeDasharray="50.2 251.2" strokeDashoffset="-138.2" />
                <circle cx="50" cy="50" r="40" stroke="#10B981" strokeWidth="12" fill="none" strokeDasharray="37.7 251.2" strokeDashoffset="-188.4" />
                <circle cx="50" cy="50" r="40" stroke="#8B5CF6" strokeWidth="12" fill="none" strokeDasharray="25.1 251.2" strokeDashoffset="-226.1" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Outflow</span>
                <span className="text-xs font-bold font-mono text-foreground">₹3.58L</span>
              </div>
            </div>

            {/* Legend Column */}
            <div className="space-y-1.5 flex-1 w-full text-xs">
              {expenseCategories.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground text-[11px] truncate">{item.name}</span>
                  </div>
                  <span className="font-mono font-semibold text-[11px] text-foreground">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Layered Digital Passcards Stack (Exact adaptation of 7.png) */}
        <div className="lg:col-span-1 rounded-2xl border border-border/80 bg-card p-5 shadow-subtle space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Society Passcards</h3>
            <span className="text-[10px] font-mono text-muted-foreground">3 Registered</span>
          </div>

          {/* Layered Visual Credit Card Stack */}
          <div className="relative h-44 w-full flex items-center justify-center">
            {/* Card 3 (Back orange layer) */}
            <div className="absolute top-2 w-[85%] h-28 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 p-3 shadow-md opacity-70 scale-95 transition-transform" />

            {/* Card 2 (Middle green PayPal/FastTag layer) */}
            <div className="absolute top-6 w-[92%] h-28 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 p-3 shadow-md opacity-85 scale-98 transition-transform" />

            {/* Card 1 (Front Translucent RFID Gate Card) */}
            <div className="absolute top-10 w-full h-32 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 shadow-elevated border border-white/20 flex flex-col justify-between z-10 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-300">
                  Society Master RFID
                </span>
                <span className="font-bold text-xs tracking-widest text-primary">VISA</span>
              </div>

              <div>
                <div className="font-mono text-sm tracking-wider font-semibold">
                  4156 •••• •••• 6902
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>Emerald Heights RWA</span>
                  <span>07/28</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-muted-foreground">
            <span>FastTag Entry: MH 02 CK</span>
            <span className="text-emerald-600 font-semibold">Linked</span>
          </div>
        </div>
      </div>

      {/* 3. Recent Transactions Ledger Feed (Inspired by inspos 6 & 7) */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Recent Ledger Transactions</h3>
            <p className="text-xs text-muted-foreground">Society maintenance receipts, vendor payouts, and dispute checks</p>
          </div>
          <Badge variant="outline" className="font-mono text-[10px]">
            {defaultTransactions.length} Verified Records
          </Badge>
        </div>

        <div className="divide-y divide-border/60 text-xs">
          {defaultTransactions.map((tx) => (
            <div key={tx.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-secondary/30 px-2 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.status === "flagged"
                      ? "bg-rose-500/10 text-rose-600"
                      : tx.type === "inflow"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {tx.status === "flagged" ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : tx.type === "inflow" ? (
                    <ArrowDownRight className="h-4 w-4" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" />
                  )}
                </div>

                <div>
                  <div className="font-semibold text-foreground flex items-center gap-2">
                    <span>{tx.vendor}</span>
                    {tx.status === "flagged" && (
                      <Badge variant="destructive" className="text-[9px] h-3.5 px-1 font-mono uppercase">
                        AI Blocked
                      </Badge>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                    <span>{tx.category}</span>
                    <span>•</span>
                    <span className="font-mono">{tx.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
                <div className="text-right">
                  <div
                    className={`font-mono font-bold text-sm ${
                      tx.type === "inflow" ? "text-emerald-600" : "text-foreground"
                    }`}
                  >
                    {tx.amount > 0 ? `+₹${tx.amount.toLocaleString()}` : `-₹${Math.abs(tx.amount).toLocaleString()}`}
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">{tx.ref}</span>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-mono ${
                    tx.status === "flagged"
                      ? "border-rose-500/30 text-rose-500 bg-rose-500/5"
                      : "border-emerald-500/30 text-emerald-600 bg-emerald-500/5"
                  }`}
                >
                  {tx.status === "flagged" ? "Flagged" : "Successful"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
