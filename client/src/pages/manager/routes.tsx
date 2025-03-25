import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Plus, 
  ArrowUpDown,
  MapPin,
  MoreHorizontal,
  Route,
  Truck,
  Clock,
  Map,
  Calendar,
  AlertTriangle,
  Wand2,
  CheckCircle2,
  Loader2
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ManagerRoutes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddRouteOpen, setIsAddRouteOpen] = useState(false);
  const [showOptimizationDialog, setShowOptimizationDialog] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  // Sample routes data - would come from API in real app
  const routes = [
    {
      id: "RT-1001",
      startLocation: "Main Warehouse",
      endLocation: "Downtown District",
      stops: 5,
      status: "In Progress",
      assignedTruck: "T-426",
      driver: "John Doe",
      distance: "47 km",
      estimatedDuration: "1h 45m",
      startTime: "08:30 AM",
      endTime: "03:15 PM"
    },
    {
      id: "RT-1002",
      startLocation: "Main Warehouse",
      endLocation: "Northern Suburbs",
      stops: 7,
      status: "Delayed",
      assignedTruck: "T-422",
      driver: "Sarah Johnson",
      distance: "62 km",
      estimatedDuration: "2h 30m",
      startTime: "09:00 AM",
      endTime: "04:30 PM"
    },
    {
      id: "RT-1003",
      startLocation: "Distribution Center B",
      endLocation: "Eastern Industrial Zone",
      stops: 4,
      status: "Planned",
      assignedTruck: "T-419",
      driver: "Mike Brown",
      distance: "35 km",
      estimatedDuration: "1h 20m",
      startTime: "11:00 AM",
      endTime: "02:30 PM"
    },
    {
      id: "RT-1004",
      startLocation: "Main Warehouse",
      endLocation: "Southern Retail District",
      stops: 8,
      status: "Planned",
      assignedTruck: "Unassigned",
      driver: "Unassigned",
      distance: "53 km",
      estimatedDuration: "2h 10m",
      startTime: "Tomorrow, 09:30 AM",
      endTime: "Tomorrow, 04:45 PM"
    },
    {
      id: "RT-1000",
      startLocation: "Distribution Center A",
      endLocation: "Western Suburbs",
      stops: 6,
      status: "Completed",
      assignedTruck: "T-423",
      driver: "Lisa Chen",
      distance: "51 km",
      estimatedDuration: "1h 55m",
      startTime: "Yesterday, 08:00 AM",
      endTime: "Yesterday, 02:40 PM"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Progress":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{status}</Badge>;
      case "Delayed":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">{status}</Badge>;
      case "Planned":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{status}</Badge>;
      case "Completed":
        return <Badge variant="outline">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    // In a real app, this would call the Gemini API
    setTimeout(() => {
      setIsOptimizing(false);
      // Show optimized results
    }, 2000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Route Management</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => setShowOptimizationDialog(true)}
          >
            <Wand2 className="mr-2 h-4 w-4" />
            Optimize Routes
          </Button>
          
          <Dialog open={isAddRouteOpen} onOpenChange={setIsAddRouteOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Create New Route
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Delivery Route</DialogTitle>
                <DialogDescription>
                  Define the route details, add stops, and assign resources.
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Route Details</TabsTrigger>
                  <TabsTrigger value="stops">Stops & Deliveries</TabsTrigger>
                  <TabsTrigger value="resources">Assign Resources</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="route-id">Route ID</Label>
                      <Input id="route-id" defaultValue="RT-" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="route-date">Date</Label>
                      <Input id="route-date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="start-location">Start Location</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select start location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="main-warehouse">Main Warehouse</SelectItem>
                          <SelectItem value="distribution-a">Distribution Center A</SelectItem>
                          <SelectItem value="distribution-b">Distribution Center B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-location">End Location</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select end location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="main-warehouse">Main Warehouse</SelectItem>
                          <SelectItem value="downtown">Downtown District</SelectItem>
                          <SelectItem value="northern">Northern Suburbs</SelectItem>
                          <SelectItem value="eastern">Eastern Industrial Zone</SelectItem>
                          <SelectItem value="southern">Southern Retail District</SelectItem>
                          <SelectItem value="western">Western Suburbs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="start-time">Start Time</Label>
                      <Input id="start-time" type="time" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estimated-duration">Estimated Duration</Label>
                      <Input id="estimated-duration" placeholder="e.g. 2h 30m" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" placeholder="Add any additional notes about this route" />
                  </div>
                </TabsContent>
                <TabsContent value="stops" className="py-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-semibold">Stops (0)</h4>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Stop
                      </Button>
                    </div>
                    <div className="border rounded-md p-8 flex flex-col items-center justify-center text-center space-y-3">
                      <MapPin className="h-8 w-8 text-muted-foreground" />
                      <h3 className="font-medium">No stops added yet</h3>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Add delivery stops to create your route. You can optimize the order later using our AI route optimizer.
                      </p>
                    </div>
                    <div className="bg-muted p-4 rounded-md">
                      <div className="flex items-start">
                        <Wand2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium">AI Route Optimization</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            After adding stops, you can use our Gemini AI-powered route optimizer to find the most efficient route order, saving time and fuel.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="resources" className="py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="assigned-truck">Assign Truck</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select truck" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="t-415">T-415 (Available)</SelectItem>
                          <SelectItem value="t-419">T-419 (Available)</SelectItem>
                          <SelectItem value="t-423">T-423 (Available)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assigned-driver">Assign Driver</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select driver" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="emily">Emily Wilson</SelectItem>
                          <SelectItem value="robert">Robert Chen</SelectItem>
                          <SelectItem value="james">James Taylor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-6 p-4 border rounded-md bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900/50">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                      <div>
                        <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Resource Availability</h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                          Ensure the truck and driver are available for the scheduled time. Conflicts will be highlighted after assignment.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddRouteOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" onClick={() => setIsAddRouteOpen(false)}>
                  Create Route
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Optimization Dialog */}
        <Dialog open={showOptimizationDialog} onOpenChange={setShowOptimizationDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>AI Route Optimization</DialogTitle>
              <DialogDescription>
                Use Gemini AI to optimize delivery routes for efficiency, reducing time and fuel consumption.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              {isOptimizing ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <div className="text-center">
                    <h4 className="font-medium">Optimizing Routes</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Gemini AI is analyzing traffic patterns, delivery windows, and truck capacities to find the optimal routes...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Optimization Target</Label>
                      <Select defaultValue="balanced">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="time">Minimize Time</SelectItem>
                          <SelectItem value="fuel">Minimize Fuel Consumption</SelectItem>
                          <SelectItem value="balanced">Balanced Approach</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Routes to Optimize</Label>
                      <Select defaultValue="planned">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Active Routes</SelectItem>
                          <SelectItem value="planned">Only Planned Routes</SelectItem>
                          <SelectItem value="selected">Selected Routes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="border p-4 rounded-md bg-primary/5">
                    <div className="flex items-start">
                      <Wand2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium">How Gemini AI Optimizes Routes</h4>
                        <ul className="text-sm mt-2 space-y-1">
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                            Considers real-time traffic data
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                            Factors in delivery time windows
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                            Optimizes for perishable/time-sensitive items
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                            Balances driver workloads
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowOptimizationDialog(false)} disabled={isOptimizing}>
                Cancel
              </Button>
              <Button 
                onClick={handleOptimize} 
                disabled={isOptimizing}
                className="flex items-center"
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Optimize Routes
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Search and Filter Controls */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="flex-1 max-w-lg relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search routes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Routes Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">
                  <div className="flex items-center">
                    Route ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Locations</TableHead>
                <TableHead>Resources</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-medium">{route.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <div className="font-medium">{route.startLocation}</div>
                      <div className="text-muted-foreground mx-1">→</div>
                      <div className="font-medium">{route.endLocation}</div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {route.stops} stops • {route.distance}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{route.assignedTruck}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      Driver: {route.driver}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{route.estimatedDuration}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {route.startTime} - {route.endTime}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(route.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 mr-1">
                      <Map className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Calendar className="h-4 w-4 mr-2" />
                          View Schedule
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Route className="h-4 w-4 mr-2" />
                          Edit Route
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Optimize
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="p-4 border-t">
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
        </CardContent>
      </Card>
    </div>
  );
}
