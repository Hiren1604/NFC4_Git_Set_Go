import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Wrench, ShieldCheck, Bot, ArrowRight, Sparkles, LogOut } from "lucide-react";
import DashboardPage from "./DashboardPage";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";

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

const Index = () => {
  const [currentView, setCurrentView] = useState<"landing" | "login" | "signup" | "dashboard">("landing");
  const [user, setUser] = useState<User | null>(null);

  // Check for existing authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setCurrentView("dashboard");
      } catch (error) {
        // Invalid user data, clear storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setCurrentView("dashboard");
  };

  const handleSignupSuccess = (userData: User) => {
    setUser(userData);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCurrentView("landing");
  };

  // Show authentication pages
  if (currentView === "login") {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onSwitchToSignup={() => setCurrentView("signup")}
      />
    );
  }

  if (currentView === "signup") {
    return (
      <SignupPage
        onSignupSuccess={handleSignupSuccess}
        onSwitchToLogin={() => setCurrentView("login")}
      />
    );
  }

  // Show dashboard if authenticated
  if (currentView === "dashboard" && user) {
    return <DashboardPage user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-primary-light">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="rounded-2xl bg-primary p-3">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-bold">SocietyHub</h1>
              <Badge variant="default" className="animate-pulse">AI-Powered</Badge>
            </div>
          </div>
          
          <p className="text-xl text-text-secondary mb-2">Multi-Agent Residential Society Issue Tracker</p>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Streamline your society management with intelligent AI agents that automatically categorize, 
            assign, and track issues for faster resolution.
          </p>
          
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-sm">
              <Bot className="h-4 w-4 text-primary" />
              <span>4 AI Agents</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-status-resolved" />
              <span>Smart Automation</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-status-progress" />
              <span>Real-time Tracking</span>
            </div>
          </div>
        </div>

        {/* Role Selection */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8">Choose Your Portal</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12 items-stretch">
            {/* Admin Portal */}
            <Card className="transition-all duration-normal hover:shadow-lg hover:scale-105 cursor-pointer border-2 hover:border-primary flex flex-col">
              <CardHeader className="text-center pb-4">
                <div className="rounded-full bg-primary-light p-4 w-16 h-16 mx-auto mb-4">
                  <ShieldCheck className="h-8 w-8 text-primary mx-auto" />
                </div>
                <CardTitle className="text-xl">Admin Portal</CardTitle>
                <p className="text-text-muted">Complete society management</p>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 flex flex-col">
                <div className="space-y-2 text-sm flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>All issues overview & assignment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>AI-powered analytics dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Resident & technician management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Real-time agent monitoring</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4" 
                  onClick={() => setCurrentView("login")}
                >
                  Enter Admin Portal
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Resident Portal */}
            <Card className="transition-all duration-normal hover:shadow-lg hover:scale-105 cursor-pointer border-2 hover:border-status-progress flex flex-col">
              <CardHeader className="text-center pb-4">
                <div className="rounded-full bg-status-progress-light p-4 w-16 h-16 mx-auto mb-4">
                  <Users className="h-8 w-8 text-status-progress mx-auto" />
                </div>
                <CardTitle className="text-xl">Resident Portal</CardTitle>
                <p className="text-text-muted">Report & track your issues</p>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 flex flex-col">
                <div className="space-y-2 text-sm flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-status-progress rounded-full"></div>
                    <span>Easy issue reporting with photos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-status-progress rounded-full"></div>
                    <span>Real-time status updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-status-progress rounded-full"></div>
                    <span>AI-powered issue categorization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-status-progress rounded-full"></div>
                    <span>Notification & feedback system</span>
                  </div>
                </div>
                <Button 
                  variant="progress" 
                  className="w-full mt-4"
                  onClick={() => setCurrentView("login")}
                >
                  Enter Resident Portal
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Technician Portal */}
            <Card className="transition-all duration-normal hover:shadow-lg hover:scale-105 cursor-pointer border-2 hover:border-status-resolved flex flex-col">
              <CardHeader className="text-center pb-4">
                <div className="rounded-full bg-status-resolved-light p-4 w-16 h-16 mx-auto mb-4">
                  <Wrench className="h-8 w-8 text-status-resolved mx-auto" />
                </div>
                <CardTitle className="text-xl">Technician Portal</CardTitle>
                <p className="text-text-muted">Manage your assigned tasks</p>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 flex flex-col">
                <div className="space-y-2 text-sm flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-status-resolved rounded-full"></div>
                    <span>Smart task assignment based on skills</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-status-resolved rounded-full"></div>
                    <span>Route optimization for efficiency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-status-resolved rounded-full"></div>
                    <span>Progress tracking & updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-status-resolved rounded-full"></div>
                    <span>Performance analytics</span>
                  </div>
                </div>
                <Button 
                  variant="resolved" 
                  className="w-full mt-4"
                  onClick={() => setCurrentView("login")}
                >
                  Enter Technician Portal
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Authentication Options */}
          <div className="text-center mb-8">
            <p className="text-text-muted mb-4">Ready to get started?</p>
            <div className="flex gap-4 justify-center items-center">
              <Button 
                onClick={() => setCurrentView("login")}
                className="px-8 h-10"
              >
                Sign In
              </Button>
              <Button 
                variant="outline"
                onClick={() => setCurrentView("signup")}
                className="px-8 h-10"
              >
                Sign Up
              </Button>
            </div>
          </div>

          {/* AI Agents Overview */}
          <Card className="bg-primary-light border-primary">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Bot className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl text-primary">AI Multi-Agent System</CardTitle>
              </div>
              <p className="text-text-secondary">
                Four specialized AI agents working 24/7 to optimize your society management
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-background rounded-lg">
                  <div className="w-12 h-12 bg-status-pending-light rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bot className="h-6 w-6 text-status-pending" />
                  </div>
                  <h4 className="font-semibold mb-2">Reporting Agent</h4>
                  <p className="text-sm text-text-muted">Detects duplicates & categorizes issues</p>
                </div>
                
                <div className="text-center p-4 bg-background rounded-lg">
                  <div className="w-12 h-12 bg-status-progress-light rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bot className="h-6 w-6 text-status-progress" />
                  </div>
                  <h4 className="font-semibold mb-2">Assignment Agent</h4>
                  <p className="text-sm text-text-muted">Matches issues to right technicians</p>
                </div>
                
                <div className="text-center p-4 bg-background rounded-lg">
                  <div className="w-12 h-12 bg-status-resolved-light rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bot className="h-6 w-6 text-status-resolved" />
                  </div>
                  <h4 className="font-semibold mb-2">Follow-up Agent</h4>
                  <p className="text-sm text-text-muted">Monitors progress & sends reminders</p>
                </div>
                
                <div className="text-center p-4 bg-background rounded-lg">
                  <div className="w-12 h-12 bg-status-urgent-light rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bot className="h-6 w-6 text-status-urgent" />
                  </div>
                  <h4 className="font-semibold mb-2">Analytics Agent</h4>
                  <p className="text-sm text-text-muted">Generates insights & trends</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
