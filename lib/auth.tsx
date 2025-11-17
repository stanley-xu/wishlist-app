import { supabase } from "@/supabase/client";
import {
  type PropsWithChildren,
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { auth as authHelpers } from "@/data/db-helpers";
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

  const signUp = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      setLoading(true);

      try {
        const { data: session, error } = await authHelpers.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (session) {
          setSession(session);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signIn = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      setLoading(true);

      try {
        const { data: session, error } = await authHelpers.signIn({
          email,
          password,
        });

        if (error) throw error;

        if (session) {
          setSession(session);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    setLoading(true);

    try {
      const { error } = await authHelpers.signOut();

      if (error) throw error;

      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      signIn,
      signOut,
      signUp,
      session,
      loading,
    }),
    [signIn, signOut, signUp, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
