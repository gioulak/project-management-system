// test_password.js
// Save this file and run: node test_password.js

const bcrypt = require('bcryptjs');

// The hash from your database
const hashFromDB = '$2a$10$CwTycUXWue0Thq9StjUM0uJ8KV8qXKr3K5dV8vJJqLqQp1G1pKvZS';

// Test different passwords
const passwords = ['admin123', 'password', 'password123', 'admin'];

console.log('========================================');
console.log('Testing Password Hash from Database');
console.log('========================================');
console.log('Hash:', hashFromDB);
console.log('');

passwords.forEach(pwd => {
    const match = bcrypt.compareSync(pwd, hashFromDB);
    console.log(`Password: "${pwd}" => ${match ? '✓ MATCH' : '✗ NO MATCH'}`);
});

console.log('\n========================================');
console.log('Generating Fresh Hashes');
console.log('========================================\n');

// Generate fresh hashes
console.log('Hash for "admin123":');
const newHash = bcrypt.hashSync('admin123', 10);
console.log(newHash);
console.log('Verify it works:', bcrypt.compareSync('admin123', newHash) ? '✓ MATCH' : '✗ NO MATCH');

console.log('\n========================================');
console.log('SQL Command to Update Admin Password');
console.log('========================================\n');
console.log(`UPDATE users SET password = '${newHash}' WHERE username = 'admin';`);

console.log('\n========================================');
console.log('Docker Command');
console.log('========================================\n');
console.log(`docker exec -it services-mysql mysql -uroot -prootpassword pms_users -e "UPDATE users SET password = '${newHash}' WHERE username = 'admin';"`);