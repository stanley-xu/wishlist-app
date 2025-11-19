import { supabase } from "@/supabase/client";
import {
  type PropsWithChildren,
  createContext,
  use,
  useEffect,
  useMemo,
  useState,
} from "react";

import { auth, auth as authHelpers, profiles } from "@/lib/api";
import { type Session } from "@supabase/supabase-js";
import { useLoadingState } from "./hooks";
import { Profile } from "./schemas";

type SignInArgs = { email: string; password: string };

const AuthContext = createContext<{
  signIn: (args: SignInArgs) => void;
  signOut: () => void;
  signUp: (args: SignInArgs) => void;
  session?: Session | null;
  profile?: Profile | null;
  loading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  signUp: () => null,
  session: null,
  profile: null,
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
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const { loading: loadSessionLoading, action: loadSession } = useLoadingState(
    async () => {
      const { data, error } = await auth.getSession();
      if (error) throw error;
      setSession(data);
      return data;
    }
  );

  // TODO: remove after testing
  // const delayedLoadProfileByUserId = useDelayedCallback(
  //   async (userId: string) => {
  //     const { data, error } = await profiles.getByUserId(userId);
  //     if (error) throw error;
  //     setProfile(data);
  //     return data;
  //   },
  //   3000
  // );

  const { loading: loadProfileByUserIdLoading, action: loadProfileByUserId } =
    useLoadingState(async (userId: string) => {
      console.debug("calling");
      const { data, error } = await profiles.getByUserId(userId);
      console.debug("loadProfileByUserId", { data, error });
      if (error) throw error;
      setProfile(data);
      return data;
    });

  const { loading: handleSessionChangeLoading, action: handleSessionChange } =
    useLoadingState(async (session: Session | null) => {
      setSession(session);
      if (session) {
        console.debug("flag");
        await loadProfileByUserId(session.user.id);
      } else {
        setProfile(null);
      }
    });

  // Fetch the session once, and subscribe to auth state changes
  useEffect(() => {
    async function fetchAndSetSessionAndProfile() {
      try {
        const session = await loadSession();
        if (session) {
          await loadProfileByUserId(session.user.id);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchAndSetSessionAndProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", { event: _event, session });
      await handleSessionChange(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const { loading: signUpLoading, action: signUp } = useLoadingState(
    async ({ email, password }: { email: string; password: string }) => {
      const { data: session, error } = await authHelpers.signUp({
        email,
        password,
      });

      if (error) throw error;

      setSession(session);
      if (session) {
        await loadProfileByUserId(session.user.id);
      }

      return session;
    }
  );

  const { loading: signInLoading, action: signIn } = useLoadingState(
    async ({ email, password }: { email: string; password: string }) => {
      const { data: session, error } = await authHelpers.signIn({
        email,
        password,
      });
      console.log("🔍 result:", { session, error }); // ← Add this

      if (error) throw error;
      if (!session) throw new Error("No session returned from sign in");

      setSession(session);
      await loadProfileByUserId(session.user.id);

      return session;
    }
  );

  const { loading: signOutLoading, action: signOut } = useLoadingState(
    async () => {
      const { error } = await authHelpers.signOut();
      if (error) throw error;
      setSession(null);
      setProfile(null);
    }
  );

  const loading =
    loadSessionLoading ||
    loadProfileByUserIdLoading ||
    handleSessionChangeLoading ||
    signInLoading ||
    signUpLoading ||
    signOutLoading;

  const value = useMemo(
    () => ({
      signIn,
      signOut,
      signUp,
      session,
      profile,
      loading,
    }),
    [signIn, signOut, signUp, session, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
