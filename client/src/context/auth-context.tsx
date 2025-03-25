import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser 
} from "firebase/auth";
import { initializeFirebase } from "../lib/firebase";
import { useToast } from "@/hooks/use-toast";

// Initialize Firebase
initializeFirebase();
const auth = getAuth();

type UserRole = "driver" | "manager";

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // User is signed in
        const storedRole = localStorage.getItem(`role_${firebaseUser.uid}`);
        
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: (storedRole as UserRole) || null,
        };
        
        setUser(authUser);
        localStorage.setItem("user", JSON.stringify(authUser));
        
        // Redirect based on role
        if (storedRole && window.location.pathname === '/login') {
          navigate(`/${storedRole}/dashboard`);
        }
      } else {
        // User is signed out
        setUser(null);
        localStorage.removeItem("user");
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // The user info is handled by onAuthStateChanged
      toast({
        title: "Signed in successfully",
        description: `Welcome, ${result.user.displayName}!`,
      });
    } catch (error) {
      console.error("Error signing in with Google", error);
      toast({
        title: "Sign in failed",
        description: "There was a problem signing in with Google",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
      navigate("/login");
    } catch (error) {
      console.error("Error signing out", error);
      toast({
        title: "Sign out failed",
        description: "There was a problem signing out",
        variant: "destructive",
      });
    }
  };

  const setUserRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      localStorage.setItem(`role_${user.uid}`, role);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      navigate(`/${role}/dashboard`);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
