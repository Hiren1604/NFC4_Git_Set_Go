import { API_BASE_URL } from "@/constants";
import { useState, useEffect } from "react";
import type { AuthUser as UserType } from "@/types/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BillDisputeModal } from "@/components/ui/bill-dispute-modal";
import {
  Home,
  FileText,
  CreditCard,
  Shield,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  Upload,
  Calendar,
  DollarSign,
  User,
  Plus,
  Eye,
  MessageSquare,
  Star,
  MapPin,
  Mail,
  Check,
  Ban,
  Flame,
  Heart,
  Car,
  Package,
  Edit,
  Bot,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Sliders,
  CheckCircle2,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchIssues } from "@/store/slices/issuesSlice";
import { setActiveItem } from "@/store/slices/navigationSlice";

interface ResidentDashboardProps {
  user?: UserType;
  onNavigate?: (item: string) => void;
}

export function ResidentDashboard({ user: propUser, onNavigate }: ResidentDashboardProps) {
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const user = propUser || reduxUser;
  const complaints = useAppSelector((state) => state.issues.items);
  const loadingComplaints = useAppSelector((state) => state.issues.loading);

  const [selectedTab, setSelectedTab] = useState("complaints");
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyType, setEmergencyType] = useState<"medical" | "fire" | "security">("medical");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [sosTriggered, setSosTriggered] = useState(false);

  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [activeTimelineIssue, setActiveTimelineIssue] = useState<any>(null);

  const [showProofModal, setShowProofModal] = useState(false);
  const [proofSubmitted, setProofSubmitted] = useState(false);

  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("Plumber");
  const [selectedSlot, setSelectedSlot] = useState<string>("2:00 PM Today");

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    dispatch(fetchIssues());
  }, [dispatch]);

  // Bills state
  const [bills, setBills] = useState<any[]>([]);

  // Fetch real bills for logged-in resident from MongoDB
  useEffect(() => {
    const fetchResidentBills = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await fetch(`${API_BASE_URL}/bills`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setBills(
              data.map((b: any) => ({
                id: b._id,
                type: b.description || (b.type.charAt(0).toUpperCase() + b.type.slice(1) + " Bill"),
                amount: b.amount,
                dueDate: new Date(b.dueDate).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }),
                status: b.status,
                description: b.description,
              }))
            );
          }
        }
      } catch (err) {
        console.error("Failed to load resident bills:", err);
      }
    };

    fetchResidentBills();
  }, []);

  const unpaidTotal = bills
    .filter((b) => b.status === "pending" || b.status === "disputed")
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  // Handle dispute submission to backend
  const handleDisputeSubmit = async (disputeData: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/bills/${disputeData.billId}/dispute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: disputeData.type,
          description: disputeData.description || disputeData.doublePaymentDetails || disputeData.wrongSplitDetails,
          transactionId: disputeData.transactionId,
          paymentDate: disputeData.paymentDate,
          paymentMethod: disputeData.paymentMethod,
        }),
      });

      // Update local state for immediate feedback
      setBills((prev) =>
        prev.map((b) => (b.id === disputeData.billId ? { ...b, status: "disputed" } : b))
      );
    } catch (error) {
      console.error("Dispute error:", error);
    }
  };

  // 3-second SOS Countdown Handler
  const startSOS = (type: "medical" | "fire" | "security") => {
    setEmergencyType(type);
    setShowEmergencyModal(true);
    setSosTriggered(false);
    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          setSosTriggered(true);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelSOS = () => {
    setCountdown(null);
    setSosTriggered(false);
    setShowEmergencyModal(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Resident Greeting Banner (Glassmorphic Bento) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Resident Portal // Verified Resident</span>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Welcome home, {user?.name || "Resident"}
            </h1>
            <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
              {user?.building || "Tower A"} • Flat {user?.flatNumber || "501"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Emerald Heights Community Portal • Society Notice: AGM on Sunday at 11 AM in Clubhouse.
          </p>
        </div>

        <Button
          onClick={() => {
            if (onNavigate) onNavigate("report-issue");
            dispatch(setActiveItem("report-issue"));
          }}
          className="bg-primary hover:bg-primary/90 text-white text-xs h-9 px-4 rounded-xl shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Report Grievance
        </Button>
      </div>

      {/* KPI Overview (Glassmorphic Bento Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
              <span>Active Issues</span>
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <FileText className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
              {complaints.filter((c) => c.status !== "resolved").length}
            </div>
            <p className="text-[11px] text-amber-600 font-medium mt-1">In-progress repairs & tickets</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
              <span>Unpaid Dues</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <CreditCard className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
              ₹{unpaidTotal.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {bills.filter((b) => b.status === "pending").length} pending bill(s)
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
              <span>Maintenance Score</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <CheckCircle className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600">96%</div>
            <Progress value={96} className="h-1.5 mt-2 bg-secondary" />
          </CardContent>
        </Card>
      </div>

      {/* Responsive Tabs Navigation */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="overflow-x-auto no-scrollbar -mx-2 px-2 pb-1">
          <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 sm:w-auto p-1 bg-secondary/60 rounded-xl border border-border/60 gap-1 backdrop-blur-md">
            <TabsTrigger value="complaints" className="text-xs shrink-0 px-3 py-1.5 font-semibold">
              Complaints ({complaints.length})
            </TabsTrigger>
            <TabsTrigger value="bills" className="text-xs shrink-0 px-3 py-1.5 font-semibold">
              Bills & Pay
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="text-xs shrink-0 px-3 py-1.5 font-semibold">
              Book Help
            </TabsTrigger>
            <TabsTrigger value="emergency" className="text-xs shrink-0 px-3 py-1.5 font-bold text-destructive">
              SOS Alert
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Complaints */}
        <TabsContent value="complaints" className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
            <span className="text-xs text-muted-foreground font-medium">
              Logged society complaints & maintenance tickets
            </span>
            <Button
              size="sm"
              onClick={() => (onNavigate ? onNavigate("report-issue") : null)}
              className="text-xs h-8 rounded-xl bg-primary hover:bg-primary/90 text-white shrink-0 cursor-pointer shadow-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Report New Grievance
            </Button>
          </div>

          {loadingComplaints ? (
            <div className="p-8 text-center text-xs text-muted-foreground rounded-2xl border border-border/60 bg-secondary/20">
              <span className="inline-block animate-spin mr-2">⚡</span> Loading grievances from society database...
            </div>
          ) : complaints.length === 0 ? (
            <Card className="rounded-2xl border border-dashed border-border/80 bg-white/50 dark:bg-slate-900/40 p-8 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">No active grievances</h4>
                <p className="text-xs text-muted-foreground mt-0.5 max-w-sm mx-auto">
                  All utilities and fixtures in your flat are operating normally. If something breaks, report it and our AI will immediately dispatch a technician.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  if (onNavigate) onNavigate("report-issue");
                  dispatch(setActiveItem("report-issue"));
                }}
                className="bg-primary hover:bg-primary/90 text-white text-xs h-8 px-4 rounded-xl shadow-xs font-semibold cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Report a Grievance
              </Button>
            </Card>
          ) : (
            complaints.map((issue) => {
              const ticketId = `#ISS-${issue._id ? issue._id.slice(-6).toUpperCase() : issue.ticketId || issue.id}`;
              const assignedName = typeof issue.assignedTo === "object" && issue.assignedTo?.name ? issue.assignedTo.name : typeof issue.assignedTo === "string" ? issue.assignedTo : "On-Duty Auto-Assigned";
              const assignedPhone = typeof issue.assignedTo === "object" ? issue.assignedTo?.phone : null;
              const dateStr = issue.createdAt ? new Date(issue.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : issue.date || "Today";

              return (
                <Card key={issue._id || issue.id} className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-muted-foreground">{ticketId}</span>
                          <h3 className="font-bold text-sm text-foreground">{issue.title}</h3>
                          <Badge
                            variant={issue.priority === "urgent" ? "destructive" : "secondary"}
                            className="text-[10px] uppercase font-mono h-4 px-1.5"
                          >
                            {issue.priority}
                          </Badge>
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-[10px] capitalize font-medium">
                            {issue.status}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {issue.category}
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">{issue.description}</p>

                        {(issue.aiReason || issue.aiAnalysis?.reasoning) && (
                          <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-xs text-primary flex items-start gap-2.5">
                            <Bot className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                            <p className="leading-relaxed">
                              <strong className="font-semibold text-foreground">AI Triage Note: </strong>
                              {issue.aiReason || issue.aiAnalysis?.reasoning}
                            </p>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                          <span>
                            Assigned to: <strong className="text-foreground">{assignedName}</strong>
                            {assignedPhone && <span className="ml-1 text-[11px] font-mono text-muted-foreground">({assignedPhone})</span>}
                          </span>
                          <span>Filed: {dateStr}</span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-8 shrink-0 rounded-lg border-border/80"
                        onClick={() => {
                          setActiveTimelineIssue(issue);
                          setShowTimelineModal(true);
                        }}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1 text-primary" />
                        Audit Timeline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* Tab 2: Bills & Payments */}
        <TabsContent value="bills" className="space-y-4 pt-2">
          {bills.map((bill) => (
            <Card key={bill.id} className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground">{bill.type}</h4>
                      <Badge
                        variant={
                          bill.status === "paid"
                            ? "default"
                            : bill.status === "disputed"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-[10px] capitalize"
                      >
                        {bill.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{bill.description}</p>
                    <span className="text-[11px] font-mono text-muted-foreground">Due: {bill.dueDate}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold font-mono text-foreground">₹{bill.amount}</div>
                    <div className="flex items-center gap-2 mt-2">
                      {bill.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-white text-xs h-8"
                            onClick={() => {
                              setBills((prev) =>
                                prev.map((b) => (b.id === bill.id ? { ...b, status: "paid" } : b))
                              );
                            }}
                          >
                            Pay via UPI / Card
                          </Button>
                          <BillDisputeModal bill={bill} onDisputeSubmit={handleDisputeSubmit} />
                        </>
                      )}
                      {bill.status === "disputed" && (
                        <Badge variant="outline" className="text-destructive border-destructive/40 text-xs py-1">
                          Under Arbitration
                        </Badge>
                      )}
                      {bill.status === "paid" && (
                        <Badge className="bg-emerald-500 text-white text-xs py-1">
                          Payment Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Tab 3: Book Maintenance */}
        <TabsContent value="maintenance" className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-5 text-center space-y-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
                  <Wrench className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Plumber</h4>
                  <p className="text-xs text-muted-foreground">Pipe repair, sanitary fittings</p>
                  <p className="text-xs font-mono font-semibold text-primary mt-1">₹500 / hr</p>
                </div>
                <Button
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => {
                    setSelectedService("Plumber");
                    setShowBookModal(true);
                  }}
                >
                  Book Appointment
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-5 text-center space-y-3">
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 mx-auto">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Electrician</h4>
                  <p className="text-xs text-muted-foreground">MCB tripping, appliance wiring</p>
                  <p className="text-xs font-mono font-semibold text-primary mt-1">₹600 / hr</p>
                </div>
                <Button
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => {
                    setSelectedService("Electrician");
                    setShowBookModal(true);
                  }}
                >
                  Book Appointment
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-5 text-center space-y-3">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 mx-auto">
                  <Home className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Carpenter</h4>
                  <p className="text-xs text-muted-foreground">Door lock repair, furniture fixes</p>
                  <p className="text-xs font-mono font-semibold text-primary mt-1">₹450 / hr</p>
                </div>
                <Button
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => {
                    setSelectedService("Carpenter");
                    setShowBookModal(true);
                  }}
                >
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 5: Emergency SOS (High Contrast, 3s countdown) */}
        <TabsContent value="emergency" className="space-y-4 pt-2">
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center space-y-4">
            <ShieldAlert className="h-12 w-12 text-destructive mx-auto" />
            <div>
              <h2 className="text-xl font-bold text-destructive">Emergency Society SOS Broadcast</h2>
              <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
                Triggers high-priority intercom sirens at security gatehouse, alerts on-duty doctor/guard, and flashes emergency notification to society administration.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto pt-2">
              <Button
                className="h-24 bg-red-600 hover:bg-red-700 text-white flex-col gap-2 rounded-xl"
                onClick={() => startSOS("medical")}
              >
                <Heart className="h-6 w-6" />
                <span className="font-bold text-sm">Medical Urgent</span>
              </Button>

              <Button
                className="h-24 bg-amber-600 hover:bg-amber-700 text-white flex-col gap-2 rounded-xl"
                onClick={() => startSOS("fire")}
              >
                <Flame className="h-6 w-6" />
                <span className="font-bold text-sm">Fire Hazard</span>
              </Button>

              <Button
                className="h-24 bg-blue-600 hover:bg-blue-700 text-white flex-col gap-2 rounded-xl"
                onClick={() => startSOS("security")}
              >
                <Shield className="h-6 w-6" />
                <span className="font-bold text-sm">Security / Intruder</span>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Emergency Confirmation Modal with Countdown */}
      <Dialog open={showEmergencyModal} onOpenChange={setShowEmergencyModal}>
        <DialogContent className="sm:max-w-md text-center p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-destructive font-bold text-lg flex items-center justify-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              Confirming {emergencyType.toUpperCase()} Emergency
            </DialogTitle>
          </DialogHeader>

          {countdown !== null ? (
            <div className="py-6 space-y-4">
              <div className="h-20 w-20 rounded-full border-4 border-destructive flex items-center justify-center mx-auto text-3xl font-mono font-bold text-destructive animate-pulse">
                {countdown}
              </div>
              <p className="text-xs text-muted-foreground">
                Broadcasting alert to Gatehouse in {countdown} seconds. Click Cancel if pressed accidentally.
              </p>
              <Button variant="outline" className="w-full text-xs" onClick={cancelSOS}>
                Cancel SOS Broadcast
              </Button>
            </div>
          ) : sosTriggered ? (
            <div className="py-6 space-y-3">
              <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-base text-foreground">Alert Dispatched</h3>
              <p className="text-xs text-muted-foreground">
                Emergency response team acknowledged distress call. Assistance dispatched to Flat {user?.flatNumber || "101"}.
              </p>
              <Button size="sm" onClick={() => setShowEmergencyModal(false)} className="text-xs mt-2">
                Close
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Timeline Audit Dialog */}
      <Dialog open={showTimelineModal} onOpenChange={setShowTimelineModal}>
        <DialogContent className="sm:max-w-lg rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Grievance Lifecycle & Audit Timeline
            </DialogTitle>
          </DialogHeader>

          {activeTimelineIssue && (
            <div className="space-y-4 py-2 text-xs">
              <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/80">
                <span className="font-mono text-muted-foreground text-[10px]">
                  #ISS-{activeTimelineIssue._id ? activeTimelineIssue._id.slice(-6).toUpperCase() : activeTimelineIssue.ticketId || activeTimelineIssue.id}
                </span>
                <h4 className="font-bold text-sm text-foreground mt-0.5">{activeTimelineIssue.title}</h4>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {activeTimelineIssue.category}
                  </Badge>
                  <Badge className="text-[10px] capitalize bg-primary/10 text-primary">
                    {activeTimelineIssue.status}
                  </Badge>
                </div>
              </div>

              <div className="relative border-l-2 border-primary/30 ml-3 pl-6 space-y-4 pt-1">
                {(activeTimelineIssue.timeline || activeTimelineIssue.updates || [
                  {
                    message: "Issue registered in database",
                    timestamp: activeTimelineIssue.createdAt,
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