// Quick test script to verify Supabase connection
// Run with: node test-supabase.js

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Load environment variables from .env.local
const envContent = readFileSync('.env.local', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_KEY;

console.log('🔍 Testing Supabase Connection...\n');

if (!supabaseUrl || !supabaseUrl.includes('supabase.co')) {
  console.log('❌ SUPABASE_URL not set or invalid');
  console.log('   → Go to your Supabase project and copy the Project URL');
  console.log('   → Update NEXT_PUBLIC_SUPABASE_URL in .env.local\n');
  process.exit(1);
}

if (!supabaseKey || supabaseKey === 'your_service_role_key_here') {
  console.log('❌ SUPABASE_SERVICE_KEY not set or using placeholder');
  console.log('   → Go to Supabase Settings → API → Copy "service_role" key');
  console.log('   → Update SUPABASE_SERVICE_KEY in .env.local\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('📡 Connecting to:', supabaseUrl);

    // Test 1: Check if orders table exists
    console.log('\n1️⃣  Testing orders table...');
    const { data, error } = await supabase
      .from('orders')
      .select('count')
      .limit(1);

    if (error) {
      if (error.message.includes('does not exist')) {
        console.log('   ⚠️  Orders table not found!');
        console.log('   → Go to SQL Editor in Supabase and run the CREATE TABLE queries');
        console.log('   → See SUPABASE_SETUP.md for the SQL code\n');
        return false;
      }
      throw error;
    }

    console.log('   ✅ Orders table exists');

    // Test 2: Check customers table
    console.log('\n2️⃣  Testing customers table...');
    const { error: customerError } = await supabase
      .from('customers')
      .select('count')
      .limit(1);

    if (customerError) {
      console.log('   ⚠️  Customers table not found');
      return false;
    }

    console.log('   ✅ Customers table exists');

    // Test 3: Check subscribers table
    console.log('\n3️⃣  Testing subscribers table...');
    const { error: subscriberError } = await supabase
      .from('subscribers')
      .select('count')
      .limit(1);

    if (subscriberError) {
      console.log('   ⚠️  Subscribers table not found');
      return false;
    }

    console.log('   ✅ Subscribers table exists');

    // Test 4: Check subscriptions table
    console.log('\n4️⃣  Testing subscriptions table...');
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('count')
      .limit(1);

    if (subscriptionError) {
      console.log('   ⚠️  Subscriptions table not found');
      return false;
    }

    console.log('   ✅ Subscriptions table exists');

    console.log('\n✨ SUCCESS! Supabase is fully configured and ready to use!\n');
    console.log('Next steps:');
    console.log('  1. Run: npm run dev');
    console.log('  2. Visit: http://localhost:3000');
    console.log('  3. Place a test order');
    console.log('  4. Check Supabase dashboard → Table Editor → orders\n');

    return true;
  } catch (error) {
    console.log('\n❌ Connection Error:', error.message);
    console.log('\nTroubleshooting:');
    console.log('  1. Check your SUPABASE_SERVICE_KEY is correct');
    console.log('  2. Make sure your Supabase project is active');
    console.log('  3. Verify the Project URL is correct\n');
    return false;
  }
}

testConnection();
