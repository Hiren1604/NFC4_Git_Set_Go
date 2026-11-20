import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { ResidentDashboard } from "@/components/dashboard/ResidentDashboard";
import { TechnicianDashboard } from "@/components/dashboard/TechnicianDashboard";
import { AIAgentsPage } from "@/components/dashboard/AIAgentsPage";
import { AIPrioritizedIssues } from "@/components/dashboard/AIPrioritizedIssues";
import { TechniciansPage } from "@/components/dashboard/TechniciansPage";
import AllIssuesPage from "./AllIssuesPage";
import ResidentsPage from "./ResidentsPage";
import ReportIssuePage from "./ReportIssuePage";
import MyIssuesPage from "./MyIssuesPage";
import NotificationsPage from "./NotificationsPage";
import AIBillingAnalysisPage from "./AIBillingAnalysisPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, PhoneCall, Mail, ShieldCheck } from "lucide-react";

import type { AuthUser as User } from "@/types/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveItem } from "@/store/slices/navigationSlice";

interface DashboardPageProps {
  user?: User;
  onLogout?: () => void;
}

export default function DashboardPage({ user: propUser, onLogout }: DashboardPageProps) {
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const activeItem = useAppSelector((state) => state.navigation.activeItem);
  const currentUser = propUser || reduxUser || { name: "Resident", email: "user@society.com", role: "resident" as const };

  const handleNavigate = (item: string) => {
    dispatch(setActiveItem(item));
  };

  const renderHelpView = () => (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-mono uppercase text-muted-foreground">Emerald Heights Governance</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">Society Bylaws & Support Desk</h1>
        <p className="text-xs text-muted-foreground">
          Official society regulations, grievance escalations, and maintenance guidelines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs relative overflow-hidden group hover:border-primary/40 transition-all">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <CardContent className="p-5 flex flex-col items-center text-center">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
              <PhoneCall className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Security Gatehouse</h3>
            <p className="text-xs text-muted-foreground mt-1">Intercom: Ext 101 / 102</p>
            <p className="text-xs font-mono font-bold text-foreground mt-1">+91 98765 43200</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
          <CardContent className="p-5 flex flex-col items-center text-center">
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-3">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Society Management</h3>
            <p className="text-xs text-muted-foreground mt-1">Hours: 9:00 AM – 7:00 PM</p>
            <p className="text-xs font-mono font-bold text-foreground mt-1">admin@emeraldheights.in</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs relative overflow-hidden group hover:border-rose-500/40 transition-all">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-rose-500/30 to-transparent" />
          <CardContent className="p-5 flex flex-col items-center text-center">
            <div className="h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600 mb-3">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Emergency SOS Team</h3>
            <p className="text-xs text-muted-foreground mt-1">24/7 Rapid Response</p>
            <p className="text-xs font-mono font-bold text-rose-500 mt-1">Dial 112 / In-App SOS</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Frequently Asked Questions & Bylaws
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-sm font-medium">
                How does AI auto-assign technicians to complaints?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                When you file a complaint, our automated dispatch engine evaluates the issue urgency, trade domain (Plumbing, Electrical, Elevator), technician availability, hourly rate, and workload. The optimal technician is dispatched immediately, and you receive an in-app confirmation notification.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-sm font-medium">
                What should I do if a maintenance bill has duplicate charges?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                Navigate to <strong>Bills & Payments</strong> tab and click <strong>Dispute Bill</strong>. Select 'Already Paid' or 'Paid Twice', enter your UPI/Bank reference number, and attach proof. Our automated billing audit cross-references the society ledger and flags it for administrator arbitration.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-sm font-medium">
                What are the quiet hours and renovation guidelines?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                Quiet hours are strictly observed between 10:00 PM and 7:00 AM daily. Any interior renovation or drilling requires prior approval from society management and is permitted only on weekdays between 10:00 AM and 5:00 PM.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );

  const renderMainContent = () => {
    // Shared and specific sub-views
    if (activeItem === "all-issues") return <AllIssuesPage />;
    if (activeItem === "residents") return <ResidentsPage />;
    if (activeItem === "technicians") return <TechniciansPage />;
    if (activeItem === "ai-agents") return <AIAgentsPage />;
    if (activeItem === "ai-issues") return <AIPrioritizedIssues />;
    if (activeItem === "my-issues") return <MyIssuesPage />;
    if (activeItem === "report-issue") return <ReportIssuePage onBack={() => handleNavigate("dashboard")} />;
    if (activeItem === "notifications") return <NotificationsPage />;
    if (activeItem === "ai-billing") return <AIBillingAnalysisPage />;
    if (activeItem === "help") return renderHelpView();
    
    // Technician specific links
    if (activeItem === "assigned-tasks") return <TechnicianDashboard defaultTab="tasks" />;
    if (activeItem === "availability") return <TechnicianDashboard defaultTab="availability" />;
    if (activeItem === "performance") return <TechnicianDashboard defaultTab="performance" />;

    // Role home views
    switch (currentUser.role) {
      case "admin":
        return <AdminDashboard />;
      case "resident":
        return <ResidentDashboard />;
      case "technician":
        return <TechnicianDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <DashboardLayout
      user={currentUser}
      activeItem={activeItem}
      onNavigate={handleNavigate}
      onLogout={onLogout || (() => {})}
      sidebar={
        <SidebarNav
          role={currentUser.role}
          activeItem={activeItem}
          onItemClick={handleNavigate}
          onLogout={onLogout || (() => {})}
          user={currentUser}
        />
      }
      main={renderMainContent()}
    />
  );
}