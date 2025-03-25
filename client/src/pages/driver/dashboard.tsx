import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PackageCheck, Map, ArrowUp, NavigationIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DriverDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Driver Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Today's Deliveries */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Today's Deliveries</h3>
              <span className="bg-primary/10 text-primary text-sm font-medium py-1 px-2 rounded">12</span>
            </div>
            <p className="text-muted-foreground text-sm">5 completed, 7 remaining</p>
            <div className="mt-3 w-full">
              <Progress value={41.67} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        {/* Distance Travelled */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-medium">Distance Travelled</h3>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-3xl font-bold">137</span>
                <span className="text-muted-foreground ml-1">km</span>
                <p className="text-muted-foreground text-sm mt-1">Today's journey</p>
              </div>
              <div className="text-green-500 flex items-center">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">12% more than yesterday</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Next Stop */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-medium">Next Stop</h3>
            </div>
            <p className="font-medium">AceTech Solutions</p>
            <p className="text-muted-foreground text-sm">123 Business Park, Building B</p>
            <div className="flex justify-between mt-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <PackageCheck className="h-4 w-4 mr-1" />
                <span>ETA: 15 min</span>
              </div>
              <Button variant="link" className="h-auto p-0">
                <NavigationIcon className="h-4 w-4 mr-1" />
                Navigate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Current Route Map and Stops */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Current Route</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg overflow-hidden h-80 relative">
            {/* Google Maps would be integrated here */}
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              {/* @FUNCTIONALITY: Implement Google Maps API integration */}
              <Map className="h-16 w-16 text-muted-foreground" />
              <p className="absolute text-muted-foreground">Google Maps integration required</p>
            </div>
            <div className="absolute bottom-4 right-4 bg-background rounded-lg shadow-lg p-3 flex items-center space-x-2">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-sm font-medium">Current Location</span>
            </div>
          </div>
          
          <div className="mt-4 space-y-3">
            <h3 className="font-medium">Today's Stops</h3>
            
            {/* Stop list */}
            <div className="space-y-3">
              {/* Completed stop */}
              <div className="flex items-center p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500">
                <div className="mr-3 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 rounded-full h-8 w-8 flex items-center justify-center">
                  <PackageCheck className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium line-through">GlobalTech Industries</p>
                  <p className="text-sm text-muted-foreground line-through">456 Tech Ave, Suite 201</p>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>Completed</p>
                  <p>10:30 AM</p>
                </div>
              </div>
              
              {/* Current stop */}
              <div className="flex items-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500">
                <div className="mr-3 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded-full h-8 w-8 flex items-center justify-center">
                  <NavigationIcon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">AceTech Solutions</p>
                  <p className="text-sm text-muted-foreground">123 Business Park, Building B</p>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>Current</p>
                  <p>ETA: 15 min</p>
                </div>
              </div>
              
              {/* Upcoming stops */}
              <div className="flex items-center p-2 rounded-lg">
                <div className="mr-3 bg-muted text-foreground rounded-full h-8 w-8 flex items-center justify-center">
                  <span>3</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Metro Distribution Center</p>
                  <p className="text-sm text-muted-foreground">789 Industrial Blvd</p>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>Upcoming</p>
                  <p>ETA: 11:45 AM</p>
                </div>
              </div>
              
              <div className="flex items-center p-2 rounded-lg">
                <div className="mr-3 bg-muted text-foreground rounded-full h-8 w-8 flex items-center justify-center">
                  <span>4</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">CityFresh Market</p>
                  <p className="text-sm text-muted-foreground">321 Market St</p>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>Upcoming</p>
                  <p>ETA: 1:15 PM</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
