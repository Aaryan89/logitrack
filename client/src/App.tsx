import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "./context/auth-context";

// Layout
import MainLayout from "./components/layout/MainLayout";

// Pages
import Login from "./pages/login";
import NotFound from "./pages/not-found";
import Settings from "./pages/settings";
import Help from "./pages/help";

// Driver Pages
import DriverDashboard from "./pages/driver/dashboard";
import DriverCurrentRoute from "./pages/driver/current-route";
import DriverTruckInventory from "./pages/driver/truck-inventory";
import DriverDeliveries from "./pages/driver/deliveries";
import DriverSchedule from "./pages/driver/schedule";

// Manager Pages
import ManagerDashboard from "./pages/manager/dashboard";
import ManagerInventory from "./pages/manager/inventory";
import ManagerTrucks from "./pages/manager/trucks";
import ManagerRoutes from "./pages/manager/routes";
import ManagerDeadlines from "./pages/manager/deadlines";
import ManagerCalendar from "./pages/manager/calendar";
import ManagerEmails from "./pages/manager/emails";

function App() {
  const [location] = useLocation();
  const isLoginPage = location === "/login";

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          {isLoginPage ? (
            <Login />
          ) : (
            <MainLayout>
              <Switch>
                {/* Driver Routes */}
                <Route path="/" component={DriverDashboard} />
                <Route path="/driver/dashboard" component={DriverDashboard} />
                <Route path="/driver/current-route" component={DriverCurrentRoute} />
                <Route path="/driver/truck-inventory" component={DriverTruckInventory} />
                <Route path="/driver/deliveries" component={DriverDeliveries} />
                <Route path="/driver/schedule" component={DriverSchedule} />
                
                {/* Manager Routes */}
                <Route path="/manager/dashboard" component={ManagerDashboard} />
                <Route path="/manager/inventory" component={ManagerInventory} />
                <Route path="/manager/trucks" component={ManagerTrucks} />
                <Route path="/manager/routes" component={ManagerRoutes} />
                <Route path="/manager/deadlines" component={ManagerDeadlines} />
                <Route path="/manager/calendar" component={ManagerCalendar} />
                <Route path="/manager/emails" component={ManagerEmails} />
                
                {/* Shared Routes */}
                <Route path="/settings" component={Settings} />
                <Route path="/help" component={Help} />
                
                {/* Fallback to 404 */}
                <Route component={NotFound} />
              </Switch>
            </MainLayout>
          )}
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
