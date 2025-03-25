import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Package,
  Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function DriverSchedule() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // This would come from an API in a real application
  const events = [
    {
      id: 1,
      title: "Start Shift",
      time: "8:00 AM",
      type: "shift"
    },
    {
      id: 2,
      title: "Load Truck #T-426",
      time: "8:15 AM",
      location: "Warehouse A - Bay 3",
      type: "loading"
    },
    {
      id: 3,
      title: "Delivery - GlobalTech Industries",
      time: "9:30 AM - 10:30 AM",
      location: "456 Tech Ave, Suite 201",
      items: 3,
      type: "delivery",
      completed: true
    },
    {
      id: 4,
      title: "Delivery - AceTech Solutions",
      time: "11:00 AM - 12:00 PM",
      location: "123 Business Park, Building B",
      items: 2,
      type: "delivery",
      current: true
    },
    {
      id: 5,
      title: "Lunch Break",
      time: "12:30 PM - 1:00 PM",
      type: "break"
    },
    {
      id: 6,
      title: "Delivery - Metro Distribution Center",
      time: "1:30 PM - 2:30 PM",
      location: "789 Industrial Blvd",
      items: 1,
      type: "delivery"
    },
    {
      id: 7,
      title: "Delivery - CityFresh Market",
      time: "3:00 PM - 4:00 PM",
      location: "321 Market St",
      items: 4,
      type: "delivery"
    },
    {
      id: 8,
      title: "Return to Warehouse",
      time: "4:30 PM",
      location: "Warehouse A",
      type: "return"
    },
    {
      id: 9,
      title: "End Shift",
      time: "5:00 PM",
      type: "shift"
    }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case "delivery":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "loading":
        return <Truck className="h-5 w-5 text-purple-500" />;
      case "break":
        return <Clock className="h-5 w-5 text-green-500" />;
      case "shift":
        return <Clock className="h-5 w-5 text-gray-500" />;
      case "return":
        return <MapPin className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getEventClass = (event: any) => {
    if (event.completed) return "opacity-60";
    if (event.current) return "border-l-4 border-primary";
    return "";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Schedule</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Today's Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shift Time</span>
                  <span className="font-medium">8:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deliveries</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium">1 of 4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Distance</span>
                  <span className="font-medium">47 km</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Today's Schedule</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                {date?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event, index) => (
                <div key={event.id} className={`p-3 rounded-lg bg-muted ${getEventClass(event)}`}>
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">{getEventIcon(event.type)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{event.title}</h3>
                        <span className="text-sm text-muted-foreground">{event.time}</span>
                      </div>
                      {event.location && (
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.location}
                        </p>
                      )}
                      {event.items && (
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <Package className="h-3 w-3 mr-1" />
                          {event.items} {event.items === 1 ? "item" : "items"}
                        </p>
                      )}
                      
                      {event.current && (
                        <div className="mt-2">
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            Current Stop
                          </Badge>
                        </div>
                      )}
                      
                      {event.completed && (
                        <div className="mt-2">
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Completed
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
