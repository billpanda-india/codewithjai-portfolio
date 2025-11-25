const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.log('Usage: node scripts/hash-password.js <your-password>');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log('\nPassword Hash:');
console.log(hash);
console.log('\nUse this in your SQL:');
console.log(`
INSERT INTO admin_users (email, password_hash, name)
VALUES (
  'jayakrishna0120@gmail.com',
  '${hash}',
  'Admin User'
);
`);
