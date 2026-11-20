import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReset = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 antialiased">
          <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-card text-center space-y-6">
            <div className="h-14 w-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto ring-8 ring-destructive/5">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-tight">Something went wrong</h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                An unexpected interface error occurred. You can reload the application or reset your session.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-muted/50 rounded-lg text-left overflow-auto max-h-32 text-[11px] font-mono text-muted-foreground border border-border">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center gap-3 justify-center pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={this.handleReset}
                className="text-xs h-9"
              >
                Reset Session
              </Button>
              <Button
                size="sm"
                onClick={this.handleReload}
                className="bg-primary hover:bg-primary/90 text-white text-xs h-9 gap-1.5 shadow-subtle"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
