import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Wrench,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Plus,
  Filter,
  Search,
  Eye,
  MessageSquare,
  Bot,
  Camera,
  Upload,
  Settings,
  TrendingUp,
  TrendingDown,
  Shield,
  Zap,
  Target,
  Users,
  Activity,
  Award,
  Briefcase,
  Tool,
  HardHat,
  Cog,
  Check,
  Ban,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Brain,
  Sparkles,
} from "lucide-react";

interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: number;
  rating: number;
  status: 'available' | 'busy' | 'offline';
  location: string;
  hourlyRate: number;
  skills: string[];
  avatar: string;
  completedJobs: number;
  activeJobs: number;
}

interface AISuggestion {
  id: string;
  issueId: string;
  issueTitle: string;
  issueDescription: string;
  suggestedTechnician: Technician;
  confidence: number;
  reasoning: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  aiAgent: string;
}

export function TechniciansPage() {
  const [selectedTab, setSelectedTab] = useState("technicians");
  const [showAddTechnicianModal, setShowAddTechnicianModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSpecialization, setFilterSpecialization] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock technicians data
  const technicians: Technician[] = [
    {
      id: "1",
      name: "Mike Johnson",
      email: "mike.johnson@tech.com",
      phone: "+91 98765 43210",
      specialization: "Plumbing",
      experience: 8,
      rating: 4.8,
      status: "available",
      location: "Building A",
      hourlyRate: 500,
      skills: ["Pipe Repair", "Drainage", "Water Heater", "Leak Detection"],
      avatar: "/placeholder.svg",
      completedJobs: 156,
      activeJobs: 2
    },
    {
      id: "2",
      name: "Sarah Chen",
      email: "sarah.chen@tech.com",
      phone: "+91 98765 43211",
      specialization: "Electrical",
      experience: 6,
      rating: 4.9,
      status: "busy",
      location: "Building B",
      hourlyRate: 600,
      skills: ["Wiring", "Circuit Repair", "Lighting", "Safety Systems"],
      avatar: "/placeholder.svg",
      completedJobs: 142,
      activeJobs: 1
    },
    {
      id: "3",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@tech.com",
      phone: "+91 98765 43212",
      specialization: "Carpentry",
      experience: 10,
      rating: 4.7,
      status: "available",
      location: "Building C",
      hourlyRate: 400,
      skills: ["Furniture Repair", "Door Installation", "Window Repair", "Woodwork"],
      avatar: "/placeholder.svg",
      completedJobs: 203,
      activeJobs: 0
    },
    {
      id: "4",
      name: "Lisa Wang",
      email: "lisa.wang@tech.com",
      phone: "+91 98765 43213",
      specialization: "HVAC",
      experience: 7,
      rating: 4.6,
      status: "offline",
      location: "Building A",
      hourlyRate: 550,
      skills: ["AC Repair", "Heating Systems", "Ventilation", "Thermostat"],
      avatar: "/placeholder.svg",
      completedJobs: 98,
      activeJobs: 0
    }
  ];

  // Mock AI suggestions data
  const aiSuggestions: AISuggestion[] = [
    {
      id: "1",
      issueId: "ISSUE-001",
      issueTitle: "Water leakage in bathroom",
      issueDescription: "Severe water leakage from the ceiling in master bathroom, urgent attention required",
      suggestedTechnician: technicians[0],
      confidence: 95,
      reasoning: "High confidence match based on: 1) Specialization in plumbing 2) Previous experience with similar issues 3) Current availability 4) High rating and completion rate",
      priority: "urgent",
      status: "pending",
      createdAt: "2024-01-15T10:30:00Z",
      aiAgent: "MaintenanceAI"
    },
    {
      id: "2",
      issueId: "ISSUE-002",
      issueTitle: "Electrical outlet not working",
      issueDescription: "Multiple electrical outlets in living room have stopped working",
      suggestedTechnician: technicians[1],
      confidence: 88,
      reasoning: "Perfect match for electrical issues: 1) Electrical specialization 2) Experience with circuit problems 3) Available within 2 hours 4) Excellent safety record",
      priority: "high",
      status: "approved",
      createdAt: "2024-01-15T09:15:00Z",
      aiAgent: "ElectricalAI"
    },
    {
      id: "3",
      issueId: "ISSUE-003",
      issueTitle: "Broken window lock",
      issueDescription: "Window lock in bedroom is broken and needs replacement",
      suggestedTechnician: technicians[2],
      confidence: 92,
      reasoning: "Ideal carpenter match: 1) Window repair expertise 2) Available immediately 3) High customer satisfaction 4) Reasonable pricing",
      priority: "medium",
      status: "rejected",
      createdAt: "2024-01-15T08:45:00Z",
      aiAgent: "CarpentryAI"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800";
      case "busy": return "bg-yellow-100 text-yellow-800";
      case "offline": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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

  const handleApproveSuggestion = (suggestionId: string) => {
    console.log("Approved suggestion:", suggestionId);
    // Add API call here
  };

  const handleRejectSuggestion = (suggestionId: string) => {
    console.log("Rejected suggestion:", suggestionId);
    // Add API call here
  };

  const filteredTechnicians = technicians.filter(technician => {
    if (filterStatus !== "all" && technician.status !== filterStatus) return false;
    if (filterSpecialization !== "all" && technician.specialization !== filterSpecialization) return false;
    if (searchQuery && !technician.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const pendingSuggestions = aiSuggestions.filter(s => s.status === "pending");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Technicians Management</h1>
          <p className="text-muted-foreground">Manage technicians and AI suggestions</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowAddTechnicianModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Technician
          </Button>
          <Button variant="outline" onClick={() => setShowIssueModal(true)}>
            <AlertTriangle className="h-4 w-4 mr-2" />
            Raise Complaint
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Technicians</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{technicians.length}</div>
            <p className="text-xs text-muted-foreground">4 available, 1 busy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Suggestions</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSuggestions.length}</div>
            <p className="text-xs text-muted-foreground">Pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">+0.2 from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="technicians">Technicians</TabsTrigger>
          <TabsTrigger value="ai-suggestions">AI Suggestions</TabsTrigger>
        </TabsList>

        {/* Technicians Tab */}
        <TabsContent value="technicians" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Technicians</h2>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search technicians..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterSpecialization} onValueChange={setFilterSpecialization}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Carpentry">Carpentry</SelectItem>
                  <SelectItem value="HVAC">HVAC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6">
            {filteredTechnicians.map((technician) => (
              <Card key={technician.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={technician.avatar} />
                      <AvatarFallback className="text-xl">{technician.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold">{technician.name}</h3>
                          <Badge className={getStatusColor(technician.status)}>
                            {technician.status}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{technician.rating}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">₹{technician.hourlyRate}</div>
                          <div className="text-sm text-muted-foreground">per hour</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Specialization</div>
                          <div className="font-medium">{technician.specialization}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Experience</div>
                          <div className="font-medium">{technician.experience} years</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Completed Jobs</div>
                          <div className="font-medium">{technician.completedJobs}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Active Jobs</div>
                          <div className="font-medium">{technician.activeJobs}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{technician.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{technician.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>{technician.email}</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-2">Skills</div>
                        <div className="flex flex-wrap gap-2">
                          {technician.skills.map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AI Suggestions Tab */}
        <TabsContent value="ai-suggestions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">AI Suggestions</h2>
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-muted-foreground">AI Agent Recommendations</span>
            </div>
          </div>

          <div className="space-y-4">
            {aiSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <Bot className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">{suggestion.aiAgent}</span>
                        </div>
                        <Badge className={getPriorityColor(suggestion.priority)}>
                          {suggestion.priority}
                        </Badge>
                        <Badge variant={suggestion.status === 'pending' ? 'secondary' : suggestion.status === 'approved' ? 'default' : 'destructive'}>
                          {suggestion.status}
                        </Badge>
                        <div className={`font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                          {suggestion.confidence}% confidence
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{suggestion.issueTitle}</h3>
                          <p className="text-muted-foreground mb-4">{suggestion.issueDescription}</p>
                          <div className="text-sm text-muted-foreground">
                            Issue ID: {suggestion.issueId} • Created: {new Date(suggestion.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">Suggested Technician</h4>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={suggestion.suggestedTechnician.avatar} />
                              <AvatarFallback>{suggestion.suggestedTechnician.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{suggestion.suggestedTechnician.name}</div>
                              <div className="text-sm text-muted-foreground">{suggestion.suggestedTechnician.specialization}</div>
                              <div className="flex items-center gap-1 text-sm">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span>{suggestion.suggestedTechnician.rating}</span>
                                <span className="text-muted-foreground">({suggestion.suggestedTechnician.completedJobs} jobs)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">AI Reasoning</span>
                        </div>
                        <p className="text-sm text-blue-800">{suggestion.reasoning}</p>
                      </div>

                      {suggestion.status === 'pending' && (
                        <div className="flex gap-3 mt-4">
                          <Button 
                            onClick={() => handleApproveSuggestion(suggestion.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleRejectSuggestion(suggestion.id)}
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
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Technician Modal */}
      <Dialog open={showAddTechnicianModal} onOpenChange={setShowAddTechnicianModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Technician</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input placeholder="Enter full name" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="Enter email" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                <Input placeholder="Enter phone number" />
              </div>
              <div>
                <Label>Specialization</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="carpentry">Carpentry</SelectItem>
                    <SelectItem value="hvac">HVAC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Experience (years)</Label>
                <Input type="number" placeholder="Enter experience" />
              </div>
              <div>
                <Label>Hourly Rate (₹)</Label>
                <Input type="number" placeholder="Enter hourly rate" />
              </div>
            </div>
            <div>
              <Label>Skills</Label>
              <Input placeholder="Enter skills separated by commas" />
            </div>
            <div>
              <Label>Location</Label>
              <Input placeholder="Enter location" />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Add Technician</Button>
              <Button variant="outline" onClick={() => setShowAddTechnicianModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Raise Complaint Modal */}
      <Dialog open={showIssueModal} onOpenChange={setShowIssueModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Raise Complaint</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="carpentry">Carpentry</SelectItem>
                    <SelectItem value="hvac">HVAC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label>Title</Label>
              <Input placeholder="Brief description of the issue" />
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Detailed description of the issue" rows={4} />
            </div>
            
            <div>
              <Label>Upload Photo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Click to upload photo</p>
              </div>
            </div>

            <Alert>
              <Bot className="h-4 w-4" />
              <AlertDescription>
                This complaint will be sent to the manager and AI agent for technician assignment.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button className="flex-1">Submit Complaint</Button>
              <Button variant="outline" onClick={() => setShowIssueModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 