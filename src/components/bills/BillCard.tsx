import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BillDisputeModal } from "@/components/ui/bill-dispute-modal";
import { AlertTriangle, DollarSign, Calendar, FileText } from "lucide-react";

interface BillCardProps {
  bill: {
    id: string;
    type: string;
    amount: number;
    description: string;
    dueDate: string;
    status: string;
  };
  onDisputeSubmit: (disputeData: any) => Promise<void>;
}

export function BillCard({ bill, onDisputeSubmit }: BillCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'overdue':
        return 'destructive';
      case 'disputed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {bill.type.charAt(0).toUpperCase() + bill.type.slice(1)} Bill
          </CardTitle>
          <Badge variant={getStatusColor(bill.status)}>
            {bill.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{bill.description}</p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="font-medium">₹{bill.amount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Due: {formatDate(bill.dueDate)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            Pay Bill
          </Button>
          <BillDisputeModal 
            bill={bill} 
            onDisputeSubmit={onDisputeSubmit}
          />
        </div>
      </CardContent>
    </Card>
  );
} 