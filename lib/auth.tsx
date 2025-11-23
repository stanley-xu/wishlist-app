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

import { auth, auth as authHelpers, profiles } from "@/lib/api";
import { type Session } from "@supabase/supabase-js";
import { Profile } from "./schemas";

type SignInArgs = { email: string; password: string };

const AuthContext = createContext<{
  signIn: (args: SignInArgs) => void;
  signOut: () => void;
  signUp: (args: SignInArgs) => void;
  session?: Session | null;
  profile?: Profile | null;
  loading: boolean;
  // Need to expose this because the app can create profiles outside of the provider here
  setProfile: (profile: Profile | null) => void;
}>({
  signIn: () => null,
  signOut: () => null,
  signUp: () => null,
  session: null,
  profile: null,
  loading: false,
  setProfile: () => null,
});

export function useAuthContext() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error("This component must be wrapped in a <AuthProvider />");
  }

  return value;
}

function useLoadingCallback<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  setLoading: (loading: boolean) => void
): (...args: Args) => Promise<T> {
  return useCallback(
    async (...args: Args): Promise<T> => {
      setLoading(true);
      try {
        return await fn(...args);
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fn, setLoading]
  );
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const getSession = useCallback(async () => {
    const { data, error } = await auth.getSession();

    setSession(data ?? null);
    return { data, error };
  }, []);

  const getProfileByUserId = useCallback(async (userId: string) => {
    const { data, error } = await profiles.getByUserId(userId);

    setProfile(data ?? null);
    return { data, error };
  }, []);

  // Fetch the session once, and subscribe to auth state changes
  useEffect(() => {
    async function fetchExistingSessionAndProfile() {
      console.debug(`[fetchExistingSessionAndProfile]`);

      setLoading(true);
      try {
        const { data: session, error: sessionError } = await getSession();
        if (sessionError) throw sessionError;

        if (session) {
          console.debug("session detected");
          const { data, error } = await getProfileByUserId(session.user.id);
          if (error) {
            console.warn(`profile not found: ${error.message}`);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchExistingSessionAndProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", {
        event: _event,
        user: { id: session?.user.id, email: session?.user.email },
      });
      // Don't await! Causes deadlock in supabase-js
      // See: https://github.com/supabase/auth-js/issues/762
      setSession(session ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  useEffect(() => {
    // Handling loading states manually for now
    async function handleSessionChange(session: Session | null) {
      console.debug(
        `[handleSessionChange] received session: ${session?.user.id}`
      );

      setLoading(true);
      try {
        if (session) {
          console.debug("session detected");
          const { data, error } = await getProfileByUserId(session.user.id);
          if (error) {
            console.warn(`profile not found: ${error.message}`);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    handleSessionChange(session);
  }, [session]);

  const signUp = useLoadingCallback(async ({ email, password }: SignInArgs) => {
    const { data: session, error } = await authHelpers.signUp({
      email,
      password,
    });

    if (error) throw error;

    setSession(session ?? null);
    return session;
  }, setLoading);

  const signIn = useLoadingCallback(async ({ email, password }: SignInArgs) => {
    const { data: session, error } = await authHelpers.signIn({
      email,
      password,
    });

    if (error) throw error;
    if (!session) throw new Error("No session returned from sign in");

    setSession(session ?? null);
    return session;
  }, setLoading);

  const signOut = useLoadingCallback(async () => {
    const { error } = await authHelpers.signOut();
    if (error) throw error;
    setSession(null);
    setProfile(null);
  }, setLoading);

  const value = useMemo(
    () => ({
      signIn,
      signOut,
      signUp,
      session,
      profile,
      loading,
      setProfile,
    }),
    [signIn, signOut, signUp, session, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
