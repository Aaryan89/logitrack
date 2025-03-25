import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Map, 
  Search, 
  RefreshCw, 
  Layers, 
  Plus, 
  Minus, 
  Phone, 
  Navigation,
  Fuel,
  Utensils
} from "lucide-react";

export default function DriverCurrentRoute() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Current Route</h1>
      
      {/* Map Container with Enlarged View */}
      <Card className="mb-6">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle>Route Map</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Layers className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="h-[70vh] bg-muted relative">
            {/* Google Maps would be integrated here */}
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              {/* @FUNCTIONALITY: Implement Google Maps API integration with detailed route planning */}
              <Map className="h-16 w-16 text-muted-foreground" />
              <p className="absolute text-muted-foreground">Google Maps integration required</p>
            </div>
            
            {/* Map UI Controls */}
            <div className="absolute top-4 left-4 bg-background rounded shadow p-2 flex flex-col space-y-2">
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Minus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Route Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-background rounded-lg shadow-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Current Destination: AceTech Solutions</h3>
                <span className="bg-primary/10 text-primary text-sm py-1 px-2 rounded-full">ETA: 15 min</span>
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                <p>123 Business Park, Building B</p>
                <p>Delivery window: 11:00 AM - 12:00 PM</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <span className="text-sm text-muted-foreground">Distance: 4.2 km</span>
                </div>
                <div>
                  <Button variant="outline" size="sm" className="mr-2">
                    <Phone className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                  <Button size="sm">
                    <Navigation className="h-4 w-4 mr-1" />
                    Navigate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Rest & Fuel Stations */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Nearby Facilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fuel Stations */}
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <Fuel className="text-yellow-500 mr-2 h-5 w-5" />
                Fuel Stations
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">QuickStop Fuel</p>
                    <p className="text-sm text-muted-foreground">1.2 km ahead • $3.45/gal</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Metro Charging Station</p>
                    <p className="text-sm text-muted-foreground">3.5 km ahead • 4 ports available</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Rest Stations */}
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <Utensils className="text-red-500 mr-2 h-5 w-5" />
                Rest Areas
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Highway Rest Stop #42</p>
                    <p className="text-sm text-muted-foreground">5.7 km ahead • Open 24/7</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">TruckStop Cafe</p>
                    <p className="text-sm text-muted-foreground">8.2 km ahead • Closing at 10 PM</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
