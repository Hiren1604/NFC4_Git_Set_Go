import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  Upload,
  Bot,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Send,
  ArrowLeft,
} from "lucide-react";

export default function ReportIssuePage() {
  const [formData, setFormData] = useState({
    category: "",
    priority: "",
    title: "",
    description: "",
    location: "",
    contactPhone: "",
    contactEmail: "",
  });
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedIssue, setSubmittedIssue] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Simulate AI analysis when description changes
    if (field === "description" && value.length > 10) {
      analyzeWithAI(value);
    }
  };

  const analyzeWithAI = (description: string) => {
    // Simulate AI analysis
    const suggestions = {
      category: description.toLowerCase().includes("water") || description.toLowerCase().includes("leak") ? "plumbing" : 
                description.toLowerCase().includes("electr") || description.toLowerCase().includes("power") ? "electrical" : 
                description.toLowerCase().includes("door") || description.toLowerCase().includes("window") ? "carpentry" : "general",
      priority: description.toLowerCase().includes("emergency") || description.toLowerCase().includes("urgent") ? "urgent" :
              description.toLowerCase().includes("broken") || description.toLowerCase().includes("not working") ? "high" : "medium",
      estimatedTime: description.toLowerCase().includes("water") && description.toLowerCase().includes("leak") ? "2-4 hours" : "1-2 days"
    };
    
    setAiSuggestion(suggestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Prepare issue data
      const issueData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        location: {
          area: formData.location
        },
        aiSuggestions: aiSuggestion ? {
          category: aiSuggestion.category,
          priority: aiSuggestion.priority,
          estimatedTime: aiSuggestion.estimatedTime,
          confidence: 0.85
        } : undefined
      };

      console.log('Submitting issue data:', issueData);

      // Call backend API
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(issueData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        let errorMessage = 'Failed to submit issue';
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const savedIssue = await response.json();
      console.log('Saved issue:', savedIssue);
      setSubmittedIssue(savedIssue);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting issue:', error);
      
      let errorMessage = 'Failed to submit issue';
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = 'Unable to connect to server. Please check if the backend is running.';
        } else if (error.message.includes('JSON')) {
          errorMessage = 'Invalid response from server. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Issue Reported Successfully!</h1>
          <p className="text-muted-foreground mb-6">
            Your issue has been submitted and assigned a priority level. Our team will get back to you soon.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">Issue Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Issue ID:</span>
                <span className="font-medium">#{submittedIssue?._id?.slice(-6) || 'ISSUE-' + Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Priority:</span>
                <Badge variant="outline" className="text-green-700">
                  {submittedIssue?.priority || aiSuggestion?.priority || "Medium"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Category:</span>
                <Badge variant="outline" className="text-green-700">
                  {submittedIssue?.category || aiSuggestion?.category || "General"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Status:</span>
                <span className="font-medium">Pending</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Estimated Response:</span>
                <span className="font-medium">{aiSuggestion?.estimatedTime || "1-2 days"}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button onClick={() => {
              setSubmitted(false);
              setSubmittedIssue(null);
              setFormData({
                category: "",
                priority: "",
                title: "",
                description: "",
                location: "",
                contactPhone: "",
                contactEmail: "",
              });
              setAiSuggestion(null);
            }}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Report Another Issue
            </Button>
            <Button variant="outline">
              View My Issues
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Report an Issue</h1>
          <p className="text-muted-foreground">Describe your issue and our AI will help prioritize it</p>
        </div>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plumbing">Plumbing</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="carpentry">Carpentry</SelectItem>
                        <SelectItem value="cleaning">Cleaning</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="elevator">Elevator</SelectItem>
                        <SelectItem value="parking">Parking</SelectItem>
                        <SelectItem value="garden">Garden</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Issue Title</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of the issue"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about the issue, including when it started, any specific details, etc."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Flat A-501, Building A, Parking Level 2"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      placeholder="+91 98765 43210"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Upload Photos (Optional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2">Click to upload photos of the issue</p>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Issue
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline">
                    Save Draft
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant Panel */}
        <div className="space-y-6">
          {/* AI Suggestions */}
          {aiSuggestion && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  AI Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Bot className="h-4 w-4" />
                  <AlertDescription>
                    Based on your description, I recommend:
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Category:</span>
                    <Badge variant="outline">{aiSuggestion.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Priority:</span>
                    <Badge variant="outline" className={
                      aiSuggestion.priority === "urgent" ? "text-red-600" :
                      aiSuggestion.priority === "high" ? "text-orange-600" :
                      "text-blue-600"
                    }>
                      {aiSuggestion.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Estimated Time:</span>
                    <span className="text-sm font-medium">{aiSuggestion.estimatedTime}</span>
                  </div>
                </div>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      category: aiSuggestion.category,
                      priority: aiSuggestion.priority
                    }));
                  }}
                >
                  Apply AI Suggestions
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Be Specific</p>
                  <p className="text-muted-foreground">Include details like location, time, and severity</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Camera className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Add Photos</p>
                  <p className="text-muted-foreground">Visual evidence helps technicians understand the issue</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-green-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Response Time</p>
                  <p className="text-muted-foreground">Urgent issues get priority response within 2 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Need Immediate Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-600" />
                <span className="text-sm">Emergency: +91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="text-sm">support@societyhub.com</span>
              </div>
              <Separator />
              <p className="text-xs text-muted-foreground">
                For life-threatening emergencies, call emergency services immediately.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 