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
        />
      }
      main={renderMainContent()}
    />
  );
}