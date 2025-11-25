require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdmin() {
  console.log('🔐 Creating admin user...\n');

  const email = 'jayakrishna0120@gmail.com';
  const password = 'admin123';
  
  // Hash the password
  const passwordHash = await bcrypt.hash(password, 10);
  
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('Hash:', passwordHash);
  console.log('');

  // Delete existing admin user if exists
  await supabase.from('admin_users').delete().eq('email', email);
  
  // Create new admin user
  const { data, error } = await supabase
    .from('admin_users')
    .insert({
      email: email,
      password_hash: passwordHash,
      name: 'Admin User'
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('✅ Admin user created successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('\n🌐 Login at: http://localhost:3000/admin/login');
  }
}

createAdmin();
