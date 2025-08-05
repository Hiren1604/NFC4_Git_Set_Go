import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Wrench,
  Clock,
  CheckCircle,
  MapPin,
  Star,
  Calendar,
  Navigation,
  Phone,
  Camera,
  MessageSquare,
  BarChart3,
  Settings,
  AlertCircle,
  Timer,
} from "lucide-react";

export function TechnicianDashboard() {
  const [selectedTab, setSelectedTab] = useState("tasks");
  const [availability, setAvailability] = useState(true);

  // Mock data
  const assignedTasks = [
    {
      id: 1,
      title: "Water leakage in A-501",
      priority: "urgent",
      location: "Building A, Floor 5",
      resident: "John Doe",
      estimatedTime: "2 hours",
      status: "in-progress",
      distance: "0.5 km",
    },
    {
      id: 2,
      title: "Electrical outlet not working",
      priority: "high",
      location: "Building B, Floor 3",
      resident: "Jane Smith",
      estimatedTime: "1 hour",
      status: "pending",
      distance: "1.2 km",
    },
    {
      id: 3,
      title: "Door lock repair",
      priority: "medium",
      location: "Building A, Floor 2",
      resident: "Mike Johnson",
      estimatedTime: "45 mins",
      status: "scheduled",
      distance: "0.3 km",
    },
  ];

  const completedTasks = [
    {
      id: 1,
      title: "AC repair in B-301",
      completedAt: "2024-01-10 15:30",
      rating: 5,
      feedback: "Excellent work! Very professional.",
      timeSpent: "1.5 hours",
    },
    {
      id: 2,
      title: "Plumbing fix in A-402",
      completedAt: "2024-01-09 11:20",
      rating: 4,
      feedback: "Good job, quick resolution.",
      timeSpent: "2 hours",
    },
  ];

  const todaySchedule = [
    { time: "09:00", task: "Water leakage - A-501", status: "in-progress" },
    { time: "11:00", task: "Electrical issue - B-303", status: "pending" },
    { time: "14:00", task: "Door repair - A-201", status: "scheduled" },
    { time: "16:00", task: "AC maintenance - C-501", status: "scheduled" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "scheduled": return "bg-purple-100 text-purple-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "text-red-600 font-semibold";
      case "high": return "text-orange-600 font-semibold";
      case "medium": return "text-blue-600 font-semibold";
      case "low": return "text-green-600 font-semibold";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Today's Tasks</CardTitle>
            <Wrench className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">5</div>
            <p className="text-xs text-blue-600">2 completed, 3 pending</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">4.8</div>
            <p className="text-xs text-yellow-600">Based on 24 reviews</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">15m</div>
            <p className="text-xs text-green-600">Average this month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Efficiency</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">94%</div>
            <Progress value={94} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-6">
          <div className="space-y-4">
            {assignedTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{task.title}</h3>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {task.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Timer className="h-4 w-4" />
                          Est. {task.estimatedTime}
                        </div>
                        <div className="flex items-center gap-2">
                          <Navigation className="h-4 w-4" />
                          {task.distance} away
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{task.resident.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{task.resident}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm">
                        <Phone className="h-4 w-4" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline">
                        <Navigation className="h-4 w-4" />
                        Navigate
                      </Button>
                      <Button size="sm" variant="outline">
                        <Camera className="h-4 w-4" />
                        Photo
                      </Button>
                      {task.status === "pending" && (
                        <Button size="sm" className="bg-status-progress">
                          Start Task
                        </Button>
                      )}
                      {task.status === "in-progress" && (
                        <Button size="sm" className="bg-status-resolved">
                          <CheckCircle className="h-4 w-4" />
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaySchedule.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="text-center min-w-[60px]">
                      <p className="font-medium">{item.time}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.task}</p>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Route Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-primary-light rounded-lg">
                <div>
                  <p className="font-medium">Optimized Route Available</p>
                  <p className="text-sm text-gray-600">Save 45 minutes on today's tasks</p>
                </div>
                <Button>
                  <Navigation className="h-4 w-4" />
                  View Route
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <div className="space-y-4">
            {completedTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{task.title}</h3>
                        <Badge className="bg-status-resolved">
                          Completed
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <p>Completed: {task.completedAt}</p>
                        <p>Time spent: {task.timeSpent}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < task.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({task.rating}/5)</span>
                      </div>

                      {task.feedback && (
                        <div className="p-3 bg-background-secondary rounded-lg">
                          <p className="text-sm italic">"{task.feedback}"</p>
                        </div>
                      )}
                    </div>

                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4" />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>This Month's Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Tasks Completed</span>
                  <span className="font-bold">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Rating</span>
                  <span className="font-bold">4.8/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Response Time</span>
                  <span className="font-bold">15 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Completion Rate</span>
                  <span className="font-bold">98%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { rating: 5, comment: "Excellent work! Very professional." },
                  { rating: 4, comment: "Quick and efficient service." },
                  { rating: 5, comment: "Solved the problem immediately." },
                ].map((feedback, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-sm">{feedback.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="availability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Availability Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Current Status</p>
                  <p className="text-sm text-gray-600">You are currently {availability ? 'available' : 'offline'}</p>
                </div>
                <Button 
                  variant={availability ? "destructive" : "default"}
                  onClick={() => setAvailability(!availability)}
                >
                  {availability ? "Go Offline" : "Go Online"}
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Working Hours</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Start Time</label>
                    <div className="mt-1 p-2 border rounded">9:00 AM</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">End Time</label>
                    <div className="mt-1 p-2 border rounded">6:00 PM</div>
                  </div>
                </div>
                <Button variant="outline">Update Schedule</Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {["Electrical", "Plumbing", "HVAC", "Carpentry"].map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
                <Button variant="outline">Manage Skills</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}