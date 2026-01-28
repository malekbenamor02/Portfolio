/**
 * Script to add a new admin user to the database
 * Usage: node scripts/add-admin.js
 * 
 * Make sure .env.local exists with:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Load .env.local manually
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase environment variables!');
  console.error('\n📝 Please create .env.local file with:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co');
  console.error('   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  console.error('\n💡 You can find these in Supabase Dashboard → Settings → API');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function addAdmin() {
  const email = 'contact@malekbenamor.dev';
  const password = '022006';
  const name = 'Malek Ben Amor';
  const role = 'admin';

  try {
    console.log('🔐 Hashing password...');
    const passwordHash = await bcrypt.hash(password, 12);
    console.log('✅ Password hashed');

    console.log('📝 Adding admin user to database...');
    const { data, error } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        name: name,
        role: role,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        // Unique constraint violation - user already exists
        console.log('⚠️  User already exists. Updating password...');
        
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({
            password_hash: passwordHash,
            name: name,
            is_active: true,
          })
          .eq('email', email.toLowerCase())
          .select()
          .single();

        if (updateError) {
          console.error('❌ Error updating user:', updateError);
          process.exit(1);
        }

        console.log('✅ Admin user updated successfully!');
        console.log('\n📋 User Details:');
        console.log(`   Email: ${updatedUser.email}`);
        console.log(`   Name: ${updatedUser.name}`);
        console.log(`   Role: ${updatedUser.role}`);
        console.log(`   Active: ${updatedUser.is_active}`);
        console.log(`   ID: ${updatedUser.id}`);
      } else {
        console.error('❌ Error adding user:', error);
        process.exit(1);
      }
    } else {
      console.log('✅ Admin user added successfully!');
      console.log('\n📋 User Details:');
      console.log(`   Email: ${data.email}`);
      console.log(`   Name: ${data.name}`);
      console.log(`   Role: ${data.role}`);
      console.log(`   Active: ${data.is_active}`);
      console.log(`   ID: ${data.id}`);
    }

    console.log('\n🎉 Done! You can now login at /admin/login');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

addAdmin();
