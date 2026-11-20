import { authenticate } from "@/services/auth";
import { saveSession } from "@/lib/session";
import { getErrorMessage } from "@/lib/api";
import type { AuthUser, UserRole } from "@/types/auth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface LoginPageProps {
  initialRole?: UserRole;
  onLoginSuccess: (userData: AuthUser) => void;
  onSwitchToSignup: () => void;
}

export default function LoginPage({ onLoginSuccess, onSwitchToSignup, initialRole = "resident" }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await authenticate("login", formData);
      saveSession(data);
      onLoginSuccess(data.user);
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Login failed. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative antialiased selection:bg-primary/20 selection:text-primary">
      {/* Top Bar with Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md border-border shadow-elevated bg-card">
        <CardHeader className="text-center space-y-3 pb-4">
          <p className="text-sm text-muted-foreground">{initialRole === "technician" ? "Personnel" : initialRole === "admin" ? "Admin" : "Resident"} login</p>
          <div className="flex items-center justify-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-subtle">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h1 className="text-base font-bold tracking-tight text-foreground flex items-center gap-1.5">
                SocietyHub
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </h1>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                Emerald Heights
              </span>
            </div>
          </div>
          <div>
            <CardTitle className="text-lg font-bold">Sign In to Workspace</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter your credentials to access your society workspace
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {error && (
              <Alert variant="destructive" className="py-2 text-xs">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs">Email Address</Label>
              <Input
                name="email"
                type="email"
                placeholder="name@emeraldheights.io"
                value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                required
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Password</Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                  required
                  className="text-xs h-9 pr-9"
                />
                <button
                  type="button"
                  className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-9 bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-subtle"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              New community occupant?{" "}
              <button
                type="button"
                className="font-semibold text-primary hover:underline"
                onClick={onSwitchToSignup}
              >
                Register profile
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}