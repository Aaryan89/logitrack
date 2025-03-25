import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package2, Clock, AlertOctagon, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ManagerDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inventory Manager Dashboard</h1>
      
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Active Drivers Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Active Drivers</h3>
              <div className="p-2 bg-primary/10 text-primary rounded-full">
                <Truck className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-bold">24</p>
            <div className="mt-2 flex items-center text-sm text-green-500">
              <ArrowUp className="mr-1 h-4 w-4" />
              <span>2 more than yesterday</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Inventory Items Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Inventory Items</h3>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                <Package2 className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-bold">1,563</p>
            <div className="mt-2 flex items-center text-sm text-muted-foreground">
              <span>86% of capacity</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Pending Deliveries Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Pending Deliveries</h3>
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-bold">127</p>
            <div className="mt-2 flex items-center text-sm text-yellow-500">
              <AlertOctagon className="mr-1 h-4 w-4" />
              <span>12 approaching deadline</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Issues Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Active Issues</h3>
              <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                <AlertOctagon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-bold">3</p>
            <div className="mt-2 flex items-center text-sm text-red-500">
              <ArrowDown className="mr-1 h-4 w-4" />
              <span>Down from 5 yesterday</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Warehouse Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Inventory Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle>Recent Inventory Activity</CardTitle>
            <Button variant="link" size="sm" className="h-auto p-0">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                  <Package2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium">New shipment received</p>
                  <p className="text-sm text-muted-foreground">124 items added to inventory</p>
                  <p className="text-xs text-muted-foreground mt-1">10 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                  <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">Truck #T-426 loaded</p>
                  <p className="text-sm text-muted-foreground">12 packages assigned to driver John D.</p>
                  <p className="text-xs text-muted-foreground mt-1">42 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3">
                  <AlertOctagon className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="font-medium">Inventory alert: Low stock</p>
                  <p className="text-sm text-muted-foreground">Category: Electronics - 15 items remaining</p>
                  <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-3">
                  <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="font-medium">Route modified</p>
                  <p className="text-sm text-muted-foreground">Delivery route updated for Truck #T-422</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Expiry Alerts */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Expiry Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
                <div className="flex justify-between">
                  <h3 className="font-medium text-red-800 dark:text-red-200">Fresh Produce</h3>
                  <span className="text-sm font-medium text-red-800 dark:text-red-200">Today</span>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">32 items expiring today</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r-lg">
                <div className="flex justify-between">
                  <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Dairy Products</h3>
                  <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Tomorrow</span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">18 items expiring</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r-lg">
                <div className="flex justify-between">
                  <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Bakery Goods</h3>
                  <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">In 2 days</span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">45 items expiring</p>
              </div>
              <div className="mt-4">
                <Button variant="secondary" className="w-full">
                  View All Expiring Items
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Map Overview and Truck Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Map Overview */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Fleet Location Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-80 relative bg-muted">
              {/* Google Maps would be integrated here */}
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                {/* @FUNCTIONALITY: Implement Google Maps API with real-time fleet tracking */}
                <h3 className="text-muted-foreground">Google Maps API integration required</h3>
              </div>
              <div className="absolute bottom-4 right-4 bg-background rounded-lg shadow-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                    <span className="text-sm">On Schedule</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
                    <span className="text-sm">Delayed</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                    <span className="text-sm">Issues</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Truck Status List */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle>Truck Status</CardTitle>
            <Button variant="link" size="sm" className="h-auto p-0">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-muted">
                <div className="flex justify-between">
                  <span className="font-medium">Truck #T-426</span>
                  <span className="text-green-500 text-sm">On Route</span>
                </div>
                <p className="text-sm text-muted-foreground">Driver: John Doe</p>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>12 packages • 4 stops</span>
                  <span>Updated 5 min ago</span>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-muted">
                <div className="flex justify-between">
                  <span className="font-medium">Truck #T-422</span>
                  <span className="text-yellow-500 text-sm">Delayed</span>
                </div>
                <p className="text-sm text-muted-foreground">Driver: Sarah Johnson</p>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>18 packages • 7 stops</span>
                  <span>Updated 12 min ago</span>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-muted">
                <div className="flex justify-between">
                  <span className="font-medium">Truck #T-419</span>
                  <span className="text-blue-500 text-sm">Loading</span>
                </div>
                <p className="text-sm text-muted-foreground">Driver: Mike Brown</p>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>8 packages • 3 stops</span>
                  <span>Updated 18 min ago</span>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-muted">
                <div className="flex justify-between">
                  <span className="font-medium">Truck #T-418</span>
                  <span className="text-red-500 text-sm">Maintenance</span>
                </div>
                <p className="text-sm text-muted-foreground">Driver: Unassigned</p>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>0 packages • 0 stops</span>
                  <span>Updated 1 hr ago</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
