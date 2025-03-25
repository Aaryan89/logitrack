import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Plus, 
  UserCheck, 
  ArrowUpDown,
  Edit,
  Trash2,
  AlertCircle,
  Wrench,
  Check,
  MapPin
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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";

export default function ManagerTrucks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddTruckOpen, setIsAddTruckOpen] = useState(false);
  const [isAssignDriverOpen, setIsAssignDriverOpen] = useState(false);
  
  // Sample truck data - would come from API in real app
  const trucks = [
    {
      id: "T-426",
      model: "Volvo FH16",
      license: "ABC-1234",
      status: "On Route",
      driver: "John Doe",
      capacity: 73,
      packages: 12,
      stops: 4,
      lastMaintenance: "2023-09-15",
      lastUpdated: "5 min ago"
    },
    {
      id: "T-422",
      model: "Mercedes-Benz Actros",
      license: "XYZ-5678",
      status: "Delayed",
      driver: "Sarah Johnson",
      capacity: 85,
      packages: 18,
      stops: 7,
      lastMaintenance: "2023-10-02",
      lastUpdated: "12 min ago"
    },
    {
      id: "T-419",
      model: "Scania R450",
      license: "DEF-9101",
      status: "Loading",
      driver: "Mike Brown",
      capacity: 45,
      packages: 8,
      stops: 3,
      lastMaintenance: "2023-10-10",
      lastUpdated: "18 min ago"
    },
    {
      id: "T-418",
      model: "MAN TGX",
      license: "GHI-1122",
      status: "Maintenance",
      driver: "Unassigned",
      capacity: 0,
      packages: 0,
      stops: 0,
      lastMaintenance: "2023-10-21",
      lastUpdated: "1 hr ago"
    },
    {
      id: "T-415",
      model: "DAF XF",
      license: "JKL-3344",
      status: "Available",
      driver: "Unassigned",
      capacity: 0,
      packages: 0,
      stops: 0,
      lastMaintenance: "2023-09-30",
      lastUpdated: "3 hrs ago"
    }
  ];

  // Sample drivers for the assignment dialog - would come from API in real app
  const availableDrivers = [
    { id: 1, name: "Emily Wilson", available: true },
    { id: 2, name: "Robert Chen", available: true },
    { id: 3, name: "Maria Lopez", available: false },
    { id: 4, name: "James Taylor", available: true }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "On Route":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{status}</Badge>;
      case "Delayed":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">{status}</Badge>;
      case "Loading":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{status}</Badge>;
      case "Maintenance":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">{status}</Badge>;
      case "Available":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Truck Management</h1>
        <Dialog open={isAddTruckOpen} onOpenChange={setIsAddTruckOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add New Truck
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Truck</DialogTitle>
              <DialogDescription>
                Enter the details for the new truck.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="truck-id" className="text-right">
                  Truck ID
                </Label>
                <Input id="truck-id" defaultValue="T-" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="model" className="text-right">
                  Model
                </Label>
                <Input id="model" placeholder="e.g. Volvo FH16" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="license" className="text-right">
                  License Plate
                </Label>
                <Input id="license" placeholder="e.g. ABC-1234" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">
                  Capacity (m³)
                </Label>
                <Input id="capacity" type="number" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="loading">Loading</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddTruckOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={() => setIsAddTruckOpen(false)}>
                Add Truck
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isAssignDriverOpen} onOpenChange={setIsAssignDriverOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Driver to Truck #T-415</DialogTitle>
              <DialogDescription>
                Select a driver to assign to this truck.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {availableDrivers.map(driver => (
                  <div key={driver.id} className={`flex items-center justify-between p-3 rounded-lg ${driver.available ? 'bg-muted hover:bg-muted/80 cursor-pointer' : 'bg-muted/50 opacity-60'}`}>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{driver.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {driver.available ? 'Available' : 'Currently assigned'}
                        </p>
                      </div>
                    </div>
                    {driver.available && (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignDriverOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAssignDriverOpen(false)}>
                Assign Driver
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
                placeholder="Search by ID, driver, or status..."
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
                  <SelectItem value="on-route">On Route</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="loading">Loading</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Trucks Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">
                  <div className="flex items-center">
                    Truck ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Model / License</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Last Maintenance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trucks.map((truck) => (
                <TableRow key={truck.id}>
                  <TableCell className="font-medium">{truck.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{truck.model}</div>
                    <div className="text-sm text-muted-foreground">{truck.license}</div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(truck.status)}
                    <div className="text-xs text-muted-foreground mt-1">Updated {truck.lastUpdated}</div>
                  </TableCell>
                  <TableCell>
                    {truck.driver === "Unassigned" ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs"
                        onClick={() => setIsAssignDriverOpen(true)}
                      >
                        <UserCheck className="mr-1 h-3 w-3" />
                        Assign Driver
                      </Button>
                    ) : (
                      <div>
                        <div className="font-medium">{truck.driver}</div>
                        <div className="text-xs text-muted-foreground">
                          {truck.packages} packages • {truck.stops} stops
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Progress value={truck.capacity} className="h-2 w-24 mr-2" />
                      <span className="text-sm">{truck.capacity}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{truck.lastMaintenance}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    {truck.status === "On Route" && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 mr-1">
                            <MapPin className="h-4 w-4 text-blue-500" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium">Current Location</h4>
                            <div className="h-[150px] bg-muted rounded-md flex items-center justify-center">
                              {/* Google Maps integration would go here */}
                              <p className="text-sm text-muted-foreground">Google Maps API integration required</p>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Last updated: {truck.lastUpdated}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                    {truck.status === "Maintenance" && (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 mr-1 text-yellow-500">
                        <Wrench className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 mr-1">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
