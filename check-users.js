const path = require('path');
// specific hack for this environment if node_modules are present
module.paths.push(path.join(__dirname, 'node_modules'));
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkUsers() {
  try {
    const res = await pool.query('SELECT email, role FROM users');
    console.log('Valid Emails:', res.rows);
  } catch (err) {
    console.error('Error querying users:', err);
  } finally {
    await pool.end();
  }
}

checkUsers();
