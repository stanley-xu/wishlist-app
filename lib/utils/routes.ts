/**
 * Type-safe route utilities for the app
 *
 * Benefits:
 * - Centralized route definitions prevent URL inconsistencies
 * - Type safety ensures required parameters are provided
 * - Easy to update routes across the entire app
 */

export const routes = {
  /**
   * User's own profile page
   */
  profile: () => "/profile" as const,

  /**
   * View another user's profile
   */
  user: (userId: string, params?: { list?: string; share?: string }): string => {
    const queryParams = new URLSearchParams();
    if (params?.list) queryParams.set("list", params.list);
    if (params?.share) queryParams.set("share", params.share);

    const query = queryParams.toString();
    return `/user/${userId}${query ? `?${query}` : ""}`;
  },

  /**
   * Following screen
   */
  following: () => "/following" as const,

  /**
   * Events screen
   */
  events: () => "/events" as const,

  /**
   * Home screen
   */
  home: () => "/" as const,
} as const;

/**
 * Generate a shareable URL for a user's wishlist
 */
export function generateShareUrl(
  baseUrl: string,
  userId: string,
  wishlistId: string,
  shareToken: string
): string {
  const route = routes.user(userId, { list: wishlistId, share: shareToken });
  return `${baseUrl}${route}`;
}
