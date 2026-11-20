import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Bot,
  Eye,
  MapPin,
  User,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Flame,
  Droplet,
  Zap,
} from "lucide-react";

interface AIPrioritizedIssue {
  id: string;
  title: string;
  description: string;
  priority: "urgent" | "high" | "medium" | "low";
  riskScore: number;
  category: string;
  reporter: {
    name: string;
    flatNumber: string;
  };
  location: string;
  createdAt: string;
  aiConfidence: number;
  aiReasoning: string[];
  status: "pending" | "approved" | "rejected";
  estimatedTime: string;
  estimatedCost: number;
  suggestedTechnician?: {
    name: string;
    specialization: string;
    rating: number;
    hourlyRate: number;
  };
}

export function AIPrioritizedIssues() {
  const [selectedTab, setSelectedTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [expandedId, setExpandedId] = useState<string | null>("AI-001");

  const [issues, setIssues] = useState<AIPrioritizedIssue[]>([
    {
      id: "AI-001",
      title: "Basement water pipe rupture near electrical panel",
      description: "Pressurized water leak observed 2 meters away from the B-Block electrical junction box. Water pooling rapidly.",
      priority: "urgent",
      riskScore: 96,
      category: "Plumbing & Electrical Hazard",
      reporter: {
        name: "Security Guard Rampal",
        flatNumber: "Security Desk",
      },
      location: "Basement 1 • Junction B-4",
      createdAt: "12 mins ago",
      aiConfidence: 98,
      aiReasoning: [
        "Proximity (< 2m) to 440V distribution panel creates severe electrocution hazard.",
        "Flooding rate estimated at 15 liters/min based on resident description.",
        "Affects parking access for 48 vehicles in Tower B.",
      ],
      status: "pending",
      estimatedTime: "1-2 hours",
      estimatedCost: 1800,
      suggestedTechnician: {
        name: "Mike Wilson",
        specialization: "Master Plumber",
        rating: 4.9,
        hourlyRate: 500,
      },
    },
    {
      id: "AI-002",
      title: "Tower B Passenger Lift #2 trapped at 4th floor",
      description: "Lift stopped abruptly between floors 3 and 4 with 2 passengers inside. Intercom alarm triggered.",
      priority: "urgent",
      riskScore: 94,
      category: "Elevator Emergency",
      reporter: {
        name: "Raj Patel",
        flatNumber: "B-1203",
      },
      location: "Tower B • Lift Shaft 2",
      createdAt: "18 mins ago",
      aiConfidence: 99,
      aiReasoning: [
        "Human occupants trapped inside enclosed elevator car.",
        "Ventilation fan running on emergency backup battery.",
        "Direct safety protocol mandates immediate OTIS technician dispatch.",
      ],
      status: "pending",
      estimatedTime: "30-45 mins",
      estimatedCost: 3500,
      suggestedTechnician: {
        name: "Alex Kumar",
        specialization: "Elevator Specialist",
        rating: 4.8,
        hourlyRate: 700,
      },
    },
    {
      id: "AI-003",
      title: "Intermittent corridor lighting flicker",
      description: "3 LED fixtures flickering continuously along 6th floor hallway in Tower A.",
      priority: "medium",
      riskScore: 42,
      category: "Electrical",
      reporter: {
        name: "Meera Sen",
        flatNumber: "A-604",
      },
      location: "Tower A • Floor 6 Corridors",
      createdAt: "2 hours ago",
      aiConfidence: 89,
      aiReasoning: [
        "No direct short-circuit or sparking reported.",
        "Daylight available via hallway windows until 6:00 PM.",
        "Low urgency; can be grouped with routine evening maintenance round.",
      ],
      status: "pending",
      estimatedTime: "25 mins",
      estimatedCost: 400,
      suggestedTechnician: {
        name: "Sarah Chen",
        specialization: "General Electrician",
        rating: 4.7,
        hourlyRate: 450,
      },
    },
  ]);

  const handleApprove = (id: string) => {
    setIssues((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "approved" } : i))
    );
  };

  const handleReject = (id: string) => {
    setIssues((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "rejected" } : i))
    );
  };

  const filteredIssues = issues.filter((i) => i.status === selectedTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            AI Priority Queue & Triage
            <Badge variant="outline" className="font-mono text-xs text-primary border-primary/40">
              Ranked by Risk
            </Badge>
          </h1>
          <p className="text-xs text-muted-foreground">
            Automated urgency score calculation with administrator verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono text-xs px-3 py-1">
            3 Pending Sign-offs
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
        <TabsList className="grid w-full grid-cols-3 max-w-sm">
          <TabsTrigger value="pending" className="text-xs">
            Pending Review ({issues.filter((i) => i.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="text-xs">
            Approved ({issues.filter((i) => i.status === "approved").length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="text-xs">
            Overridden ({issues.filter((i) => i.status === "rejected").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4 pt-2">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-dashed border-border bg-card">
              <Bot className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">No issues in {selectedTab} state</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                AI queue is currently synchronized with society operations.
              </p>
            </div>
          ) : (
            filteredIssues.map((issue) => {
              const isExpanded = expandedId === issue.id;
              const isUrgent = issue.priority === "urgent";

              return (
                <Card
                  key={issue.id}
                  className={`border transition-all shadow-subtle ${
                    isUrgent
                      ? "border-destructive/40 bg-gradient-to-r from-destructive/5 to-transparent"
                      : "border-border hover:border-border/80"
                  }`}
                >
                  <CardContent className="p-5">
                    {/* Top Row */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      {/* Left Block */}
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        {/* Risk Score Circle */}
                        <div
                          className={`h-12 w-12 rounded-xl flex flex-col items-center justify-center shrink-0 border font-mono ${
                            isUrgent
                              ? "bg-destructive/10 border-destructive/30 text-destructive"
                              : "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          <span className="text-base font-bold leading-none">{issue.riskScore}</span>
                          <span className="text-[9px] uppercase tracking-tighter opacity-80">Risk</span>
                        </div>

                        {/* Title and Metadata */}
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs text-muted-foreground">{issue.id}</span>
                            <h3 className="font-bold text-sm text-foreground truncate">{issue.title}</h3>
                            <Badge
                              variant={isUrgent ? "destructive" : "secondary"}
                              className="text-[10px] uppercase font-mono tracking-wider h-4 px-1.5"
                            >
                              {issue.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground font-mono">
                              • {issue.createdAt}
                            </span>
                          </div>

                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {issue.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                            <span className="font-medium text-foreground">{issue.location}</span>
                            <span>Reported by: {issue.reporter.name}</span>
                            <span className="font-mono text-emerald-600 font-medium">
                              AI Confidence: {issue.aiConfidence}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {issue.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                              onClick={() => handleApprove(issue.id)}
                            >
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                              Approve Dispatch
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-8 text-destructive border-destructive/40 hover:bg-destructive/10"
                              onClick={() => handleReject(issue.id)}
                            >
                              <XCircle className="h-3.5 w-3.5 mr-1" />
                              Override
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground"
                          onClick={() => setExpandedId(isExpanded ? null : issue.id)}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    {/* Expandable AI Reasoning Breakdown */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-border/80 space-y-4 text-xs animate-fade-in">
                        <div className="rounded-lg bg-card/60 border border-border p-3.5">
                          <h4 className="font-semibold text-foreground flex items-center gap-1.5 mb-2">
                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                            Multi-Factor Urgency Diagnostic Breakdown
                          </h4>
                          <ul className="space-y-1.5 text-muted-foreground list-disc list-inside">
                            {issue.aiReasoning.map((reason, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Suggested Technician Preview */}
                        {issue.suggestedTechnician && (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border bg-secondary/30 p-3">
                            <div className="flex items-center gap-2.5">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                                  {issue.suggestedTechnician.name.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="font-semibold text-foreground">
                                  {issue.suggestedTechnician.name}
                                </span>
                                <p className="text-[11px] text-muted-foreground">
                                  {issue.suggestedTechnician.specialization} • ⭐ {issue.suggestedTechnician.rating}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs font-mono">
                              <span>Est. Time: {issue.estimatedTime}</span>
                              <span className="font-bold text-foreground">
                                Est. Cost: ₹{issue.estimatedCost}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}