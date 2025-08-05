import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { BillDisputeModal } from "@/components/ui/bill-dispute-modal";
import {
  Home,
  FileText,
  Bell,
  CreditCard,
  Shield,
  Wrench,
  Camera,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  Upload,
  Calendar,
  DollarSign,
  AlertCircle,
  User,
  Settings,
  Plus,
  Filter,
  Search,
  Eye,
  MessageSquare,
  Star,
  MapPin,
  Mail,
  X,
  Check,
  Ban,
  Flame,
  Heart,
  Car,
  Package,
  UserCheck,
  CalendarDays,
  Time,
  Edit,
  Save,
  Trash2,
  Image,
  Send,
  Download,
  Receipt,
  Banknote,
  TrendingUp,
  TrendingDown,
  Bot,
} from "lucide-react";

export function ResidentDashboard() {
  const [selectedTab, setSelectedTab] = useState("complaints");
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [emergencyType, setEmergencyType] = useState("");
  const [alertSent, setAlertSent] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Handle dispute submission
  const handleDisputeSubmit = async (disputeData: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/bills/${disputeData.billId}/dispute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: disputeData.type,
          description: disputeData.description || disputeData.doublePaymentDetails || disputeData.wrongSplitDetails,
          transactionId: disputeData.transactionId,
          paymentDate: disputeData.paymentDate,
          paymentMethod: disputeData.paymentMethod
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit dispute');
      }

      const result = await response.json();
      console.log('Dispute submitted successfully:', result);
      // You can add a toast notification here
    } catch (error) {
      console.error('Error submitting dispute:', error);
      // You can add error handling here
    }
  };

  // Mock data
  const complaints = [
    {
      id: 1,
      title: "Water leakage in bathroom",
      description: "Severe water leakage from the ceiling in master bathroom",
      status: "in-progress",
      priority: "high",
      category: "plumbing",
      date: "2024-01-10",
      assignedTo: "John Plumber",
      updates: [
        { date: "2024-01-10", message: "Issue reported", status: "reported" },
        { date: "2024-01-11", message: "Technician assigned", status: "assigned" },
        { date: "2024-01-12", message: "Work in progress", status: "in-progress" },
      ],
      photo: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Elevator not working",
      description: "Elevator stuck between 3rd and 4th floor",
      status: "resolved",
      priority: "urgent",
      category: "electrical",
      date: "2024-01-08",
      assignedTo: "Mike Technician",
      updates: [
        { date: "2024-01-08", message: "Emergency reported", status: "reported" },
        { date: "2024-01-08", message: "Technician arrived", status: "assigned" },
        { date: "2024-01-08", message: "Issue resolved", status: "resolved" },
      ],
      photo: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Broken window lock",
      description: "Window lock in living room is broken",
      status: "pending",
      priority: "medium",
      category: "carpentry",
      date: "2024-01-15",
      assignedTo: "Pending",
      updates: [
        { date: "2024-01-15", message: "Issue reported", status: "reported" },
      ],
      photo: "/placeholder.svg"
    },
  ];

  const bills = [
    {
      id: 1,
      type: "Maintenance",
      amount: 2500,
      dueDate: "2024-01-15",
      status: "pending",
      description: "Monthly maintenance charges"
    },
    {
      id: 2,
      type: "Electricity",
      amount: 1200,
      dueDate: "2024-01-20",
      status: "paid",
      description: "Electricity bill for December"
    },
    {
      id: 3,
      type: "Water",
      amount: 800,
      dueDate: "2024-01-25",
      status: "disputed",
      description: "Water bill for December"
    },
  ];

  const securityAlerts = [
    {
      id: 1,
      type: "delivery",
      visitor: "Amazon Delivery",
      photo: "/placeholder.svg",
      time: "2024-01-10 14:30",
      status: "pending",
      items: "Package for Flat A-501"
    },
    {
      id: 2,
      type: "guest",
      visitor: "John Smith",
      photo: "/placeholder.svg",
      time: "2024-01-09 18:45",
      status: "approved",
      items: "Visiting Flat A-501"
    },
  ];

  const maintenanceServices = [
    { name: "Plumber", icon: Wrench, available: 3, nextSlot: "2PM Today", rate: "₹500/hour" },
    { name: "Electrician", icon: AlertTriangle, available: 2, nextSlot: "4PM Today", rate: "₹600/hour" },
    { name: "Carpenter", icon: Wrench, available: 1, nextSlot: "10AM Tomorrow", rate: "₹400/hour" },
    { name: "Painter", icon: Wrench, available: 0, nextSlot: "9AM Monday", rate: "₹300/hour" },
  ];

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"
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
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      case "urgent": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (filterStatus !== "all" && complaint.status !== filterStatus) return false;
    if (filterCategory !== "all" && complaint.category !== filterCategory) return false;
    return true;
  });

  const handleEmergencyAlert = () => {
    setAlertSent(true);
    setTimeout(() => {
      setAlertSent(false);
      setShowEmergencyModal(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, John!</h1>
          <p className="text-muted-foreground">Flat A-501, Building A</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setShowProfileModal(true)}
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
          <Button 
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => setShowEmergencyModal(true)}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            SOS Emergency
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">1 urgent, 2 pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹3,700</div>
            <p className="text-xs text-muted-foreground">Due in 5 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">1 pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Score</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <Progress value={92} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="complaints">My Complaints</TabsTrigger>
          <TabsTrigger value="bills">Bills & Payments</TabsTrigger>
          <TabsTrigger value="security">Security Gate</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="emergency">SOS</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Complaints Tab */}
        <TabsContent value="complaints" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Complaints</h2>
            <Button onClick={() => setShowComplaintModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Raise Complaint
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
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

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="carpentry">Carpentry</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Complaints List */}
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <Card key={complaint.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                        <img src={complaint.photo} alt="Issue" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{complaint.title}</h3>
                          <Badge className={getStatusColor(complaint.status)}>
                            {complaint.status}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(complaint.priority)}>
                            {complaint.priority}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{complaint.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Assigned to: {complaint.assignedTo}</span>
                          <span>Date: {complaint.date}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Timeline
                    </Button>
                  </div>

                  {/* Timeline */}
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-3">Timeline</h4>
                    <div className="space-y-2">
                      {complaint.updates.map((update, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-muted-foreground">{update.date}</span>
                          <span>{update.message}</span>
                          <Badge variant="outline" className="text-xs">
                            {update.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Bills Tab */}
        <TabsContent value="bills" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Bills & Payments</h2>
            <Button onClick={() => setShowBillModal(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Payment Proof
            </Button>
          </div>

          <div className="grid gap-4">
            {bills.map((bill) => (
              <Card key={bill.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{bill.type}</h3>
                        <Badge className={getStatusColor(bill.status)}>
                          {bill.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{bill.description}</p>
                      <p className="text-sm text-muted-foreground">Due: {bill.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold mb-2">₹{bill.amount}</div>
                      <div className="flex gap-2">
                        {bill.status === "pending" && (
                          <>
                            <Button size="sm">
                              <DollarSign className="h-4 w-4 mr-2" />
                              Pay Bill
                            </Button>
                            <BillDisputeModal 
                              bill={bill} 
                              onDisputeSubmit={handleDisputeSubmit}
                            />
                          </>
                        )}
                        {bill.status === "disputed" && (
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            View Dispute
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Security Gate Interface</h2>
            <Button onClick={() => setShowSecurityModal(true)}>
              <Calendar className="h-4 w-4 mr-2" />
              Pre-schedule Delivery
            </Button>
          </div>

          <div className="space-y-4">
            {securityAlerts.map((alert) => (
              <Card key={alert.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={alert.photo} />
                      <AvatarFallback>{alert.visitor.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{alert.visitor}</h3>
                      <p className="text-muted-foreground">{alert.items}</p>
                      <p className="text-sm text-muted-foreground">{alert.time}</p>
                    </div>
                    <div className="flex gap-2">
                      {alert.status === "pending" ? (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <Check className="h-4 w-4 mr-2" />
                            Allow
                          </Button>
                                                     <Button size="sm" variant="outline">
                             <Clock className="h-4 w-4 mr-2" />
                             Delay
                           </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            <Ban className="h-4 w-4 mr-2" />
                            Deny
                          </Button>
                        </>
                      ) : (
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Book Maintenance Help</h2>
            <Button onClick={() => setShowMaintenanceModal(true)}>
              <Calendar className="h-4 w-4 mr-2" />
              Book Appointment
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {maintenanceServices.map((service, idx) => (
              <Card key={idx} className="text-center">
                <CardHeader className="pb-2">
                  <service.icon className="h-8 w-8 mx-auto text-primary mb-2" />
                  <CardTitle className="text-sm">{service.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground mb-2">
                    {service.available} available
                  </p>
                  <p className="text-xs font-medium mb-2">
                    Next: {service.nextSlot}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    {service.rate}
                  </p>
                  <Button 
                    size="sm" 
                    variant={service.available > 0 ? "default" : "secondary"}
                    disabled={service.available === 0}
                    className="w-full"
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Available Time Slots */}
          <Card>
            <CardHeader>
              <CardTitle>Available Time Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {timeSlots.map((time, idx) => (
                  <Button 
                    key={idx} 
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Tab */}
        <TabsContent value="emergency" className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Emergency SOS</h2>
            <p className="text-muted-foreground mb-6">
              Use this in case of emergency situations
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <Button 
                className="h-32 bg-red-600 hover:bg-red-700 text-white flex-col"
                onClick={() => {
                  setEmergencyType("medical");
                  setShowEmergencyModal(true);
                }}
              >
                <Heart className="h-8 w-8 mb-2" />
                Medical Emergency
              </Button>
              
                             <Button 
                 className="h-32 bg-orange-600 hover:bg-orange-700 text-white flex-col"
                 onClick={() => {
                   setEmergencyType("fire");
                   setShowEmergencyModal(true);
                 }}
               >
                 <Flame className="h-8 w-8 mb-2" />
                 Fire Emergency
               </Button>
              
                             <Button 
                 className="h-32 bg-blue-600 hover:bg-blue-700 text-white flex-col"
                 onClick={() => {
                   setEmergencyType("theft");
                   setShowEmergencyModal(true);
                 }}
               >
                 <Shield className="h-8 w-8 mb-2" />
                 Security/Theft
               </Button>
            </div>
          </div>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Profile</h2>
            <Button onClick={() => setShowProfileModal(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">John Doe</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Flat A-501, Building A</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>+91 98765 43210</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>john.doe@email.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Emergency Modal */}
      <Dialog open={showEmergencyModal} onOpenChange={setShowEmergencyModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Emergency Alert
            </DialogTitle>
          </DialogHeader>
          {alertSent ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Alert Sent!</h3>
              <p className="text-muted-foreground">
                Emergency services have been notified. Help is on the way.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This will immediately notify security, emergency services, and building management.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label>Emergency Type: {emergencyType}</Label>
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={handleEmergencyAlert}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Send Emergency Alert
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Complaint Modal */}
      <Dialog open={showComplaintModal} onOpenChange={setShowComplaintModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Raise a Complaint</DialogTitle>
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
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Urgency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
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

            {/* AI Suggestions */}
            <Alert>
              <Bot className="h-4 w-4" />
              <AlertDescription>
                AI Suggestion: This appears to be a plumbing issue with high urgency. 
                Recommended category: Plumbing, Priority: High
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button className="flex-1">Submit Complaint</Button>
              <Button variant="outline" onClick={() => setShowComplaintModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Security Modal */}
      <Dialog open={showSecurityModal} onOpenChange={setShowSecurityModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pre-schedule Delivery</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Delivery Company</Label>
              <Input placeholder="e.g., Amazon, Flipkart" />
            </div>
            <div>
              <Label>Expected Date</Label>
              <Input type="date" />
            </div>
            <div>
              <Label>Expected Time</Label>
              <Input type="time" />
            </div>
            <div>
              <Label>Contact Number</Label>
              <Input placeholder="Delivery person's number" />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Schedule</Button>
              <Button variant="outline" onClick={() => setShowSecurityModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Maintenance Modal */}
      <Dialog open={showMaintenanceModal} onOpenChange={setShowMaintenanceModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Maintenance Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Service Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plumber">Plumber</SelectItem>
                  <SelectItem value="electrician">Electrician</SelectItem>
                  <SelectItem value="carpenter">Carpenter</SelectItem>
                  <SelectItem value="painter">Painter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" />
            </div>
            <div>
              <Label>Time Slot</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time, idx) => (
                    <SelectItem key={idx} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Describe the issue" rows={3} />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Confirm Booking</Button>
              <Button variant="outline" onClick={() => setShowMaintenanceModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bill Modal */}
      <Dialog open={showBillModal} onOpenChange={setShowBillModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Payment Proof</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <Camera className="h-6 w-6 mb-2" />
                Bank SMS Screenshot
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Receipt className="h-6 w-6 mb-2" />
                Payment Receipt
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Banknote className="h-6 w-6 mb-2" />
                UPI Transaction
              </Button>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Upload</Button>
              <Button variant="outline" onClick={() => setShowBillModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-xl">JD</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
            </div>
            <div>
              <Label>Full Name</Label>
              <Input defaultValue="John Doe" />
            </div>
            <div>
              <Label>Flat Number</Label>
              <Input defaultValue="A-501" />
            </div>
            <div>
              <Label>Building</Label>
              <Input defaultValue="Building A" />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input defaultValue="+91 98765 43210" />
            </div>
            <div>
              <Label>Email</Label>
              <Input defaultValue="john.doe@email.com" />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setShowProfileModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}