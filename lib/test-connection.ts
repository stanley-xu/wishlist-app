// Test script for database connection
// Run this to verify Supabase setup is working

import { testConnection } from './database'

export async function runConnectionTest() {
  console.log('Testing database connection...')
  
  try {
    const isConnected = await testConnection()
    
    if (isConnected) {
      console.log('✅ Database connection successful!')
      return true
    } else {
      console.log('❌ Database connection failed')
      return false
    }
  } catch (error) {
    console.error('❌ Connection test error:', error)
    return false
  }
}

// Uncomment to run test directly
runConnectionTest()