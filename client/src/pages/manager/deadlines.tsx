import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Plus, 
  ArrowUpDown,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Timer,
  CalendarClock,
  CalendarIcon,
  BellRing,
  Wand2,
  Package2
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ManagerDeadlines() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDeadlineOpen, setIsAddDeadlineOpen] = useState(false);
  
  // Sample deadlines data - would come from API in real app
  const deadlines = [
    {
      id: "DL-5123",
      title: "TechCorp Large Shipment",
      description: "Electronics delivery for quarterly order",
      deadline: "Today, 5:00 PM",
      type: "Delivery",
      priority: "High",
      status: "At Risk",
      progress: 65,
      responsible: "John Doe",
      estimatedCompletion: "Today, 6:30 PM",
      route: "RT-1001"
    },
    {
      id: "DL-5124",
      title: "Fresh Produce Daily Delivery",
      description: "Grocery chain perishable goods",
      deadline: "Today, 2:00 PM",
      type: "Delivery",
      priority: "Critical",
      status: "Urgent",
      progress: 40,
      responsible: "Sarah Johnson",
      estimatedCompletion: "Today, 2:15 PM",
      route: "RT-1002"
    },
    {
      id: "DL-5125",
      title: "Medical Supplies Restocking",
      description: "Hospital weekly supply delivery",
      deadline: "Tomorrow, 9:00 AM",
      type: "Delivery",
      priority: "Medium",
      status: "On Track",
      progress: 20,
      responsible: "Mike Brown",
      estimatedCompletion: "Tomorrow, 8:45 AM",
      route: "RT-1003"
    },
    {
      id: "DL-5126",
      title: "Office Furniture Installation",
      description: "Corporate headquarters setup",
      deadline: "Oct 25, 3:00 PM",
      type: "Service",
      priority: "Low",
      status: "On Track",
      progress: 10,
      responsible: "Emily Wilson",
      estimatedCompletion: "Oct 25, 1:30 PM",
      route: "RT-1004"
    },
    {
      id: "DL-5127",
      title: "Monthly Inventory Audit",
      description: "Warehouse A full inspection",
      deadline: "Oct 31, 5:00 PM",
      type: "Internal",
      priority: "Medium",
      status: "Upcoming",
      progress: 0,
      responsible: "Inventory Team",
      estimatedCompletion: "Oct 31, 4:00 PM",
      route: "N/A"
    }
  ];

  const expiringItems = [
    {
      id: "INV-7846",
      name: "Organic Apples",
      category: "Fresh Produce",
      quantity: "120 kg",
      location: "Cold Storage A • Zone 2",
      expiryDate: "Today"
    },
    {
      id: "INV-7847",
      name: "Fresh Milk",
      category: "Dairy Products",
      quantity: "85 L",
      location: "Cold Storage A • Zone 1",
      expiryDate: "Tomorrow"
    },
    {
      id: "INV-7850",
      name: "Whole Grain Bread",
      category: "Bakery Goods",
      quantity: "45 units",
      location: "Warehouse B • Bakery Section",
      expiryDate: "In 2 days"
    }
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Critical":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">{priority}</Badge>;
      case "High":
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">{priority}</Badge>;
      case "Medium":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">{priority}</Badge>;
      case "Low":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{priority}</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "Urgent":
        return (
          <div className="flex items-center">
            <div className="mr-2 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-red-500 font-medium">Urgent</span>
          </div>
        );
      case "At Risk":
        return (
          <div className="flex items-center">
            <div className="mr-2 h-2.5 w-2.5 rounded-full bg-orange-500"></div>
            <span className="text-orange-500 font-medium">At Risk</span>
          </div>
        );
      case "On Track":
        return (
          <div className="flex items-center">
            <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-500"></div>
            <span className="text-green-500 font-medium">On Track</span>
          </div>
        );
      case "Upcoming":
        return (
          <div className="flex items-center">
            <div className="mr-2 h-2.5 w-2.5 rounded-full bg-blue-500"></div>
            <span className="text-blue-500 font-medium">Upcoming</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <div className="mr-2 h-2.5 w-2.5 rounded-full bg-gray-500"></div>
            <span className="text-gray-500 font-medium">{status}</span>
          </div>
        );
    }
  };

  const getProgressIndicator = (deadline: any) => {
    const progressColor = 
      deadline.status === "Urgent" ? "bg-red-500" :
      deadline.status === "At Risk" ? "bg-orange-500" :
      "bg-green-500";
    
    return (
      <div className="flex items-center gap-2">
        <Progress value={deadline.progress} className={`h-2 w-full ${progressColor}`} />
        <span className="text-xs font-medium">{deadline.progress}%</span>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Deadline Management</h1>
        <Dialog open={isAddDeadlineOpen} onOpenChange={setIsAddDeadlineOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add New Deadline
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Deadline</DialogTitle>
              <DialogDescription>
                Create a new deadline for tracking time-sensitive operations.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input id="title" className="col-span-3" placeholder="e.g. Fresh Produce Delivery" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input id="description" className="col-span-3" placeholder="Brief description of the deadline" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deadline-date" className="text-right">
                  Due Date
                </Label>
                <div className="col-span-3 grid grid-cols-2 gap-2">
                  <Input id="deadline-date" type="date" />
                  <Input id="deadline-time" type="time" />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="responsible" className="text-right">
                  Responsible
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Assign responsible party" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">John Doe</SelectItem>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="mike">Mike Brown</SelectItem>
                    <SelectItem value="emily">Emily Wilson</SelectItem>
                    <SelectItem value="inventory">Inventory Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="related-route" className="text-right">
                  Related Route
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select related route (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rt-1001">RT-1001 (Downtown District)</SelectItem>
                    <SelectItem value="rt-1002">RT-1002 (Northern Suburbs)</SelectItem>
                    <SelectItem value="rt-1003">RT-1003 (Eastern Industrial Zone)</SelectItem>
                    <SelectItem value="rt-1004">RT-1004 (Southern Retail District)</SelectItem>
                    <SelectItem value="na">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDeadlineOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={() => setIsAddDeadlineOpen(false)}>
                Create Deadline
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Upcoming Deadlines Summary */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Deadlines Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-900/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-red-800 dark:text-red-200">Urgent</h3>
                  <div className="font-bold text-2xl text-red-800 dark:text-red-200">1</div>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">Requires immediate attention</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-900/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-orange-800 dark:text-orange-200">At Risk</h3>
                  <div className="font-bold text-2xl text-orange-800 dark:text-orange-200">1</div>
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">May miss deadline</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-900/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-green-800 dark:text-green-200">On Track</h3>
                  <div className="font-bold text-2xl text-green-800 dark:text-green-200">3</div>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">Progressing as planned</p>
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-lg mb-4">
              <div className="flex items-start space-x-3">
                <Wand2 className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">Gemini AI Deadline Assistant</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Our AI system can help prioritize deadlines, suggest optimal resource allocation, and predict potential delays based on current progress and historical data.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Wand2 className="h-3 w-3 mr-1" />
                    Get AI Recommendations
                  </Button>
                </div>
              </div>
            </div>
            
            <h3 className="font-medium text-lg mb-3">Today's Priorities</h3>
            <div className="space-y-3">
              {deadlines
                .filter(d => d.deadline.includes("Today"))
                .map(deadline => (
                  <div key={deadline.id} className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">{deadline.title}</h4>
                          {getPriorityBadge(deadline.priority)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{deadline.description}</p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm">{deadline.deadline}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      {getProgressIndicator(deadline)}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>Route: {deadline.route}</span>
                      <span>Responsible: {deadline.responsible}</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Expiry Alerts */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
              Expiry Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiringItems.map(item => (
                <div key={item.id} className={`p-3 border-l-4 rounded-r-lg ${
                  item.expiryDate === "Today" 
                    ? "bg-red-50 dark:bg-red-900/20 border-red-500" 
                    : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500"
                }`}>
                  <div className="flex justify-between">
                    <h3 className="font-medium">
                      {item.expiryDate === "Today" 
                        ? <span className="text-red-800 dark:text-red-200">{item.name}</span>
                        : <span className="text-yellow-800 dark:text-yellow-200">{item.name}</span>
                      }
                    </h3>
                    <span className={`text-sm font-medium ${
                      item.expiryDate === "Today"
                        ? "text-red-800 dark:text-red-200"
                        : "text-yellow-800 dark:text-yellow-200"
                    }`}>
                      {item.expiryDate}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className={
                      item.expiryDate === "Today"
                        ? "text-red-700 dark:text-red-300"
                        : "text-yellow-700 dark:text-yellow-300"
                    }>
                      {item.category}
                    </span>
                    <span className={
                      item.expiryDate === "Today"
                        ? "text-red-700 dark:text-red-300"
                        : "text-yellow-700 dark:text-yellow-300"
                    }>
                      {item.quantity}
                    </span>
                  </div>
                  <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                    Location: {item.location}
                  </p>
                </div>
              ))}
              <div className="mt-4">
                <Button variant="secondary" className="w-full">
                  View All Expiring Items
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Deadlines Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <CardTitle>All Deadlines</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search deadlines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-[200px]"
                />
              </div>
              <Select>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList className="mb-4">
              <TabsTrigger value="active" className="flex items-center">
                <Timer className="h-4 w-4 mr-2" />
                Active
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="flex items-center">
                <CalendarClock className="h-4 w-4 mr-2" />
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Completed
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Title & Description</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Deadline
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deadlines
                    .filter(d => d.status !== "Completed")
                    .map((deadline) => (
                      <TableRow key={deadline.id}>
                        <TableCell className="font-medium">{deadline.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{deadline.title}</div>
                          <div className="text-sm text-muted-foreground">{deadline.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Responsible: {deadline.responsible}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{deadline.deadline}</div>
                          <div className="text-xs text-muted-foreground">
                            Est. completion: {deadline.estimatedCompletion}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(deadline.priority)}
                        </TableCell>
                        <TableCell>
                          {getStatusIndicator(deadline.status)}
                        </TableCell>
                        <TableCell className="w-[140px]">
                          {getProgressIndicator(deadline)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="upcoming">
              <div className="flex items-center justify-center py-10">
                <div className="text-center space-y-3">
                  <CalendarIcon className="h-10 w-10 text-muted-foreground mx-auto" />
                  <h3 className="font-medium text-lg">No upcoming deadlines</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    All scheduled deadlines are currently active. Create a new deadline to plan ahead.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="completed">
              <div className="flex items-center justify-center py-10">
                <div className="text-center space-y-3">
                  <CheckCircle2 className="h-10 w-10 text-muted-foreground mx-auto" />
                  <h3 className="font-medium text-lg">No completed deadlines in view</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    There are no recently completed deadlines. Adjust the date range to see historical data.
                  </p>
                  <Button variant="outline" size="sm">
                    View Historical Data
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="pt-2 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing 5 of 5 deadlines
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
