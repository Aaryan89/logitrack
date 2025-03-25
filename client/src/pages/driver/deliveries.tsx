import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TicketCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  Package,
  MapPin,
  ListFilter
} from "lucide-react";

export default function DriverDeliveries() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // This would come from an API in a real application
  const deliveries = [
    {
      id: "DEL-7532",
      recipient: "AceTech Solutions",
      address: "123 Business Park, Building B",
      items: 2,
      status: "In Progress",
      scheduledTime: "11:00 AM - 12:00 PM",
      notes: "Deliver to reception"
    },
    {
      id: "DEL-7533",
      recipient: "Metro Distribution Center",
      address: "789 Industrial Blvd",
      items: 1,
      status: "Pending",
      scheduledTime: "11:45 AM - 12:30 PM",
      notes: "Loading dock #3"
    },
    {
      id: "DEL-7534",
      recipient: "CityFresh Market",
      address: "321 Market St",
      items: 4,
      status: "Pending",
      scheduledTime: "1:15 PM - 2:00 PM",
      notes: "Refrigerated items"
    },
    {
      id: "DEL-7529",
      recipient: "GlobalTech Industries",
      address: "456 Tech Ave, Suite 201",
      items: 3,
      status: "Completed",
      scheduledTime: "9:30 AM - 10:30 AM",
      notes: "Signed by J. Smith"
    },
    {
      id: "DEL-7530",
      recipient: "Urban Office Supplies",
      address: "789 Downtown Ave",
      items: 2,
      status: "Completed",
      scheduledTime: "10:00 AM - 10:45 AM",
      notes: "Left with security"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{status}</Badge>;
      case "In Progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{status}</Badge>;
      case "Pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingDeliveries = deliveries.filter(d => d.status === "Pending" || d.status === "In Progress");
  const completedDeliveries = deliveries.filter(d => d.status === "Completed");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Deliveries</h1>
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search deliveries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full sm:w-[300px]"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Active ({pendingDeliveries.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Completed ({completedDeliveries.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Active Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingDeliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">{delivery.id}</TableCell>
                      <TableCell>
                        <div>{delivery.recipient}</div>
                        <div className="text-sm text-muted-foreground">{delivery.address}</div>
                      </TableCell>
                      <TableCell>{delivery.items}</TableCell>
                      <TableCell>{delivery.scheduledTime}</TableCell>
                      <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="mr-2">
                          <MapPin className="h-4 w-4 mr-2" />
                          Navigate
                        </Button>
                        <Button variant="outline" size="sm">
                          <TicketCheck className="h-4 w-4 mr-2" />
                          Complete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Completed Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Delivered At</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedDeliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">{delivery.id}</TableCell>
                      <TableCell>
                        <div>{delivery.recipient}</div>
                        <div className="text-sm text-muted-foreground">{delivery.address}</div>
                      </TableCell>
                      <TableCell>{delivery.items}</TableCell>
                      <TableCell>{delivery.scheduledTime}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{delivery.notes}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
