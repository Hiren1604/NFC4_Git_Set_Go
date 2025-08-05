import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Phone,
  Mail,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  Calendar,
  Wrench,
  Star,
  AlertCircle
} from 'lucide-react';

interface Technician {
  id: string;
  name: string;
  phone: string;
  email: string;
  skills: string[];
  hourlyRate: number;
  availability: string;
}

interface EstimatedCost {
  estimated_hours: number;
  hourly_rate: number;
  total_cost: number;
  currency: string;
}

interface TechnicianAssignmentNotificationProps {
  notification: {
    type: string;
    title: string;
    message: string;
    technician: Technician;
    issue: {
      title: string;
      description: string;
      category: string;
    };
    estimatedTime: string;
    estimatedCost: EstimatedCost;
    actions: Array<{
      type: string;
      label: string;
      description: string;
    }>;
  };
  issueId: string;
  onAccept: (issueId: string) => void;
  onReject: (issueId: string, reason?: string) => void;
  onReschedule: (issueId: string) => void;
}

export default function TechnicianAssignmentNotification({
  notification,
  issueId,
  onAccept,
  onReject,
  onReschedule
}: TechnicianAssignmentNotificationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [actionTaken, setActionTaken] = useState<string | null>(null);

  const handleAction = async (actionType: string) => {
    setIsLoading(true);
    try {
      switch (actionType) {
        case 'accept':
          await onAccept(issueId);
          setActionTaken('accepted');
          break;
        case 'reject':
          await onReject(issueId);
          setActionTaken('rejected');
          break;
        case 'reschedule':
          await onReschedule(issueId);
          setActionTaken('rescheduled');
          break;
      }
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (actionTaken) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">
                Assignment {actionTaken === 'accepted' ? 'Accepted' : actionTaken === 'rejected' ? 'Rejected' : 'Rescheduled'}
              </h3>
              <p className="text-sm text-green-700">
                {actionTaken === 'accepted' 
                  ? 'The technician has been assigned to your issue.'
                  : actionTaken === 'rejected'
                  ? 'The assignment has been rejected. A new technician will be assigned.'
                  : 'A reschedule request has been sent.'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <User className="h-5 w-5" />
          {notification.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Message */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-blue-800">
            {notification.message}
          </AlertDescription>
        </Alert>

        {/* Technician Details */}
        <div className="space-y-3">
          <h4 className="font-semibold text-blue-800">Technician Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                <span className="font-medium">{notification.technician.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600" />
                <span className="text-sm">{notification.technician.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="text-sm">{notification.technician.email}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Skills:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {notification.technician.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span className="text-sm">₹{notification.technician.hourlyRate}/hour</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Issue Details */}
        <div className="space-y-2">
          <h4 className="font-semibold text-blue-800">Issue Details</h4>
          <div className="space-y-1">
            <p className="text-sm"><strong>Title:</strong> {notification.issue.title}</p>
            <p className="text-sm"><strong>Category:</strong> 
              <Badge variant="outline" className="ml-1 text-xs">
                {notification.issue.category}
              </Badge>
            </p>
            <p className="text-sm"><strong>Description:</strong> {notification.issue.description}</p>
          </div>
        </div>

        <Separator />

        {/* Estimates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-800">Time Estimate</h4>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm">{notification.estimatedTime}</span>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-800">Cost Estimate</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span className="text-sm">₹{notification.estimatedCost.total_cost}</span>
              </div>
              <div className="text-xs text-gray-600">
                ({notification.estimatedCost.estimated_hours} hours × ₹{notification.estimatedCost.hourly_rate}/hr)
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-3">
          <h4 className="font-semibold text-blue-800">Actions</h4>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => handleAction('accept')}
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Accept Assignment
            </Button>
            <Button
              onClick={() => handleAction('reschedule')}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Request Reschedule
            </Button>
            <Button
              onClick={() => handleAction('reject')}
              disabled={isLoading}
              variant="outline"
              className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject & Request Another
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 