import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon: LucideIcon;
  variant?: "default" | "pending" | "progress" | "resolved" | "urgent";
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  variant = "default",
  className 
}: StatsCardProps) {
  const variantClasses = {
    default: "border-border",
    pending: "border-status-pending bg-status-pending-light",
    progress: "border-status-progress bg-status-progress-light", 
    resolved: "border-status-resolved bg-status-resolved-light",
    urgent: "border-status-urgent bg-status-urgent-light",
  };

  const iconClasses = {
    default: "text-primary",
    pending: "text-status-pending",
    progress: "text-status-progress",
    resolved: "text-status-resolved", 
    urgent: "text-status-urgent",
  };

  return (
    <Card className={cn(
      "transition-all duration-normal hover:shadow-md",
      variantClasses[variant],
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-text-muted text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {change && (
              <div className="flex items-center gap-1">
                <span className={cn(
                  "text-xs font-medium",
                  change.type === "increase" ? "text-status-resolved" : "text-status-urgent"
                )}>
                  {change.type === "increase" ? "+" : ""}{change.value}%
                </span>
                <span className="text-xs text-text-muted">vs last month</span>
              </div>
            )}
          </div>
          <div className={cn(
            "rounded-full p-3 bg-background",
            iconClasses[variant]
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}