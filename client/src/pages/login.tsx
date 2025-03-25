import { useState } from "react";
import { useAuth } from "../context/auth-context";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Truck, Warehouse } from "lucide-react";

export default function Login() {
  const { user, loading, signInWithGoogle, setUserRole } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    setShowRoleSelection(true);
  };

  const handleRoleSelect = (role: "driver" | "manager") => {
    // Set the user role first
    setUserRole(role);
    
    // Let the auth context handle navigation
    console.log(`Role selected: ${role}, redirecting to /${role}/dashboard`);
    
    // Force a navigation to the appropriate dashboard
    setTimeout(() => {
      if (role === "driver") {
        window.location.href = "/driver/dashboard";
      } else {
        window.location.href = "/manager/dashboard";
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center mb-6">
            <h1 className="text-3xl font-bold text-primary">LogiTrack</h1>
          </div>
          
          <h2 className="text-2xl font-semibold mb-6 text-center">Login to your account</h2>
          
          {!showRoleSelection ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleGoogleSignIn} 
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-5 mb-6"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                <span>Sign in with Google</span>
              </Button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>
              
              <form className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <div className="text-sm text-right">
                  <a href="#" className="text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                
                <Button type="button" className="w-full" disabled>
                  Sign in with Email
                </Button>
              </form>
              
              <p className="mt-6 text-sm text-center text-muted-foreground">
                Don't have an account? 
                <a href="#" className="text-primary ml-1 hover:underline">
                  Sign up
                </a>
              </p>
            </>
          ) : (
            <div className="mt-6">
              <p className="text-center font-medium mb-4">Select your role to continue:</p>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleRoleSelect("driver")}
                  className="flex flex-col items-center justify-center p-8 border-2 border-primary bg-primary/5 hover:bg-primary/10"
                >
                  <Truck className="h-10 w-10 mb-2 text-primary" />
                  <span className="font-medium">Driver</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleRoleSelect("manager")}
                  className="flex flex-col items-center justify-center p-8 border-2 border-primary bg-primary/5 hover:bg-primary/10"
                >
                  <Warehouse className="h-10 w-10 mb-2 text-primary" />
                  <span className="font-medium">Inventory Manager</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-4">
                Note: Your role cannot be changed after selection.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
