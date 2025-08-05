import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Bot,
  Brain,
  Zap,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Users,
  MessageSquare,
  DollarSign,
  Filter,
  Target,
  Lightbulb,
  Sparkles,
  Shield,
  Wrench,
  FileText,
  Bell,
  Star,
  Settings,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

interface AIAgent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'idle' | 'processing' | 'error';
  confidence: number;
  tasksCompleted: number;
  tasksInProgress: number;
  lastActivity: string;
  specializations: string[];
  performance: {
    accuracy: number;
    speed: number;
    efficiency: number;
  };
  recentActions: {
    id: string;
    action: string;
    timestamp: string;
    result: 'success' | 'pending' | 'error';
    details: string;
  }[];
}

export function AIAgentsPage() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  // Mock AI agents data
  const aiAgents: AIAgent[] = [
    {
      id: "priority-agent",
      name: "Priority Agent",
      description: "Intelligent issue prioritization system that analyzes urgency, impact, and resource availability to determine optimal issue handling order.",
      status: "active",
      confidence: 94,
      tasksCompleted: 156,
      tasksInProgress: 3,
      lastActivity: "2 minutes ago",
      specializations: ["Urgency Analysis", "Impact Assessment", "Resource Optimization", "Risk Evaluation"],
      performance: {
        accuracy: 94,
        speed: 87,
        efficiency: 92
      },
      recentActions: [
        {
          id: "1",
          action: "Prioritized water leakage issue as URGENT",
          timestamp: "2 minutes ago",
          result: "success",
          details: "Elevated priority due to safety hazard and potential vehicle damage"
        },
        {
          id: "2",
          action: "Reassessed elevator malfunction priority",
          timestamp: "15 minutes ago",
          result: "success",
          details: "Maintained HIGH priority for accessibility concerns"
        },
        {
          id: "3",
          action: "Analyzed garbage chute blockage",
          timestamp: "1 hour ago",
          result: "success",
          details: "Set as MEDIUM priority - hygiene concern but non-critical"
        }
      ]
    },
    {
      id: "delegation-agent",
      name: "Delegation Agent",
      description: "Smart technician assignment system that matches issues with the most suitable technicians based on skills, availability, and location.",
      status: "active",
      confidence: 91,
      tasksCompleted: 142,
      tasksInProgress: 2,
      lastActivity: "5 minutes ago",
      specializations: ["Skill Matching", "Availability Tracking", "Route Optimization", "Performance Analysis"],
      performance: {
        accuracy: 91,
        speed: 92,
        efficiency: 89
      },
      recentActions: [
        {
          id: "1",
          action: "Assigned Mike Johnson to water leakage issue",
          timestamp: "5 minutes ago",
          result: "success",
          details: "Perfect match: Plumbing specialist, available, nearby location"
        },
        {
          id: "2",
          action: "Notified residents and admin of technician assignment",
          timestamp: "8 minutes ago",
          result: "success",
          details: "Sent alerts to 3 residents and admin team"
        },
        {
          id: "3",
          action: "Optimized route for Alex Kumar",
          timestamp: "1 hour ago",
          result: "success",
          details: "Reduced travel time by 15 minutes"
        }
      ]
    },
    {
      id: "billing-agent",
      name: "Billing Agent",
      description: "Automated billing analysis system that filters and validates maintenance charges, ensuring accurate cost allocation and dispute resolution.",
      status: "processing",
      confidence: 88,
      tasksCompleted: 203,
      tasksInProgress: 5,
      lastActivity: "1 minute ago",
      specializations: ["Cost Analysis", "Dispute Detection", "Payment Validation", "Refund Processing"],
      performance: {
        accuracy: 88,
        speed: 85,
        efficiency: 90
      },
      recentActions: [
        {
          id: "1",
          action: "Detected duplicate payment in maintenance bill",
          timestamp: "1 minute ago",
          result: "pending",
          details: "Flagged for admin review and potential refund"
        },
        {
          id: "2",
          action: "Validated payment proof for A-501 resident",
          timestamp: "10 minutes ago",
          result: "success",
          details: "Payment confirmed, issue marked as resolved"
        },
        {
          id: "3",
          action: "Analyzed billing pattern for Tower B",
          timestamp: "30 minutes ago",
          result: "success",
          details: "Identified 3% cost reduction opportunity"
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "idle": return "bg-gray-100 text-gray-800";
      case "error": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4" />;
      case "processing": return <Activity className="h-4 w-4" />;
      case "idle": return <Clock className="h-4 w-4" />;
      case "error": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "success": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "error": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleAgentControl = (agentId: string, action: string) => {
    console.log(`${action} agent:`, agentId);
    // Add API call here
  };

  const totalTasks = aiAgents.reduce((sum, agent) => sum + agent.tasksCompleted, 0);
  const activeAgents = aiAgents.filter(agent => agent.status === 'active').length;
  const avgConfidence = Math.round(aiAgents.reduce((sum, agent) => sum + agent.confidence, 0) / aiAgents.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Agents</h1>
          <p className="text-muted-foreground">Monitor and manage intelligent automation agents</p>
        </div>
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-muted-foreground">3 Active Agents</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">Completed this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAgents}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgConfidence}%</div>
            <p className="text-xs text-muted-foreground">+2% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Excellent</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Agent Overview</TabsTrigger>
          <TabsTrigger value="details">Agent Details</TabsTrigger>
        </TabsList>

        {/* Agent Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              Three specialized AI agents work together to optimize society management operations.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6">
            {aiAgents.map((agent) => (
              <Card key={agent.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <Bot className="h-6 w-6 text-blue-600" />
                          <h3 className="text-xl font-semibold">{agent.name}</h3>
                        </div>
                        <Badge className={getStatusColor(agent.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(agent.status)}
                            <span className="capitalize">{agent.status}</span>
                          </div>
                        </Badge>
                        <div className="flex items-center gap-1 text-sm">
                          <Brain className="h-4 w-4" />
                          <span>{agent.confidence}% confidence</span>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{agent.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">Performance Metrics</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Accuracy</span>
                                <span>{agent.performance.accuracy}%</span>
                              </div>
                              <Progress value={agent.performance.accuracy} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Speed</span>
                                <span>{agent.performance.speed}%</span>
                              </div>
                              <Progress value={agent.performance.speed} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Efficiency</span>
                                <span>{agent.performance.efficiency}%</span>
                              </div>
                              <Progress value={agent.performance.efficiency} className="h-2" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">Specializations</h4>
                          <div className="space-y-2">
                            {agent.specializations.map((spec, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <Sparkles className="h-3 w-3 text-blue-600" />
                                <span>{spec}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">Activity Stats</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Tasks Completed:</span>
                              <span className="font-medium">{agent.tasksCompleted}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>In Progress:</span>
                              <span className="font-medium">{agent.tasksInProgress}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Last Activity:</span>
                              <span className="font-medium">{agent.lastActivity}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-6 pt-4 border-t">
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => handleAgentControl(agent.id, 'start')}
                            disabled={agent.status === 'active'}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Start
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => handleAgentControl(agent.id, 'pause')}
                            disabled={agent.status !== 'active'}
                          >
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => handleAgentControl(agent.id, 'restart')}
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Restart
                          </Button>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => setSelectedAgent(agent.id)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Agent Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid gap-6">
            {aiAgents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">Recent Actions & Performance</p>
                    </div>
                    <Badge className={getStatusColor(agent.status)}>
                      {agent.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">Recent Actions</h4>
                      <div className="space-y-3">
                        {agent.recentActions.map((action) => (
                          <div key={action.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className={`rounded-full p-1 ${
                              action.result === 'success' ? 'bg-green-100' :
                              action.result === 'pending' ? 'bg-yellow-100' :
                              'bg-red-100'
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                action.result === 'success' ? 'bg-green-600' :
                                action.result === 'pending' ? 'bg-yellow-600' :
                                'bg-red-600'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">{action.action}</span>
                                <Badge className={getResultColor(action.result)}>
                                  {action.result}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{action.details}</p>
                              <p className="text-xs text-muted-foreground mt-1">{action.timestamp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 