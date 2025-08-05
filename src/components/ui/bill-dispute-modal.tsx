import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  FileText,
  Camera,
  Send,
  Loader2
} from "lucide-react";

interface BillDisputeModalProps {
  bill: {
    id: string;
    type: string;
    amount: number;
    description: string;
    dueDate: string;
    status: string;
  };
  onDisputeSubmit: (disputeData: any) => void;
}

export function BillDisputeModal({ bill, onDisputeSubmit }: BillDisputeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("already-paid");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    reason: "",
    description: "",
    transactionId: "",
    paymentDate: "",
    paymentMethod: "",
    screenshot: null as File | null,
    bankSms: null as File | null,
    doublePaymentDetails: "",
    wrongSplitDetails: ""
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  const handleSubmit = async (type: string) => {
    setIsLoading(true);
    try {
      const disputeData = {
        billId: bill.id,
        type,
        ...formData
      };
      await onDisputeSubmit(disputeData);
      setIsOpen(false);
      setFormData({
        reason: "",
        description: "",
        transactionId: "",
        paymentDate: "",
        paymentMethod: "",
        screenshot: null,
        bankSms: null,
        doublePaymentDetails: "",
        wrongSplitDetails: ""
      });
    } catch (error) {
      console.error("Error submitting dispute:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Raise Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Raise Bill Dispute
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bill Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Bill Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{bill.type}</span>
                <Badge variant={bill.status === 'paid' ? 'default' : 'secondary'}>
                  {bill.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{bill.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm">Amount: ₹{bill.amount}</span>
                <span className="text-sm">Due: {bill.dueDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Dispute Options */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="already-paid">Already Paid</TabsTrigger>
              <TabsTrigger value="paid-twice">Paid Twice</TabsTrigger>
              <TabsTrigger value="wrong-split">Wrong Split</TabsTrigger>
            </TabsList>

            <TabsContent value="already-paid" className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  If you've already paid this bill, upload proof to resolve the issue.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="transactionId">Transaction ID</Label>
                  <Input
                    id="transactionId"
                    placeholder="Enter transaction ID"
                    value={formData.transactionId}
                    onChange={(e) => setFormData(prev => ({ ...prev, transactionId: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="paymentDate">Payment Date</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentDate: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Input
                    id="paymentMethod"
                    placeholder="e.g., UPI, Bank Transfer, Cash"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload Payment Proof</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="screenshot" className="text-sm">Screenshot/Receipt</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <input
                          type="file"
                          id="screenshot"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'screenshot')}
                          className="hidden"
                        />
                        <label htmlFor="screenshot" className="cursor-pointer text-sm text-blue-600">
                          {formData.screenshot ? formData.screenshot.name : "Upload Screenshot"}
                        </label>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bankSms" className="text-sm">Bank SMS</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <input
                          type="file"
                          id="bankSms"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'bankSms')}
                          className="hidden"
                        />
                        <label htmlFor="bankSms" className="cursor-pointer text-sm text-blue-600">
                          {formData.bankSms ? formData.bankSms.name : "Upload SMS"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => handleSubmit('already-paid')} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit for Review
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="paid-twice" className="space-y-4">
              <Alert>
                <DollarSign className="h-4 w-4" />
                <AlertDescription>
                  If you've paid this bill twice, provide details for refund processing.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="doublePaymentDetails">Double Payment Details</Label>
                  <Textarea
                    id="doublePaymentDetails"
                    placeholder="Describe when and how you paid twice..."
                    value={formData.doublePaymentDetails}
                    onChange={(e) => setFormData(prev => ({ ...prev, doublePaymentDetails: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="transactionId2">Transaction IDs</Label>
                  <Input
                    id="transactionId2"
                    placeholder="Enter both transaction IDs separated by comma"
                    value={formData.transactionId}
                    onChange={(e) => setFormData(prev => ({ ...prev, transactionId: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload Proof of Double Payment</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'screenshot')}
                      className="hidden"
                    />
                    <label className="cursor-pointer text-sm text-blue-600">
                      {formData.screenshot ? formData.screenshot.name : "Upload Payment Proofs"}
                    </label>
                  </div>
                </div>

                <Button 
                  onClick={() => handleSubmit('paid-twice')} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Request Refund
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="wrong-split" className="space-y-4">
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  If the bill amount is incorrect or split wrongly, explain the issue.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="wrongSplitDetails">Issue Description</Label>
                  <Textarea
                    id="wrongSplitDetails"
                    placeholder="Explain what's wrong with the bill amount or split..."
                    value={formData.wrongSplitDetails}
                    onChange={(e) => setFormData(prev => ({ ...prev, wrongSplitDetails: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="expectedAmount">Expected Amount (if known)</Label>
                  <Input
                    id="expectedAmount"
                    type="number"
                    placeholder="Enter expected amount"
                    value={formData.transactionId}
                    onChange={(e) => setFormData(prev => ({ ...prev, transactionId: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload Supporting Documents</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(e, 'screenshot')}
                      className="hidden"
                    />
                    <label className="cursor-pointer text-sm text-blue-600">
                      {formData.screenshot ? formData.screenshot.name : "Upload Documents"}
                    </label>
                  </div>
                </div>

                <Button 
                  onClick={() => handleSubmit('wrong-split')} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit to Accountant
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
} 