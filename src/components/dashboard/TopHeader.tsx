import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveItem, setCommandMenuOpen } from "@/store/slices/navigationSlice";
import { logout as reduxLogout } from "@/store/slices/authSlice";
import {
  Bell,
  Search,
  Command as CommandIcon,
  Bot,
  Sparkles,
  ChevronRight,
  Shield,
  User,
  LogOut,
  Building2,
  CheckCircle2,
  Car,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface TopHeaderProps {
  user?: {
    name: string;
    email: string;
    role: "admin" | "resident" | "technician";
    flatNumber?: string;
    building?: string;
    phone?: string;
  };
  activeItem?: string;
  onOpenCommand?: () => void;
  onNavigate?: (viewId: string) => void;
  onLogout?: () => void;
}

export function TopHeader({
  user: propUser,
  activeItem: propActiveItem,
  onOpenCommand,
  onNavigate,
  onLogout,
}: TopHeaderProps) {
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const reduxActiveItem = useAppSelector((state) => state.navigation.activeItem);
  const user = propUser || reduxUser || { name: "Neighbor", email: "user@demo.com", role: "resident" as const };
  const activeItem = propActiveItem || reduxActiveItem || "dashboard";

  const [unreadCount, setUnreadCount] = useState(3);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleNav = (id: string) => {
    if (onNavigate) onNavigate(id);
    dispatch(setActiveItem(id));
  };

  const handleOpenCmd = () => {
    if (onOpenCommand) onOpenCommand();
    dispatch(setCommandMenuOpen(true));
  };

  const handleLogoutClick = () => {
    if (onLogout) onLogout();
    dispatch(reduxLogout());
  };

  // Map view ID to human title
  const getPageTitle = (id: string) => {
    switch (id) {
      case "dashboard":
        return "Executive Overview";
      case "all-issues":
        return "Grievances & Issue Triage";
      case "residents":
        return "Resident Directory";
      case "technicians":
        return "Service Technicians";
      case "analytics":
        return "Performance Analytics";
      case "ai-agents":
        return "Automated Operations Center";
      case "ai-issues":
        return "AI Priority Intelligence";
      case "ai-billing":
        return "AI Billing Anomaly Audit";
      case "my-issues":
        return "My Grievances";
      case "report-issue":
        return "AI Maintenance Concierge Chat";
      case "notifications":
        return "Notification Center";
      case "help":
        return "Society Bylaws & Support";
      default:
        return id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border/70 bg-background/85 px-3 sm:px-6 backdrop-blur-md transition-colors">
      {/* Breadcrumbs Trail */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-sm min-w-0">
        <div className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0" onClick={() => handleNav("dashboard")}>
          <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          <span className="font-medium text-xs sm:text-sm hidden xs:inline">Emerald Heights</span>
        </div>
        <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground/60 shrink-0" />
        <span className="font-semibold text-foreground tracking-tight text-xs sm:text-sm truncate">
          {getPageTitle(activeItem)}
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Global Search / Command Bar Trigger (Admin Only) */}
        {user.role === "admin" && (
          <button
            onClick={handleOpenCmd}
            className="group relative hidden sm:flex items-center gap-2 rounded-lg border border-border bg-background/60 hover:bg-secondary px-2.5 sm:px-3 py-1.5 text-xs text-muted-foreground transition-all duration-150 shadow-subtle hover:border-primary/40"
          >
            <Search className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="pr-3 hidden md:inline">Search or command...</span>
            <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span>Ctrl</span> K
            </kbd>
          </button>
        )}

        {/* Critical Alarms Quick Capsule */}
        <button
          onClick={() => handleNav(user.role === "admin" ? "ai-issues" : user.role === "resident" ? "my-issues" : "assigned-tasks")}
          className="flex items-center gap-1 sm:gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs text-rose-600 dark:text-rose-400 font-mono font-bold hover:bg-rose-500/20 transition-colors"
          title="Critical Alarms Pending Review"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
          <span className="hidden sm:inline">Alarm:</span>
          <span>{user.role === "admin" ? "2 Critical" : user.role === "resident" ? "Notice" : "1 Urgent"}</span>
        </button>

        {/* AI Health Capsule Desktop - Admin Only */}
        {user.role === "admin" && (
          <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs text-primary font-mono font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>System 99.8%</span>
          </div>
        )}

        {/* Theme Toggle */}
        <ThemeToggle className="h-8 w-8" />

        {/* Notifications Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 shadow-elevated" align="end">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">Notifications</span>
                <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                  {unreadCount} new
                </Badge>
              </div>
              <button
                onClick={() => setUnreadCount(0)}
                className="text-xs text-primary hover:underline"
              >
                Mark all read
              </button>
            </div>
            <div className="divide-y divide-border text-xs">
              <div
                className="p-3 hover:bg-secondary/50 cursor-pointer transition-colors"
                onClick={() => onNavigate("notifications")}
              >
                <div className="flex items-center justify-between font-medium text-foreground">
                  <span>Technician Auto-Assigned</span>
                  <span className="text-[10px] text-muted-foreground">3m ago</span>
                </div>
                <p className="text-muted-foreground mt-0.5 line-clamp-1">
                  John Plumber dispatched for Water leakage in A-501.
                </p>
              </div>
              <div
                className="p-3 hover:bg-secondary/50 cursor-pointer transition-colors"
                onClick={() => onNavigate("ai-billing")}
              >
                <div className="flex items-center justify-between font-medium text-foreground">
                  <span>Billing Duplicate Alert</span>
                  <span className="text-[10px] text-muted-foreground">22m ago</span>
                </div>
                <p className="text-muted-foreground mt-0.5 line-clamp-1">
                  AI detected ₹2,500 duplicate charge in December ledger.
                </p>
              </div>
              <div
                className="p-3 hover:bg-secondary/50 cursor-pointer transition-colors"
                onClick={() => handleNav("notifications")}
              >
                <div className="flex items-center justify-between font-medium text-foreground">
                  <span>Security Gate Notice</span>
                  <span className="text-[10px] text-muted-foreground">1h ago</span>
                </div>
                <p className="text-muted-foreground mt-0.5 line-clamp-1">
                  Amazon delivery driver arrived at Gate 1.
                </p>
              </div>
            </div>
            <div className="border-t border-border p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-primary justify-center"
                onClick={() => handleNav("notifications")}
              >
                View all notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1 transition-all hover:bg-secondary outline-none">
              <Avatar className="h-8 w-8 ring-1 ring-border">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">
                  {user.name ? user.name.split(" ").map((n) => n[0]).join("") : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-semibold leading-none">{user.name}</span>
                <span className="text-[10px] text-muted-foreground capitalize leading-tight mt-0.5">
                  {user.role}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 shadow-elevated">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                <div className="pt-1">
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {user.role === "admin"
                      ? "Society Administrator"
                      : user.role === "resident"
                      ? `Resident (${user.building || "A"}-${user.flatNumber || "501"})`
                      : "Service Technician"}
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowProfileModal(true)} className="cursor-pointer text-xs">
              <User className="mr-2 h-3.5 w-3.5 text-primary" />
              <span>Household Profile</span>
            </DropdownMenuItem>
            {user.role === "admin" && (
              <DropdownMenuItem onClick={handleOpenCmd} className="cursor-pointer text-xs">
                <CommandIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                <span>Command Palette (Ctrl + K)</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => handleNav("dashboard")}
              className="cursor-pointer text-xs"
            >
              <Building2 className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              <span>Society Overview</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogoutClick}
              className="cursor-pointer text-xs text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <LogOut className="mr-2 h-3.5 w-3.5" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Household Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="sm:max-w-md rounded-2xl p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Household Profile & Premise
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Verified resident identity and registered society amenities.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2 text-xs">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border/80">
              <Avatar className="h-11 w-11 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary text-white font-bold text-sm">
                  {user.name ? user.name.split(" ").map((n) => n[0]).join("") : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-sm text-foreground">{user.name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/40 bg-emerald-500/5">
                    Verified Resident
                  </Badge>
                  <span className="text-[11px] text-muted-foreground capitalize">• {user.role}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl border border-border/60 bg-card/60 space-y-1">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-primary" /> Apartment Unit
                </span>
                <p className="font-bold text-foreground text-xs">
                  {user.building || "Tower A"} • Flat {user.flatNumber || "101"}
                </p>
                <p className="text-[10px] text-muted-foreground">Emerald Heights Society</p>
              </div>

              <div className="p-3 rounded-xl border border-border/60 bg-card/60 space-y-1">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Car className="h-3 w-3 text-primary" /> Assigned Parking
                </span>
                <p className="font-bold font-mono text-foreground text-xs">
                  Bay P-{user.flatNumber ? user.flatNumber.replace(/[^0-9]/g, "") || "14" : "14"}
                </p>
                <p className="text-[10px] text-muted-foreground">Basement Level 1</p>
              </div>

              <div className="p-3 rounded-xl border border-border/60 bg-card/60 space-y-1">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3 text-primary" /> Registered Email
                </span>
                <p className="font-bold text-foreground text-xs truncate">
                  {user.email}
                </p>
                <p className="text-[10px] text-emerald-600">Active Notifications</p>
              </div>

              <div className="p-3 rounded-xl border border-border/60 bg-card/60 space-y-1">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3 text-primary" /> Emergency Contact
                </span>
                <p className="font-bold text-foreground text-xs">
                  {user.phone || "+91 98765 00001"}
                </p>
                <p className="text-[10px] text-muted-foreground">Gate Intercom Synced</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={() => setShowProfileModal(false)} className="text-xs h-8 px-4 rounded-xl">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
