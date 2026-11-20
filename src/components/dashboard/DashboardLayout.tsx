import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TopHeader } from "./TopHeader";
import { CommandMenu } from "./CommandMenu";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CriticalAlertBanner } from "./CriticalAlertBanner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCommandMenuOpen, setMobileMenuOpen } from "@/store/slices/navigationSlice";

interface DashboardLayoutProps {
  sidebar: ReactNode;
  main: ReactNode;
  rightPanel?: ReactNode;
  className?: string;
  user: {
    name: string;
    email: string;
    role: "admin" | "resident" | "technician";
    flatNumber?: string;
    building?: string;
  };
  activeItem: string;
  onNavigate: (viewId: string) => void;
  onRoleSwitch?: (role: "admin" | "resident" | "technician") => void;
  onLogout: () => void;
}

export function DashboardLayout({
  sidebar,
  main,
  rightPanel,
  className,
  user,
  activeItem,
  onNavigate,
  onRoleSwitch,
  onLogout,
}: DashboardLayoutProps) {
  const dispatch = useAppDispatch();
  const commandOpen = useAppSelector((state) => state.navigation.commandMenuOpen);
  const mobileMenuOpen = useAppSelector((state) => state.navigation.mobileMenuOpen);

  return (
    <div className={cn("min-h-screen bg-background text-foreground flex flex-col antialiased", className)}>
      {/* Command Palette (Ctrl + K) */}
      <CommandMenu
        open={commandOpen}
        onOpenChange={(open) => dispatch(setCommandMenuOpen(open))}
        onNavigate={onNavigate}
        onRoleSwitch={onRoleSwitch}
        onLogout={onLogout}
      />

      <div className="flex flex-1 w-full relative">
        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => dispatch(setMobileMenuOpen(false))}
          />
        )}

        {/* Sidebar Desktop */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-background transition-transform duration-200 ease-in-out lg:translate-x-0",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Close button for mobile */}
          <div className="absolute top-3 right-3 lg:hidden z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => dispatch(setMobileMenuOpen(false))}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {sidebar}
        </aside>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col lg:pl-64 min-w-0 transition-all duration-200">
          {/* Top Header */}
          <div className="flex items-center">
            {/* Mobile hamburger trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 ml-3 lg:hidden shrink-0"
              onClick={() => dispatch(setMobileMenuOpen(true))}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <TopHeader
                user={user}
                activeItem={activeItem}
                onOpenCommand={() => dispatch(setCommandMenuOpen(true))}
                onNavigate={(item) => {
                  onNavigate(item);
                  dispatch(setMobileMenuOpen(false));
                }}
                onLogout={onLogout}
              />
            </div>
          </div>

          {/* Main Viewport Container with Ambient Luminous Glow */}
          <div className="relative flex-1">
            {/* Ambient specular light orbs behind dashboard glassmorphism */}
            <div className="pointer-events-none fixed top-20 left-72 w-96 h-96 bg-primary/5 rounded-full blur-[140px] -z-10" />
            <div className="pointer-events-none fixed bottom-10 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[140px] -z-10" />
            <div className="pointer-events-none fixed top-1/2 left-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-[130px] -z-10" />

            <main className="flex-1 p-3 sm:p-5 md:p-8 max-w-7xl mx-auto w-full transition-all space-y-4">
              <CriticalAlertBanner role={user.role} onAction={onNavigate} />
              {main}
            </main>
          </div>
        </div>

        {/* Right Panel (Optional inspector) */}
        {rightPanel && (
          <aside className="hidden xl:block fixed right-0 top-16 bottom-0 w-80 bg-background border-l border-border overflow-y-auto">
            {rightPanel}
          </aside>
        )}
      </div>
    </div>
  );
}