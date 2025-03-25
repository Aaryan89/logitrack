import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  InfoIcon, 
  CheckCircle, 
  Search, 
  Filter 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function DriverTruckInventory() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock packages data - in a real app, this would come from an API
  const packages = [
    { 
      id: "PKG-001245", 
      description: "Electronics - Fragile", 
      destination: "AceTech Solutions", 
      stopNumber: 2, 
      status: "In Transit", 
      priority: "High" 
    },
    { 
      id: "PKG-001246", 
      description: "Office Supplies", 
      destination: "AceTech Solutions", 
      stopNumber: 2, 
      status: "In Transit", 
      priority: "Medium" 
    },
    { 
      id: "PKG-001252", 
      description: "Fresh Produce", 
      destination: "CityFresh Market", 
      stopNumber: 4, 
      status: "In Transit", 
      priority: "High" 
    },
    { 
      id: "PKG-001255", 
      description: "Industrial Equipment", 
      destination: "Metro Distribution Center", 
      stopNumber: 3, 
      status: "In Transit", 
      priority: "Low" 
    }
  ];

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "low":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "in transit":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "delivered":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Truck Inventory</h1>
      
      {/* Truck Info Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-medium">Truck #T-426</h2>
              <p className="text-muted-foreground">License: ABC-1234 • Model: Volvo FH16</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <span className="block text-2xl font-bold">73%</span>
                <span className="text-sm text-muted-foreground">Capacity</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold">12</span>
                <span className="text-sm text-muted-foreground">Packages</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold">4</span>
                <span className="text-sm text-muted-foreground">Stops</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Inventory Table */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle>Current Inventory</CardTitle>
          <div className="flex">
            <div className="relative mr-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 max-w-xs"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium">{pkg.id}</TableCell>
                  <TableCell>{pkg.description}</TableCell>
                  <TableCell>
                    <div>{pkg.destination}</div>
                    <div className="text-sm text-muted-foreground">Stop #{pkg.stopNumber}</div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(pkg.status)}`}>
                      {pkg.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadgeClass(pkg.priority)}`}>
                      {pkg.priority}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 mr-2">
                      <InfoIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-600 hover:text-green-700">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-4">
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
