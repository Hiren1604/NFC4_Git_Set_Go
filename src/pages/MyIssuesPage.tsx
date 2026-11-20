import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchIssues, submitIssueRating } from "@/store/slices/issuesSlice";
import { setActiveItem } from "@/store/slices/navigationSlice";
import {
  FileText,
  Plus,
  Eye,
  Clock,
  Phone,
  CheckCircle2,
  Wrench,
  Zap,
  Home,
  Shield,
  Layers,
  Sparkles,
  Bot,
  Search,
  RotateCcw,
  Activity,
  Star,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";

interface MyIssuesPageProps {
  user?: any;
  onNavigate?: (item: string) => void;
}

export default function MyIssuesPage({ user: propUser, onNavigate }: MyIssuesPageProps) {
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const user = propUser || reduxUser;
  const issues = useAppSelector((state) => state.issues.items);
  const loading = useAppSelector((state) => state.issues.loading);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [activeIssue, setActiveIssue] = useState<any>(null);

  // Feedback & Rating Modal State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackIssue, setFeedbackIssue] = useState<any>(null);
  const [ratingScore, setRatingScore] = useState(5);
  const [hoverScore, setHoverScore] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchIssues());
  }, [dispatch]);

  const handleOpenFeedbackModal = (issue: any) => {
    setFeedbackIssue(issue);
    setRatingScore(issue.rating?.score || 5);
    setFeedbackComment(issue.rating?.feedback || "");
    setSelectedTags([]);
    setFeedbackSuccess(null);
    setShowFeedbackModal(true);
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackIssue) return;
    setIsSubmittingFeedback(true);
    setFeedbackSuccess(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in to rate an issue.");
      }

      const combinedFeedback = [
        selectedTags.length > 0 ? selectedTags.join(", ") : "",
        feedbackComment.trim(),
      ]
        .filter(Boolean)
        .join(". ");

      await dispatch(
        submitIssueRating({
          id: feedbackIssue._id,
          score: ratingScore,
          feedback: combinedFeedback || "Satisfied with completed repair work.",
        })
      ).unwrap();

      setFeedbackSuccess("⭐ Thank you! Your feedback and rating have been recorded.");
      setTimeout(() => {
        setShowFeedbackModal(false);
        setFeedbackSuccess(null);
      }, 1500);
    } catch (err: any) {
      alert(err.message || "Failed to submit feedback");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Filtered issues
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof issue.assignedTo === "object" &&
        issue.assignedTo?.name?.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" ? true : issue.status?.toLowerCase() === filterStatus.toLowerCase();

    const matchesCategory =
      filterCategory === "all" ? true : issue.category?.toLowerCase() === filterCategory.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const activeCount = issues.filter((i) => i.status !== "resolved" && i.status !== "closed").length;
  const resolvedCount = issues.filter((i) => i.status === "resolved" || i.status === "closed").length;

  const getCategoryIcon = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case "plumbing":
        return <Wrench className="h-4 w-4 text-sky-500" />;
      case "electrical":
        return <Zap className="h-4 w-4 text-amber-500" />;
      case "carpentry":
        return <Home className="h-4 w-4 text-orange-500" />;
      case "elevator":
        return <Layers className="h-4 w-4 text-purple-500" />;
      case "security":
        return <Shield className="h-4 w-4 text-emerald-500" />;
      case "cleaning":
        return <Sparkles className="h-4 w-4 text-teal-500" />;
      default:
        return <Wrench className="h-4 w-4 text-primary" />;
    }
  };

  const getScoreLabel = (score: number) => {
    switch (score) {
      case 1:
        return "Poor Service";
      case 2:
        return "Fair";
      case 3:
        return "Satisfactory";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent Repair & Professionalism!";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Catchy Hero Greeting & Direct CTA Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Resident Grievances Ledger // Live Sync
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            My Maintenance Grievances
          </h1>
          <p className="text-xs text-muted-foreground">
            Monitor real-time progress, technician assignment, priority SLA, and provide post-completion feedback.
          </p>
        </div>

        <Button
          onClick={() => {
            if (onNavigate) onNavigate("report-issue");
            dispatch(setActiveItem("report-issue"));
          }}
          className="bg-primary hover:bg-primary/90 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-md cursor-pointer shrink-0 transition-transform active:scale-95"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Report New Grievance ⚡
        </Button>
      </div>

      {/* KPI Overview Bento Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
              <span>Active Issues</span>
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <FileText className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">{activeCount}</div>
            <p className="text-[11px] text-amber-600 font-medium mt-1">Under dispatch or in-progress</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
              <span>Resolved Tickets</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600">{resolvedCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Repairs completed & rated</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
              <span>Feedback Match Rate</span>
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                <Star className="h-3.5 w-3.5 fill-blue-500" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-600">100%</div>
            <p className="text-[11px] text-muted-foreground mt-1">Resident verified reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Search & Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md p-3.5 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by issue title, description, or technician name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-9 rounded-xl border-border/80 bg-background/80"
          />
        </div>

        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[130px] text-xs h-9 rounded-xl bg-background/80 border-border/80">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[140px] text-xs h-9 rounded-xl bg-background/80 border-border/80">
              <SelectValue placeholder="All Domains" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Domains</SelectItem>
              <SelectItem value="plumbing">Plumbing</SelectItem>
              <SelectItem value="electrical">Electrical</SelectItem>
              <SelectItem value="carpentry">Carpentry</SelectItem>
              <SelectItem value="elevator">Elevators</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="cleaning">Sanitation</SelectItem>
            </SelectContent>
          </Select>

          {(searchQuery || filterStatus !== "all" || filterCategory !== "all") && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSearchQuery("");
                setFilterStatus("all");
                setFilterCategory("all");
              }}
              className="h-9 w-9 rounded-xl shrink-0"
              title="Reset Filters"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Issues List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-muted-foreground rounded-2xl border border-border/60 bg-secondary/20">
          <Activity className="h-5 w-5 animate-spin mx-auto text-primary mb-2" />
          <span>Synchronizing grievances with society database...</span>
        </div>
      ) : filteredIssues.length === 0 ? (
        <Card className="rounded-2xl border border-dashed border-border/80 bg-white/50 dark:bg-slate-900/40 p-10 text-center space-y-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto ring-8 ring-primary/5">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">
              {issues.length === 0 ? "No Grievances Reported Yet" : "No Grievances Match Your Search"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              {issues.length === 0
                ? "Your flat currently has zero logged complaints. If an electrical socket, plumbing line, or appliance fails, report it here."
                : "Try adjusting your search terms or domain filter to view other tickets."}
            </p>
          </div>
          <Button
            onClick={() => {
              if (onNavigate) onNavigate("report-issue");
              dispatch(setActiveItem("report-issue"));
            }}
            className="bg-primary hover:bg-primary/90 text-white font-bold text-xs h-9 px-5 rounded-xl shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Report an Issue Now
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredIssues.map((issue) => {
            const ticketId = `#ISS-${issue._id ? issue._id.slice(-6).toUpperCase() : issue.ticketId || issue.id}`;
            const tech = typeof issue.assignedTo === "object" ? issue.assignedTo : null;
            const techName = tech?.name || (typeof issue.assignedTo === "string" ? issue.assignedTo : "On-Duty Auto-Assigned");
            const techPhone = tech?.phone || null;
            const isDone = issue.status === "resolved" || issue.status === "closed";
            const hasRating = Boolean(issue.rating?.score);
            const dateStr = issue.createdAt
              ? new Date(issue.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : issue.date || "Today";

            return (
              <Card
                key={issue._id || issue.id}
                className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                    <div className="space-y-2.5 flex-1">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                          {ticketId}
                        </span>
                        <h3 className="font-bold text-sm sm:text-base text-foreground tracking-tight">
                          {issue.title}
                        </h3>
                        <Badge
                          variant={issue.priority === "urgent" ? "destructive" : "secondary"}
                          className="text-[10px] uppercase font-mono h-4 px-1.5"
                        >
                          {issue.priority}
                        </Badge>
                        <Badge
                          className={`text-[10px] capitalize font-semibold ${
                            isDone
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                              : "bg-primary/10 text-primary border border-primary/20"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full mr-1 ${
                              isDone ? "bg-emerald-500" : "bg-primary animate-pulse"
                            }`}
                          />
                          {issue.status}
                        </Badge>
                        <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground capitalize">
                          {getCategoryIcon(issue.category)}
                          <span>{issue.category}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground leading-relaxed">{issue.description}</p>

                      {/* AI Reasoning Capsule */}
                      {(issue.aiReason || issue.aiAnalysis?.reasoning) && (
                        <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-xs text-primary flex items-start gap-2.5">
                          <Bot className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                          <p className="leading-relaxed">
                            <strong className="font-semibold text-foreground">AI Triage Classification: </strong>
                            {issue.aiReason || issue.aiAnalysis?.reasoning}
                          </p>
                        </div>
                      )}

                      {/* Feedback & Star Display if Rated */}
                      {hasRating && (
                        <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs">
                          <div className="flex text-amber-500">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`h-3.5 w-3.5 ${
                                  s <= issue.rating.score
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-bold text-foreground font-mono">
                            {issue.rating.score}/5
                          </span>
                          {issue.rating.feedback && (
                            <span className="text-[11px] text-muted-foreground italic truncate max-w-sm">
                              "{issue.rating.feedback}"
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenFeedbackModal(issue)}
                            className="text-[10px] text-primary hover:underline ml-auto font-medium cursor-pointer"
                          >
                            Update Feedback
                          </button>
                        </div>
                      )}

                      {/* Technician & Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-[10px]">
                              {techName ? techName[0] : "T"}
                            </AvatarFallback>
                          </Avatar>
                          <span>
                            Technician: <strong className="text-foreground">{techName}</strong>
                            {tech?.skills && (
                              <span className="text-[10px] text-muted-foreground ml-1 font-mono">
                                ({tech.skills.join(", ")})
                              </span>
                            )}
                          </span>
                        </div>

                        {techPhone && (
                          <a
                            href={`tel:${techPhone}`}
                            className="flex items-center gap-1 text-primary hover:underline font-mono text-[11px]"
                          >
                            <Phone className="h-3 w-3" />
                            <span>{techPhone}</span>
                          </a>
                        )}

                        {tech?.hourlyRate && (
                          <span className="font-mono text-emerald-600 font-semibold">
                            ₹{tech.hourlyRate}/hr
                          </span>
                        )}

                        <span className="text-muted-foreground">Filed: {dateStr}</span>
                      </div>
                    </div>

                    {/* Action Buttons Column */}
                    <div className="flex md:flex-col items-center gap-2 shrink-0 w-full md:w-auto">
                      {/* Give Feedback / Rate Service Button */}
                      {isDone && !hasRating && (
                        <Button
                          size="sm"
                          onClick={() => handleOpenFeedbackModal(issue)}
                          className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs h-8 px-3.5 rounded-xl shadow-xs cursor-pointer w-full md:w-auto"
                        >
                          <Star className="h-3.5 w-3.5 mr-1.5 fill-white" />
                          Give Feedback ⭐
                        </Button>
                      )}

                      {/* Mark Done & Rate Button (If work is assigned or in progress) */}
                      {!isDone && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenFeedbackModal(issue)}
                          className="text-xs h-8 px-3 rounded-xl border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10 cursor-pointer w-full md:w-auto"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
                          Mark Done & Rate
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-8 px-3 rounded-xl border-border/80 w-full md:w-auto"
                        onClick={() => {
                          setActiveIssue(issue);
                          setShowTimelineModal(true);
                        }}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1.5 text-primary" />
                        Audit Timeline
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Give Feedback & Rating Modal */}
      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="sm:max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              Service Feedback & Rating
            </DialogTitle>
          </DialogHeader>

          {feedbackIssue && (
            <div className="space-y-4 py-2 text-xs">
              {/* Issue & Tech Context */}
              <div className="p-3 rounded-xl bg-secondary/50 border border-border/80 space-y-1">
                <span className="font-mono text-muted-foreground text-[10px]">
                  #ISS-{feedbackIssue._id ? feedbackIssue._id.slice(-6).toUpperCase() : "RESOLVED"}
                </span>
                <h4 className="font-bold text-sm text-foreground">{feedbackIssue.title}</h4>
                <p className="text-[11px] text-muted-foreground">
                  Personnel:{" "}
                  <strong className="text-foreground">
                    {feedbackIssue.assignedTo?.name || "Assigned Technician"}
                  </strong>{" "}
                  • Flat {feedbackIssue.location?.flatNumber || user?.flatNumber || "101"}
                </p>
              </div>

              {/* 5-Star Interactive Selector */}
              <div className="space-y-1.5 text-center py-2 bg-card/60 border border-border/60 rounded-xl p-3">
                <span className="text-[11px] text-muted-foreground block font-semibold">
                  How would you rate the technician's repair work?
                </span>
                <div className="flex justify-center items-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const filled = (hoverScore || ratingScore) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverScore(star)}
                        onMouseLeave={() => setHoverScore(0)}
                        onClick={() => setRatingScore(star)}
                        className="p-1 hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`h-7 w-7 transition-colors ${
                            filled
                              ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                              : "text-muted-foreground/30 hover:text-amber-300"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-bold text-primary block mt-1">
                  {getScoreLabel(hoverScore || ratingScore)}
                </span>
              </div>

              {/* Quick Feedback Attribute Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground block">
                  Quick Review Highlights:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "⚡ Prompt Arrival",
                    "🔧 High Quality Fix",
                    "🧹 Clean Work Area",
                    "🤝 Polite & Respectful",
                    "💰 Fair Trade Rate",
                    "⚠️ Delayed",
                  ].map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`text-[10px] font-medium px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-primary text-white border-primary shadow-xs"
                            : "bg-secondary/40 text-muted-foreground border-border/80 hover:bg-secondary"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback Textarea */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground block">
                  Additional Comments (Optional):
                </span>
                <Textarea
                  placeholder="Share details about the repair experience, promptness, or suggestions..."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  className="text-xs min-h-[70px] rounded-xl border-border/80 bg-background/80"
                />
              </div>

              {feedbackSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{feedbackSuccess}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFeedbackModal(false)}
                  disabled={isSubmittingFeedback}
                  className="flex-1 text-xs h-9 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitFeedback}
                  disabled={isSubmittingFeedback}
                  className="flex-1 text-xs h-9 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-md cursor-pointer"
                >
                  {isSubmittingFeedback ? (
                    <span className="flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5 animate-spin" /> Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <ThumbsUp className="h-3.5 w-3.5" /> Submit Review
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Timeline Modal */}
      <Dialog open={showTimelineModal} onOpenChange={setShowTimelineModal}>
        <DialogContent className="sm:max-w-lg rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Grievance Lifecycle & Audit Timeline
            </DialogTitle>
          </DialogHeader>

          {activeIssue && (
            <div className="space-y-4 py-2 text-xs">
              <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/80">
                <span className="font-mono text-muted-foreground text-[10px]">
                  #ISS-{activeIssue._id ? activeIssue._id.slice(-6).toUpperCase() : activeIssue.ticketId || activeIssue.id}
                </span>
                <h4 className="font-bold text-sm text-foreground mt-0.5">{activeIssue.title}</h4>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {activeIssue.category}
                  </Badge>
                  <Badge className="text-[10px] capitalize bg-primary/10 text-primary">
                    {activeIssue.status}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px] uppercase font-mono">
                    {activeIssue.priority}
                  </Badge>
                </div>
              </div>

              <div className="relative border-l-2 border-primary/30 ml-3 pl-6 space-y-4 pt-1">
                {(activeIssue.timeline || activeIssue.updates || [
                  {
                    message: "Issue registered in database",
                    timestamp: activeIssue.createdAt,
                  },
                ]).map((update: any, idx: number) => {
                  const timeStr = update.timestamp
                    ? new Date(update.timestamp).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : update.date || "Initial";

                  return (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[31px] top-0.5 h-3.5 w-3.5 rounded-full bg-primary ring-4 ring-background" />
                      <span className="font-mono text-muted-foreground text-[10px]">{timeStr}</span>
                      <p className="font-semibold text-foreground mt-0.5 text-xs">{update.message}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
