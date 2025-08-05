import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Bell,
  Eye,
  MessageSquare,
  Star,
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wrench,
  Bot,
  Filter,
  Search,
  ArrowLeft,
  Calendar,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export default function MyIssuesPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data with AI-determined priorities
  const issues = [
    {
      id: 1,
      title: "Water leakage in bathroom",
      description: "Severe water leakage from the ceiling in master bathroom, causing damage to walls and floor",
      status: "in-progress",
      priority: "urgent", // AI determined
      aiPriority: "urgent",
      aiReason: "Water damage can cause structural issues and mold growth",
      category: "plumbing",
      date: "2024-01-10",
      assignedTo: {
        name: "John Plumber",
        phone: "+91 98765 43210",
        email: "john.plumber@societyhub.com",
        specialization: "Plumbing",
        rating: 4.8,
        avatar: "/placeholder.svg",
        availability: "Available",
        estimatedCompletion: "2-3 hours"
      },
      updates: [
        { 
          date: "2024-01-10 09:30", 
          message: "Issue reported and AI assigned urgent priority", 
          status: "reported",
          aiAnalysis: "Water damage detected - immediate attention required"
        },
        { 
          date: "2024-01-10 10:15", 
          message: "Technician John Plumber assigned", 
          status: "assigned",
          technician: "John Plumber"
        },
        { 
          date: "2024-01-10 11:00", 
          message: "Technician arrived and started assessment", 
          status: "in-progress",
          technician: "John Plumber"
        },
      ],
      photo: "/placeholder.svg",
      location: "Flat A-501, Master Bathroom",
      estimatedCost: "₹2,500 - ₹3,500",
      impact: "High - Structural damage risk"
    },
    {
      id: 2,
      title: "Elevator not working",
      description: "Elevator stuck between 3rd and 4th floor, residents trapped",
      status: "resolved",
      priority: "urgent", // AI determined
      aiPriority: "urgent",
      aiReason: "Safety issue with residents potentially trapped",
      category: "electrical",
      date: "2024-01-08",
      assignedTo: {
        name: "Mike Technician",
        phone: "+91 98765 43211",
        email: "mike.tech@societyhub.com",
        specialization: "Electrical",
        rating: 4.9,
        avatar: "/placeholder.svg",
        availability: "Available",
        estimatedCompletion: "1-2 hours"
      },
      updates: [
        { 
          date: "2024-01-08 14:30", 
          message: "Emergency reported - AI flagged as urgent safety issue", 
          status: "reported",
          aiAnalysis: "Safety critical - immediate response required"
        },
        { 
          date: "2024-01-08 14:45", 
          message: "Technician Mike Technician dispatched immediately", 
          status: "assigned",
          technician: "Mike Technician"
        },
        { 
          date: "2024-01-08 15:15", 
          message: "Issue resolved - elevator operational", 
          status: "resolved",
          technician: "Mike Technician"
        },
      ],
      photo: "/placeholder.svg",
      location: "Building A, Elevator 1",
      estimatedCost: "₹1,500 - ₹2,000",
      impact: "Critical - Safety issue"
    },
    {
      id: 3,
      title: "Broken window lock",
      description: "Window lock in living room is broken, security concern",
      status: "pending",
      priority: "medium", // AI determined
      aiPriority: "medium",
      aiReason: "Security concern but not immediately dangerous",
      category: "carpentry",
      date: "2024-01-15",
      assignedTo: {
        name: "Pending Assignment",
        phone: "",
        email: "",
        specialization: "",
        rating: 0,
        avatar: "/placeholder.svg",
        availability: "Pending",
        estimatedCompletion: "24-48 hours"
      },
      updates: [
        { 
          date: "2024-01-15 16:00", 
          message: "Issue reported - AI assigned medium priority", 
          status: "reported",
          aiAnalysis: "Security concern - schedule within 24-48 hours"
        },
      ],
      photo: "/placeholder.svg",
      location: "Flat A-501, Living Room",
      estimatedCost: "₹800 - ₹1,200",
      impact: "Medium - Security concern"
    },
    {
      id: 4,
      title: "AC not cooling properly",
      description: "Air conditioner not providing adequate cooling in bedroom",
      status: "in-progress",
      priority: "high", // AI determined
      aiPriority: "high",
      aiReason: "Comfort issue affecting daily life in hot weather",
      category: "electrical",
      date: "2024-01-12",
      assignedTo: {
        name: "Sarah AC Tech",
        phone: "+91 98765 43212",
        email: "sarah.ac@societyhub.com",
        specialization: "HVAC",
        rating: 4.7,
        avatar: "/placeholder.svg",
        availability: "Available",
        estimatedCompletion: "1-2 hours"
      },
      updates: [
        { 
          date: "2024-01-12 10:00", 
          message: "Issue reported - AI assigned high priority", 
          status: "reported",
          aiAnalysis: "Comfort issue - schedule within 4-6 hours"
        },
        { 
          date: "2024-01-12 14:00", 
          message: "Technician Sarah AC Tech assigned", 
          status: "assigned",
          technician: "Sarah AC Tech"
        },
        { 
          date: "2024-01-12 15:30", 
          message: "Technician arrived and diagnosing issue", 
          status: "in-progress",
          technician: "Sarah AC Tech"
        },
      ],
      photo: "/placeholder.svg",
      location: "Flat A-501, Master Bedroom",
      estimatedCost: "₹1,200 - ₹1,800",
      impact: "High - Comfort issue"
    },
  ];



  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "text-red-600 bg-red-50";
      case "high": return "text-orange-600 bg-orange-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent": return <AlertTriangle className="h-4 w-4" />;
      case "high": return <TrendingUp className="h-4 w-4" />;
      case "medium": return <Clock className="h-4 w-4" />;
      case "low": return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredIssues = issues.filter(issue => {
    if (selectedTab !== "all" && issue.status !== selectedTab) return false;
    if (filterStatus !== "all" && issue.status !== filterStatus) return false;
    if (filterPriority !== "all" && issue.priority !== filterPriority) return false;
    if (searchQuery && !issue.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Issues</h1>
          <p className="text-muted-foreground">AI-prioritized issues and updates</p>
        </div>
        <Button variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-48">
                  <Input
                    placeholder="Search issues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Issues List */}
          <div className="space-y-4">
            {sortedIssues.map((issue) => (
              <Card key={issue.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                        <img src={issue.photo} alt="Issue" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{issue.title}</h3>
                          <Badge className={getStatusColor(issue.status)}>
                            {issue.status}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(issue.priority)}>
                            <div className="flex items-center gap-1">
                              {getPriorityIcon(issue.priority)}
                              {issue.priority}
                            </div>
                          </Badge>
                          {issue.aiPriority && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              <Bot className="h-3 w-3 mr-1" />
                              AI Priority
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-2">{issue.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {issue.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {issue.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {issue.assignedTo.name}
                          </span>
                        </div>
                        
                        {/* AI Analysis */}
                        {issue.aiReason && (
                          <Alert className="mb-3">
                            <Bot className="h-4 w-4" />
                            <AlertDescription>
                              <strong>AI Analysis:</strong> {issue.aiReason}
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* Technician Info */}
                        {issue.assignedTo.name !== "Pending Assignment" && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={issue.assignedTo.avatar} />
                                <AvatarFallback>{issue.assignedTo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{issue.assignedTo.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {issue.assignedTo.specialization}
                                  </Badge>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-500" />
                                    <span className="text-xs">{issue.assignedTo.rating}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {issue.assignedTo.phone}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Est: {issue.assignedTo.estimatedCompletion}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-3">Timeline</h4>
                    <div className="space-y-2">
                      {issue.updates.map((update, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-muted-foreground">{update.date}</span>
                              <span>{update.message}</span>
                              <Badge variant="outline" className="text-xs">
                                {update.status}
                              </Badge>
                            </div>
                            {update.aiAnalysis && (
                              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                                <Bot className="h-3 w-3 inline mr-1" />
                                AI: {update.aiAnalysis}
                              </div>
                            )}
                            {update.technician && (
                              <div className="text-xs text-green-600 bg-green-50 p-2 rounded mt-1">
                                <User className="h-3 w-3 inline mr-1" />
                                Technician: {update.technician}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
  );
} 