import { useState } from "react";
import { StatsCard } from "./StatsCard";
import { IssueCard } from "./IssueCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "lucide-react";

// Mock data
const mockIssues = [
  {
    id: "ISS-001",
    title: "Water leakage in basement parking",
    description: "There's a significant water leak near parking slot B-15. The water is accumulating and might damage vehicles.",
    status: "new" as const,
    priority: "urgent" as const,
    category: "water" as const,
    reporter: {
      name: "Sarah Johnson",
      avatar: "",
      flatNumber: "A-501"
    },
    location: "Basement Parking - B Block",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    hasMedia: true,
    commentsCount: 0
  },
  {
    id: "ISS-002", 
    title: "Elevator not working in Tower B",
    description: "The main elevator in Tower B has been out of service since yesterday. Residents are facing difficulty, especially elderly people.",
    status: "assigned" as const,
    priority: "high" as const,
    category: "elevator" as const,
    reporter: {
      name: "Raj Patel",
      avatar: "",
      flatNumber: "B-1203"
    },
    assignedTo: {
      name: "Mike Wilson",
      avatar: ""
    },
    location: "Tower B - Ground Floor",
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    hasMedia: false,
    commentsCount: 3
  },
  {
    id: "ISS-003",
    title: "Broken street light near gate",
    description: "The street light near the main gate is not working, making it difficult for security to monitor the area at night.",
    status: "in-progress" as const,
    priority: "medium" as const,
    category: "electrical" as const,
    reporter: {
      name: "Security Team",
      avatar: "",
      flatNumber: "Security"
    },
    assignedTo: {
      name: "Alex Kumar",
      avatar: ""
    },
    location: "Main Gate Area",
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    hasMedia: true,
    commentsCount: 5
  }
];

const agentActivities = [
  {
    id: "1",
    agent: "Assignment Agent",
    action: "Auto-assigned water leakage issue to nearest plumber",
    timestamp: "2 minutes ago",
    confidence: 95,
    status: "success"
  },
  {
    id: "2", 
    agent: "Analytics Agent",
    action: "Identified pattern: 3 electrical issues in Tower A this week",
    timestamp: "15 minutes ago",
    confidence: 87,
    status: "insight"
  },
  {
    id: "3",
    agent: "Follow-up Agent", 
    action: "Sent reminder to technician for overdue elevator repair",
    timestamp: "1 hour ago",
    confidence: 100,
    status: "action"
  }
];

export function AdminDashboard() {
  const [selectedIssue, setSelectedIssue] = useState<any>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-text-muted">Manage your society with AI-powered insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4" />
            Generate Report
          </Button>
          <Button size="sm">
            <Bot className="h-4 w-4" />
            AI Insights
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Issues"
          value="47"
          change={{ value: 12, type: "increase" }}
          icon={FileText}
          variant="default"
        />
        <StatsCard
          title="Pending Issues"
          value="12"
          change={{ value: 5, type: "decrease" }}
          icon={Clock}
          variant="pending"
        />
        <StatsCard
          title="Active Technicians"
          value="8"
          icon={Users}
          variant="progress"
        />
        <StatsCard
          title="Resolved Today"
          value="6"
          change={{ value: 25, type: "increase" }}
          icon={CheckCircle}
          variant="resolved"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Issues */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Issues</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
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

        {/* AI Agents Activity */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">AI Agents Activity</h2>
            <Badge variant="resolved" className="animate-pulse">Live</Badge>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Real-time Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {agentActivities.map((activity) => (
                <div key={activity.id} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className={`rounded-full p-1 ${
                      activity.status === 'success' ? 'bg-status-resolved-light' :
                      activity.status === 'insight' ? 'bg-status-progress-light' :
                      'bg-status-pending-light'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-status-resolved' :
                        activity.status === 'insight' ? 'bg-status-progress' :
                        'bg-status-pending'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{activity.agent}</span>
                        <Badge variant="outline" className="text-xs">
                          {activity.confidence}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-text-secondary">{activity.action}</p>
                      <p className="text-xs text-text-muted mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Wrench className="h-4 w-4" />
                Assign Technician
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="h-4 w-4" />
                Escalate Issue
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4" />
                View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Zap className="h-4 w-4" />
                Trigger AI Analysis
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}