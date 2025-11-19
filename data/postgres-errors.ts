/**
 * PostgreSQL Error Codes
 * https://www.postgresql.org/docs/current/errcodes-appendix.html
 */

export const PostgresErrorCodes = {
  /** Unique constraint violation (e.g., duplicate key) */
  UNIQUE_VIOLATION: "23505",

  /** Foreign key violation */
  FOREIGN_KEY_VIOLATION: "23503",

  /** Not null constraint violation */
  NOT_NULL_VIOLATION: "23502",

  /** Check constraint violation */
  CHECK_VIOLATION: "23514",

  /** Insufficient privilege (RLS policy violation) */
  INSUFFICIENT_PRIVILEGE: "42501",
} as const;

/**
 * PostgREST Error Codes
 * https://postgrest.org/en/stable/errors.html
 */
export const PostgRESTErrorCodes = {
  /** No rows returned when .single() expects exactly one row */
  NO_ROWS: "PGRST116",
} as const;

/**
 * Type guard to check if an error is a Postgres error with a code
 */
export function isPostgresError(
  error: unknown
): error is { code: string; message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  );
}
