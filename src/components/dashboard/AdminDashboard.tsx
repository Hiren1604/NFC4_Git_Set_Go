import { useState } from "react";
import { StatsCard } from "./StatsCard";
import { IssueCard } from "./IssueCard";
import { TechniciansPage } from "./TechniciansPage";
import { AIPrioritizedIssues } from "./AIPrioritizedIssues";
import { AIAgentsPage } from "./AIAgentsPage";
import { AIInsights } from "./AIInsights";
import { SocietyTreasuryLedger } from "./SocietyTreasuryLedger";
import { GlassmorphicBentoDashboard } from "./GlassmorphicBentoDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Users,
  Wrench,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Bot,
  Zap,
  Activity,
  BarChart3,
  LogOut,
  Settings,
  UserCheck,
  CreditCard,
  Radio,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Trend chart data (Stripe style)
const trendData = [
  { day: "Mon", issues: 4, resolved: 3 },
  { day: "Tue", issues: 7, resolved: 6 },
  { day: "Wed", issues: 5, resolved: 5 },
  { day: "Thu", issues: 9, resolved: 7 },
  { day: "Fri", issues: 6, resolved: 6 },
  { day: "Sat", issues: 8, resolved: 8 },
  { day: "Sun", issues: 3, resolved: 3 },
];

const categoryData = [
  { name: "Plumbing", count: 18, color: "#0080FF" },
  { name: "Electrical", count: 14, color: "#F59E0B" },
  { name: "Elevators", count: 8, color: "#EF4444" },
  { name: "Carpentry", count: 5, color: "#10B981" },
  { name: "Security", count: 4, color: "#8B5CF6" },
];

const mockIssues = [
  {
    id: "ISS-001",
    title: "Water leakage in basement parking slot B-15",
    description: "Significant water leak near parking slot B-15. Water is pooling and might damage vehicles.",
    status: "new" as const,
    priority: "urgent" as const,
    category: "water" as const,
    reporter: {
      name: "Sarah Johnson",
      avatar: "",
      flatNumber: "A-501",
    },
    location: "Basement Parking • B Block",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    hasMedia: true,
    commentsCount: 1,
  },
  {
    id: "ISS-002",
    title: "Tower B Elevator Lift #2 out of service",
    description: "Passenger elevator in Tower B has been halted. Intercom activated.",
    status: "assigned" as const,
    priority: "urgent" as const,
    category: "elevator" as const,
    reporter: {
      name: "Raj Patel",
      avatar: "",
      flatNumber: "B-1203",
    },
    assignedTo: {
      name: "Alex Kumar (Elevator Tech)",
      avatar: "",
    },
    location: "Tower B • Lift Shaft 2",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    hasMedia: false,
    commentsCount: 3,
  },
  {
    id: "ISS-003",
    title: "Broken security light near Gate 1",
    description: "Main gate street light is flickering and off, reducing guard night visibility.",
    status: "in-progress" as const,
    priority: "medium" as const,
    category: "electrical" as const,
    reporter: {
      name: "Security Rampal",
      avatar: "",
      flatNumber: "Security Desk",
    },
    assignedTo: {
      name: "Mike Wilson",
      avatar: "",
    },
    location: "Main Gate • Gate 1 Entrance",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    hasMedia: true,
    commentsCount: 2,
  },
];

const liveAIStream = [
  {
    id: "1",
    agent: "Triage Engine",
    action: "Assessed basement leak ISS-001 risk score: 96/100 (Urgent hazard)",
    time: "4 mins ago",
    type: "urgent",
  },
  {
    id: "2",
    agent: "Dispatch Coordinator",
    action: "Dispatched Mike Wilson (Plumbing, ₹500/hr) within 15-min SLA",
    time: "12 mins ago",
    type: "success",
  },
  {
    id: "3",
    agent: "Ledger Audit",
    action: "Flagged ₹2,500 duplicate maintenance charge for Flat A-501",
    time: "28 mins ago",
    type: "warning",
  },
];

interface AdminDashboardProps {
  defaultTab?: string;
}

export function AdminDashboard({ defaultTab = "overview" }: AdminDashboardProps) {
  const [selectedTab, setSelectedTab] = useState(defaultTab);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Bar (Glassmorphic Bento) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Foundry Node Cluster Online</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            Administrator Command Center
            <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
              Live Operations
            </Badge>
          </h1>
          <p className="text-xs text-muted-foreground">
            Complete oversight of society grievances, automated workflows, ledgers, and technicians.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedTab("ai-issues")}
            className="text-xs h-8 border-border/80 bg-background/80 hover:bg-background"
          >
            <Bot className="h-3.5 w-3.5 mr-1 text-primary" />
            Priority Queue (6)
          </Button>
          <Button
            size="sm"
            onClick={() => setSelectedTab("ai-agents")}
            className="text-xs h-8 bg-primary hover:bg-primary/90 text-white shadow-xs"
          >
            <Zap className="h-3.5 w-3.5 mr-1" />
            Workflows
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="overflow-x-auto no-scrollbar -mx-2 px-2 pb-1">
          <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 sm:w-auto p-1 bg-secondary/60 rounded-xl border border-border/60 gap-1 backdrop-blur-md">
            <TabsTrigger value="overview" className="text-xs shrink-0 px-3 py-1.5">Overview</TabsTrigger>
            <TabsTrigger value="bento" className="text-xs shrink-0 px-3 py-1.5 font-bold text-primary">⚡ Command Grid</TabsTrigger>
            <TabsTrigger value="treasury" className="text-xs shrink-0 px-3 py-1.5">Treasury & Ledger</TabsTrigger>
            <TabsTrigger value="technicians" className="text-xs shrink-0 px-3 py-1.5">Technicians (8)</TabsTrigger>
            <TabsTrigger value="ai-agents" className="text-xs shrink-0 px-3 py-1.5">Automated Workflows</TabsTrigger>
            <TabsTrigger value="ai-issues" className="text-xs shrink-0 px-3 py-1.5">Priority Queue (6)</TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-6 pt-2">
          {/* KPI Cards Row (Glassmorphic Bento precision) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
                  <span>Total Complaints</span>
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">47</div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12% vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
                  <span>Pending AI Sign-offs</span>
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">6</div>
                <div className="flex items-center gap-1 text-[11px] text-amber-600 font-medium mt-1">
                  <span>2 urgent safety tickets</span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
                  <span>Active Technicians</span>
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                    <Users className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">8 / 10</div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>8 online on premise</span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
                  <span>Disputed Ledgers</span>
                  <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
                    <CreditCard className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">₹14,200</div>
                <div className="flex items-center gap-1 text-[11px] text-rose-600 font-medium mt-1">
                  <span>3 cases under arbitration</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row (Stripe Inspired AreaChart & Category Breakdown) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 7-Day Resolution Curve */}
            <Card className="lg:col-span-2 rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold text-foreground">
                      Weekly Grievance & Resolution Velocity
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Issues filed vs successfully closed by technicians
                    </p>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px] border-primary/30 text-primary">
                    Past 7 Days
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0080FF" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#0080FF" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "12px",
                          fontSize: "12px",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="issues"
                        stroke="#0080FF"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorIssues)"
                        name="Reported"
                      />
                      <Area
                        type="monotone"
                        dataKey="resolved"
                        stroke="#10B981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorResolved)"
                        name="Resolved"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-foreground">Complaint Domain Breakdown</CardTitle>
                <p className="text-xs text-muted-foreground">Volume by maintenance domain</p>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                {categoryData.map((cat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-foreground">{cat.name}</span>
                      <span className="font-mono text-muted-foreground">{cat.count} issues</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(cat.count / 20) * 100}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Operational Feeds (Recent Grievances & Live Agent Stream) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent High-Priority Grievances */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Urgent Society Incidents</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-primary"
                  onClick={() => setSelectedTab("ai-issues")}
                >
                  View All Active Tickets
                </Button>
              </div>

              <div className="space-y-3">
                {mockIssues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    onCardClick={setSelectedIssue}
                    variant="detailed"
                  />
                ))}
              </div>
            </div>

            {/* Live AI Autonomous Event Stream */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Bot className="h-4 w-4 text-primary" />
                  Live Operations Pipeline
                </h3>
                <Badge variant="outline" className="text-[10px] font-mono text-emerald-600 border-emerald-500/30">
                  Streaming
                </Badge>
              </div>

              <Card className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                <CardContent className="p-4 space-y-3 divide-y divide-border/60">
                  {liveAIStream.map((item) => (
                    <div key={item.id} className="pt-3 first:pt-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-primary">{item.agent}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">{item.time}</span>
                      </div>
                      <p className="text-xs text-foreground/90 leading-snug">{item.action}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Technicians */}
        <TabsContent value="technicians" className="pt-2">
          <TechniciansPage />
        </TabsContent>

        {/* Tab 3: AI Agents */}
        <TabsContent value="ai-agents" className="pt-2">
          <AIAgentsPage />
        </TabsContent>

        {/* Tab 4: AI Issues */}
        <TabsContent value="ai-issues" className="pt-2">
          <AIPrioritizedIssues />
        </TabsContent>

        {/* Tab 5: Treasury & Ledger (Inspo 6 & 7 Finly/Ethereal) */}
        <TabsContent value="treasury" className="pt-2">
          <SocietyTreasuryLedger />
        </TabsContent>

        {/* Tab 6: Glassmorphic Bento Grid (Inspo 5 Architecture) */}
        <TabsContent value="bento" className="pt-2">
          <GlassmorphicBentoDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}