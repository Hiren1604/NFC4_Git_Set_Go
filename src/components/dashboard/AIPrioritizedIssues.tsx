import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Bot,
  Eye,
  MessageSquare,
  MapPin,
  User,
  Calendar,
  TrendingUp,
  TrendingDown,
  Zap,
  Lightbulb,
  Brain,
  Sparkles,
} from "lucide-react";

interface AIPrioritizedIssue {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  reporter: {
    name: string;
    avatar: string;
    flatNumber: string;
  };
  location: string;
  createdAt: string;
  aiConfidence: number;
  aiReasoning: string;
  aiAgent: string;
  status: 'pending' | 'approved' | 'rejected';
  estimatedTime: string;
  estimatedCost: number;
  suggestedTechnician?: {
    name: string;
    specialization: string;
    rating: number;
  };
}

export function AIPrioritizedIssues() {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [selectedIssue, setSelectedIssue] = useState<AIPrioritizedIssue | null>(null);

  // Mock AI-prioritized issues data
  const aiIssues: AIPrioritizedIssue[] = [
    {
      id: "AI-001",
      title: "Water leakage in basement parking",
      description: "Significant water leak near parking slot B-15. Water accumulating and might damage vehicles.",
      priority: "urgent",
      category: "plumbing",
      reporter: {
        name: "Sarah Johnson",
        avatar: "",
        flatNumber: "A-501"
      },
      location: "Basement Parking - B Block",
      createdAt: "2024-01-15T10:30:00Z",
      aiConfidence: 95,
      aiReasoning: "High priority due to: 1) Potential vehicle damage 2) Safety hazard 3) Water damage to infrastructure 4) Multiple residents affected",
      aiAgent: "PriorityAI",
      status: "pending",
      estimatedTime: "2-3 hours",
      estimatedCost: 2500,
      suggestedTechnician: {
        name: "Mike Johnson",
        specialization: "Plumbing",
        rating: 4.8
      }
    },
    {
      id: "AI-002",
      title: "Elevator malfunction in Tower B",
      description: "Main elevator in Tower B out of service. Elderly residents facing difficulty.",
      priority: "high",
      category: "elevator",
      reporter: {
        name: "Raj Patel",
        avatar: "",
        flatNumber: "B-1203"
      },
      location: "Tower B - Ground Floor",
      createdAt: "2024-01-15T09:15:00Z",
      aiConfidence: 88,
      aiReasoning: "Medium-high priority: 1) Accessibility issue for elderly 2) Multiple residents affected 3) Safety concern 4) High usage area",
      aiAgent: "AccessibilityAI",
      status: "pending",
      estimatedTime: "4-6 hours",
      estimatedCost: 5000,
      suggestedTechnician: {
        name: "Alex Kumar",
        specialization: "Elevator",
        rating: 4.6
      }
    },
    {
      id: "AI-003",
      title: "Broken street light near gate",
      description: "Street light near main gate not working. Security monitoring compromised.",
      priority: "medium",
      category: "electrical",
      reporter: {
        name: "Security Team",
        avatar: "",
        flatNumber: "Security"
      },
      location: "Main Gate Area",
      createdAt: "2024-01-15T08:45:00Z",
      aiConfidence: 92,
      aiReasoning: "Medium priority: 1) Security concern 2) Limited area impact 3) Standard electrical issue 4) Quick fix possible",
      aiAgent: "SecurityAI",
      status: "approved",
      estimatedTime: "1-2 hours",
      estimatedCost: 1200,
      suggestedTechnician: {
        name: "Sarah Chen",
        specialization: "Electrical",
        rating: 4.9
      }
    },
    {
      id: "AI-004",
      title: "Garbage chute blockage",
      description: "Garbage chute in Tower A blocked. Waste accumulating on floors.",
      priority: "medium",
      category: "maintenance",
      reporter: {
        name: "Lisa Wang",
        avatar: "",
        flatNumber: "A-302"
      },
      location: "Tower A - All Floors",
      createdAt: "2024-01-15T07:30:00Z",
      aiConfidence: 85,
      aiReasoning: "Medium priority: 1) Hygiene concern 2) Multiple floors affected 3) Standard maintenance issue 4) Quick resolution possible",
      aiAgent: "MaintenanceAI",
      status: "rejected",
      estimatedTime: "2-3 hours",
      estimatedCost: 1800,
      suggestedTechnician: {
        name: "Rajesh Kumar",
        specialization: "General Maintenance",
        rating: 4.7
      }
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const handleApprove = (issueId: string) => {
    console.log("Approved issue:", issueId);
    // Add API call here
  };

  const handleReject = (issueId: string) => {
    console.log("Rejected issue:", issueId);
    // Add API call here
  };

  const pendingIssues = aiIssues.filter(issue => issue.status === "pending");
  const approvedIssues = aiIssues.filter(issue => issue.status === "approved");
  const rejectedIssues = aiIssues.filter(issue => issue.status === "rejected");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI-Prioritized Issues</h1>
          <p className="text-muted-foreground">Review and approve AI-suggested issue priorities</p>
        </div>
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-muted-foreground">AI Agent Recommendations</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingIssues.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedIssues.length}</div>
            <p className="text-xs text-muted-foreground">+2 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedIssues.length}</div>
            <p className="text-xs text-muted-foreground">-1 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg AI Confidence</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">90%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        {/* Pending Review Tab */}
        <TabsContent value="pending" className="space-y-4">
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              AI agents have analyzed and prioritized these issues. Review and approve or reject based on your assessment.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {pendingIssues.map((issue) => (
              <Card key={issue.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <Bot className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">{issue.aiAgent}</span>
                        </div>
                        <Badge className={getPriorityColor(issue.priority)}>
                          {issue.priority}
                        </Badge>
                        <div className={`font-medium ${getConfidenceColor(issue.aiConfidence)}`}>
                          {issue.aiConfidence}% confidence
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{issue.title}</h3>
                          <p className="text-muted-foreground mb-4">{issue.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{issue.reporter.name} ({issue.reporter.flatNumber})</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{issue.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">AI Analysis</h4>
                          <div className="p-3 bg-blue-50 rounded-lg mb-4">
                            <p className="text-sm text-blue-800">{issue.aiReasoning}</p>
                          </div>
                          
                          {issue.suggestedTechnician && (
                            <div>
                              <h4 className="font-medium mb-2">Suggested Technician</h4>
                              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{issue.suggestedTechnician.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{issue.suggestedTechnician.name}</div>
                                  <div className="text-sm text-muted-foreground">{issue.suggestedTechnician.specialization}</div>
                                  <div className="flex items-center gap-1 text-sm">
                                    <span>★</span>
                                    <span>{issue.suggestedTechnician.rating}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Est. Time: {issue.estimatedTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>₹</span>
                            <span>Est. Cost: ₹{issue.estimatedCost}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <Button 
                            onClick={() => handleApprove(issue.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleReject(issue.id)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
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

        {/* Approved Tab */}
        <TabsContent value="approved" className="space-y-4">
          <div className="space-y-4">
            {approvedIssues.map((issue) => (
              <Card key={issue.id} className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{issue.title}</h3>
                        <Badge className={getPriorityColor(issue.priority)}>
                          {issue.priority}
                        </Badge>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Approved
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{issue.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                        <span>{issue.reporter.name}</span>
                        <span>{issue.location}</span>
                        <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">₹{issue.estimatedCost}</div>
                      <div className="text-xs text-muted-foreground">{issue.estimatedTime}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Rejected Tab */}
        <TabsContent value="rejected" className="space-y-4">
          <div className="space-y-4">
            {rejectedIssues.map((issue) => (
              <Card key={issue.id} className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{issue.title}</h3>
                        <Badge className={getPriorityColor(issue.priority)}>
                          {issue.priority}
                        </Badge>
                        <Badge variant="destructive">
                          Rejected
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{issue.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                        <span>{issue.reporter.name}</span>
                        <span>{issue.location}</span>
                        <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">₹{issue.estimatedCost}</div>
                      <div className="text-xs text-muted-foreground">{issue.estimatedTime}</div>
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