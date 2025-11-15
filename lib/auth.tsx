import {
  type PropsWithChildren,
  createContext,
  use,
  useEffect,
  useState,
} from "react";
import { supabase } from "./supabase";

import { type Session } from "@supabase/supabase-js";

type SignInArgs = { email: string; password: string };

const AuthContext = createContext<{
  signIn: (args: SignInArgs) => void;
  signOut: () => void;
  signUp: (args: SignInArgs) => void;
  session?: Session | null;
  loading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  signUp: () => null,
  session: null,
  loading: false,
});

export function useAuthContext() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error("This component must be wrapped in a <AuthProvider />");
  }

  return value;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  // Fetch the session once, and subscribe to auth state changes
  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error);
      }

      setSession(session);
      setLoading(false);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", { event: _event, session });
      setSession(session);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function signUp({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      await supabase.from("users").insert({
        id: data.user.id,
        email,
        // Default user's name to the email hostname
        // TODO: figure out a proper form
        name: email.split("@").at(0),
      });

      setSession(data.session);
    }
    setLoading(false);
  }

  async function signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    setSession(data.session);
    setLoading(false);
  }

  async function signOut() {
    setLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setLoading(false);
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        signUp,
        session,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
