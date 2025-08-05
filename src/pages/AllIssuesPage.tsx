import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Search,
  Filter,
  MapPin,
  Clock,
  User,
  Calendar,
  Camera,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Timer,
  BarChart3,
  Download,
  Plus,
} from "lucide-react";

export default function AllIssuesPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Mock data
  const issues = [
    {
      id: "ISS-001",
      title: "Water leakage in bathroom",
      description: "Severe water leak from the main pipe in master bathroom causing flooding",
      reporter: "John Doe",
      reporterFlat: "A-501",
      category: "Plumbing",
      priority: "urgent",
      status: "in-progress",
      assignedTo: "Alex Wilson",
      assignedToRole: "Plumber",
      createdAt: "2024-01-10T09:30:00Z",
      updatedAt: "2024-01-10T14:20:00Z",
      location: "Building A, Floor 5",
      estimatedTime: "4 hours",
      photos: 3,
      comments: 5,
    },
    {
      id: "ISS-002", 
      title: "Elevator not working",
      description: "Main elevator in Building B is stuck between floors 3 and 4",
      reporter: "Jane Smith",
      reporterFlat: "B-304",
      category: "Mechanical",
      priority: "high",
      status: "assigned",
      assignedTo: "Mike Johnson",
      assignedToRole: "Maintenance",
      createdAt: "2024-01-09T16:45:00Z",
      updatedAt: "2024-01-10T08:15:00Z",
      location: "Building B, Elevator 1",
      estimatedTime: "6 hours",
      photos: 2,
      comments: 3,
    },
    {
      id: "ISS-003",
      title: "Street light not working",
      description: "Street light near parking area has been flickering and now completely off",
      reporter: "Robert Brown", 
      reporterFlat: "C-201",
      category: "Electrical",
      priority: "medium",
      status: "resolved",
      assignedTo: "Sarah Davis",
      assignedToRole: "Electrician",
      createdAt: "2024-01-08T20:15:00Z",
      updatedAt: "2024-01-09T11:30:00Z",
      location: "Parking Area - Section C",
      estimatedTime: "2 hours",
      photos: 1,
      comments: 2,
    },
    {
      id: "ISS-004",
      title: "Noise complaint from neighbor",
      description: "Loud music playing from apartment above during night hours",
      reporter: "Lisa Wilson",
      reporterFlat: "A-201",
      category: "Noise",
      priority: "low",
      status: "pending",
      assignedTo: null,
      assignedToRole: null,
      createdAt: "2024-01-10T22:30:00Z",
      updatedAt: "2024-01-10T22:30:00Z",
      location: "Building A, Floor 2",
      estimatedTime: "1 hour",
      photos: 0,
      comments: 1,
    },
    {
      id: "ISS-005",
      title: "AC not cooling properly",
      description: "Air conditioning unit in living room making strange noises and not cooling",
      reporter: "David Miller",
      reporterFlat: "B-405",
      category: "HVAC",
      priority: "medium",
      status: "in-progress", 
      assignedTo: "Tom Anderson",
      assignedToRole: "HVAC Specialist",
      createdAt: "2024-01-10T11:20:00Z",
      updatedAt: "2024-01-10T15:45:00Z",
      location: "Building B, Floor 4",
      estimatedTime: "3 hours",
      photos: 2,
      comments: 4,
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-status-pending text-status-pending-foreground";
      case "assigned": return "bg-status-progress text-status-progress-foreground";
      case "in-progress": return "bg-status-progress text-status-progress-foreground";
      case "resolved": return "bg-status-resolved text-status-resolved-foreground";
      case "closed": return "bg-secondary text-secondary-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "text-status-urgent bg-status-urgent/10 border-status-urgent";
      case "high": return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium": return "text-status-progress bg-status-progress/10 border-status-progress";
      case "low": return "text-status-resolved bg-status-resolved/10 border-status-resolved";
      default: return "text-text-secondary bg-secondary/10 border-border";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Plumbing": return "🔧";
      case "Electrical": return "⚡";
      case "Mechanical": return "🏗️";
      case "HVAC": return "❄️";
      case "Noise": return "🔊";
      default: return "📋";
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const getIssuesByStatus = (status: string) => {
    if (status === "all") return filteredIssues;
    return filteredIssues.filter(issue => issue.status === status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">All Issues</h1>
          <p className="text-text-secondary">Manage and track all society issues</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4" />
            Create Issue
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
                <Input
                  placeholder="Search issues by title, description, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-text-primary">{issues.length}</div>
            <div className="text-sm text-text-secondary">Total Issues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-status-pending">{issues.filter(i => i.status === 'pending').length}</div>
            <div className="text-sm text-text-secondary">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-status-progress">{issues.filter(i => i.status === 'in-progress').length}</div>
            <div className="text-sm text-text-secondary">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-status-resolved">{issues.filter(i => i.status === 'resolved').length}</div>
            <div className="text-sm text-text-secondary">Resolved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-status-urgent">{issues.filter(i => i.priority === 'urgent').length}</div>
            <div className="text-sm text-text-secondary">Urgent</div>
          </CardContent>
        </Card>
      </div>

      {/* Issues Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({filteredIssues.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({getIssuesByStatus('pending').length})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({getIssuesByStatus('in-progress').length})</TabsTrigger>
          <TabsTrigger value="assigned">Assigned ({getIssuesByStatus('assigned').length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({getIssuesByStatus('resolved').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {getIssuesByStatus(selectedTab).map((issue) => (
            <Card key={issue.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getCategoryIcon(issue.category)}</span>
                      <div>
                        <h3 className="font-semibold text-lg text-text-primary">{issue.title}</h3>
                        <p className="text-sm text-text-secondary">#{issue.id} • {issue.category}</p>
                      </div>
                    </div>
                    <p className="text-text-secondary mb-3 text-sm leading-relaxed">{issue.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <Badge className={getStatusColor(issue.status)}>
                      {issue.status}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(issue.priority)}>
                      {issue.priority}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-text-muted" />
                    <span className="text-text-secondary">Reporter:</span>
                    <span className="font-medium">{issue.reporter}</span>
                    <span className="text-text-muted">({issue.reporterFlat})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-text-muted" />
                    <span className="text-text-secondary">Location:</span>
                    <span className="font-medium">{issue.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-text-muted" />
                    <span className="text-text-secondary">Est. Time:</span>
                    <span className="font-medium">{issue.estimatedTime}</span>
                  </div>
                </div>

                {issue.assignedTo && (
                  <div className="flex items-center gap-3 mb-4 p-3 bg-background-secondary rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{issue.assignedTo.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">Assigned to: {issue.assignedTo}</p>
                      <p className="text-xs text-text-secondary">{issue.assignedToRole}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Created: {formatDate(issue.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Updated: {formatDate(issue.updatedAt)}
                    </div>
                    {issue.photos > 0 && (
                      <div className="flex items-center gap-1">
                        <Camera className="h-4 w-4" />
                        {issue.photos} photos
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {issue.comments} comments
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    {issue.status === "pending" && (
                      <Button size="sm">
                        Assign
                      </Button>
                    )}
                    {issue.status === "in-progress" && (
                      <Button size="sm" className="bg-status-resolved">
                        <CheckCircle className="h-4 w-4" />
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {getIssuesByStatus(selectedTab).length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-text-muted mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No issues found</h3>
                <p className="text-text-secondary">
                  {searchQuery || statusFilter !== "all" || priorityFilter !== "all" 
                    ? "Try adjusting your filters" 
                    : "No issues have been reported yet"
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}