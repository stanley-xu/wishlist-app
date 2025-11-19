import { useCallback, useRef, useState } from "react";

type UseLoadingStateResult<T, Args extends any[]> = {
  loading: boolean;
  action: (...args: Args) => Promise<T>;
};

/**
 * Hook that wraps an async function with loading state management
 *
 * Features:
 * - Automatically sets loading to true when action is called
 * - Sets loading to false when action completes or fails
 * - Handles concurrent calls correctly (loading stays true until ALL calls complete)
 * - Always uses the latest version of the wrapped function
 * - Preserves type safety for arguments and return type
 *
 * @example
 * const { loading, action } = useLoadingState(async (userId: string) => {
 *   const response = await fetch(`/api/users/${userId}`);
 *   return response.json();
 * });
 *
 * // Later:
 * const user = await action('123'); // TypeScript knows userId is a string
 */
export function useLoadingState<T, Args extends any[] = []>(
  fn: (...args: Args) => Promise<T>
): UseLoadingStateResult<T, Args> {
  const [loading, setLoading] = useState(false);

  // Track number of concurrent calls using a ref
  // This ensures loading stays true until ALL calls complete
  const callCountRef = useRef(0);

  const action = useCallback(
    async (...args: Args): Promise<T> => {
      // Increment call count and set loading
      callCountRef.current += 1;
      setLoading(true);

      try {
        // Call the function with properly typed arguments
        return await fn(...args);
      } finally {
        // Decrement call count
        callCountRef.current -= 1;

        // Only set loading to false if no other calls are pending
        if (callCountRef.current === 0) {
          setLoading(false);
        }
      }
    },
    [fn] // ✅ FIX: Include fn in deps to prevent stale closures
  );

  return { loading, action };
}
