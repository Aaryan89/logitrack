import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  LifeBuoy,
  Search,
  FileQuestion,
  BookOpen,
  Mail,
  Phone,
  Video,
  Truck,
  Package,
  LayoutGrid,
  CalendarClock,
  MapPin,
  MessageSquare,
  CircleHelp
} from "lucide-react";

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Help & Support</h1>

      {/* Hero Section with Search */}
      <Card className="mb-6 bg-primary/5 border-primary/20">
        <CardContent className="pt-6 pb-8">
          <div className="text-center mb-6">
            <LifeBuoy className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">How can we help you?</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Search our knowledge base for answers or browse the categories below
            </p>
          </div>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="pl-10"
            />
            <Button className="absolute right-1 top-1 h-8">Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="hover:border-primary/50 cursor-pointer transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-lg mr-4">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Driver Guides</h3>
                <p className="text-sm text-muted-foreground">
                  Help for truck drivers using the delivery system
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 cursor-pointer transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-lg mr-4">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Inventory Management</h3>
                <p className="text-sm text-muted-foreground">
                  Learn about tracking and managing inventory
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 cursor-pointer transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-lg mr-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Route Planning</h3>
                <p className="text-sm text-muted-foreground">
                  Guidance on optimizing delivery routes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 cursor-pointer transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-lg mr-4">
                <CalendarClock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Deadlines & Scheduling</h3>
                <p className="text-sm text-muted-foreground">
                  Tips for managing deadlines and schedules
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 cursor-pointer transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-lg mr-4">
                <LayoutGrid className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">UI Navigation</h3>
                <p className="text-sm text-muted-foreground">
                  Help with finding and using features
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 cursor-pointer transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-lg mr-4">
                <CircleHelp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Getting Started</h3>
                <p className="text-sm text-muted-foreground">
                  New user guides and tutorials
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Support Tabs */}
      <Tabs defaultValue="faq" className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">
            <FileQuestion className="h-4 w-4 mr-2" />
            FAQs
          </TabsTrigger>
          <TabsTrigger value="docs">
            <BookOpen className="h-4 w-4 mr-2" />
            Documentation
          </TabsTrigger>
          <TabsTrigger value="videos">
            <Video className="h-4 w-4 mr-2" />
            Video Tutorials
          </TabsTrigger>
          <TabsTrigger value="contact">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I change my account password?</AccordionTrigger>
                  <AccordionContent>
                    You can change your password by going to the Settings page, then selecting the Security tab. There, you'll find the option to change your password. If you're using Google authentication, you'll need to manage your password through your Google account.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I optimize my delivery routes?</AccordionTrigger>
                  <AccordionContent>
                    In the Route Management section, click on the "Optimize Routes" button that uses our Gemini AI-powered route optimization. The system will analyze traffic patterns, delivery windows, and truck capacities to find the optimal routes for your deliveries.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Can I switch between driver and manager roles?</AccordionTrigger>
                  <AccordionContent>
                    No, your role (driver or inventory manager) is selected during initial setup and cannot be changed afterward. This is by design to ensure proper security and access control. If you need to change roles, please contact your system administrator.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>How do I add new inventory items?</AccordionTrigger>
                  <AccordionContent>
                    Navigate to the Inventory Management section and click the "Add New Item" button. Fill out the required information including item ID, name, category, quantity, and location. You can also set status and expiry dates for perishable items.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>How does the AI email organization work?</AccordionTrigger>
                  <AccordionContent>
                    Our Gemini AI-powered email organization system automatically categorizes emails based on content, identifies important messages related to logistics operations, flags urgent communications, and creates summaries. To use this feature, go to the Email Organization page and click on "AI Organize".
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger>How can I check my truck inventory as a driver?</AccordionTrigger>
                  <AccordionContent>
                    As a driver, you can access your truck inventory by navigating to the "Truck Inventory" section in the sidebar menu. This will show you all packages currently loaded on your truck, along with their details such as package ID, description, destination, status, and priority.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border border-muted h-full">
                  <CardContent className="pt-6">
                    <h3 className="font-medium flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-primary" />
                      Getting Started Guide
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      A comprehensive guide to getting started with LogiTrack, covering basic setup, navigation, and essential features.
                    </p>
                    <Button variant="outline" className="mt-4 w-full">View Guide</Button>
                  </CardContent>
                </Card>
                
                <Card className="border border-muted h-full">
                  <CardContent className="pt-6">
                    <h3 className="font-medium flex items-center">
                      <Truck className="h-5 w-5 mr-2 text-primary" />
                      Driver Manual
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Complete documentation for drivers on using the system, including route navigation, delivery confirmation, and truck inventory management.
                    </p>
                    <Button variant="outline" className="mt-4 w-full">View Manual</Button>
                  </CardContent>
                </Card>
                
                <Card className="border border-muted h-full">
                  <CardContent className="pt-6">
                    <h3 className="font-medium flex items-center">
                      <Package className="h-5 w-5 mr-2 text-primary" />
                      Inventory Management Guide
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Detailed instructions for inventory managers on tracking, updating, and optimizing inventory across warehouses and trucks.
                    </p>
                    <Button variant="outline" className="mt-4 w-full">View Guide</Button>
                  </CardContent>
                </Card>
                
                <Card className="border border-muted h-full">
                  <CardContent className="pt-6">
                    <h3 className="font-medium flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-primary" />
                      Route Optimization Guide
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Learn how to use Gemini AI-powered route optimization to create efficient delivery schedules and reduce fuel consumption.
                    </p>
                    <Button variant="outline" className="mt-4 w-full">View Guide</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Video Tutorials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Video className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="font-medium">Getting Started with LogiTrack</p>
                    <p className="text-sm text-muted-foreground">(5:32)</p>
                  </div>
                </div>
                
                <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Video className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="font-medium">Driver Interface Tutorial</p>
                    <p className="text-sm text-muted-foreground">(7:15)</p>
                  </div>
                </div>
                
                <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Video className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="font-medium">Inventory Management Basics</p>
                    <p className="text-sm text-muted-foreground">(8:42)</p>
                  </div>
                </div>
                
                <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Video className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="font-medium">AI Route Optimization</p>
                    <p className="text-sm text-muted-foreground">(6:19)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card className="border border-muted">
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-lg mr-4">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Email Support</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Our support team typically responds within 24 hours
                        </p>
                        <p className="text-sm font-medium">support@logitrack.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-muted">
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-lg mr-4">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Phone Support</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Available Monday to Friday, 9am to 5pm ET
                        </p>
                        <p className="text-sm font-medium">+1 (800) 123-4567</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-4">Send us a message</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Name</label>
                        <Input id="name" placeholder="Your name" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input id="email" type="email" placeholder="Your email address" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                      <Input id="subject" placeholder="What is your question about?" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">Message</label>
                      <textarea 
                        id="message" 
                        rows={5} 
                        className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Please describe your issue in detail..."
                      />
                    </div>
                    
                    <Button className="w-full">Submit</Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator className="my-6" />
      
      {/* Getting Started */}
      <h2 className="text-xl font-semibold mb-4">Quick Start Guides</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>For Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Log in with your account</li>
              <li>Check your schedule for today</li>
              <li>View your truck inventory</li>
              <li>Start your route navigation</li>
              <li>Mark deliveries as complete</li>
            </ol>
            <Button variant="outline" className="w-full mt-4">
              Driver Onboarding Guide
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>For Inventory Managers</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Log in with your account</li>
              <li>Check inventory status dashboard</li>
              <li>Review expiring items</li>
              <li>Assign packages to trucks</li>
              <li>Create and optimize routes</li>
            </ol>
            <Button variant="outline" className="w-full mt-4">
              Manager Onboarding Guide
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>AI Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded mr-2 mt-0.5">
                  <MapPin className="h-4 w-4 text-primary" />
                </span>
                <span>Route optimization with Gemini AI</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded mr-2 mt-0.5">
                  <Mail className="h-4 w-4 text-primary" />
                </span>
                <span>Email organization and prioritization</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded mr-2 mt-0.5">
                  <Package className="h-4 w-4 text-primary" />
                </span>
                <span>Inventory tracking and reordering</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded mr-2 mt-0.5">
                  <CalendarClock className="h-4 w-4 text-primary" />
                </span>
                <span>Deadline management</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full mt-4">
              AI Features Guide
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
