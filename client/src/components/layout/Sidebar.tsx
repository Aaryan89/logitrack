import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "../../context/auth-context";
import {
  LayoutDashboard,
  MapPin,
  Truck,
  Package,
  Calendar,
  Settings,
  HelpCircle,
  PackageOpen,
  TruckIcon,
  Map,
  Clock,
  Mail,
  Warehouse
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isMobile: boolean;
}

export default function Sidebar({ isOpen, setIsOpen, isMobile }: SidebarProps) {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  
  // Close sidebar when navigating on mobile
  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const isActive = (path: string) => {
    return location === path;
  };

  const linkClass = (path: string) => {
    return `flex items-center px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${
      isActive(path)
        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
    }`;
  };

  // Driver Navigation Links
  const driverLinks = [
    { name: "Dashboard", path: "/driver/dashboard", icon: <LayoutDashboard className="mr-3 h-5 w-5" /> },
    { name: "Current Route", path: "/driver/current-route", icon: <MapPin className="mr-3 h-5 w-5" /> },
    { name: "Truck Inventory", path: "/driver/truck-inventory", icon: <Truck className="mr-3 h-5 w-5" /> },
    { name: "Deliveries", path: "/driver/deliveries", icon: <Package className="mr-3 h-5 w-5" /> },
    { name: "Schedule", path: "/driver/schedule", icon: <Calendar className="mr-3 h-5 w-5" /> },
  ];

  // Manager Navigation Links
  const managerLinks = [
    { name: "Dashboard", path: "/manager/dashboard", icon: <LayoutDashboard className="mr-3 h-5 w-5" /> },
    { name: "Inventory", path: "/manager/inventory", icon: <PackageOpen className="mr-3 h-5 w-5" /> },
    { name: "Trucks", path: "/manager/trucks", icon: <TruckIcon className="mr-3 h-5 w-5" /> },
    { name: "Routes", path: "/manager/routes", icon: <Map className="mr-3 h-5 w-5" /> },
    { name: "Deadlines", path: "/manager/deadlines", icon: <Clock className="mr-3 h-5 w-5" /> },
    { name: "Calendar", path: "/manager/calendar", icon: <Calendar className="mr-3 h-5 w-5" /> },
    { name: "Emails", path: "/manager/emails", icon: <Mail className="mr-3 h-5 w-5" /> },
  ];

  // Common Links
  const commonLinks = [
    { name: "Settings", path: "/settings", icon: <Settings className="mr-3 h-5 w-5" /> },
    { name: "Help & Support", path: "/help", icon: <HelpCircle className="mr-3 h-5 w-5" /> },
  ];

  // Sidebar classNames
  const sidebarClass = `
    bg-white dark:bg-gray-800 
    ${isOpen ? "w-64" : "w-0 md:w-20"} 
    fixed md:sticky top-16 
    h-[calc(100vh-4rem)] 
    shadow-md 
    z-20 
    overflow-hidden
    transition-all duration-300 ease-in-out
  `;

  // Handle navigation content based on user role
  const navigationLinks = user?.role === "manager" ? managerLinks : driverLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={sidebarClass}>
        <ScrollArea>
          <div className="py-4 px-3">
            <div className="px-2 py-4 mb-2 border-b border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">
                {user?.role === "manager" ? "Manager Portal" : "Driver Portal"}
              </div>
            </div>
            
            <nav className="space-y-1">
              {navigationLinks.map((link) => (
                <a
                  key={link.path}
                  onClick={() => handleNavigation(link.path)}
                  className={linkClass(link.path)}
                >
                  {link.icon}
                  <span className={`${!isOpen && "md:hidden"}`}>{link.name}</span>
                </a>
              ))}
            </nav>
            
            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
              <nav className="space-y-1">
                {commonLinks.map((link) => (
                  <a
                    key={link.path}
                    onClick={() => handleNavigation(link.path)}
                    className={linkClass(link.path)}
                  >
                    {link.icon}
                    <span className={`${!isOpen && "md:hidden"}`}>{link.name}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}
