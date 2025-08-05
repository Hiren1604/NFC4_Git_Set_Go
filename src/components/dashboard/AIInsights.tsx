import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Bot,
  Brain,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Clock,
  Activity,
  Target,
  Zap,
  Eye,
  BarChart3,
  Calendar,
  Users,
  DollarSign,
  Shield,
  Wrench,
  FileText,
  MessageSquare,
  Bell,
  Star,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface AIInsight {
  id: string;
  type: 'decision' | 'pattern' | 'optimization' | 'alert';
  title: string;
  description: string;
  agent: string;
  timestamp: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  status: 'active' | 'implemented' | 'pending' | 'expired';
  metrics?: {
    before: number;
    after: number;
    unit: string;
  };
  relatedIssues?: string[];
}

export function AIInsights() {
  const [selectedTab, setSelectedTab] = useState("recent");

  // Mock AI insights data
  const aiInsights: AIInsight[] = [
    {
      id: "1",
      type: "decision",
      title: "Elevated Water Leakage Priority",
      description: "AI Priority Agent identified water leakage as URGENT due to safety hazards and potential vehicle damage. Issue moved to top of queue.",
      agent: "Priority Agent",
      timestamp: "2 minutes ago",
      impact: "high",
      confidence: 95,
      status: "active",
      metrics: {
        before: 3,
        after: 1,
        unit: "queue position"
      },
      relatedIssues: ["ISS-001"]
    },
    {
      id: "2",
      type: "pattern",
      title: "Electrical Issues Pattern Detected",
      description: "AI Analytics Agent identified 3 electrical issues in Tower A this week, suggesting potential infrastructure problems.",
      agent: "Analytics Agent",
      timestamp: "15 minutes ago",
      impact: "medium",
      confidence: 87,
      status: "active",
      metrics: {
        before: 1,
        after: 3,
        unit: "issues this week"
      },
      relatedIssues: ["ISS-002", "ISS-005", "ISS-008"]
    },
    {
      id: "3",
      type: "optimization",
      title: "Technician Route Optimization",
      description: "AI Delegation Agent optimized Alex Kumar's route, reducing travel time by 15 minutes for better efficiency.",
      agent: "Delegation Agent",
      timestamp: "1 hour ago",
      impact: "medium",
      confidence: 92,
      status: "implemented",
      metrics: {
        before: 45,
        after: 30,
        unit: "minutes"
      }
    },
    {
      id: "4",
      type: "alert",
      title: "Duplicate Payment Detected",
      description: "AI Billing Agent detected duplicate payment in maintenance bill for A-501, flagged for admin review.",
      agent: "Billing Agent",
      timestamp: "1 hour ago",
      impact: "high",
      confidence: 88,
      status: "pending",
      relatedIssues: ["BILL-003"]
    },
    {
      id: "5",
      type: "pattern",
      title: "Peak Maintenance Hours",
      description: "AI Analytics Agent identified 2-4 PM as peak maintenance request hours, suggesting optimal technician scheduling.",
      agent: "Analytics Agent",
      timestamp: "3 hours ago",
      impact: "medium",
      confidence: 85,
      status: "active",
      metrics: {
        before: 0,
        after: 15,
        unit: "requests per hour"
      }
    },
    {
      id: "6",
      type: "optimization",
      title: "Cost Reduction Opportunity",
      description: "AI Billing Agent analyzed billing patterns and identified 3% cost reduction opportunity in Tower B maintenance.",
      agent: "Billing Agent",
      timestamp: "4 hours ago",
      impact: "medium",
      confidence: 90,
      status: "pending",
      metrics: {
        before: 100,
        after: 97,
        unit: "% of current cost"
      }
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "decision": return "bg-blue-100 text-blue-800";
      case "pattern": return "bg-purple-100 text-purple-800";
      case "optimization": return "bg-green-100 text-green-800";
      case "alert": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "implemented": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "expired": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "decision": return <Target className="h-4 w-4" />;
      case "pattern": return <TrendingUp className="h-4 w-4" />;
      case "optimization": return <Zap className="h-4 w-4" />;
      case "alert": return <AlertTriangle className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const recentInsights = aiInsights.filter(insight => insight.status === 'active' || insight.status === 'pending');
  const implementedInsights = aiInsights.filter(insight => insight.status === 'implemented');
  const highImpactInsights = aiInsights.filter(insight => insight.impact === 'high');

  const totalInsights = aiInsights.length;
  const activeInsights = recentInsights.length;
  const avgConfidence = Math.round(aiInsights.reduce((sum, insight) => sum + insight.confidence, 0) / aiInsights.length);
  const highImpactCount = highImpactInsights.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Insights</h1>
          <p className="text-muted-foreground">Recent AI decisions and intelligent recommendations</p>
        </div>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-muted-foreground">Live AI Intelligence</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Insights</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInsights}</div>
            <p className="text-xs text-muted-foreground">Generated this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Insights</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeInsights}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Impact</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highImpactCount}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgConfidence}%</div>
            <p className="text-xs text-muted-foreground">+3% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent">Recent Insights</TabsTrigger>
          <TabsTrigger value="implemented">Implemented</TabsTrigger>
          <TabsTrigger value="high-impact">High Impact</TabsTrigger>
        </TabsList>

        {/* Recent Insights Tab */}
        <TabsContent value="recent" className="space-y-4">
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              AI agents continuously analyze data to provide intelligent insights and recommendations.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {recentInsights.map((insight) => (
              <Card key={insight.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(insight.type)}
                          <span className="font-medium">{insight.agent}</span>
                        </div>
                        <Badge className={getTypeColor(insight.type)}>
                          {insight.type}
                        </Badge>
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact} impact
                        </Badge>
                        <Badge className={getStatusColor(insight.status)}>
                          {insight.status}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm">
                          <Brain className="h-4 w-4" />
                          <span>{insight.confidence}% confidence</span>
                        </div>
                      </div>

                      <h3 className="font-semibold text-lg mb-2">{insight.title}</h3>
                      <p className="text-muted-foreground mb-4">{insight.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">Impact Analysis</h4>
                          {insight.metrics && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <ArrowDown className="h-4 w-4 text-red-600" />
                                  <span className="text-sm">Before</span>
                                </div>
                                <span className="font-medium">{insight.metrics.before} {insight.metrics.unit}</span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <ArrowUp className="h-4 w-4 text-green-600" />
                                  <span className="text-sm">After</span>
                                </div>
                                <span className="font-medium">{insight.metrics.after} {insight.metrics.unit}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Agent:</span>
                              <span className="font-medium">{insight.agent}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Timestamp:</span>
                              <span className="font-medium">{insight.timestamp}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Confidence:</span>
                              <span className="font-medium">{insight.confidence}%</span>
                            </div>
                            {insight.relatedIssues && (
                              <div>
                                <span className="block mb-1">Related Issues:</span>
                                <div className="flex gap-1">
                                  {insight.relatedIssues.map((issue, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {issue}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{insight.timestamp}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bot className="h-4 w-4" />
                            <span>{insight.agent}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button size="sm">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Implement
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Implemented Tab */}
        <TabsContent value="implemented" className="space-y-4">
          <div className="space-y-4">
            {implementedInsights.map((insight) => (
              <Card key={insight.id} className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{insight.title}</h3>
                        <Badge className={getTypeColor(insight.type)}>
                          {insight.type}
                        </Badge>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Implemented
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                        <span>{insight.agent}</span>
                        <span>{insight.timestamp}</span>
                        <span>{insight.confidence}% confidence</span>
                      </div>
                    </div>
                    {insight.metrics && (
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {insight.metrics.before} → {insight.metrics.after}
                        </div>
                        <div className="text-xs text-muted-foreground">{insight.metrics.unit}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* High Impact Tab */}
        <TabsContent value="high-impact" className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              High-impact insights require immediate attention and may affect multiple residents or critical systems.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {highImpactInsights.map((insight) => (
              <Card key={insight.id} className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          <span className="font-medium">{insight.agent}</span>
                        </div>
                        <Badge className={getTypeColor(insight.type)}>
                          {insight.type}
                        </Badge>
                        <Badge className="bg-red-100 text-red-800">
                          HIGH IMPACT
                        </Badge>
                        <Badge className={getStatusColor(insight.status)}>
                          {insight.status}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-lg mb-2">{insight.title}</h3>
                      <p className="text-muted-foreground mb-4">{insight.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{insight.timestamp}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Brain className="h-4 w-4" />
                            <span>{insight.confidence}% confidence</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Take Action
                          </Button>
                        </div>
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