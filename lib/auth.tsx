import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { supabase, User } from "./database";
import { withPendingStates } from "./utils";

interface LoginArgs {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (args: LoginArgs) => Promise<void>;
  signUp: (args: LoginArgs) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start loading while checking session

  // Check for existing session on startup
  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    }
    
    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function signUp({ email, password }: LoginArgs) {
    return withPendingStates(setLoading, async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await supabase.from("users").insert({
          id: data.user.id,
          email,
          name: email.split("@").at(0), // Fall back to email hostname for now
        });

        setUser(data.user);
      }
    });
  }

  async function signIn({ email, password }: LoginArgs) {
    return withPendingStates(setLoading, async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setUser(data.user);
    });
  }

  async function signOut() {
    return withPendingStates(setLoading, async () => {
      await supabase.auth.signOut();
      setUser(null);
    });
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  console.log({ value });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
