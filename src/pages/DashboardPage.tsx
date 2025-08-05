import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { ResidentDashboard } from "@/components/dashboard/ResidentDashboard";
import { TechnicianDashboard } from "@/components/dashboard/TechnicianDashboard";
import AllIssuesPage from "./AllIssuesPage";
import ResidentsPage from "./ResidentsPage";

type UserRole = "resident" | "admin" | "technician";

interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  flatNumber?: string;
  building?: string;
}

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
}

export default function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [activeItem, setActiveItem] = useState("dashboard");

  const renderMainContent = () => {
    // Handle navigation for different pages
    if (activeItem === "all-issues") return <AllIssuesPage />;
    if (activeItem === "residents") return <ResidentsPage />;
    if (activeItem === "technicians") return <AdminDashboard defaultTab="technicians" />; // This will show the Technicians tab
    if (activeItem === "analytics") return <div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1><p>Analytics page coming soon...</p></div>;
    if (activeItem === "ai-agents") return <AdminDashboard defaultTab="ai-agents" />;
    if (activeItem === "ai-issues") return <AdminDashboard defaultTab="ai-issues" />;
    if (activeItem === "my-issues") return <div className="p-6"><h1 className="text-2xl font-bold">My Issues</h1><p>My issues page coming soon...</p></div>;
    if (activeItem === "report-issue") return <div className="p-6"><h1 className="text-2xl font-bold">Report Issue</h1><p>Report issue page coming soon...</p></div>;
    if (activeItem === "notifications") return <div className="p-6"><h1 className="text-2xl font-bold">Notifications</h1><p>Notifications page coming soon...</p></div>;
    if (activeItem === "help") return <div className="p-6"><h1 className="text-2xl font-bold">Help & FAQ</h1><p>Help page coming soon...</p></div>;
    if (activeItem === "assigned-tasks") return <div className="p-6"><h1 className="text-2xl font-bold">My Tasks</h1><p>Assigned tasks page coming soon...</p></div>;
    if (activeItem === "availability") return <div className="p-6"><h1 className="text-2xl font-bold">Availability</h1><p>Availability management page coming soon...</p></div>;
    if (activeItem === "performance") return <div className="p-6"><h1 className="text-2xl font-bold">Performance</h1><p>Performance analytics page coming soon...</p></div>;
    
    // Handle dashboards based on role
    switch (user.role) {
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
      sidebar={
        <SidebarNav 
          role={user.role} 
          activeItem={activeItem}
          onItemClick={setActiveItem}
          onLogout={onLogout}
          user={user}
        />
      }
      main={renderMainContent()}
    />
  );
}