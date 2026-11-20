import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  BarChart3,
  Bell,
  PlusCircle,
  HelpCircle,
  Building2,
  Wrench,
  UserCheck,
  Shield,
  Bot,
  LogOut,
  CreditCard,
  Sparkles,
  ChevronDown,
  Layers,
  Radio,
  Clock,
  HeartHandshake,
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

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "destructive";
  badgePulse?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function SidebarNav({
  role,
  activeItem = "dashboard",
  onItemClick,
  onLogout,
  user,
}: SidebarNavProps) {
  // Role-specific grouped sections
  const getNavSections = (): NavSection[] => {
    switch (role) {
      case "admin":
        return [
          {
            title: "OVERVIEW",
            items: [
              { id: "dashboard", label: "Executive Dashboard", icon: LayoutDashboard },
              { id: "all-issues", label: "All Complaints", icon: FileText, badge: "24" },
            ],
          },
          {
            title: "AI INTELLIGENCE",
            items: [
              {
                id: "ai-agents",
                label: "Automated Workflows",
                icon: Bot,
                badge: "Live",
                badgePulse: true,
              },
              { id: "ai-issues", label: "Priority Triage", icon: Sparkles, badge: "6" },
              {
                id: "ai-billing",
                label: "Billing Anomaly Audit",
                icon: CreditCard,
                badge: "Dispute",
                badgeVariant: "destructive",
              },
            ],
          },
          {
            title: "COMMUNITY & ROSTER",
            items: [
              { id: "residents", label: "Residents Roster", icon: Users },
              { id: "technicians", label: "Service Technicians", icon: Wrench, badge: "8 Online" },
              { id: "notifications", label: "Notification Feed", icon: Bell },
            ],
          },
        ];

      case "resident":
        return [
          {
            title: "MY PORTAL",
            items: [
              { id: "dashboard", label: "Resident Home", icon: LayoutDashboard },
              { id: "my-issues", label: "My Grievances", icon: FileText },
              { id: "report-issue", label: "AI Concierge Chat", icon: Bot, badge: "AI Live", badgePulse: true },
            ],
          },
          {
            title: "SERVICES & COMMUNITY",
            items: [
              { id: "notifications", label: "Notifications & Alerts", icon: Bell, badge: "2" },
              { id: "help", label: "Society Bylaws & Help", icon: HelpCircle },
            ],
          },
        ];

      case "technician":
        return [
          {
            title: "FIELD WORKSPACE",
            items: [
              { id: "dashboard", label: "Work Overview", icon: LayoutDashboard },
              { id: "assigned-tasks", label: "Active Jobs", icon: FileText, badge: "5", badgePulse: true },
              { id: "availability", label: "Shift & Availability", icon: UserCheck },
              { id: "performance", label: "Earnings & Stats", icon: BarChart3 },
              { id: "help", label: "Support Dispatch", icon: HelpCircle },
            ],
          },
        ];
    }
  };

  const sections = getNavSections();

  return (
    <div className="flex h-full flex-col bg-background-sidebar select-none">
      {/* Brand & Society Switcher Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between rounded-lg p-2 hover:bg-secondary/60 transition-colors cursor-pointer border border-transparent hover:border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-subtle">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                SocietyHub
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </span>
              <span className="text-[11px] font-mono text-muted-foreground truncate max-w-[130px]">
                Emerald Heights
              </span>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Role Pill */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center justify-between rounded-md bg-secondary/50 px-2.5 py-1.5 border border-border/60 text-xs">
          <span className="text-muted-foreground font-mono text-[10px] uppercase tracking-wider">
            Active Role
          </span>
          <Badge
            variant="outline"
            className="capitalize text-[10px] font-medium bg-background text-foreground"
          >
            {role === "admin"
              ? "Administrator"
              : role === "resident"
              ? `Resident • ${user?.building || "A"}-${user?.flatNumber || "501"}`
              : "Technician"}
          </Badge>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <p className="px-2 pb-1 text-[10px] font-mono font-semibold tracking-wider text-muted-foreground/80 uppercase">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = activeItem === item.id;
                const IconComponent = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => onItemClick?.(item.id)}
                    className={cn(
                      "group relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-150 text-left outline-none",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold shadow-subtle"
                        : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                    )}
                  >
                    {/* Active highlight bar on left */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary" />
                    )}

                    <IconComponent
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span className="flex-1 truncate">{item.label}</span>

                    {item.badge && (
                      <Badge
                        variant={item.badgeVariant || "secondary"}
                        className={cn(
                          "ml-auto text-[10px] h-4 px-1.5 font-mono font-normal tracking-tight",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground",
                          item.badgePulse && "animate-pulse"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Automated System Capsule */}
      <div className="p-3 mx-3 mb-2 rounded-xl border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary">
            <Bot className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-semibold text-foreground">Smart Automation</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-snug">
          Intelligent triage and audit engines actively managing complaints and duplicate billing.
        </p>
      </div>

      {/* User Footer Profile & Session */}
      <div className="p-3 border-t border-border bg-background/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="h-8 w-8 ring-1 ring-border">
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                {user?.name ? user.name.split(" ").map((n) => n[0]).join("") : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-foreground truncate">
                {user?.name || "Society Member"}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                {user?.email || "user@societyhub.io"}
              </span>
            </div>
          </div>
          {onLogout && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              title="Log out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}