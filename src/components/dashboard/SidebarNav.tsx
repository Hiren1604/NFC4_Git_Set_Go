import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  FileText,
  Users,
  Settings,
  BarChart3,
  Bell,
  Plus,
  HelpCircle,
  Building2,
  Wrench,
  UserCheck,
  Shield,
  Bot,
  LogOut,
} from "lucide-react";

interface SidebarNavProps {
  role: "resident" | "admin" | "technician";
  activeItem?: string;
  onItemClick?: (item: string) => void;
  onLogout?: () => void;
  user?: {
    name: string;
    email: string;
    flatNumber?: string;
    building?: string;
    specialization?: string;
  };
}

const navigationItems = {
  resident: [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "my-issues", label: "My Issues", icon: FileText, badge: "3" },
    { id: "report-issue", label: "Report Issue", icon: Plus },
    { id: "notifications", label: "Notifications", icon: Bell, badge: "2" },
    { id: "help", label: "Help & FAQ", icon: HelpCircle },
  ],
  admin: [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "all-issues", label: "All Issues", icon: FileText, badge: "12" },
    { id: "residents", label: "Residents", icon: Users },
    { id: "technicians", label: "Technicians", icon: Wrench },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "ai-agents", label: "AI Agents", icon: Bot, badge: "Active" },
    { id: "ai-issues", label: "AI Issues", icon: Bot },
    { id: "ai-billing", label: "AI Billing Analysis", icon: Bot, badge: "3" },
  ],
  technician: [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "assigned-tasks", label: "My Tasks", icon: FileText, badge: "5" },
    { id: "availability", label: "Availability", icon: UserCheck },
    { id: "performance", label: "Performance", icon: BarChart3 },
    { id: "help", label: "Help", icon: HelpCircle },
  ],
};

export function SidebarNav({ role, activeItem = "dashboard", onItemClick, onLogout, user }: SidebarNavProps) {
  const items = navigationItems[role];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">SocietyHub</h2>
            <p className="text-xs text-text-muted">AI-Powered Management</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-sm text-text-muted capitalize">
              {role === "admin" ? "Society Admin" : role}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="secondary" className="text-xs">
                {role === "resident" ? `${user?.building || 'A'}-${user?.flatNumber || '501'}` : 
                 role === "technician" ? user?.specialization || "General" : "Admin"}
              </Badge>
              {role === "technician" && (
                <Badge variant="outline" className="text-xs bg-status-resolved-light text-status-resolved">
                  Available
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => (
          <Button
            key={item.id}
            variant={activeItem === item.id ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start h-11 px-4",
              activeItem === item.id && "bg-primary-light text-primary font-medium"
            )}
            onClick={() => onItemClick?.(item.id)}
          >
            <item.icon className="h-4 w-4" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <Badge 
                variant={item.badge === "Active" ? "default" : "secondary"} 
                className="text-xs"
              >
                {item.badge}
              </Badge>
            )}
          </Button>
        ))}
      </nav>

      {/* AI Assistant */}
      <div className="p-4 border-t border-border">
        <div className="bg-primary-light rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI Assistant</span>
          </div>
          <p className="text-xs text-text-secondary mb-3">
            Need help? Ask our AI assistant for instant support.
          </p>
          <Button size="sm" variant="default" className="w-full">
            Chat with AI
          </Button>
        </div>
      </div>

      {/* Logout */}
      {onLogout && (
        <div className="p-4 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}