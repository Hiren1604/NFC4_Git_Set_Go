import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Bell,
  User,
  Phone,
  Star,
  Bot,
  Filter,
  Search,
  ArrowLeft,
  Calendar,
  Clock,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wrench,
  Shield,
  FileText,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import TechnicianAssignmentNotification from "@/components/dashboard/TechnicianAssignmentNotification";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  priority: string;
  status: string;
  technician?: any;
  aiAnalysis?: any;
  issueId?: string;
}

export default function NotificationsPage() {
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [unreadCount, setUnreadCount] = useState(0);
  const [previousUnreadCount, setPreviousUnreadCount] = useState(0);
  const { toast } = useToast();

  // Fetch notifications from backend
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing notifications...');
      fetchNotifications();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Update unread count when notifications change
  useEffect(() => {
    const unread = notifications.filter(n => n.status === 'unread').length;
    setUnreadCount(unread);
    
    // Show toast when new notifications arrive
    if (unread > previousUnreadCount && previousUnreadCount > 0) {
      const newCount = unread - previousUnreadCount;
      toast({
        title: "New Notifications",
        description: `You have ${newCount} new notification${newCount > 1 ? 's' : ''}`,
        duration: 3000,
      });
    }
    
    setPreviousUnreadCount(unread);
  }, [notifications, previousUnreadCount, toast]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      // Fetch real notifications from the API
      const response = await fetch('/api/notifications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.notifications);
        setLastRefresh(new Date());
        console.log('✅ Notifications refreshed successfully:', {
          count: data.count,
          unreadCount: data.unreadCount
        });
      } else {
        console.error('❌ Failed to fetch notifications:', data.error);
        // Fallback to empty array if API fails
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to empty array if API fails
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const simulateNewNotification = () => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type: "technician_assignment",
      title: "AI Assignment: Lakshmi Devi",
      message: "AI agent has automatically assigned Lakshmi Devi to your cleaning request. Estimated cost: ₹800 (2 hours).",
      timestamp: new Date().toLocaleString(),
      priority: "high",
      status: "unread",
      issueId: "simulated_issue",
      technician: {
        name: "Lakshmi Devi",
        skills: ["cleaning"],
        hourlyRate: 400,
        phone: "+91 98765 43216",
        email: "lakshmi.gardener@societyhub.com"
      }
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    toast({
      title: "New AI Assignment",
      description: "AI agent has assigned a technician to your issue!",
      duration: 3000,
    });
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      // Call API to mark notification as read
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notificationId })
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId 
              ? { ...n, status: 'read' as const }
              : n
          )
        );
        console.log('✅ Notification marked as read:', notificationId);
      } else {
        console.error('❌ Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Still update local state even if API fails
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, status: 'read' as const }
            : n
        )
      );
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    await markAsRead(notification.id);
    if (notification.type === 'technician_assignment') {
      setSelectedNotification(notification);
      setSelectedIssueId(notification.issueId || null);
    }
  };

  const handleAssignTechnician = async (issueId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch('/api/technician-assignment/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ issueId })
      });

      if (!response.ok) {
        throw new Error('Failed to assign technician');
      }

      const result = await response.json();
      setSelectedNotification(result);
      setSelectedIssueId(issueId);
    } catch (error) {
      console.error('Error assigning technician:', error);
    }
  };

  const handleAcceptAssignment = async (issueId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`/api/technician-assignment/${issueId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to accept assignment');
      }

      // Refresh notifications
      fetchNotifications();
    } catch (error) {
      console.error('Error accepting assignment:', error);
    }
  };

  const handleRejectAssignment = async (issueId: string, reason?: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`/api/technician-assignment/${issueId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        throw new Error('Failed to reject assignment');
      }

      // Refresh notifications
      fetchNotifications();
    } catch (error) {
      console.error('Error rejecting assignment:', error);
    }
  };

  const handleRescheduleRequest = async (issueId: string) => {
    try {
      // This would typically call a reschedule API
      console.log('Reschedule request for issue:', issueId);
      // For now, just show a success message
      alert('Reschedule request sent successfully');
    } catch (error) {
      console.error('Error requesting reschedule:', error);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === "all" || notification.type === filterType;
    const matchesPriority = filterPriority === "all" || notification.priority === filterPriority;
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesPriority && matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "technician_assignment":
      case "technician_assigned":
        return <User className="h-4 w-4" />;
      case "issue_update":
        return <MessageSquare className="h-4 w-4" />;
      case "ai_analysis":
        return <Bot className="h-4 w-4" />;
      case "security_alert":
        return <Shield className="h-4 w-4" />;
      case "bill_reminder":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "technician_assignment":
      case "technician_assigned":
        return "text-blue-600";
      case "issue_update":
        return "text-green-600";
      case "ai_analysis":
        return "text-purple-600";
      case "security_alert":
        return "text-red-600";
      case "bill_reminder":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  if (selectedNotification && selectedNotification.type === 'technician_assignment') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSelectedNotification(null);
              setSelectedIssueId(null);
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Notifications
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Technician Assignment</h1>
            <p className="text-muted-foreground">Review and manage your technician assignment</p>
          </div>
        </div>

        <TechnicianAssignmentNotification
          notification={selectedNotification}
          issueId={selectedIssueId || ''}
          onAccept={handleAcceptAssignment}
          onReject={handleRejectAssignment}
          onReschedule={handleRescheduleRequest}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">Stay updated with your maintenance requests</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Last refreshed: {lastRefresh.toLocaleTimeString()}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={loading || refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading || refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={simulateNewNotification}
          >
            <Bot className="h-4 w-4 mr-2" />
            Test AI Assignment
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="technician_assignment">Technician Assignment</SelectItem>
              <SelectItem value="issue_update">Issue Updates</SelectItem>
              <SelectItem value="ai_analysis">AI Analysis</SelectItem>
              <SelectItem value="security_alert">Security Alerts</SelectItem>
              <SelectItem value="bill_reminder">Bill Reminders</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground">You're all caught up!</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                notification.status === 'unread' ? 'border-blue-200 bg-blue-50' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(notification.priority)}>
                          {notification.priority}
                        </Badge>
                        {notification.status === 'unread' && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{notification.timestamp}</span>
                      {notification.type === 'technician_assignment' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (notification.issueId) {
                              handleAssignTechnician(notification.issueId);
                            }
                          }}
                        >
                          View Assignment
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 