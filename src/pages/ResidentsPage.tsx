import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserPlus,
  FileText,
  CreditCard,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Home,
  Filter,
  Download,
  Edit,
  MoreHorizontal,
} from "lucide-react";

export default function ResidentsPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data
  const residents = [
    {
      id: "RES-001",
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+91 98765 43210",
      flatNumber: "A-501",
      building: "Building A",
      floor: 5,
      status: "active",
      memberSince: "2023-03-15",
      familySize: 4,
      vehicle: "Car - MH12AB1234",
      emergencyContact: "Jane Doe - +91 98765 43211",
      activeIssues: 2,
      pendingBills: 1,
      lastPayment: "2024-01-05",
      totalPaid: 45000,
      avatar: "/api/placeholder/150/150"
    },
    {
      id: "RES-002", 
      name: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "+91 98765 43220",
      flatNumber: "B-304",
      building: "Building B",
      floor: 3,
      status: "active",
      memberSince: "2022-08-20",
      familySize: 2,
      vehicle: "Bike - MH12CD5678",
      emergencyContact: "Robert Smith - +91 98765 43221",
      activeIssues: 0,
      pendingBills: 0,
      lastPayment: "2024-01-10",
      totalPaid: 28000,
      avatar: "/api/placeholder/150/150"
    },
    {
      id: "RES-003",
      name: "Robert Brown",
      email: "robert.brown@email.com", 
      phone: "+91 98765 43230",
      flatNumber: "C-201",
      building: "Building C",
      floor: 2,
      status: "inactive",
      memberSince: "2023-11-10",
      familySize: 3,
      vehicle: "Car - MH12EF9012",
      emergencyContact: "Lisa Brown - +91 98765 43231",
      activeIssues: 1,
      pendingBills: 3,
      lastPayment: "2023-12-15",
      totalPaid: 15000,
      avatar: "/api/placeholder/150/150"
    },
    {
      id: "RES-004",
      name: "Lisa Wilson",
      email: "lisa.wilson@email.com",
      phone: "+91 98765 43240",
      flatNumber: "A-201",
      building: "Building A", 
      floor: 2,
      status: "active",
      memberSince: "2021-05-03",
      familySize: 1,
      vehicle: "None",
      emergencyContact: "Mark Wilson - +91 98765 43241",
      activeIssues: 1,
      pendingBills: 0,
      lastPayment: "2024-01-08",
      totalPaid: 82000,
      avatar: "/api/placeholder/150/150"
    },
    {
      id: "RES-005",
      name: "David Miller",
      email: "david.miller@email.com",
      phone: "+91 98765 43250",
      flatNumber: "B-405",
      building: "Building B",
      floor: 4,
      status: "active",
      memberSince: "2023-01-20",
      familySize: 5,
      vehicle: "Car - MH12GH3456, Bike - MH12IJ7890",
      emergencyContact: "Sarah Miller - +91 98765 43251",
      activeIssues: 1,
      pendingBills: 1,
      lastPayment: "2024-01-03",
      totalPaid: 52000,
      avatar: "/api/placeholder/150/150"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-status-resolved text-status-resolved-foreground";
      case "inactive": return "bg-status-pending text-status-pending-foreground";
      case "suspended": return "bg-status-urgent text-status-urgent-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getIssueStatusColor = (count: number) => {
    if (count === 0) return "text-status-resolved";
    if (count <= 2) return "text-status-progress";
    return "text-status-urgent";
  };

  const getBillStatusColor = (count: number) => {
    if (count === 0) return "text-status-resolved";
    if (count <= 1) return "text-status-progress";
    return "text-status-urgent";
  };

  const filteredResidents = residents.filter(resident => {
    const matchesSearch = resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resident.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resident.flatNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resident.phone.includes(searchQuery);
    const matchesBuilding = buildingFilter === "all" || resident.building === buildingFilter;
    const matchesStatus = statusFilter === "all" || resident.status === statusFilter;
    
    return matchesSearch && matchesBuilding && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getResidentsByStatus = (status: string) => {
    if (status === "all") return filteredResidents;
    return filteredResidents.filter(resident => resident.status === status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Residents</h1>
          <p className="text-text-secondary">Manage society residents and their information</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Export List
          </Button>
          <Button>
            <UserPlus className="h-4 w-4" />
            Add Resident
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
                  placeholder="Search by name, email, flat number, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={buildingFilter} onValueChange={setBuildingFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Building" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Buildings</SelectItem>
                <SelectItem value="Building A">Building A</SelectItem>
                <SelectItem value="Building B">Building B</SelectItem>
                <SelectItem value="Building C">Building C</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-text-primary">{residents.length}</div>
            <div className="text-sm text-text-secondary">Total Residents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-status-resolved">{residents.filter(r => r.status === 'active').length}</div>
            <div className="text-sm text-text-secondary">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-status-pending">{residents.filter(r => r.status === 'inactive').length}</div>
            <div className="text-sm text-text-secondary">Inactive</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-status-urgent">{residents.reduce((acc, r) => acc + r.activeIssues, 0)}</div>
            <div className="text-sm text-text-secondary">Active Issues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-status-progress">{residents.reduce((acc, r) => acc + r.pendingBills, 0)}</div>
            <div className="text-sm text-text-secondary">Pending Bills</div>
          </CardContent>
        </Card>
      </div>

      {/* Residents Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({filteredResidents.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({getResidentsByStatus('active').length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({getResidentsByStatus('inactive').length})</TabsTrigger>
          <TabsTrigger value="issues">With Issues ({residents.filter(r => r.activeIssues > 0).length})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {/* Residents Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(selectedTab === "issues" ? residents.filter(r => r.activeIssues > 0) : getResidentsByStatus(selectedTab)).map((resident) => (
              <Card key={resident.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={resident.avatar} />
                        <AvatarFallback className="text-lg">
                          {resident.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg text-text-primary">{resident.name}</h3>
                        <p className="text-text-secondary">{resident.flatNumber}, {resident.building}</p>
                        <p className="text-sm text-text-muted">#{resident.id}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(resident.status)}>
                        {resident.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-text-muted" />
                        <span className="text-text-secondary truncate">{resident.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-text-muted" />
                        <span className="text-text-secondary">{resident.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-text-muted" />
                        <span className="text-text-secondary">Family: {resident.familySize}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-text-muted" />
                        <span className="text-text-secondary">Floor {resident.floor}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-text-muted" />
                        <span className="text-text-secondary">Since {formatDate(resident.memberSince)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-text-muted" />
                        <span className="text-text-secondary">₹{resident.totalPaid.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {resident.vehicle !== "None" && (
                    <div className="mb-4 p-3 bg-background-secondary rounded-lg">
                      <p className="text-sm text-text-secondary">
                        <strong>Vehicle:</strong> {resident.vehicle}
                      </p>
                    </div>
                  )}

                  <div className="mb-4 p-3 bg-background-secondary rounded-lg">
                    <p className="text-sm text-text-secondary">
                      <strong>Emergency Contact:</strong> {resident.emergencyContact}
                    </p>
                  </div>

                  {/* Status Indicators */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-text-muted" />
                        <span className={`text-sm font-medium ${getIssueStatusColor(resident.activeIssues)}`}>
                          {resident.activeIssues} Active Issues
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-text-muted" />
                        <span className={`text-sm font-medium ${getBillStatusColor(resident.pendingBills)}`}>
                          {resident.pendingBills} Pending Bills
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-text-muted">
                      Last payment: {formatDate(resident.lastPayment)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4" />
                      View Issues
                    </Button>
                    <Button size="sm" variant="outline">
                      <CreditCard className="h-4 w-4" />
                      Billing
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4" />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {getResidentsByStatus(selectedTab).length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-text-muted mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No residents found</h3>
                <p className="text-text-secondary">
                  {searchQuery || buildingFilter !== "all" || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "No residents have been added yet"
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