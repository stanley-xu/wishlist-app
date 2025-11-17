// Test script for database connection
// Run this to verify Supabase setup is working

import { supabase } from "./client";

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("count")
      .limit(1);
    if (error && error.code !== "PGRST116") {
      // PGRST116 is "table not found" which is OK during setup
      console.error("Database connection error:", error);
      return false;
    }
    console.log("Database connection successful");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

export async function runConnectionTest() {
  console.log("Testing database connection...");

  try {
    const isConnected = await testConnection();

    if (isConnected) {
      console.log("✅ Database connection successful!");
      return true;
    } else {
      console.log("❌ Database connection failed");
      return false;
    }
  } catch (error) {
    console.error("❌ Connection test error:", error);
    return false;
  }
}

// Uncomment to run test directly
runConnectionTest();
