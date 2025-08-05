import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  MapPin, 
  AlertTriangle, 
  Droplets, 
  Zap, 
  Shield, 
  Volume2,
  Camera,
  MessageSquare,
  MoreHorizontal
} from "lucide-react";

interface Issue {
  id: string;
  title: string;
  description: string;
  status: "new" | "assigned" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: "sanitation" | "security" | "water" | "electrical" | "elevator" | "noise";
  reporter: {
    name: string;
    avatar?: string;
    flatNumber: string;
  };
  assignedTo?: {
    name: string;
    avatar?: string;
  };
  location: string;
  createdAt: Date;
  hasMedia: boolean;
  commentsCount: number;
}

interface IssueCardProps {
  issue: Issue;
  onCardClick?: (issue: Issue) => void;
  variant?: "compact" | "detailed";
  showActions?: boolean;
}

const statusConfig = {
  new: { label: "New", variant: "pending" as const },
  assigned: { label: "Assigned", variant: "progress" as const },
  "in-progress": { label: "In Progress", variant: "progress" as const },
  resolved: { label: "Resolved", variant: "resolved" as const },
  closed: { label: "Closed", variant: "resolved" as const },
};

const priorityConfig = {
  low: { label: "Low", variant: "secondary" as const },
  medium: { label: "Medium", variant: "pending" as const },
  high: { label: "High", variant: "progress" as const },
  urgent: { label: "Urgent", variant: "urgent" as const },
};

const categoryIcons = {
  sanitation: AlertTriangle,
  security: Shield,
  water: Droplets,
  electrical: Zap,
  elevator: AlertTriangle,
  noise: Volume2,
};

export function IssueCard({ 
  issue, 
  onCardClick, 
  variant = "detailed",
  showActions = true 
}: IssueCardProps) {
  const CategoryIcon = categoryIcons[issue.category];
  const timeAgo = formatTimeAgo(issue.createdAt);

  return (
    <Card 
      className={cn(
        "transition-all duration-normal hover:shadow-md cursor-pointer",
        variant === "compact" && "p-4"
      )}
      onClick={() => onCardClick?.(issue)}
    >
      {variant === "detailed" && (
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary-light p-2">
                <CategoryIcon className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold line-clamp-1">{issue.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant={statusConfig[issue.status].variant}>
                    {statusConfig[issue.status].label}
                  </Badge>
                  <Badge variant={priorityConfig[issue.priority].variant}>
                    {priorityConfig[issue.priority].label}
                  </Badge>
                  <span className="text-sm text-text-muted capitalize">
                    {issue.category}
                  </span>
                </div>
              </div>
            </div>
            {showActions && (
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
      )}

      <CardContent className={cn(variant === "compact" && "p-0")}>
        {variant === "compact" && (
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg bg-primary-light p-2">
              <CategoryIcon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium line-clamp-1">{issue.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={statusConfig[issue.status].variant} className="text-xs">
                  {statusConfig[issue.status].label}
                </Badge>
                <Badge variant={priorityConfig[issue.priority].variant} className="text-xs">
                  {priorityConfig[issue.priority].label}
                </Badge>
              </div>
            </div>
          </div>
        )}

        <p className="text-sm text-text-secondary mb-4 line-clamp-2">
          {issue.description}
        </p>

        <div className="space-y-3">
          {/* Location & Time */}
          <div className="flex items-center gap-4 text-sm text-text-muted">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{issue.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{timeAgo}</span>
            </div>
          </div>

          {/* Reporter & Assignee */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={issue.reporter.avatar} />
                <AvatarFallback className="text-xs">
                  {issue.reporter.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <span className="text-text-secondary">Reported by </span>
                <span className="font-medium">{issue.reporter.name}</span>
                <span className="text-text-muted"> ({issue.reporter.flatNumber})</span>
              </div>
            </div>

            {issue.assignedTo && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-muted">Assigned to</span>
                <Avatar className="h-6 w-6">
                  <AvatarImage src={issue.assignedTo.avatar} />
                  <AvatarFallback className="text-xs">
                    {issue.assignedTo.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{issue.assignedTo.name}</span>
              </div>
            )}
          </div>

          {/* Media & Comments */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-3">
              {issue.hasMedia && (
                <div className="flex items-center gap-1 text-xs text-text-muted">
                  <Camera className="h-3 w-3" />
                  <span>Has attachments</span>
                </div>
              )}
              {issue.commentsCount > 0 && (
                <div className="flex items-center gap-1 text-xs text-text-muted">
                  <MessageSquare className="h-3 w-3" />
                  <span>{issue.commentsCount} comments</span>
                </div>
              )}
            </div>
            
            <div className="text-xs text-text-muted">
              #{issue.id.slice(-6)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
}