import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock,
  Truck,
  Package,
  Users,
  CalendarClock,
  Calendar as CalendarCheck,
  MoreHorizontal
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// This component represents a calendar day cell
const DayCell = ({ day, events, currentDate, setSelectedDate, setIsEventDetailsOpen }: any) => {
  const isToday = 
    day.getDate() === new Date().getDate() && 
    day.getMonth() === new Date().getMonth() && 
    day.getFullYear() === new Date().getFullYear();
  
  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
  
  // Filter events for this day
  const dayEvents = events.filter((event: any) => {
    const eventDate = new Date(event.start);
    return eventDate.getDate() === day.getDate() && 
           eventDate.getMonth() === day.getMonth() && 
           eventDate.getFullYear() === day.getFullYear();
  });
  
  const handleEventClick = (event: any) => {
    setSelectedDate(day);
    setIsEventDetailsOpen(true);
  };

  return (
    <div 
      className={`min-h-[100px] border border-border p-1 ${
        isToday ? 'bg-primary/10' : isCurrentMonth ? 'bg-background' : 'bg-muted/50'
      }`}
      onClick={() => setSelectedDate(day)}
    >
      <div className={`text-xs p-1 font-medium ${
        isToday ? 'text-primary' : 
        !isCurrentMonth ? 'text-muted-foreground' : ''
      }`}>
        {day.getDate()}
      </div>
      <div className="space-y-1 mt-1">
        {dayEvents.slice(0, 3).map((event: any, idx: number) => (
          <div 
            key={idx}
            className={`text-xs px-2 py-1 truncate rounded ${getEventColor(event.type)}`}
            onClick={(e) => {
              e.stopPropagation();
              handleEventClick(event);
            }}
          >
            {event.title}
          </div>
        ))}
        {dayEvents.length > 3 && (
          <div className="text-xs text-muted-foreground pl-2">
            + {dayEvents.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
};

// Helper to get event color based on type
const getEventColor = (type: string) => {
  switch (type) {
    case "shipment":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200";
    case "departure":
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200";
    case "audit":
      return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200";
    case "meeting":
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200";
    default:
      return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
  }
};

// Helper to get event icon based on type
const getEventIcon = (type: string) => {
  switch (type) {
    case "shipment":
      return <Package className="h-5 w-5 text-blue-500" />;
    case "departure":
      return <Truck className="h-5 w-5 text-green-500" />;
    case "audit":
      return <CalendarCheck className="h-5 w-5 text-purple-500" />;
    case "meeting":
      return <Users className="h-5 w-5 text-yellow-500" />;
    default:
      return <Clock className="h-5 w-5" />;
  }
};

export default function ManagerCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  
  // Generate calendar grid
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    // Get the last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Get the day of the week of the first day (0-6, where 0 is Sunday)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    // Calculate how many days to show from the previous month
    const daysFromPrevMonth = firstDayOfWeek;
    
    // Calculate total days to show (42 = 6 weeks x 7 days)
    const totalDays = 42;
    
    const days = [];
    
    // Add days from the previous month
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    
    for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
      days.push(new Date(year, month - 1, i));
    }
    
    // Add days from the current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add days from the next month to fill the grid
    const remainingDays = totalDays - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Get today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Sample events - would come from API in real app
  const events = [
    {
      id: 1,
      title: "Large Shipment - TechCorp Order",
      description: "Receiving electronics order for TechCorp quarterly stock",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 21, 11, 0),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 21, 12, 30),
      type: "shipment",
      relatedId: "INV-7845"
    },
    {
      id: 2,
      title: "Truck #T-426 Departure",
      description: "Downtown delivery route with 12 packages",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 21, 15, 0),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 21, 16, 0),
      type: "departure",
      relatedId: "RT-1001"
    },
    {
      id: 3,
      title: "Weekly Team Meeting",
      description: "Review weekly operations and address any issues",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20, 8, 0),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20, 9, 0),
      type: "meeting",
      relatedId: ""
    },
    {
      id: 4,
      title: "Inventory Audit",
      description: "Quarterly audit of Warehouse A inventory",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 22, 13, 0),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 22, 15, 0),
      type: "audit",
      relatedId: ""
    },
    {
      id: 5,
      title: "Supplier Meeting",
      description: "Meeting with FreshGoods Co. about upcoming orders",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19, 13, 0),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19, 14, 30),
      type: "meeting",
      relatedId: ""
    },
    {
      id: 6,
      title: "Truck Maintenance",
      description: "Scheduled maintenance for Truck #T-418",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20, 15, 0),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20, 16, 0),
      type: "audit",
      relatedId: "T-418"
    },
    {
      id: 7,
      title: "Weekend Delivery",
      description: "Special weekend delivery route",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 23, 8, 0),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 23, 9, 0),
      type: "departure",
      relatedId: "RT-1005"
    }
  ];

  // Filter events for the selected date
  const selectedDateEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.getDate() === selectedDate.getDate() && 
           eventDate.getMonth() === selectedDate.getMonth() && 
           eventDate.getFullYear() === selectedDate.getFullYear();
  });

  // Get days of the week for header
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Get time string from Date
  const getTimeString = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Scheduling Calendar</h1>
        <div className="flex space-x-2">
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Schedule a new event in the logistics calendar.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="event-title" className="text-right">
                    Title
                  </Label>
                  <Input id="event-title" className="col-span-3" placeholder="Event title" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="event-description" className="text-right">
                    Description
                  </Label>
                  <Textarea id="event-description" className="col-span-3" placeholder="Event description" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="event-type" className="text-right">
                    Event Type
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shipment">Shipment</SelectItem>
                      <SelectItem value="departure">Departure</SelectItem>
                      <SelectItem value="audit">Audit/Maintenance</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="event-date" className="text-right">
                    Date
                  </Label>
                  <Input 
                    id="event-date" 
                    type="date" 
                    className="col-span-3" 
                    defaultValue={selectedDate.toISOString().split('T')[0]}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="event-time" className="text-right">
                    Time
                  </Label>
                  <div className="col-span-3 flex space-x-2">
                    <Input id="event-start-time" type="time" className="flex-1" />
                    <span className="flex items-center">to</span>
                    <Input id="event-end-time" type="time" className="flex-1" />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="event-related" className="text-right">
                    Related Item
                  </Label>
                  <Input id="event-related" className="col-span-3" placeholder="e.g. T-426, RT-1001, INV-7845 (optional)" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="col-span-4 flex items-center space-x-2 justify-end">
                    <Checkbox id="all-day" />
                    <Label htmlFor="all-day">All day event</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" onClick={() => setIsAddEventOpen(false)}>
                  Add Event
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Calendar Navigation */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold">{formatDate(currentDate)}</h2>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
            </div>
            <div className="flex justify-end">
              <Tabs 
                defaultValue="month" 
                value={viewMode} 
                onValueChange={(val) => setViewMode(val as "month" | "week" | "day")}
                className="w-auto"
              >
                <TabsList>
                  <TabsTrigger value="day" className="px-3">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Day
                  </TabsTrigger>
                  <TabsTrigger value="week" className="px-3">
                    <CalendarClock className="h-4 w-4 mr-1" />
                    Week
                  </TabsTrigger>
                  <TabsTrigger value="month" className="px-3">
                    <CalendarCheck className="h-4 w-4 mr-1" />
                    Month
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Calendar Grid */}
      <Card className="mb-6">
        <CardContent className="p-0">
          {viewMode === "month" && (
            <>
              {/* Calendar Header - Days of Week */}
              <div className="grid grid-cols-7">
                {daysOfWeek.map((day, index) => (
                  <div key={index} className="p-2 text-center font-medium text-sm border-b">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {generateCalendar().map((day, index) => (
                  <DayCell 
                    key={index} 
                    day={day} 
                    events={events}
                    currentDate={currentDate}
                    setSelectedDate={setSelectedDate}
                    setIsEventDetailsOpen={setIsEventDetailsOpen}
                  />
                ))}
              </div>
            </>
          )}
          
          {viewMode === "week" && (
            <div className="flex flex-col items-center justify-center py-20">
              <CalendarClock className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Week View Coming Soon</h3>
              <p className="text-sm text-muted-foreground max-w-md text-center mt-2">
                We're working on implementing the week view for more detailed scheduling. Please use month or day view for now.
              </p>
            </div>
          )}
          
          {viewMode === "day" && (
            <div className="p-4">
              <h3 className="text-lg font-medium mb-4">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <div key={event.id} className={`p-3 rounded-lg ${getEventColor(event.type)}`}>
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">{getEventIcon(event.type)}</div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{event.title}</h3>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <p className="text-sm mt-1">{event.description}</p>
                          <div className="flex items-center mt-2 text-sm">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              {getTimeString(new Date(event.start))} - {getTimeString(new Date(event.end))}
                            </span>
                          </div>
                          {event.relatedId && (
                            <Badge variant="outline" className="mt-2">
                              ID: {event.relatedId}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="font-medium">No events scheduled</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                    There are no events scheduled for this day. Click the "Add Event" button to create one.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => setIsAddEventOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Event
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Upcoming Events */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events
              .filter(event => new Date(event.start) > new Date())
              .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
              .slice(0, 3)
              .map((event) => (
                <div key={event.id} className="flex items-start p-3 bg-muted rounded-lg">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                    event.type === "shipment" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" :
                    event.type === "departure" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" :
                    event.type === "audit" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" :
                    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                  }`}>
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">{event.title}</p>
                      <span className="text-sm text-muted-foreground">
                        {new Date(event.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {getTimeString(new Date(event.start))}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                </div>
              ))}
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Scheduled Events
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Event Details Dialog */}
      <Dialog open={isEventDetailsOpen} onOpenChange={setIsEventDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          {selectedDateEvents.length > 0 && (
            <div className="py-4">
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <div key={event.id} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      {getEventIcon(event.type)}
                      <h2 className="text-lg font-medium">{event.title}</h2>
                    </div>
                    
                    <p className="text-muted-foreground">{event.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="font-medium">Start Time</div>
                        <div className="text-muted-foreground">
                          {new Date(event.start).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">End Time</div>
                        <div className="text-muted-foreground">
                          {new Date(event.end).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {event.relatedId && (
                      <div className="text-sm">
                        <div className="font-medium">Related ID</div>
                        <div className="text-muted-foreground">{event.relatedId}</div>
                      </div>
                    )}
                    
                    <div className="text-sm">
                      <div className="font-medium">Event Type</div>
                      <div className="text-muted-foreground capitalize">{event.type}</div>
                    </div>
                    
                    <Separator />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsEventDetailsOpen(false)}>
                  Close
                </Button>
                <Button variant="default">
                  Edit Event
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
