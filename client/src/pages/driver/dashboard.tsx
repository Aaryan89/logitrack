import { useEffect, useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  PackageCheck, Map, ArrowUp, NavigationIcon, 
  Loader2, Truck, Fuel, Coffee, Route, AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useGoogleMaps, LocationType, type Location } from "@/lib/maps";
import { getRouteOptimization, analyzeInventory } from "@/lib/gemini";

type Delivery = {
  id: string;
  address: string;
  customer: string;
  eta: string;
  status: 'completed' | 'current' | 'upcoming';
  completedTime?: string;
  packages: string[];
};

type RouteInfo = {
  id: string;
  origin: string;
  destination: string;
  currentLocation: string;
  stops: Delivery[];
  distance: number;
  estimatedTime: string;
};

type TruckInventory = {
  name: string;
  quantity: number;
  expiryDate?: string;
};

export default function DriverDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("route");
  const [aiRouteAnalysis, setAiRouteAnalysis] = useState<string | null>(null);
  const [aiInventoryAnalysis, setAiInventoryAnalysis] = useState<string | null>(null);
  const [isLoadingRouteAI, setIsLoadingRouteAI] = useState(false);
  const [isLoadingInventoryAI, setIsLoadingInventoryAI] = useState(false);
  const mapContainerId = "driver-route-map";
  
  // Google Maps integration
  const { isLoaded, addMarkers, drawRoute, searchNearby } = useGoogleMaps(mapContainerId);
  const [nearbyLocations, setNearbyLocations] = useState<Location[]>([]);
  const [showNearbyLocations, setShowNearbyLocations] = useState(false);
  
  // Mock data for demonstration
  const mockRouteInfo: RouteInfo = {
    id: "ROUTE-001",
    origin: "Warehouse A, Chicago, IL",
    destination: "Distribution Center, Detroit, MI",
    currentLocation: "Chicago, IL",
    stops: [
      {
        id: "STOP-001",
        customer: "GlobalTech Industries",
        address: "456 Tech Ave, Suite 201, Chicago, IL",
        eta: "10:30 AM",
        status: "completed",
        completedTime: "10:30 AM",
        packages: ["PKG-001", "PKG-002"],
      },
      {
        id: "STOP-002",
        customer: "AceTech Solutions",
        address: "123 Business Park, Building B, Gary, IN",
        eta: "11:30 AM",
        status: "current",
        packages: ["PKG-003"],
      },
      {
        id: "STOP-003",
        customer: "Metro Distribution Center",
        address: "789 Industrial Blvd, South Bend, IN",
        eta: "1:45 PM",
        status: "upcoming",
        packages: ["PKG-004", "PKG-005"],
      },
      {
        id: "STOP-004",
        customer: "CityFresh Market",
        address: "321 Market St, Kalamazoo, MI",
        eta: "3:15 PM",
        status: "upcoming",
        packages: ["PKG-006"],
      },
    ],
    distance: 137,
    estimatedTime: "5 hours 20 min",
  };
  
  const mockInventory: TruckInventory[] = [
    { name: "Fresh Produce", quantity: 12, expiryDate: "2025-04-01" },
    { name: "Dairy Products", quantity: 8, expiryDate: "2025-03-28" },
    { name: "Electronics", quantity: 5 },
    { name: "Office Supplies", quantity: 15 },
    { name: "Medical Supplies", quantity: 3, expiryDate: "2026-02-15" },
  ];

  // Convert mock stops to locations for map
  const deliveryLocations: Location[] = mockRouteInfo.stops.map((stop, index) => ({
    id: stop.id,
    type: stop.status === 'current' 
      ? LocationType.CurrentLocation 
      : LocationType.DeliveryLocation,
    position: { 
      // This would be geocoded in a real app, using approximate coordinates for demo
      lat: 41.8781 - (index * 0.5), 
      lng: -87.6298 + (index * 0.8)
    },
    name: stop.customer,
    address: stop.address,
    description: `ETA: ${stop.eta} • Packages: ${stop.packages.join(', ')}`
  }));

  // Fetch driver's current route
  const { data: routeData, isLoading: isLoadingRoute } = useQuery({
    queryKey: ['/api/routes/current'],
    queryFn: async () => {
      // In a real app, we would fetch from the API
      // return await apiRequest('/api/routes/current');
      
      // For demo, return mock data with a delay to simulate API request
      return new Promise<RouteInfo>((resolve) => {
        setTimeout(() => resolve(mockRouteInfo), 500);
      });
    }
  });

  // Fetch truck inventory
  const { data: inventoryData, isLoading: isLoadingInventory } = useQuery({
    queryKey: ['/api/inventory/truck'],
    queryFn: async () => {
      // In a real app, we would fetch from the API
      // return await apiRequest('/api/inventory/truck');
      
      // For demo, return mock data with a delay to simulate API request
      return new Promise<TruckInventory[]>((resolve) => {
        setTimeout(() => resolve(mockInventory), 700);
      });
    }
  });

  // Calculate completed percentage
  const completedCount = routeData?.stops.filter(s => s.status === 'completed').length || 0;
  const totalStops = routeData?.stops.length || 0;
  const completedPercentage = totalStops > 0 ? (completedCount / totalStops) * 100 : 0;

  // Initialize map with route data once loaded
  useEffect(() => {
    if (isLoaded && routeData && deliveryLocations.length > 0) {
      // Add all delivery locations to the map
      addMarkers(deliveryLocations);
      
      // Draw the route between locations
      const originPos = deliveryLocations[0].position;
      const destinationPos = deliveryLocations[deliveryLocations.length - 1].position;
      const waypointPositions = deliveryLocations.slice(1, -1).map(loc => loc.position);
      
      drawRoute(originPos, destinationPos, waypointPositions);
    }
  }, [isLoaded, routeData, deliveryLocations, addMarkers, drawRoute]);

  // Function to search for nearby facilities
  const handleFindNearby = async (type: 'gas_station' | 'restaurant') => {
    if (!isLoaded || deliveryLocations.length === 0) return;
    
    try {
      // Use the current location for searching nearby places
      const currentLocation = deliveryLocations.find(loc => loc.type === LocationType.CurrentLocation);
      if (!currentLocation) return;
      
      const locationType = type === 'gas_station' ? 'gas_station' : 'restaurant';
      const locations = await searchNearby(currentLocation.position, locationType, 5000);
      
      setNearbyLocations(locations);
      setShowNearbyLocations(true);
      
      // Update markers to show both delivery locations and nearby facilities
      addMarkers([...deliveryLocations, ...locations]);
      
      toast({
        title: "Found nearby places",
        description: `Showing ${locations.length} ${type === 'gas_station' ? 'gas stations' : 'rest areas'} near your current location.`,
      });
    } catch (error) {
      console.error("Error searching for nearby places:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not find nearby places. Please try again.",
      });
    }
  };

  // Function to reset map to only show delivery locations
  const handleResetMap = () => {
    if (isLoaded && deliveryLocations.length > 0) {
      addMarkers(deliveryLocations);
      setShowNearbyLocations(false);
      setNearbyLocations([]);
    }
  };

  // Function to get AI-powered route optimization suggestions
  const handleGetRouteOptimization = async () => {
    if (!routeData) return;
    
    setIsLoadingRouteAI(true);
    try {
      const currentLocation = routeData.currentLocation;
      const deliveryAddresses = routeData.stops
        .filter(s => s.status !== 'completed')
        .map(s => s.address);
      
      const truckContents = inventoryData?.map(item => 
        `${item.name} (${item.quantity} units)${item.expiryDate ? ` - Expires: ${item.expiryDate}` : ''}`
      ) || [];
      
      const analysis = await getRouteOptimization(
        currentLocation,
        deliveryAddresses,
        truckContents
      );
      
      setAiRouteAnalysis(analysis);
    } catch (error) {
      console.error("Error getting route optimization:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not get route optimization suggestions. Please try again.",
      });
    } finally {
      setIsLoadingRouteAI(false);
    }
  };

  // Function to get AI-powered inventory analysis
  const handleGetInventoryAnalysis = async () => {
    if (!inventoryData) return;
    
    setIsLoadingInventoryAI(true);
    try {
      const analysis = await analyzeInventory(inventoryData);
      setAiInventoryAnalysis(analysis);
    } catch (error) {
      console.error("Error analyzing inventory:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not analyze inventory. Please try again.",
      });
    } finally {
      setIsLoadingInventoryAI(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Driver Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Today's Deliveries */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Today's Deliveries</h3>
              <span className="bg-primary/10 text-primary text-sm font-medium py-1 px-2 rounded">
                {totalStops}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              {completedCount} completed, {totalStops - completedCount} remaining
            </p>
            <div className="mt-3 w-full">
              <Progress value={completedPercentage} className="h-2" />
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
                <span className="text-3xl font-bold">{routeData?.distance || 0}</span>
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
            {routeData?.stops.find(s => s.status === 'current') ? (
              <>
                <p className="font-medium">
                  {routeData.stops.find(s => s.status === 'current')?.customer}
                </p>
                <p className="text-muted-foreground text-sm">
                  {routeData.stops.find(s => s.status === 'current')?.address}
                </p>
                <div className="flex justify-between mt-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <PackageCheck className="h-4 w-4 mr-1" />
                    <span>ETA: {routeData.stops.find(s => s.status === 'current')?.eta}</span>
                  </div>
                  <Button variant="link" className="h-auto p-0">
                    <NavigationIcon className="h-4 w-4 mr-1" />
                    Navigate
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">No current stops</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="route">Route & Map</TabsTrigger>
          <TabsTrigger value="inventory">Truck Inventory</TabsTrigger>
          <TabsTrigger value="ai">AI Assistance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="route" className="space-y-4">
          {/* Current Route Map and Stops */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Current Route</CardTitle>
              <CardDescription>
                {routeData?.origin} to {routeData?.destination}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg overflow-hidden h-80 relative">
                {isLoaded ? (
                  <div id={mapContainerId} className="w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                    <p className="ml-2 text-muted-foreground">Loading map...</p>
                  </div>
                )}
                
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="flex items-center"
                    onClick={() => handleFindNearby('gas_station')}
                    disabled={!isLoaded}
                  >
                    <Fuel className="h-4 w-4 mr-2" />
                    Find Gas
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="flex items-center"
                    onClick={() => handleFindNearby('restaurant')}
                    disabled={!isLoaded}
                  >
                    <Coffee className="h-4 w-4 mr-2" />
                    Find Rest Stops
                  </Button>
                  {showNearbyLocations && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex items-center"
                      onClick={handleResetMap}
                    >
                      <Route className="h-4 w-4 mr-2" />
                      Show Route Only
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <h3 className="font-medium">Today's Stops</h3>
                
                {/* Stop list */}
                <div className="space-y-3">
                  {isLoadingRoute ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-6 w-6 text-primary animate-spin mr-2" />
                      <p>Loading stops...</p>
                    </div>
                  ) : (
                    routeData?.stops.map((stop, index) => (
                      <div 
                        key={stop.id}
                        className={`flex items-center p-2 rounded-lg ${
                          stop.status === 'completed' 
                            ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500' 
                            : stop.status === 'current'
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                              : ''
                        }`}
                      >
                        <div className={`mr-3 rounded-full h-8 w-8 flex items-center justify-center ${
                          stop.status === 'completed' 
                            ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200' 
                            : stop.status === 'current'
                              ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200'
                              : 'bg-muted text-foreground'
                        }`}>
                          {stop.status === 'completed' ? (
                            <PackageCheck className="h-4 w-4" />
                          ) : stop.status === 'current' ? (
                            <NavigationIcon className="h-4 w-4" />
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${stop.status === 'completed' ? 'line-through' : ''}`}>
                            {stop.customer}
                          </p>
                          <p className={`text-sm text-muted-foreground ${stop.status === 'completed' ? 'line-through' : ''}`}>
                            {stop.address}
                          </p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>{
                            stop.status === 'completed' 
                              ? 'Completed' 
                              : stop.status === 'current'
                                ? 'Current'
                                : 'Upcoming'
                          }</p>
                          <p>{
                            stop.status === 'completed' 
                              ? stop.completedTime 
                              : `ETA: ${stop.eta}`
                          }</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Truck Inventory</CardTitle>
              <CardDescription>
                Items currently loaded in your truck
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingInventory ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 text-primary animate-spin mr-2" />
                  <p>Loading inventory...</p>
                </div>
              ) : (
                <div className="border rounded-md divide-y">
                  <div className="grid grid-cols-12 py-3 px-4 font-medium bg-muted">
                    <div className="col-span-6">Item</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-4 text-right">Expiration</div>
                  </div>
                  
                  {inventoryData?.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 py-3 px-4">
                      <div className="col-span-6 flex items-center">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                          <Truck className="w-4 h-4 text-primary" />
                        </div>
                        <span>{item.name}</span>
                      </div>
                      <div className="col-span-2 text-center flex items-center justify-center">
                        <span className="bg-primary/10 text-primary font-medium px-2 py-1 rounded-md text-sm">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="col-span-4 text-right">
                        {item.expiryDate ? (
                          <span className={`px-2 py-1 rounded-md text-sm ${
                            new Date(item.expiryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                              ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300'
                              : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300'
                          }`}>
                            {item.expiryDate}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">N/A</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGetInventoryAnalysis}
                disabled={isLoadingInventoryAI || !inventoryData}
                className="ml-auto"
              >
                {isLoadingInventoryAI && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyze Inventory with AI
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Route Optimization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Route className="h-5 w-5 mr-2" />
                  Route Optimization
                </CardTitle>
                <CardDescription>
                  Get AI-powered suggestions for the most efficient route
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                {isLoadingRouteAI ? (
                  <div className="flex flex-col items-center justify-center h-40">
                    <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                    <p>Analyzing your route with AI...</p>
                    <p className="text-sm text-muted-foreground mt-2">This might take a moment</p>
                  </div>
                ) : aiRouteAnalysis ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ 
                      __html: aiRouteAnalysis.replace(/\n/g, '<br />') 
                    }} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                    <p>No route analysis available</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click the button below to analyze your current route
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleGetRouteOptimization}
                  disabled={isLoadingRouteAI || !routeData}
                  className="w-full"
                >
                  {isLoadingRouteAI && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Get Route Optimization
                </Button>
              </CardFooter>
            </Card>
            
            {/* AI Inventory Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Inventory Analysis
                </CardTitle>
                <CardDescription>
                  Get AI-powered analysis of your truck's inventory
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                {isLoadingInventoryAI ? (
                  <div className="flex flex-col items-center justify-center h-40">
                    <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                    <p>Analyzing your inventory with AI...</p>
                    <p className="text-sm text-muted-foreground mt-2">This might take a moment</p>
                  </div>
                ) : aiInventoryAnalysis ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ 
                      __html: aiInventoryAnalysis.replace(/\n/g, '<br />') 
                    }} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                    <p>No inventory analysis available</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click the button below to analyze your current inventory
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleGetInventoryAnalysis}
                  disabled={isLoadingInventoryAI || !inventoryData}
                  className="w-full"
                >
                  {isLoadingInventoryAI && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Analyze Inventory
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
