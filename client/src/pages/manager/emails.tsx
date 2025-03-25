import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { analyzeEmails } from "@/lib/gemini";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Filter, 
  Mail, 
  MailOpen, 
  Star, 
  StarOff, 
  Trash2, 
  Archive, 
  Folder, 
  Tag, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Wand2, 
  Inbox, 
  Send, 
  FileQuestion, 
  Loader2, 
  Plus, 
  SlidersHorizontal, 
  MoreHorizontal, 
  UserPlus,
  FileText,
  ArrowRight,
  AlertTriangle,
  MoveRight,
  MapPin,
  FileWarning,
  ShieldAlert,
  MessageSquare
} from "lucide-react";

export default function ManagerEmails() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("inbox");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isAiProcessingOpen, setIsAiProcessingOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Sample email data - would come from API in real app
  const emails = [
    {
      id: "e-0012",
      subject: "Urgent: Delayed Shipment Update - TechCorp Order #TC-4503",
      sender: "Sarah Johnson",
      email: "sjohnson@techcorp.com",
      time: "10:23 AM",
      preview: "Due to unexpected road closures on Highway 101, our delivery will be delayed by approximately 2 hours. The driver has been rerouted...",
      read: false,
      starred: true,
      category: "important",
      labels: ["supplier", "urgent"]
    },
    {
      id: "e-0011",
      subject: "Inventory Restock Request - Office Supplies",
      sender: "Mike Peterson",
      email: "purchasing@centraloffice.com",
      time: "Yesterday",
      preview: "We need to restock the following office supplies: Premium Office Chairs (12 units), Premium Notebooks (100 units)...",
      read: true,
      starred: false,
      category: "inventory",
      labels: ["inventory", "order"]
    },
    {
      id: "e-0010",
      subject: "Maintenance Schedule Update - Truck Fleet",
      sender: "Maintenance Department",
      email: "maintenance@logitrack.com",
      time: "Oct 20",
      preview: "Please note the updated maintenance schedule for the truck fleet. Truck #T-418 is scheduled for maintenance on Oct 21, 2023...",
      read: true,
      starred: false,
      category: "maintenance",
      labels: ["maintenance", "internal"]
    },
    {
      id: "e-0009",
      subject: "Fresh Produce Order Confirmation - Weekly Delivery",
      sender: "FreshGoods Co.",
      email: "orders@freshgoods.com",
      time: "Oct 19",
      preview: "This is to confirm your order #FG-8867 for the following items: Organic Apples (120kg), Fresh Milk (85L), Whole Grain Bread (45 units)...",
      read: true,
      starred: true,
      category: "orders",
      labels: ["order", "perishable"]
    },
    {
      id: "e-0008",
      subject: "New Delivery Schedule Proposal",
      sender: "Operations Team",
      email: "operations@logitrack.com",
      time: "Oct 18",
      preview: "Based on our analysis of delivery patterns and traffic data, we propose the following adjustments to our delivery schedule...",
      read: true,
      starred: false,
      category: "operations",
      labels: ["internal", "planning"]
    }
  ];

  // State for organized emails
  const [organizedEmails, setOrganizedEmails] = useState<{
    urgent: {subject: string, content: string, sender: string, date: string}[];
    changed_route: {subject: string, content: string, sender: string, date: string}[];
    problems: {subject: string, content: string, sender: string, date: string}[];
    other: {subject: string, content: string, sender: string, date: string}[];
  } | null>(null);
  
  const [showAIResults, setShowAIResults] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Function to handle AI organization with Gemini
  const handleOrganizeEmails = async () => {
    setIsProcessing(true);
    try {
      // Format the emails for the AI analysis
      const formattedEmails = emails.map(email => ({
        subject: email.subject,
        content: email.preview,
        sender: email.sender,
        date: email.time
      }));
      
      // Call the Gemini API
      const analysis = await analyzeEmails(formattedEmails);
      
      // Create organized structure based on analysis
      // In a production app, this parsing would be more robust
      const organized = {
        urgent: formattedEmails.filter(e => 
          e.subject.toLowerCase().includes('urgent') || 
          e.content.toLowerCase().includes('delayed') ||
          e.subject.toLowerCase().includes('delay')
        ),
        changed_route: formattedEmails.filter(e => 
          e.content.toLowerCase().includes('rerouted') || 
          e.content.toLowerCase().includes('road closures') ||
          e.subject.toLowerCase().includes('schedule')
        ),
        problems: formattedEmails.filter(e =>
          e.content.toLowerCase().includes('issue') ||
          e.content.toLowerCase().includes('problem') ||
          e.subject.toLowerCase().includes('urgent')
        ),
        other: formattedEmails.filter(e => 
          !e.subject.toLowerCase().includes('urgent') &&
          !e.content.toLowerCase().includes('delayed') &&
          !e.subject.toLowerCase().includes('delay') &&
          !e.content.toLowerCase().includes('rerouted') &&
          !e.content.toLowerCase().includes('road closures') &&
          !e.subject.toLowerCase().includes('schedule') &&
          !e.content.toLowerCase().includes('issue') &&
          !e.content.toLowerCase().includes('problem')
        )
      };
      
      setOrganizedEmails(organized);
      setIsAiProcessingOpen(false);
      setShowAIResults(true);
      
      toast({
        title: "Emails Organized",
        description: "Gemini AI has successfully analyzed and organized your emails.",
      });
    } catch (error) {
      console.error("Error analyzing emails:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not analyze emails with Gemini AI. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getLabelBadge = (label: string) => {
    switch (label) {
      case "urgent":
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">{label}</Badge>;
      case "order":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">{label}</Badge>;
      case "inventory":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200">{label}</Badge>;
      case "supplier":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">{label}</Badge>;
      case "maintenance":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200">{label}</Badge>;
      case "internal":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">{label}</Badge>;
      case "perishable":
        return <Badge variant="outline" className="bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200">{label}</Badge>;
      case "planning":
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200">{label}</Badge>;
      default:
        return <Badge variant="outline">{label}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Email Organization</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => setIsAiProcessingOpen(true)}
          >
            <Wand2 className="mr-2 h-4 w-4" />
            AI Organize
          </Button>
          
          <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Compose
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Compose New Email</DialogTitle>
                <DialogDescription>
                  Create and send a new email message
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email-to" className="text-right">
                    To
                  </Label>
                  <div className="col-span-3 flex gap-2 items-center">
                    <Input id="email-to" placeholder="recipient@example.com" className="flex-1" />
                    <Button variant="outline" size="icon">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email-subject" className="text-right">
                    Subject
                  </Label>
                  <Input id="email-subject" placeholder="Email subject" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="email-body" className="text-right mt-3">
                    Message
                  </Label>
                  <Textarea id="email-body" placeholder="Type your message here..." className="col-span-3 min-h-[200px]" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">
                    Labels
                  </Label>
                  <div className="col-span-3">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Add label (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="order">Order</SelectItem>
                        <SelectItem value="inventory">Inventory</SelectItem>
                        <SelectItem value="supplier">Supplier</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="internal">Internal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" onClick={() => setIsComposeOpen(false)}>
                  Send Email
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* AI Organization Dialog */}
      <Dialog open={isAiProcessingOpen} onOpenChange={setIsAiProcessingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gemini AI Email Organization</DialogTitle>
            <DialogDescription>
              Use Gemini AI to automatically organize, categorize, and prioritize your emails.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <div className="text-center">
                  <h4 className="font-medium">Analyzing Emails</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Gemini AI is analyzing email content, identifying priorities, and organizing your inbox...
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="categorize" defaultChecked />
                    <Label htmlFor="categorize">Categorize emails</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="prioritize" defaultChecked />
                    <Label htmlFor="prioritize">Prioritize by importance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="flag-urgent" defaultChecked />
                    <Label htmlFor="flag-urgent">Flag urgent logistics matters</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="summaries" defaultChecked />
                    <Label htmlFor="summaries">Generate email summaries</Label>
                  </div>
                </div>
                <div className="border p-4 rounded-md bg-primary/5">
                  <div className="flex items-start">
                    <Wand2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium">How Gemini AI Organizes Emails</h4>
                      <ul className="text-sm mt-2 space-y-1">
                        <li className="flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                          Identifies order requests and inventory updates
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                          Flags urgent delivery issues and delays
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                          Categorizes emails by sender and topic
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                          Creates follow-up reminders for important emails
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAiProcessingOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              onClick={handleOrganizeEmails} 
              disabled={isProcessing}
              className="flex items-center"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Organize Emails
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Email Sidebar */}
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <Button 
              className="w-full mb-4" 
              onClick={() => setIsComposeOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Compose
            </Button>
            
            <div className="space-y-1">
              <Button 
                variant={currentTab === "inbox" ? "secondary" : "ghost"} 
                className="w-full justify-start" 
                onClick={() => setCurrentTab("inbox")}
              >
                <Inbox className="mr-2 h-4 w-4" />
                Inbox
                <Badge className="ml-auto bg-primary">{emails.filter(e => !e.read).length}</Badge>
              </Button>
              <Button 
                variant={currentTab === "starred" ? "secondary" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setCurrentTab("starred")}
              >
                <Star className="mr-2 h-4 w-4" />
                Starred
                <Badge className="ml-auto bg-muted text-muted-foreground">{emails.filter(e => e.starred).length}</Badge>
              </Button>
              <Button 
                variant={currentTab === "sent" ? "secondary" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setCurrentTab("sent")}
              >
                <Send className="mr-2 h-4 w-4" />
                Sent
              </Button>
              <Button 
                variant={currentTab === "drafts" ? "secondary" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setCurrentTab("drafts")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Drafts
              </Button>
              <Button 
                variant={currentTab === "archive" ? "secondary" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setCurrentTab("archive")}
              >
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </Button>
              <Button 
                variant={currentTab === "trash" ? "secondary" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setCurrentTab("trash")}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Trash
              </Button>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-1">
              <h3 className="text-sm font-medium px-3 py-2">Labels</h3>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setCurrentTab("urgent")}
              >
                <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                Urgent
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setCurrentTab("orders")}
              >
                <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                Orders
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setCurrentTab("inventory")}
              >
                <span className="h-2 w-2 rounded-full bg-purple-500 mr-2"></span>
                Inventory
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setCurrentTab("suppliers")}
              >
                <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                Suppliers
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setCurrentTab("maintenance")}
              >
                <span className="h-2 w-2 rounded-full bg-orange-500 mr-2"></span>
                Maintenance
              </Button>
            </div>
            
            <Separator className="my-4" />
            
            <h3 className="text-sm font-medium px-3 py-2">AI Assistance</h3>
            <div className="rounded-lg border p-4 space-y-3">
              <h4 className="font-medium flex items-center">
                <Wand2 className="h-4 w-4 mr-2 text-primary" />
                Gemini AI Features
              </h4>
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="flex items-center">
                  <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                  Auto-categorize emails
                </p>
                <p className="flex items-center">
                  <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                  Generate email summaries
                </p>
                <p className="flex items-center">
                  <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                  Prioritize by importance
                </p>
                <p className="flex items-center">
                  <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                  Create follow-up reminders
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setIsAiProcessingOpen(true)}
              >
                <Wand2 className="mr-2 h-3 w-3" />
                Run AI Organization
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Email Content */}
        <Card className="md:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Emails</CardTitle>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-[250px]"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="inbox" value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <div className="border-b px-4">
                <TabsList className="w-full justify-start h-12 bg-transparent space-x-6">
                  <TabsTrigger 
                    value="inbox" 
                    className="text-sm font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-1 py-3"
                  >
                    Primary
                  </TabsTrigger>
                  <TabsTrigger 
                    value="urgent" 
                    className="text-sm font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-1 py-3"
                  >
                    Urgent
                  </TabsTrigger>
                  <TabsTrigger 
                    value="orders" 
                    className="text-sm font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-1 py-3"
                  >
                    Orders
                  </TabsTrigger>
                  <TabsTrigger 
                    value="inventory" 
                    className="text-sm font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-1 py-3"
                  >
                    Inventory
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="inbox" className="m-0">
                <Table>
                  <TableBody>
                    {emails.map((email) => (
                      <TableRow key={email.id} className={email.read ? "" : "bg-primary/5"}>
                        <TableCell className="py-3">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              {email.read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4 text-primary" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              {email.starred ? <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> : <StarOff className="h-4 w-4" />}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{email.sender}</div>
                          <div className="text-xs text-muted-foreground">{email.email}</div>
                        </TableCell>
                        <TableCell className="w-full">
                          <div className="font-medium">{email.subject}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-md">{email.preview}</div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex flex-wrap gap-1 justify-end mb-2">
                            {email.labels.map((label, index) => (
                              <div key={index}>{getLabelBadge(label)}</div>
                            ))}
                          </div>
                          <div className="text-xs text-right text-muted-foreground">{email.time}</div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <MailOpen className="h-4 w-4 mr-2" />
                                Mark as read
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Star className="h-4 w-4 mr-2" />
                                Star
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Tag className="h-4 w-4 mr-2" />
                                Apply label
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Archive className="h-4 w-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="py-3 px-4 border-t">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </TabsContent>
              
              <TabsContent value="urgent" className="m-0">
                <Table>
                  <TableBody>
                    {emails
                      .filter(email => email.labels.includes("urgent"))
                      .map((email) => (
                        <TableRow key={email.id} className={email.read ? "" : "bg-primary/5"}>
                          <TableCell className="py-3">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                {email.read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4 text-primary" />}
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                {email.starred ? <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> : <StarOff className="h-4 w-4" />}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{email.sender}</div>
                            <div className="text-xs text-muted-foreground">{email.email}</div>
                          </TableCell>
                          <TableCell className="w-full">
                            <div className="font-medium">{email.subject}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-md">{email.preview}</div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex flex-wrap gap-1 justify-end mb-2">
                              {email.labels.map((label, index) => (
                                <div key={index}>{getLabelBadge(label)}</div>
                              ))}
                            </div>
                            <div className="text-xs text-right text-muted-foreground">{email.time}</div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <MailOpen className="h-4 w-4 mr-2" />
                                  Mark as read
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Star className="h-4 w-4 mr-2" />
                                  Star
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Tag className="h-4 w-4 mr-2" />
                                  Apply label
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Archive className="h-4 w-4 mr-2" />
                                  Archive
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {emails.filter(email => email.labels.includes("urgent")).length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg">No urgent emails</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                      There are no emails marked as urgent at the moment.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="orders" className="m-0">
                <Table>
                  <TableBody>
                    {emails
                      .filter(email => email.labels.includes("order"))
                      .map((email) => (
                        <TableRow key={email.id} className={email.read ? "" : "bg-primary/5"}>
                          <TableCell className="py-3">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                {email.read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4 text-primary" />}
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                {email.starred ? <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> : <StarOff className="h-4 w-4" />}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{email.sender}</div>
                            <div className="text-xs text-muted-foreground">{email.email}</div>
                          </TableCell>
                          <TableCell className="w-full">
                            <div className="font-medium">{email.subject}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-md">{email.preview}</div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex flex-wrap gap-1 justify-end mb-2">
                              {email.labels.map((label, index) => (
                                <div key={index}>{getLabelBadge(label)}</div>
                              ))}
                            </div>
                            <div className="text-xs text-right text-muted-foreground">{email.time}</div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <MailOpen className="h-4 w-4 mr-2" />
                                  Mark as read
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Star className="h-4 w-4 mr-2" />
                                  Star
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Tag className="h-4 w-4 mr-2" />
                                  Apply label
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Archive className="h-4 w-4 mr-2" />
                                  Archive
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {emails.filter(email => email.labels.includes("order")).length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <FileQuestion className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg">No order emails</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                      There are no emails related to orders at the moment.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="inventory" className="m-0">
                <Table>
                  <TableBody>
                    {emails
                      .filter(email => email.labels.includes("inventory"))
                      .map((email) => (
                        <TableRow key={email.id} className={email.read ? "" : "bg-primary/5"}>
                          <TableCell className="py-3">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                {email.read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4 text-primary" />}
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                {email.starred ? <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> : <StarOff className="h-4 w-4" />}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{email.sender}</div>
                            <div className="text-xs text-muted-foreground">{email.email}</div>
                          </TableCell>
                          <TableCell className="w-full">
                            <div className="font-medium">{email.subject}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-md">{email.preview}</div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex flex-wrap gap-1 justify-end mb-2">
                              {email.labels.map((label, index) => (
                                <div key={index}>{getLabelBadge(label)}</div>
                              ))}
                            </div>
                            <div className="text-xs text-right text-muted-foreground">{email.time}</div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <MailOpen className="h-4 w-4 mr-2" />
                                  Mark as read
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Star className="h-4 w-4 mr-2" />
                                  Star
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Tag className="h-4 w-4 mr-2" />
                                  Apply label
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Archive className="h-4 w-4 mr-2" />
                                  Archive
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {emails.filter(email => email.labels.includes("inventory")).length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <FileQuestion className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg">No inventory emails</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                      There are no emails related to inventory at the moment.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="sent" className="m-0">
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Send className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg">No sent emails</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                    You haven't sent any emails recently.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="starred" className="m-0">
                <Table>
                  <TableBody>
                    {emails
                      .filter(email => email.starred)
                      .map((email) => (
                        <TableRow key={email.id} className={email.read ? "" : "bg-primary/5"}>
                          <TableCell className="py-3">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                {email.read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4 text-primary" />}
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{email.sender}</div>
                            <div className="text-xs text-muted-foreground">{email.email}</div>
                          </TableCell>
                          <TableCell className="w-full">
                            <div className="font-medium">{email.subject}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-md">{email.preview}</div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex flex-wrap gap-1 justify-end mb-2">
                              {email.labels.map((label, index) => (
                                <div key={index}>{getLabelBadge(label)}</div>
                              ))}
                            </div>
                            <div className="text-xs text-right text-muted-foreground">{email.time}</div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <MailOpen className="h-4 w-4 mr-2" />
                                  Mark as read
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <StarOff className="h-4 w-4 mr-2" />
                                  Remove star
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Tag className="h-4 w-4 mr-2" />
                                  Apply label
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Archive className="h-4 w-4 mr-2" />
                                  Archive
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {emails.filter(email => email.starred).length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Star className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg">No starred emails</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                      You haven't starred any emails yet. Star important emails to find them quickly.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
