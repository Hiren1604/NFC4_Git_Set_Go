import { API_BASE_URL } from "@/constants";
import { useState, useEffect } from "react";
import { SocietyTreasuryLedger } from "@/components/dashboard/SocietyTreasuryLedger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Bot,
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Eye,
  Settings,
  BarChart3,
  CreditCard,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock financial monthly billing distribution
const monthlyBillingTrends = [
  { month: "Aug", billed: 420000, collected: 412000, duplicates: 0 },
  { month: "Sep", billed: 435000, collected: 428000, duplicates: 2500 },
  { month: "Oct", billed: 440000, collected: 430000, duplicates: 5000 },
  { month: "Nov", billed: 442000, collected: 439000, duplicates: 2500 },
  { month: "Dec", billed: 460000, collected: 445000, duplicates: 7500 },
  { month: "Jan", billed: 450000, collected: 442000, duplicates: 2500 },
];

export default function AIBillingAnalysisPage() {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [runningAnalysis, setRunningAnalysis] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  const defaultAnalysisFallback = {
    summary: {
      totalBills: 124,
      duplicateBills: 4,
      duplicateAmount: 10000,
      potentialSavings: 14500,
      disputeRate: "3.2%",
      averageResolutionTime: "1.8 days",
    },
    duplicateBills: [
      {
        id: 1,
        residentName: "Sarah Johnson",
        flatNumber: "A-501",
        billIds: ["BILL-DEC-041", "BILL-DEC-042"],
        amount: 2500,
        status: "Pending Investigation",
        date: "2024-01-10",
        comments: "Paid via UPI on Dec 28, but January ledger re-billed December maintenance.",
        severity: "high",
        aiAnalysis: "Identical ₹2,500 maintenance fee billed twice for Flat A-501 within 14 days.",
      },
      {
        id: 2,
        residentName: "Raj Patel",
        flatNumber: "B-1203",
        billIds: ["BILL-NOV-092", "BILL-NOV-093"],
        amount: 2500,
        status: "Under Review",
        date: "2024-01-08",
        comments: "Double charge of clubhouse gym fee.",
        severity: "medium",
        aiAnalysis: "Two simultaneous clubhouse fee debits recorded on the same date timestamp.",
      },
      {
        id: 3,
        residentName: "Kunal Mehra",
        flatNumber: "C-204",
        billIds: ["BILL-JAN-011", "BILL-JAN-012"],
        amount: 3200,
        status: "Verified Duplicate",
        date: "2024-01-12",
        comments: "Parking slot fee deducted for both bay P-12 and duplicate bay P-12A.",
        severity: "high",
        aiAnalysis: "Ledger discrepancy in parking bay allocation formula.",
      },
    ],
    billingAnomalies: [
      {
        id: 1,
        type: "Sudden Water Charge Spike",
        residentName: "Tower A Common Tank",
        amount: 42000,
        expectedRange: "₹24,000 – ₹28,000",
        aiAnalysis: "Water bill is 58% higher than 6-month moving average; suggests underground pipe leakage.",
        recommendedAction: "Dispatch Mike Wilson to inspect Tower A underground valve line immediately.",
      },
      {
        id: 2,
        type: "Diesel Generator Fuel Over-run",
        residentName: "DG Backup Set 1",
        amount: 18500,
        expectedRange: "₹9,000 – ₹12,000",
        aiAnalysis: "Fuel consumption spiked despite grid power uptime being 99.1% during the cycle.",
        recommendedAction: "Verify generator logbook hours with security guard gate log.",
      },
    ],
    aiRecommendations: [
      {
        id: 1,
        title: "Automate UPI Transaction Hash Cross-Checking",
        category: "Ledger Hygiene",
        priority: "high",
        estimatedImpact: "Eliminate 100% of double-payment false positives",
        description: "Enforce unique transaction ID constraints at payment upload point before ledger creation.",
      },
      {
        id: 2,
        title: "Split Maintenance Slabs by Carpet Area",
        category: "Policy",
        priority: "medium",
        estimatedImpact: "Reduce resident split disputes by 35%",
        description: "Re-calibrate 3BHK vs 2BHK common area electricity consumption ratios based on recent audits.",
      },
    ],
  };

  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/ai-billing/analysis`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisData(data.data || defaultAnalysisFallback);
      } else {
        setAnalysisData(defaultAnalysisFallback);
      }
    } catch (error) {
      // Fallback gracefully to demo dataset
      setAnalysisData(defaultAnalysisFallback);
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    try {
      setRunningAnalysis(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/ai-billing/run-analysis`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisData(data.data || defaultAnalysisFallback);
      } else {
        fetchAnalysisData();
      }
    } catch (error) {
      console.error("AI billing execution bridge error:", error);
      fetchAnalysisData();
    } finally {
      setRunningAnalysis(false);
    }
  };

  const data = analysisData || defaultAnalysisFallback;

  return (
    <div className="space-y-6">
      {/* Title Bar (Glassmorphic Bento) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Financial Forensics Active</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            AI Billing Anomaly & Duplicate Audit
            <Badge variant="outline" className="font-mono text-xs text-primary border-primary/40">
              Audit Engine
            </Badge>
          </h1>
          <p className="text-xs text-muted-foreground">
            Autonomous ledger reconciliation, double-payment prevention, and financial forensics.
          </p>
        </div>

        <Button
          onClick={runAnalysis}
          disabled={runningAnalysis}
          className="bg-primary hover:bg-primary/90 text-white text-xs h-9 px-4 rounded-xl shadow-xs"
        >
          {runningAnalysis ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              Scanning Ledger...
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Run Forensic Audit Scan
            </>
          )}
        </Button>
      </div>

      {/* Stripe-Style KPI Banner (Glassmorphic Bento) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs relative overflow-hidden group hover:border-primary/40 transition-all">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
              <span>Bills Audited</span>
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <CreditCard className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
              {data.summary.totalBills}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Across Towers A, B, C</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs relative overflow-hidden group hover:border-rose-500/40 transition-all">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-rose-500/30 to-transparent" />
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
              <span>Duplicate Charges</span>
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
                <AlertTriangle className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-500">
              {data.summary.duplicateBills} Cases
            </div>
            <p className="text-[11px] text-rose-600 font-medium mt-1">
              ₹{data.summary.duplicateAmount.toLocaleString()} flagged
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
              <span>Recoverable Savings</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600">
              ₹{data.summary.potentialSavings.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Disputed credits & errors</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
              <span>Dispute Rate</span>
              <ShieldCheck className="h-4 w-4 text-sky-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {data.summary.disputeRate}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
              Avg resolution: {data.summary.averageResolutionTime}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stripe-style Monthly Collection Trend Area Chart */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">
                Society Collections & Duplicate Charge Interceptions
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Monthly billed maintenance vs verified collections
              </p>
            </div>
            <Badge variant="outline" className="font-mono text-[10px]">
              INR (₹) Ledger
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyBillingTrends} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBilled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0080FF" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0080FF" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorDup" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  formatter={(val: any) => `₹${Number(val).toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="billed"
                  stroke="#0080FF"
                  strokeWidth={2}
                  fill="url(#colorBilled)"
                  name="Monthly Billed"
                />
                <Area
                  type="monotone"
                  dataKey="duplicates"
                  stroke="#EF4444"
                  strokeWidth={2}
                  fill="url(#colorDup)"
                  name="Intercepted Duplicates"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto no-scrollbar pb-1">
          <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 sm:w-auto p-1 bg-secondary/60 rounded-xl border border-border/60 gap-1">
            <TabsTrigger value="overview" className="text-xs shrink-0 px-3 py-1.5">
              Flagged Duplicates ({data.duplicateBills.length})
            </TabsTrigger>
            <TabsTrigger value="treasury" className="text-xs shrink-0 px-3 py-1.5">
              Treasury Escrow & Ledger
            </TabsTrigger>
            <TabsTrigger value="anomalies" className="text-xs shrink-0 px-3 py-1.5">
              Infrastructure Anomalies ({data.billingAnomalies.length})
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="text-xs shrink-0 px-3 py-1.5">
              AI Recommendations
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Duplicates */}
        <TabsContent value="overview" className="space-y-4 pt-2">
          {data.duplicateBills.map((dup: any) => (
            <Card key={dup.id} className="border-border">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{dup.residentName}</span>
                      <Badge variant="outline" className="font-mono text-xs">
                        {dup.flatNumber || "A-501"}
                      </Badge>
                      <Badge variant="destructive" className="text-[10px] uppercase font-mono">
                        {dup.severity} Severity
                      </Badge>
                    </div>

                    <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-2.5 text-xs text-destructive">
                      <strong>AI Forensics: </strong>
                      {dup.aiAnalysis}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      <strong>Resident Description: </strong>"{dup.comments}"
                    </p>

                    <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                      <span>Conflict Bills: {dup.billIds.join(", ")}</span>
                      <span>Flagged: {dup.date}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xl font-bold font-mono text-destructive">
                      ₹{dup.amount.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-muted-foreground">Duplicate Amount</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-white text-xs h-8">
                        Issue Credit Note
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs h-8">
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Tab 2: Anomalies */}
        <TabsContent value="anomalies" className="space-y-4 pt-2">
          {data.billingAnomalies.map((anomaly: any) => (
            <Card key={anomaly.id} className="border-border">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground">{anomaly.type}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {anomaly.residentName}
                      </Badge>
                    </div>

                    <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-2.5 text-xs text-amber-700 dark:text-amber-300">
                      <strong>Anomaly Insight: </strong>
                      {anomaly.aiAnalysis}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      <strong>Recommended Action: </strong>
                      {anomaly.recommendedAction}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-lg font-bold font-mono text-foreground">
                      ₹{anomaly.amount.toLocaleString()}
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      Benchmark: {anomaly.expectedRange}
                    </p>
                    <Button size="sm" variant="outline" className="text-xs mt-3 h-8">
                      Dispatch Inspection
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Tab 3: Recommendations */}
        <TabsContent value="recommendations" className="space-y-4 pt-2">
          {data.aiRecommendations.map((rec: any) => (
            <Card key={rec.id} className="border-border">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-foreground">{rec.title}</h4>
                  <Badge variant="outline" className="font-mono text-xs">
                    {rec.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{rec.description}</p>
                <div className="rounded-md bg-emerald-500/10 p-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Target Impact: {rec.estimatedImpact}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Tab 4: Treasury Escrow & Ledger (Inspo 6 & 7 Finly/Ethereal) */}
        <TabsContent value="treasury" className="pt-2">
          <SocietyTreasuryLedger />
        </TabsContent>
      </Tabs>
    </div>
  );
}