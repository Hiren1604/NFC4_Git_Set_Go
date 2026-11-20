import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { GlassmorphicBentoDashboard } from "./GlassmorphicBentoDashboard";
import {
  Wrench,
  Clock,
  CheckCircle,
  MapPin,
  Star,
  Calendar,
  Navigation,
  Phone,
  Camera,
  MessageSquare,
  BarChart3,
  Settings,
  AlertCircle,
  Timer,
  Bot,
  Zap,
  DollarSign,
  TrendingUp,
  Award,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface TechnicianDashboardProps {
  defaultTab?: string;
}

export function TechnicianDashboard({ defaultTab = "tasks" }: TechnicianDashboardProps) {
  const [selectedTab, setSelectedTab] = useState(defaultTab);
  const [isAvailable, setIsAvailable] = useState(true);
  const [tasks, setTasks] = useState([
    {
      id: 101,
      ticketId: "ISS-401",
      title: "Master bathroom flush tank leak",
      priority: "urgent" as const,
      category: "Plumbing",
      location: "Tower A • Flat 501",
      resident: "Sarah Johnson",
      phone: "+91 98765 43210",
      estimatedTime: "45 mins",
      status: "in-progress" as "pending" | "in-progress" | "completed",
      distance: "Within Tower A",
      aiReasoning: "AI matched: Qualified in plumbing, currently on-site in Tower A, lowest response latency.",
      reportedAt: "25 mins ago",
    },
    {
      id: 102,
      ticketId: "ISS-402",
      title: "Tripping MCB breaker in kitchen",
      priority: "high" as const,
      category: "Electrical",
      location: "Tower B • Flat 304",
      resident: "Amit Verma",
      phone: "+91 98765 43219",
      estimatedTime: "1 hour",
      status: "pending" as "pending" | "in-progress" | "completed",
      distance: "120m away",
      aiReasoning: "High priority: Kitchen power outage affects refrigeration. Scheduled right after ISS-401.",
      reportedAt: "1 hour ago",
    },
    {
      id: 103,
      ticketId: "ISS-403",
      title: "Clubhouse gym treadmill wiring",
      priority: "medium" as const,
      category: "Electrical",
      location: "Clubhouse • Level 1",
      resident: "Estate Manager",
      phone: "+91 98765 43200",
      estimatedTime: "30 mins",
      status: "pending" as "pending" | "in-progress" | "completed",
      distance: "250m away",
      aiReasoning: "Non-critical community equipment. Flexible afternoon window.",
      reportedAt: "3 hours ago",
    },
  ]);

  const handleStartTask = (taskId: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "in-progress" } : t))
    );
  };

  const handleCompleteTask = (taskId: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "completed" } : t))
    );
  };

  const completedTasks = [
    {
      id: 1,
      ticketId: "ISS-388",
      title: "HVAC cooling coil pressure tune",
      completedAt: "Today, 11:30 AM",
      resident: "David Miller (C-702)",
      rating: 5,
      feedback: "Arrived in 10 minutes, fixed the issue cleanly. Highly professional!",
      earnings: 750,
      duration: "40 mins",
    },
    {
      id: 2,
      ticketId: "ISS-384",
      title: "Basement drainage sump pump valve",
      completedAt: "Yesterday, 4:15 PM",
      resident: "Society Admin",
      rating: 5,
      feedback: "Critical preventative fix before heavy monsoon rains.",
      earnings: 1200,
      duration: "1 hr 15 mins",
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Technician Status Hero Bar (Glassmorphic Bento) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="flex items-center gap-3.5">
          <Avatar className="h-12 w-12 ring-2 ring-primary/30 shadow-xs">
            <AvatarFallback className="bg-primary text-primary-foreground font-black text-base">
              MW
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-foreground">Mike Wilson</h2>
              <Badge
                variant={isAvailable ? "default" : "secondary"}
                className={isAvailable ? "bg-emerald-500 hover:bg-emerald-600 text-white font-mono text-[10px]" : "font-mono text-[10px]"}
              >
                {isAvailable ? "Available for Dispatch" : "Offline / On Break"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              Lead Technician • Plumbing & Electrical • Base Rate: ₹500/hr
            </p>
          </div>
        </div>

        {/* Tactical Availability Switch */}
        <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-secondary/50 px-3.5 py-2">
          <span className="text-xs font-medium text-foreground">Duty Status:</span>
          <div className="flex items-center gap-2">
            <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
            <span className="text-xs font-mono font-bold text-primary">
              {isAvailable ? "ONLINE" : "OFFLINE"}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards (Tactical Glassmorphic Bento) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
              <span>Active Queue</span>
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Wrench className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
              {tasks.filter((t) => t.status !== "completed").length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">1 in progress, 2 pending</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
              <span>Customer Rating</span>
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">4.92</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Top 5% in society</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
              <span>Avg Turnaround</span>
              <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-500">
                <Timer className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">38m</div>
            <p className="text-[11px] text-muted-foreground mt-1">Target: &lt; 45 mins</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
              <span>Today's Payout</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <DollarSign className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">₹2,450</div>
            <p className="text-[11px] text-muted-foreground mt-1">3 jobs logged today</p>
          </CardContent>
        </Card>
      </div>

      {/* Responsive Tabs Navigation */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="overflow-x-auto no-scrollbar -mx-2 px-2 pb-1">
          <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 sm:w-auto p-1 bg-secondary/60 rounded-xl border border-border/60 gap-1 backdrop-blur-md">
            <TabsTrigger value="tasks" className="text-xs shrink-0 px-3 py-1.5">My Tasks ({tasks.length})</TabsTrigger>
            <TabsTrigger value="bento" className="text-xs shrink-0 px-3 py-1.5 font-bold text-primary">⚡ Tactical Radar</TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs shrink-0 px-3 py-1.5">Route & Schedule</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs shrink-0 px-3 py-1.5">Completed Jobs</TabsTrigger>
            <TabsTrigger value="performance" className="text-xs shrink-0 px-3 py-1.5">Performance & Payout</TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: My Tasks */}
        <TabsContent value="tasks" className="space-y-4 pt-2">
          {tasks.map((task) => {
            const isUrgent = task.priority === "urgent";
            const inProgress = task.status === "in-progress";
            const isCompleted = task.status === "completed";

            return (
              <Card
                key={task.id}
                className={`rounded-2xl border backdrop-blur-xl transition-all relative overflow-hidden shadow-xs ${
                  inProgress
                    ? "border-primary/60 bg-primary/5 ring-1 ring-primary/30"
                    : isCompleted
                    ? "opacity-65 bg-muted/40 border-border/60"
                    : "border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 hover:border-primary/40 hover:shadow-md"
                }`}
              >
                <div className={`absolute top-0 inset-x-0 h-px ${inProgress ? "bg-primary" : "bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent"}`} />
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-muted-foreground">
                          {task.ticketId}
                        </span>
                        <h3 className="font-bold text-base text-foreground">{task.title}</h3>
                        <Badge
                          variant={isUrgent ? "destructive" : "secondary"}
                          className="text-[10px] uppercase font-mono tracking-wider"
                        >
                          {task.priority}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {task.category}
                        </Badge>
                        {inProgress && (
                          <Badge className="bg-primary text-white text-[10px] animate-pulse">
                            In Progress
                          </Badge>
                        )}
                        {isCompleted && (
                          <Badge className="bg-emerald-500 text-white text-[10px]">
                            Resolved
                          </Badge>
                        )}
                      </div>

                      {/* Location & Resident Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          <span>{task.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Est. Duration: {task.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Navigation className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{task.distance}</span>
                        </div>
                      </div>

                      {/* AI Matching Reasoning */}
                      <div className="flex items-start gap-2 rounded-lg bg-background p-2.5 border border-border/80 text-xs">
                        <Bot className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-muted-foreground leading-relaxed">
                          <strong className="text-foreground font-medium">Auto-Dispatch Match: </strong>
                          {task.aiReasoning}
                        </p>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Resident Contact: <span className="text-foreground font-medium">{task.resident}</span> ({task.phone})
                      </div>
                    </div>

                    {/* Operational Action Controls */}
                    <div className="flex flex-row md:flex-col gap-2 shrink-0">
                      <a
                        href={`tel:${task.phone}`}
                        className="inline-flex items-center justify-center rounded-lg border border-border bg-secondary/80 hover:bg-secondary px-3 py-2 text-xs font-medium text-foreground transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5 mr-1.5 text-primary" />
                        Call
                      </a>

                      {!isCompleted && !inProgress && (
                        <Button
                          size="sm"
                          onClick={() => handleStartTask(task.id)}
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          <Zap className="h-3.5 w-3.5 mr-1.5" />
                          Start Job
                        </Button>
                      )}

                      {inProgress && (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteTask(task.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                          Complete & Close
                        </Button>
                      )}

                      {isCompleted && (
                        <Button size="sm" variant="outline" disabled className="text-xs">
                          Closed
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Tab 2: Schedule & Route */}
        <TabsContent value="schedule" className="space-y-4 pt-2">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Navigation className="h-4 w-4 text-primary" />
                AI Smart Route Sequence (Emerald Heights)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-xs text-primary flex items-center justify-between">
                <span>
                  ⚡ Optimal route calculated: Saves 25 mins of walking between Tower A and Tower B.
                </span>
                <Badge variant="outline" className="border-primary/40 text-primary">
                  Sequence: A501 → B304 → Clubhouse
                </Badge>
              </div>

              <div className="relative border-l-2 border-border ml-3 pl-6 space-y-6 text-xs">
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 h-3.5 w-3.5 rounded-full bg-primary ring-4 ring-background" />
                  <span className="font-mono text-muted-foreground">09:30 AM — Now</span>
                  <p className="font-semibold text-foreground mt-0.5 text-sm">Tower A • Flat 501 (Plumbing)</p>
                  <p className="text-muted-foreground">Priority repair underway.</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0 h-3.5 w-3.5 rounded-full bg-muted-foreground/40 ring-4 ring-background" />
                  <span className="font-mono text-muted-foreground">10:30 AM — Next</span>
                  <p className="font-semibold text-foreground mt-0.5 text-sm">Tower B • Flat 304 (MCB Breaker)</p>
                  <p className="text-muted-foreground">Resident confirmed availability.</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0 h-3.5 w-3.5 rounded-full bg-muted-foreground/40 ring-4 ring-background" />
                  <span className="font-mono text-muted-foreground">11:45 AM — Follow-up</span>
                  <p className="font-semibold text-foreground mt-0.5 text-sm">Clubhouse • Treadmill Wiring</p>
                  <p className="text-muted-foreground">Estate manager inspection scheduled.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Completed Jobs */}
        <TabsContent value="completed" className="space-y-4 pt-2">
          {completedTasks.map((job) => (
            <Card key={job.id} className="border-border">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{job.ticketId}</span>
                      <h4 className="font-semibold text-sm text-foreground">{job.title}</h4>
                      <Badge className="bg-emerald-500 text-white text-[10px]">Paid</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{job.resident} • Finished {job.completedAt}</p>
                    <p className="text-xs italic text-foreground/80 mt-2 bg-secondary/50 p-2.5 rounded-md">
                      "{job.feedback}"
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-base font-bold text-foreground">
                      +₹{job.earnings}
                    </span>
                    <div className="flex items-center gap-0.5 justify-end mt-1">
                      {[...Array(job.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Tab 4: Performance Analytics */}
        <TabsContent value="performance" className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  Monthly Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">First-Time Fix Rate</span>
                    <span className="font-bold text-foreground font-mono">94%</span>
                  </div>
                  <Progress value={94} className="h-2 bg-secondary" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">On-Time Arrival Rate</span>
                    <span className="font-bold text-foreground font-mono">98%</span>
                  </div>
                  <Progress value={98} className="h-2 bg-secondary" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Resident Satisfaction</span>
                    <span className="font-bold text-foreground font-mono">99%</span>
                  </div>
                  <Progress value={99} className="h-2 bg-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                  Monthly Earnings Ledger
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-border">
                  <span className="text-muted-foreground">Total Jobs Completed</span>
                  <span className="font-mono font-bold text-foreground">42 jobs</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-border">
                  <span className="text-muted-foreground">Billable Hours Logged</span>
                  <span className="font-mono font-bold text-foreground">68.5 hrs</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-border">
                  <span className="text-muted-foreground">Society Retainer Bonus</span>
                  <span className="font-mono font-bold text-emerald-600">+₹5,000</span>
                </div>
                <div className="flex justify-between items-center pt-1 font-semibold text-sm">
                  <span>Net Monthly Payout</span>
                  <span className="font-mono text-primary font-bold">₹39,250</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 5: Glassmorphic Bento Grid (Inspo 5 Architecture) */}
        <TabsContent value="bento" className="pt-2">
          <GlassmorphicBentoDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}