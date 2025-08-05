import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Bot,
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  User,
  FileText,
  Lightbulb,
  RefreshCw,
  Eye,
  Settings,
  BarChart3,
  Shield,
  Zap,
} from "lucide-react";

interface DuplicateBill {
  id: number;
  residentName: string;
  billIds: string[];
  amount: number;
  status: string;
  date: string;
  comments: string;
  duplicateType: string;
  aiAnalysis: string;
  recommendedAction: string;
  severity: string;
}

interface BillingAnomaly {
  id: number;
  type: string;
  residentName: string;
  billId?: string;
  amount?: number;
  expectedRange?: string;
  disputeCount?: number;
  totalBills?: number;
  disputeRate?: string;
  pattern?: string;
  aiAnalysis: string;
  recommendedAction: string;
}

interface AIRecommendation {
  id: number;
  category: string;
  title: string;
  description: string;
  priority: string;
  estimatedImpact: string;
}

interface AnalysisSummary {
  totalBills: number;
  duplicateBills: number;
  duplicateAmount: number;
  potentialSavings: number;
  disputeRate: string;
  averageResolutionTime: string;
}

export default function AIBillingAnalysisPage() {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [runningAnalysis, setRunningAnalysis] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No authentication token found. Please log in as admin.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/ai-billing/analysis", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisData(data.data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to fetch analysis data:", errorData.error || response.statusText);
      }
    } catch (error) {
      console.error("Error fetching analysis data:", error);
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    try {
      setRunningAnalysis(true);
      
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No authentication token found. Please log in as admin.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/ai-billing/run-analysis", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Received data:", data);
        setAnalysisData(data.data);
        console.log("AI analysis completed successfully");
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to run analysis:", errorData.error || response.statusText);
        console.error("Response status:", response.status);
      }
    } catch (error) {
      console.error("Error running analysis:", error);
    } finally {
      setRunningAnalysis(false);
    }
  };

  const resolveDuplicate = async (duplicateId: number, action: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/ai-billing/resolve-duplicate/${duplicateId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        // Refresh data after resolving
        fetchAnalysisData();
      }
    } catch (error) {
      console.error("Error resolving duplicate:", error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-red-600 bg-red-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading AI Billing Analysis...</span>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="text-center py-8">
        <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Analysis Data</h3>
        <p className="text-muted-foreground mb-4">
          Run AI analysis to detect billing issues and duplicates
        </p>
        <Button onClick={runAnalysis} disabled={runningAnalysis}>
          {runningAnalysis ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Running Analysis...
            </>
          ) : (
            <>
              <Bot className="h-4 w-4 mr-2" />
              Run AI Analysis
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Billing Analysis</h1>
          <p className="text-muted-foreground">
            AI-powered duplicate detection and billing optimization
          </p>
        </div>
        <Button onClick={runAnalysis} disabled={runningAnalysis}>
          {runningAnalysis ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Running Analysis...
            </>
          ) : (
            <>
              <Bot className="h-4 w-4 mr-2" />
              Run Analysis
            </>
          )}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisData.summary?.totalBills || 0}</div>
            <p className="text-xs text-muted-foreground">Analyzed bills</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duplicate Payment Complaints</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{analysisData.summary?.duplicateBills || 0}</div>
            <p className="text-xs text-muted-foreground">
              Residents reported duplicate charges
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{(analysisData.summary?.potentialSavings || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">If duplicates resolved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dispute Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisData.summary?.disputeRate || "0%"}</div>
            <p className="text-xs text-muted-foreground">
              Avg resolution: {analysisData.summary?.averageResolutionTime || "0 days"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="duplicates">Duplicates</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Duplicate Bills Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Resident Complaints - Duplicate Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(analysisData.duplicateBills || []).slice(0, 3).map((duplicate: DuplicateBill) => (
                    <div key={duplicate.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{duplicate.residentName}</span>
                        <Badge variant="outline" className={getSeverityColor(duplicate.severity)}>
                          {duplicate.severity}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>Amount: ₹{duplicate.amount.toLocaleString()}</div>
                        <div>Complaint: {duplicate.comments.substring(0, 50)}...</div>
                        <div className="text-orange-600 font-medium">Resident reported duplicate payment</div>
                      </div>
                    </div>
                  ))}
                  {(analysisData.duplicateBills || []).length > 3 && (
                    <Button variant="outline" className="w-full">
                      View All {(analysisData.duplicateBills || []).length} Complaints
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisData.aiRecommendations.slice(0, 3).map((rec: AIRecommendation) => (
                    <div key={rec.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{rec.title}</span>
                        <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{rec.description}</p>
                      <div className="text-xs text-green-600 mt-1">
                        Impact: {rec.estimatedImpact}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Duplicates Tab */}
        <TabsContent value="duplicates" className="space-y-6">
          <div className="space-y-4">
            {analysisData.duplicateBills.map((duplicate: DuplicateBill) => (
              <Card key={duplicate.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{duplicate.residentName}</h3>
                        <Badge variant="outline" className={getSeverityColor(duplicate.severity)}>
                          {duplicate.severity}
                        </Badge>
                        <Badge variant="outline" className="bg-orange-100 text-orange-800">
                          Resident Complaint
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Amount</span>
                          <div className="font-medium">₹{duplicate.amount.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Status</span>
                          <div className="font-medium">{duplicate.status}</div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Date</span>
                          <div className="font-medium">{duplicate.date}</div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Bill IDs</span>
                          <div className="font-medium">{duplicate.billIds.join(", ")}</div>
                        </div>
                      </div>

                      <Alert className="mb-4">
                        <Bot className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Resident Complaint:</strong> {duplicate.aiAnalysis}
                        </AlertDescription>
                      </Alert>

                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          <span className="font-medium text-orange-800">Resident's Issue</span>
                        </div>
                        <p className="text-sm text-orange-700">{duplicate.comments}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      onClick={() => resolveDuplicate(duplicate.id, "remove_duplicate")}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Remove Duplicate
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Manual Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Anomalies Tab */}
        <TabsContent value="anomalies" className="space-y-6">
          <div className="space-y-4">
            {analysisData.billingAnomalies.map((anomaly: BillingAnomaly) => (
              <Card key={anomaly.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{anomaly.residentName}</h3>
                        <Badge variant="outline">
                          {anomaly.type}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {anomaly.billId && (
                          <div>
                            <span className="text-sm text-muted-foreground">Bill ID</span>
                            <div className="font-medium">{anomaly.billId}</div>
                          </div>
                        )}
                        {anomaly.amount && (
                          <div>
                            <span className="text-sm text-muted-foreground">Amount</span>
                            <div className="font-medium">₹{anomaly.amount.toLocaleString()}</div>
                          </div>
                        )}
                        {anomaly.expectedRange && (
                          <div>
                            <span className="text-sm text-muted-foreground">Expected Range</span>
                            <div className="font-medium">{anomaly.expectedRange}</div>
                          </div>
                        )}
                        {anomaly.disputeRate && (
                          <div>
                            <span className="text-sm text-muted-foreground">Dispute Rate</span>
                            <div className="font-medium">{anomaly.disputeRate}</div>
                          </div>
                        )}
                        {anomaly.pattern && (
                          <div>
                            <span className="text-sm text-muted-foreground">Pattern</span>
                            <div className="font-medium">{anomaly.pattern}</div>
                          </div>
                        )}
                      </div>

                      <Alert className="mb-4">
                        <Bot className="h-4 w-4" />
                        <AlertDescription>
                          <strong>AI Analysis:</strong> {anomaly.aiAnalysis}
                        </AlertDescription>
                      </Alert>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium text-yellow-800">Recommended Action</span>
                        </div>
                        <p className="text-sm text-yellow-700">{anomaly.recommendedAction}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Investigate
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="space-y-4">
            {analysisData.aiRecommendations.map((rec: AIRecommendation) => (
              <Card key={rec.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{rec.title}</h3>
                        <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                        <Badge variant="outline">
                          {rec.category}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{rec.description}</p>
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-800">Estimated Impact</span>
                        </div>
                        <p className="text-sm text-green-700">{rec.estimatedImpact}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm">
                      <Zap className="h-4 w-4 mr-2" />
                      Implement
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Clock className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 