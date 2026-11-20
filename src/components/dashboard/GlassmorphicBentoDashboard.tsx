import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Bot,
  Zap,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Users,
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Radio,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Maximize2,
} from "lucide-react";

// Inspo 5 Wave Chart Data (Multi-Layer Purple/Blue Ocean Waves)
const multiLayerWaveData = [
  { time: "06:00", active: 20, load: 35, efficiency: 55 },
  { time: "09:00", active: 55, load: 78, efficiency: 88 },
  { time: "12:00", active: 85, load: 92, efficiency: 95 },
  { time: "15:00", active: 65, load: 80, efficiency: 89 },
  { time: "18:00", active: 90, load: 96, efficiency: 98 },
  { time: "21:00", active: 75, load: 85, efficiency: 91 },
  { time: "00:00", active: 30, load: 45, efficiency: 65 },
];

// Inspo 5 Vertical Bar Data
const barVelocityData = [
  { day: "M", val: 65, resolved: 55 },
  { day: "T", val: 88, resolved: 80 },
  { day: "W", val: 45, resolved: 42 },
  { day: "T", val: 95, resolved: 90 },
  { day: "F", val: 70, resolved: 68 },
  { day: "S", val: 82, resolved: 79 },
  { day: "S", val: 40, resolved: 38 },
];

// Inspo 5 Trend Line with Peak Points
const trendLineData = [
  { step: "T-6", score: 62 },
  { step: "T-5", score: 78 },
  { step: "T-4", score: 55 },
  { step: "T-3", score: 89 },
  { step: "T-2", score: 72 },
  { step: "T-1", score: 94 },
  { step: "Now", score: 99 },
];

export function GlassmorphicBentoDashboard() {
  const [activePersona, setActivePersona] = useState<"admin" | "resident" | "technician">("admin");
  const [selectedIncident, setSelectedIncident] = useState<number>(0);

  const incidents = [
    {
      id: "ISS-001",
      title: "Basement Water Seepage B-15",
      tower: "Tower A • Bay 15",
      urgency: 96,
      tech: "Mike Wilson (Plumber)",
      status: "Asspatched",
      time: "2m ago",
    },
    {
      id: "ISS-002",
      title: "Passenger Lift #2 Inverted Brake",
      tower: "Tower B • Shaft 2",
      urgency: 91,
      tech: "Alex Kumar (Elevators)",
      status: "On-Site",
      time: "8m ago",
    },
    {
      id: "ISS-003",
      title: "Phase-3 Voltage Fluctuation",
      tower: "Tower C • Substation",
      urgency: 84,
      tech: "Rajesh S. (Electrical)",
      status: "Analyzing",
      time: "14m ago",
    },
  ];

  return (
    <div className="relative rounded-3xl p-4 sm:p-7 md:p-8 border border-white/60 dark:border-white/10 bg-gradient-to-br from-white/80 via-slate-50/70 to-blue-50/50 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-indigo-950/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden">
      
      {/* Ambient Glass Luminous Glow Orbs (from Inspo 5) */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-400/20 dark:bg-blue-600/15 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-purple-400/20 dark:bg-purple-600/15 blur-[80px]" />

      {/* Bento Header & Persona Switcher */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/60 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono font-bold mb-1.5">
            <Sparkles className="h-3 w-3" />
            <span>UNIFIED OPERATIONS INFRASTRUCTURE // PLATFORM GRID</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            Multi-Tenant Unified Command Grid
          </h3>
          <p className="text-xs text-muted-foreground">
            Modular interface tiles with real-time IoT wave telemetry, automated dispatch routing, and fraud forensics.
          </p>
        </div>

        {/* Persona Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-white/80 dark:border-white/10 backdrop-blur-md shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setActivePersona("admin")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
              activePersona === "admin"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Admin Command
          </button>
          <button
            onClick={() => setActivePersona("resident")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
              activePersona === "resident"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Resident Portal
          </button>
          <button
            onClick={() => setActivePersona("technician")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
              activePersona === "technician"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Tactical Tech
          </button>
        </div>
      </div>

      {/* The 6-Module Operations Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 pt-6">

        {/* ========================================================
            TILE 1: Left Vertical Pillar
            Incident Radar & Urgent Tickets (Col 1-4)
           ======================================================== */}
        <div className="md:col-span-4 rounded-2xl p-4 sm:p-5 border border-white/80 dark:border-white/10 bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Radio className="h-3 w-3 animate-pulse text-emerald-500" />
                Live Incident Queue
              </span>
              <Badge variant="outline" className="text-[10px] font-mono bg-white/50 dark:bg-slate-700/50">
                3 Urgent
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground">
              Autonomous triage priority evaluated by smart vision and hazard diagnostics.
            </p>

            {/* Incident Selection Stack */}
            <div className="space-y-2 pt-1">
              {incidents.map((inc, i) => (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(i)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedIncident === i
                      ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-xs ring-1 ring-primary/20"
                      : "border-white/60 dark:border-white/5 bg-white/40 dark:bg-slate-800/40 hover:bg-white/70"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-foreground">{inc.id}</span>
                    <span className="text-rose-500 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded">
                      {inc.urgency}% Risk
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-foreground mt-1 leading-snug">
                    {inc.title}
                  </h5>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono mt-1.5 pt-1.5 border-t border-border/40">
                    <span>{inc.tower}</span>
                    <span className="text-primary font-medium">{inc.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Dispatch Bottom Trigger */}
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-[11px]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Certified Dispatch Ready</span>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">ETA &lt; 15s</span>
          </div>
        </div>

        {/* ========================================================
            TILE 2: Multi-Layer Ocean Wave Chart (Inspo 5 Top Right)
            Daily Infrastructure Velocity (Col 5-12)
           ======================================================== */}
        <div className="md:col-span-8 rounded-2xl p-4 sm:p-5 border border-white/80 dark:border-white/10 bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Telemetry Velocity & Grid Load
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h4 className="text-sm font-bold text-foreground">
                24-Hour IoT Pressure, Electricity, & Ticket Resolution Flow
              </h4>
            </div>

            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-primary">
                <span className="h-2 w-2 rounded-full bg-[#0080FF]" /> Grievances
              </span>
              <span className="flex items-center gap-1 text-purple-500">
                <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" /> Power Load
              </span>
              <span className="flex items-center gap-1 text-emerald-500">
                <span className="h-2 w-2 rounded-full bg-[#10B981]" /> Resolved
              </span>
            </div>
          </div>

          {/* The Multi-Layer Wave Chart (Exact Inspo 5 style) */}
          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={multiLayerWaveData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="wavePrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0080FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0080FF" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="wavePurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="waveEmerald" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "11px",
                    fontFamily: "monospace",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="load"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#wavePurple)"
                />
                <Area
                  type="monotone"
                  dataKey="active"
                  stroke="#0080FF"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#wavePrimary)"
                />
                <Area
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#waveEmerald)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ========================================================
            TILE 3: Circular 99% Gauge Card (Inspo 5 Center Left)
            AI Precision SLA (Col 1-4)
           ======================================================== */}
        <div className="md:col-span-4 rounded-2xl p-4 sm:p-5 border border-white/80 dark:border-white/10 bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">
              Autonomous SLA
            </span>
            <div className="text-2xl font-black text-foreground font-mono">
              99.2%
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">
              Zero human bottleneck
            </p>
            <div className="text-[10px] font-mono text-muted-foreground pt-1">
              1,400+ Units Monitored
            </div>
          </div>

          {/* SVG Circular Ring Gauge (Inspo 5 Circular Tile) */}
          <div className="relative h-20 w-20 shrink-0 flex items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-secondary"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-primary animate-pulse"
                strokeDasharray="99, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-mono font-black text-xs text-primary">
              99%
            </span>
          </div>
        </div>

        {/* ========================================================
            TILE 4: Weekly Vertical Velocity Bars (Inspo 5 Top Center)
            (Col 5-8)
           ======================================================== */}
        <div className="md:col-span-4 rounded-2xl p-4 sm:p-5 border border-white/80 dark:border-white/10 bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl shadow-sm flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">
              Weekly Grievance Velocity
            </span>
            <span className="text-xs font-mono font-bold text-emerald-600">
              ↗ +14% vs Mon
            </span>
          </div>

          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barVelocityData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                <Bar dataKey="val" fill="#0080FF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1 border-t border-border/40">
            <span>47 Closed This Week</span>
            <span className="text-foreground font-semibold">1.8d Avg Time</span>
          </div>
        </div>

        {/* ========================================================
            TILE 5: High-Contrast Dark Surface Wave
            Operations Engine Telemetry (Col 9-12)
           ======================================================== */}
        <div className="md:col-span-4 rounded-2xl p-4 sm:p-5 border border-white/20 dark:border-white/10 bg-neutral-950 text-white shadow-md flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sky-400 font-mono text-[10px] font-bold">
              <Zap className="h-3 w-3" />
              <span>AUTOMATED DISPATCH ENGINE</span>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[9px] font-mono">
              LIVE NODE
            </Badge>
          </div>

          <div>
            <div className="text-xl font-black font-mono">
              8 Active Services
            </div>
            <p className="text-[11px] text-white/70 mt-0.5">
              Triage, Fraud Forensics, Dispatch, SOS
            </p>
          </div>

          <div className="h-16 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendLineData}>
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#38BDF8"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#38BDF8" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-white/60 pt-1 border-t border-white/10">
            <span>Smart Triage Engine</span>
            <span className="text-emerald-400 font-bold">99.8% Healthy</span>
          </div>
        </div>

      </div>
    </div>
  );
}
