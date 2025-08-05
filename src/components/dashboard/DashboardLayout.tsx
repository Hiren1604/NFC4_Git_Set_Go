import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  sidebar: ReactNode;
  main: ReactNode;
  rightPanel?: ReactNode;
  className?: string;
}

export function DashboardLayout({ sidebar, main, rightPanel, className }: DashboardLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <div className="flex w-full">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-80 bg-background-sidebar border-r border-border">
          {sidebar}
        </aside>
        
        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-normal",
          rightPanel ? "ml-80 mr-80" : "ml-80"
        )}>
          <div className="p-6">
            {main}
          </div>
        </main>
        
        {/* Right Panel */}
        {rightPanel && (
          <aside className="fixed right-0 top-0 h-full w-80 bg-background border-l border-border">
            {rightPanel}
          </aside>
        )}
      </div>
    </div>
  );
}