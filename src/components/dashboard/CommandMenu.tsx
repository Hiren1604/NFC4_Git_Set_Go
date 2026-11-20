import { useEffect } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  FileText,
  Users,
  Wrench,
  Bot,
  CreditCard,
  Bell,
  PlusCircle,
  ShieldAlert,
  Moon,
  Sun,
  LogOut,
  Sparkles,
  Shield,
  Search,
} from "lucide-react";
import { useTheme } from "next-themes";

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (viewId: string) => void;
  onRoleSwitch?: (role: "admin" | "resident" | "technician") => void;
  onLogout?: () => void;
}

export function CommandMenu({
  open,
  onOpenChange,
  onNavigate,
  onRoleSwitch,
  onLogout,
}: CommandMenuProps) {
  const { theme, setTheme } = useTheme();

  // Listen for keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const handleSelect = (callback: () => void) => {
    onOpenChange(false);
    callback();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search society items... (Ctrl + K)" />
      <CommandList className="max-h-[360px] py-2">
        <CommandEmpty>No matching results found.</CommandEmpty>

        <CommandGroup heading="Navigation & Views">
          <CommandItem onSelect={() => handleSelect(() => onNavigate("dashboard"))}>
            <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
            <span>Dashboard Overview</span>
            <CommandShortcut>G D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => onNavigate("all-issues"))}>
            <FileText className="mr-2 h-4 w-4 text-sky-500" />
            <span>All Grievances & Tickets</span>
            <CommandShortcut>G I</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => onNavigate("ai-agents"))}>
            <Bot className="mr-2 h-4 w-4 text-indigo-500" />
            <span>Automated Operations Center</span>
            <CommandShortcut>G A</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => onNavigate("ai-billing"))}>
            <CreditCard className="mr-2 h-4 w-4 text-emerald-500" />
            <span>AI Billing Anomaly Analysis</span>
            <CommandShortcut>G B</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => onNavigate("technicians"))}>
            <Wrench className="mr-2 h-4 w-4 text-amber-500" />
            <span>Technician Roster & Matching</span>
            <CommandShortcut>G T</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => onNavigate("residents"))}>
            <Users className="mr-2 h-4 w-4 text-purple-500" />
            <span>Residents Directory</span>
            <CommandShortcut>G R</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => onNavigate("notifications"))}>
            <Bell className="mr-2 h-4 w-4 text-rose-500" />
            <span>Notifications Hub</span>
            <CommandShortcut>G N</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => handleSelect(() => onNavigate("report-issue"))}>
            <PlusCircle className="mr-2 h-4 w-4 text-primary" />
            <span>Report New Issue (AI Assisted)</span>
            <CommandShortcut>N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => onNavigate("ai-billing"))}>
            <Sparkles className="mr-2 h-4 w-4 text-indigo-500" />
            <span>Trigger AI Duplicate Billing Scan</span>
          </CommandItem>
        </CommandGroup>

        {onRoleSwitch && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Switch Demo Role Perspective">
              <CommandItem onSelect={() => handleSelect(() => onRoleSwitch("admin"))}>
                <Shield className="mr-2 h-4 w-4 text-primary" />
                <span>Switch to Society Administrator</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect(() => onRoleSwitch("resident"))}>
                <Users className="mr-2 h-4 w-4 text-sky-500" />
                <span>Switch to Resident Portal</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect(() => onRoleSwitch("technician"))}>
                <Wrench className="mr-2 h-4 w-4 text-amber-500" />
                <span>Switch to Technician Portal</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}

        <CommandSeparator />

        <CommandGroup heading="Preferences & Session">
          <CommandItem onSelect={() => handleSelect(() => setTheme(theme === "dark" ? "light" : "dark"))}>
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="mr-2 h-4 w-4 text-indigo-400" />
            )}
            <span>Toggle Theme ({theme === "dark" ? "Light Mode" : "Dark Mode"})</span>
            <CommandShortcut>T</CommandShortcut>
          </CommandItem>
          {onLogout && (
            <CommandItem onSelect={() => handleSelect(onLogout)} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4 text-destructive" />
              <span>Log Out</span>
            </CommandItem>
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
