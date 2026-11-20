import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Bot,
  Brain,
  Zap,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  Shield,
  Sliders,
  DollarSign,
  Terminal,
  Settings2,
  Workflow,
  Cpu,
  Database,
  Radio,
} from "lucide-react";

interface WorkflowNode {
  id: string;
  type: "trigger" | "model" | "tool" | "action";
  label: string;
  badge: string;
  badgeColor: string;
  subtext: string;
  systemPrompt?: string;
  temperature?: number;
  tokens?: number;
  latency?: string;
  cost?: string;
  status: "idle" | "running" | "success";
  toolsEnabled?: string[];
}

export function AIAgentsPage() {
  const [selectedTab, setSelectedTab] = useState("canvas");
  const [activeNodeId, setActiveNodeId] = useState<string>("node-model");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);

  const nodes: WorkflowNode[] = [
    {
      id: "node-trigger",
      type: "trigger",
      label: "Resident Grievance Form",
      badge: "TRIGGER 01",
      badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30",
      subtext: "Grievance webhook with text, category, flat, and photos",
      systemPrompt: "Validates incoming JSON payload, generates normalized ticket hash, attaches resident flat metadata.",
      latency: "12ms",
      cost: "₹0.00",
      status: simulationStep >= 1 ? "success" : "idle",
    },
    {
      id: "node-model",
      type: "model",
      label: "Smart Triage & Urgency Engine",
      badge: "DIAGNOSTIC ENGINE 02",
      badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
      subtext: "Urgency classification, safety risk calculation, trade tagging",
      systemPrompt: "Analyzes resident grievances for physical risk, water leakage hazards, electrical fire hazards, and elevator traps. Classifies urgency into Low, Medium, High, or Urgent.",
      temperature: 0.2,
      tokens: 1024,
      latency: "280ms",
      cost: "₹0.08",
      status: simulationStep >= 2 ? "success" : "idle",
      toolsEnabled: ["TechnicianAssignmentTool", "DuplicateCheckerTool"],
    },
    {
      id: "node-tool-tech",
      type: "tool",
      label: "TechnicianAssignmentTool",
      badge: "TOOL 03",
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      subtext: "Scans active technicians, skill compatibility, proximity & hourly rate",
      systemPrompt: "Evaluates registered society technicians in MongoDB. Filters by trade specialization, on-site presence, current active task count (<3), and lowest hourly rate.",
      latency: "45ms",
      cost: "₹0.01",
      status: simulationStep >= 3 ? "success" : "idle",
      toolsEnabled: ["MongoDB Query", "Geo-Distance Matrix"],
    },
    {
      id: "node-tool-billing",
      type: "tool",
      label: "DuplicateBillingScanner",
      badge: "TOOL 04",
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
      subtext: "Pandas engine checking ledger for identical amount, flat, date overlap",
      systemPrompt: "Scans maintenance bills dataset. Identifies identical payments made within a 45-day window for the same flat number to flag duplicate transactions.",
      latency: "62ms",
      cost: "₹0.02",
      status: simulationStep >= 3 ? "success" : "idle",
      toolsEnabled: ["Pandas Bill Analyzer", "Anomaly Detector"],
    },
    {
      id: "node-action-dispatch",
      type: "action",
      label: "Automated Dispatch & Alerts",
      badge: "ACTION 05",
      badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
      subtext: "Dispatches technician, pushes real-time notification to resident",
      systemPrompt: "Emits WebSocket push notification to resident app and sends SMS dispatch alert to assigned technician with 15-minute response SLA.",
      latency: "85ms",
      cost: "₹0.04",
      status: simulationStep >= 4 ? "success" : "idle",
    },
  ];

  const activeNode = nodes.find((n) => n.id === activeNodeId) || nodes[1];

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(1);

    setTimeout(() => setSimulationStep(2), 700);
    setTimeout(() => setSimulationStep(3), 1500);
    setTimeout(() => setSimulationStep(4), 2200);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationStep(0);
    }, 4500);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Automated Operations Center
            </h1>
            <Badge variant="outline" className="font-mono text-xs border-primary/40 text-primary">
              Active Pipeline
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Automated workflow orchestration managing real-time triage, intelligent routing, and ledger audit.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            onClick={runSimulation}
            disabled={isSimulating}
            className="bg-primary hover:bg-primary/90 text-white shadow-subtle text-xs"
          >
            {isSimulating ? (
              <>
                <Activity className="h-3.5 w-3.5 mr-1.5 animate-spin text-white" />
                Simulating Pipeline ({simulationStep}/4)...
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 mr-1.5" />
                Test Run Simulation
              </>
            )}
          </Button>

          <Badge variant="secondary" className="px-3 py-1 font-mono text-xs">
            <Radio className="h-3 w-3 text-emerald-500 mr-1.5 animate-pulse" />
            Active Deployment
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-xs">
          <TabsTrigger value="canvas" className="text-xs">Visual Workflow Canvas</TabsTrigger>
          <TabsTrigger value="agents" className="text-xs">Service Health & Stats</TabsTrigger>
        </TabsList>

        {/* Tab 1: Foundry-style Visual Workflow Canvas */}
        <TabsContent value="canvas" className="space-y-4 pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Canvas (2 cols) */}
            <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-card canvas-grid relative overflow-hidden min-h-[520px] flex flex-col justify-between">
              {/* Canvas Header */}
              <div className="flex items-center justify-between border-b border-border/80 pb-3 z-10 bg-card/70 backdrop-blur-sm -mx-6 -mt-6 px-6 pt-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-mono font-medium text-muted-foreground ml-2">
                    canvas / grievance-to-dispatch-pipeline.flow
                  </span>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">
                  100% Zoom
                </Badge>
              </div>

              {/* Node Network Map */}
              <div className="space-y-8 relative z-10 py-2">
                {/* Level 1: Trigger */}
                <div className="flex justify-center">
                  <div
                    onClick={() => setActiveNodeId("node-trigger")}
                    className={`cursor-pointer rounded-xl border p-4 w-72 bg-card transition-all duration-150 shadow-subtle ${
                      activeNodeId === "node-trigger"
                        ? "border-teal-500 ring-2 ring-teal-500/20 shadow-elevated"
                        : "border-border hover:border-teal-500/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30">
                        TRIGGER 01
                      </span>
                      {simulationStep >= 1 && (
                        <CheckCircle className="h-3.5 w-3.5 text-teal-500 animate-bounce" />
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-foreground">Resident Grievance Form</h4>
                    <p className="text-[11px] text-muted-foreground mt-1">Webhook payload via React app</p>
                  </div>
                </div>

                {/* Connecting Cable 1 */}
                <div className="flex justify-center -my-4">
                  <div className={`w-0.5 h-8 transition-colors ${simulationStep >= 1 ? "bg-teal-500" : "bg-border"}`} />
                </div>

                {/* Level 2: AI Core Model */}
                <div className="flex justify-center">
                  <div
                    onClick={() => setActiveNodeId("node-model")}
                    className={`cursor-pointer rounded-xl border p-4 w-80 bg-card transition-all duration-150 shadow-subtle ${
                      activeNodeId === "node-model"
                        ? "border-purple-500 ring-2 ring-purple-500/20 shadow-elevated"
                        : "border-border hover:border-purple-500/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30">
                        DIAGNOSTIC ENGINE 02
                      </span>
                      <div className="flex items-center gap-1">
                        <Brain className="h-3.5 w-3.5 text-purple-500" />
                        <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400">95% Conf</span>
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-foreground">Smart Triage & Urgency Engine</h4>
                    <p className="text-[11px] text-muted-foreground mt-1">Urgency classification & trade tagging</p>
                  </div>
                </div>

                {/* Connecting Branch Cables */}
                <div className="flex justify-center -my-4">
                  <div className={`w-0.5 h-8 transition-colors ${simulationStep >= 2 ? "bg-purple-500" : "bg-border"}`} />
                </div>

                {/* Level 3: Tools (2 columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
                  <div
                    onClick={() => setActiveNodeId("node-tool-tech")}
                    className={`cursor-pointer rounded-xl border p-3.5 bg-card transition-all duration-150 shadow-subtle ${
                      activeNodeId === "node-tool-tech"
                        ? "border-amber-500 ring-2 ring-amber-500/20 shadow-elevated"
                        : "border-border hover:border-amber-500/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30">
                        TOOL 03
                      </span>
                      {simulationStep >= 3 && <CheckCircle className="h-3.5 w-3.5 text-amber-500" />}
                    </div>
                    <h4 className="text-xs font-bold text-foreground">TechnicianAssignmentTool</h4>
                    <p className="text-[10px] text-muted-foreground mt-1">Skills, hourly rate & load balancing</p>
                  </div>

                  <div
                    onClick={() => setActiveNodeId("node-tool-billing")}
                    className={`cursor-pointer rounded-xl border p-3.5 bg-card transition-all duration-150 shadow-subtle ${
                      activeNodeId === "node-tool-billing"
                        ? "border-blue-500 ring-2 ring-blue-500/20 shadow-elevated"
                        : "border-border hover:border-blue-500/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30">
                        TOOL 04
                      </span>
                      {simulationStep >= 3 && <CheckCircle className="h-3.5 w-3.5 text-blue-500" />}
                    </div>
                    <h4 className="text-xs font-bold text-foreground">DuplicateBillingScanner</h4>
                    <p className="text-[10px] text-muted-foreground mt-1">Pandas anomaly detection script</p>
                  </div>
                </div>

                {/* Connecting Cable 3 */}
                <div className="flex justify-center -my-4">
                  <div className={`w-0.5 h-8 transition-colors ${simulationStep >= 3 ? "bg-amber-500" : "bg-border"}`} />
                </div>

                {/* Level 4: Action */}
                <div className="flex justify-center">
                  <div
                    onClick={() => setActiveNodeId("node-action-dispatch")}
                    className={`cursor-pointer rounded-xl border p-4 w-72 bg-card transition-all duration-150 shadow-subtle ${
                      activeNodeId === "node-action-dispatch"
                        ? "border-rose-500 ring-2 ring-rose-500/20 shadow-elevated"
                        : "border-border hover:border-rose-500/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30">
                        ACTION 05
                      </span>
                      {simulationStep >= 4 && (
                        <span className="text-[10px] font-mono font-bold text-emerald-500">DISPATCHED</span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-foreground">Automated Dispatch & Push Alert</h4>
                    <p className="text-[11px] text-muted-foreground mt-1">15-min SLA with resident tracking</p>
                  </div>
                </div>
              </div>

              {/* Canvas Footer Status */}
              <div className="flex items-center justify-between border-t border-border pt-3 mt-4 text-[11px] text-muted-foreground font-mono">
                <span>Active Nodes: 5</span>
                <span>Avg Latency: 480ms</span>
                <span>Token Cost / Run: ~₹0.15</span>
              </div>
            </div>

            {/* Inspector Panel (1 col) - Foundry style right inspector */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Node Inspector
                    </span>
                  </div>
                  <Badge variant="outline" className={`font-mono text-[10px] ${activeNode.badgeColor}`}>
                    {activeNode.badge}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] text-muted-foreground">Node Label</span>
                    <h3 className="text-sm font-bold text-foreground mt-0.5">{activeNode.label}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{activeNode.subtext}</p>
                  </div>

                  {activeNode.systemPrompt && (
                    <div>
                      <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                        System Prompt / Logic
                      </span>
                      <div className="mt-1.5 p-3 rounded-lg bg-secondary/50 border border-border font-mono text-xs text-foreground/90 leading-relaxed max-h-36 overflow-y-auto">
                        {activeNode.systemPrompt}
                      </div>
                    </div>
                  )}

                  {activeNode.toolsEnabled && (
                    <div>
                      <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                        Enabled Tools
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {activeNode.toolsEnabled.map((tool, i) => (
                          <Badge key={i} variant="secondary" className="font-mono text-[10px]">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-2.5 rounded-lg border border-border bg-secondary/30">
                      <span className="text-[10px] text-muted-foreground font-mono">Execution Latency</span>
                      <p className="text-sm font-bold font-mono text-foreground mt-0.5">{activeNode.latency}</p>
                    </div>
                    <div className="p-2.5 rounded-lg border border-border bg-secondary/30">
                      <span className="text-[10px] text-muted-foreground font-mono">Run Cost</span>
                      <p className="text-sm font-bold font-mono text-foreground mt-0.5">{activeNode.cost}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border mt-4">
                <Button
                  size="sm"
                  className="w-full text-xs"
                  onClick={runSimulation}
                  disabled={isSimulating}
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Test Execute Node
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Agent Health & Stats */}
        <TabsContent value="agents" className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Triage Engine */}
            <Card className="border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">Triage Engine</CardTitle>
                      <p className="text-[11px] text-muted-foreground">Urgency & Safety Triage</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500 text-white text-[10px]">Running</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-xs pt-2">
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Accuracy Score</span>
                  <span className="font-mono font-bold text-foreground">96.4%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Total Tickets Scored</span>
                  <span className="font-mono font-bold text-foreground">184</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Average Latency</span>
                  <span className="font-mono font-bold text-foreground">280ms</span>
                </div>
                <div className="pt-2 flex gap-2">
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    View Logs
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Dispatch Coordinator */}
            <Card className="border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                      <Cpu className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">Dispatch Coordinator</CardTitle>
                      <p className="text-[11px] text-muted-foreground">Technician Matchmaker</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500 text-white text-[10px]">Running</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-xs pt-2">
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Skill Match Rate</span>
                  <span className="font-mono font-bold text-foreground">98.1%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Autonomous Dispatches</span>
                  <span className="font-mono font-bold text-foreground">142</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Human Override Rate</span>
                  <span className="font-mono font-bold text-foreground">1.9%</span>
                </div>
                <div className="pt-2 flex gap-2">
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    View Logs
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Ledger Audit Service */}
            <Card className="border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                      <Database className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">Ledger Audit Service</CardTitle>
                      <p className="text-[11px] text-muted-foreground">Ledger Fraud & Duplicates</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-500 text-white text-[10px]">Scanning</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-xs pt-2">
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Ledger Rows Audited</span>
                  <span className="font-mono font-bold text-foreground">1,240</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Duplicates Caught</span>
                  <span className="font-mono font-bold text-rose-500">4 cases</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Resident Savings</span>
                  <span className="font-mono font-bold text-emerald-600">₹14,500</span>
                </div>
                <div className="pt-2 flex gap-2">
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    View Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}