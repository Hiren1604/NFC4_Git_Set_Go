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
import { Building2, Eye, EyeOff, Loader2, Users, Wrench, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface SignupPageProps {
  initialRole?: UserRole;
  onSignupSuccess: (userData: AuthUser) => void;
  onSwitchToLogin: () => void;
}

export default function SignupPage({ onSignupSuccess, onSwitchToLogin, initialRole = "resident" }: SignupPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: initialRole === "admin" ? "resident" : initialRole,
    phone: "",
    flatNumber: "",
    building: "Tower A",
    skills: "Plumbing",
    hourlyRate: 500,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const data = await authenticate("register", {
        name: formData.name, email: formData.email, password: formData.password,
        role: formData.role, phone: formData.phone,
        flatNumber: formData.role === "resident" ? formData.flatNumber : undefined,
        building: formData.role === "resident" ? formData.building : undefined,
        skills: formData.role === "technician" ? formData.skills.split(",").map(skill => skill.trim().toLowerCase()).filter(Boolean) : undefined,
        hourlyRate: formData.role === "technician" ? Number(formData.hourlyRate) : undefined,
      });
      saveSession(data);
      onSignupSuccess(data.user);
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Signup failed. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative antialiased selection:bg-primary/20 selection:text-primary">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-lg border-border shadow-elevated bg-card my-8">
        <CardHeader className="text-center space-y-3 pb-4">
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
                Account Registration
              </span>
            </div>
          </div>
          <div>
            <CardTitle className="text-lg font-bold">Join Emerald Heights Community</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select your role and complete your society profile
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Role Selector Grid */}
          <div className="space-y-1.5">
            <Label className="text-xs">Select Persona</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, role: "resident" }))}
                className={`p-3 rounded-xl border text-center transition-all ${
                  formData.role === "resident"
                    ? "border-primary bg-primary/10 text-primary font-bold ring-2 ring-primary/20 shadow-subtle"
                    : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Users className="h-4 w-4 mx-auto mb-1 text-sky-500" />
                <span className="text-xs block">Resident</span>
              </button>



              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, role: "technician" }))}
                className={`p-3 rounded-xl border text-center transition-all ${
                  formData.role === "technician"
                    ? "border-primary bg-primary/10 text-primary font-bold ring-2 ring-primary/20 shadow-subtle"
                    : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Wrench className="h-4 w-4 mx-auto mb-1 text-amber-500" />
                <span className="text-xs block">Technician</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {error && (
              <Alert variant="destructive" className="py-2 text-xs">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Full Name</Label>
                <Input
                  placeholder="e.g. Sarah Johnson"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  required
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Phone Number</Label>
                <Input
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                  required
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Email Address</Label>
              <Input
                type="email"
                placeholder="name@emeraldheights.io"
                value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                required
                className="text-xs h-9"
              />
            </div>

            {formData.role === "resident" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Building / Tower</Label>
                  <Input
                    placeholder="Tower A"
                    value={formData.building}
                    onChange={(e) => setFormData((p) => ({ ...p, building: e.target.value }))}
                    required
                    className="text-xs h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Flat / Unit Number</Label>
                  <Input
                    placeholder="e.g. 501"
                    value={formData.flatNumber}
                    onChange={(e) => setFormData((p) => ({ ...p, flatNumber: e.target.value }))}
                    required
                    className="text-xs h-9"
                  />
                </div>
              </div>
            )}

            {formData.role === "technician" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Primary Trade</Label>
                  <Input
                    placeholder="Plumbing, Electrical, HVAC"
                    value={formData.skills}
                    onChange={(e) => setFormData((p) => ({ ...p, skills: e.target.value }))}
                    required
                    className="text-xs h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Base Hourly Rate (₹)</Label>
                  <Input
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData((p) => ({ ...p, hourlyRate: Number(e.target.value) }))}
                    required
                    className="text-xs h-9 font-mono"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                  required
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Confirm Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((p) => ({ ...p, confirmPassword: e.target.value }))}
                  required
                  className="text-xs h-9"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-9 bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-subtle mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Complete Registration
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Already registered?{" "}
              <button
                type="button"
                className="font-semibold text-primary hover:underline"
                onClick={onSwitchToLogin}
              >
                Sign in
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}