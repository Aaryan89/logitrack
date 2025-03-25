import { useState } from "react";
import { useAuth } from "../context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/hooks/use-theme";
import {
  User,
  Lock,
  Bell,
  Palette,
  LifeBuoy,
  LogOut,
  UserCircle,
  Mail,
  MapPin,
  Phone,
  Shield,
  ChevronRight,
  SunMoon,
  Moon,
  Sun,
  Smartphone,
  GlobeLock
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("profile");
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    deliveryAlerts: true,
    inventoryAlerts: true,
    systemUpdates: false
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully."
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved."
    });
  };

  const handleToggleNotification = (key: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof notificationSettings]
    }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation Sidebar */}
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <div className="space-y-2">
              <Button 
                variant={currentTab === "profile" ? "secondary" : "ghost"} 
                className="w-full justify-start" 
                onClick={() => setCurrentTab("profile")}
              >
                <User className="mr-2 h-5 w-5" />
                Profile
                <ChevronRight className="ml-auto h-5 w-5" />
              </Button>
              <Button 
                variant={currentTab === "security" ? "secondary" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setCurrentTab("security")}
              >
                <Shield className="mr-2 h-5 w-5" />
                Security
                <ChevronRight className="ml-auto h-5 w-5" />
              </Button>
              <Button 
                variant={currentTab === "notifications" ? "secondary" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setCurrentTab("notifications")}
              >
                <Bell className="mr-2 h-5 w-5" />
                Notifications
                <ChevronRight className="ml-auto h-5 w-5" />
              </Button>
              <Button 
                variant={currentTab === "appearance" ? "secondary" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setCurrentTab("appearance")}
              >
                <Palette className="mr-2 h-5 w-5" />
                Appearance
                <ChevronRight className="ml-auto h-5 w-5" />
              </Button>
              <Button 
                variant={currentTab === "help" ? "secondary" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setCurrentTab("help")}
              >
                <LifeBuoy className="mr-2 h-5 w-5" />
                Help & Support
                <ChevronRight className="ml-auto h-5 w-5" />
              </Button>
              
              <Separator className="my-4" />
              
              <Button 
                variant="destructive" 
                className="w-full justify-start"
                onClick={signOut}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Settings Content Area */}
        <Card className="md:col-span-3">
          <CardContent className="p-6">
            {/* Profile Settings */}
            {currentTab === "profile" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Profile Settings</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Manage your personal information and preferences
                    </p>
                  </div>
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || "User"} />
                      <AvatarFallback className="text-2xl">
                        {user?.displayName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">Change Photo</Button>
                    <div className="text-center">
                      <p className="text-sm font-medium">Account Type</p>
                      <p className="text-sm text-muted-foreground capitalize">{user?.role || "User"}</p>
                      <p className="text-xs text-muted-foreground mt-1">Role cannot be changed</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input 
                          id="fullName" 
                          defaultValue={user?.displayName || ""}
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          defaultValue={user?.email || ""}
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          placeholder="Your phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input 
                          id="location" 
                          placeholder="Your location"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="utc-8">
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                          <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                          <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                          <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                          <SelectItem value="utc-0">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Security Settings */}
            {currentTab === "security" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">Security Settings</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage your account security and login options
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-muted/50 p-4 rounded-lg flex items-start">
                    <UserCircle className="h-10 w-10 text-primary mr-4 mt-1" />
                    <div>
                      <h3 className="font-medium">Google Account Authentication</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your account is linked with Google authentication.
                      </p>
                      <div className="text-xs text-muted-foreground mt-3 flex items-center">
                        <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 rounded text-xs font-medium mr-2">
                          ACTIVE
                        </span>
                        Connected email: {user?.email}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-4">Session Management</h3>
                    <div className="space-y-3">
                      <div className="bg-muted p-3 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <GlobeLock className="h-5 w-5 mr-3 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">Current Browser</p>
                            <p className="text-xs text-muted-foreground">Chrome on Windows • Active now</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Sign Out</Button>
                      </div>
                      
                      <div className="bg-muted p-3 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <Smartphone className="h-5 w-5 mr-3 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">Mobile App</p>
                            <p className="text-xs text-muted-foreground">iPhone 14 • Last active: Yesterday</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Sign Out</Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Enable 2FA</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Notification Settings */}
            {currentTab === "notifications" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Notification Settings</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Manage how you receive notifications and alerts
                    </p>
                  </div>
                  <Button onClick={handleSaveNotifications}>Save Changes</Button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Email Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="emailNotifications" className="text-base font-normal">
                            Receive email notifications
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Get notifications via email
                          </p>
                        </div>
                        <Switch 
                          id="emailNotifications" 
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={() => handleToggleNotification("emailNotifications")}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-4">System Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="deliveryAlerts" className="text-base font-normal">
                            Delivery Alerts
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Notifications about delivery status changes
                          </p>
                        </div>
                        <Switch 
                          id="deliveryAlerts" 
                          checked={notificationSettings.deliveryAlerts}
                          onCheckedChange={() => handleToggleNotification("deliveryAlerts")}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="inventoryAlerts" className="text-base font-normal">
                            Inventory Alerts
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Notifications about low stock or inventory changes
                          </p>
                        </div>
                        <Switch 
                          id="inventoryAlerts" 
                          checked={notificationSettings.inventoryAlerts}
                          onCheckedChange={() => handleToggleNotification("inventoryAlerts")}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="systemUpdates" className="text-base font-normal">
                            System Updates
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Notifications about system updates and maintenance
                          </p>
                        </div>
                        <Switch 
                          id="systemUpdates" 
                          checked={notificationSettings.systemUpdates}
                          onCheckedChange={() => handleToggleNotification("systemUpdates")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Appearance Settings */}
            {currentTab === "appearance" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">Appearance Settings</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Customize how LogiTrack looks for you
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Theme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer hover:border-primary ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border'}`}
                        onClick={() => theme === 'dark' && toggleTheme()}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium">Light</span>
                          {theme === 'light' && <Check className="h-4 w-4 text-primary" />}
                        </div>
                        <div className="h-24 bg-white border rounded-md flex items-center justify-center">
                          <Sun className="h-8 w-8 text-yellow-500" />
                        </div>
                      </div>
                      
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer hover:border-primary ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border'}`}
                        onClick={() => theme === 'light' && toggleTheme()}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium">Dark</span>
                          {theme === 'dark' && <Check className="h-4 w-4 text-primary" />}
                        </div>
                        <div className="h-24 bg-gray-900 border rounded-md flex items-center justify-center">
                          <Moon className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 cursor-not-allowed opacity-60">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium">System</span>
                        </div>
                        <div className="h-24 bg-gradient-to-r from-white to-gray-900 border rounded-md flex items-center justify-center">
                          <SunMoon className="h-8 w-8 text-gray-600" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Coming soon</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-4">Layout</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sidebarPosition">Sidebar Position</Label>
                        <Select defaultValue="left">
                          <SelectTrigger id="sidebarPosition">
                            <SelectValue placeholder="Select sidebar position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="denseMode">Content Density</Label>
                        <Select defaultValue="comfortable">
                          <SelectTrigger id="denseMode">
                            <SelectValue placeholder="Select content density" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="comfortable">Comfortable</SelectItem>
                            <SelectItem value="compact">Compact</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Help & Support */}
            {currentTab === "help" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">Help & Support</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get assistance with LogiTrack
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="font-medium flex items-center">
                        <LifeBuoy className="h-5 w-5 mr-2 text-primary" />
                        Customer Support
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Contact our support team for help with any issues you're experiencing with LogiTrack.
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>support@logitrack.com</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>+1 (800) 123-4567</span>
                        </div>
                      </div>
                      <Button className="mt-4 w-full">Contact Support</Button>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="font-medium flex items-center">
                        <FileQuestion className="h-5 w-5 mr-2 text-primary" />
                        Documentation
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Browse our documentation for guides on how to use LogiTrack's features.
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                          <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>Getting Started</span>
                        </div>
                        <div className="flex items-center">
                          <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>Inventory Management</span>
                        </div>
                        <div className="flex items-center">
                          <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>Route Planning</span>
                        </div>
                        <div className="flex items-center">
                          <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>Truck Assignment</span>
                        </div>
                      </div>
                      <Button variant="outline" className="mt-4 w-full">View Documentation</Button>
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <h3 className="font-medium flex items-center text-primary">
                      <Wand2 className="h-5 w-5 mr-2" />
                      AI Assistant
                    </h3>
                    <p className="text-sm mt-2">
                      Our Gemini AI-powered assistant can help answer your questions and guide you through LogiTrack.
                    </p>
                    <div className="mt-4">
                      <Button className="w-full">Chat with AI Assistant</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Frequently Asked Questions</h3>
                    <div className="space-y-3">
                      <div className="bg-muted p-3 rounded-lg">
                        <h4 className="font-medium">How do I add a new inventory item?</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Navigate to Inventory Management, then click the "Add New Item" button and fill out the required information.
                        </p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <h4 className="font-medium">How can I optimize delivery routes?</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          In the Route Management section, click on "Optimize Routes" to use our Gemini AI-powered route optimization.
                        </p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <h4 className="font-medium">Can I change my role from driver to manager?</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Roles are assigned during initial setup and cannot be changed afterward. Please contact support if you need role adjustments.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper component for the checkmark in theme selection
function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
