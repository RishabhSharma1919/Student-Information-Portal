const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_ZyxiotzOC0c3@ep-cold-moon-akhlbqbj-pooler.c-3.us-west-2.aws.neon.tech/neondb?sslmode=require',
});

// Test connection
pool.connect()
  .then(client => {
    console.log('✅ Neon Postgres Connected Successfully!');
    client.release();
  })
  .catch(err => {
    console.error('❌ Neon Postgres Connection Failed:', err.message);
  });

/**
 * Compatibility wrapper to match mysql2's await db.query(sql, [params]) -> [rows]
 * Also converts '?' placeholders to '$n'
 */
const query = async (text, params) => {
  let count = 0;
  const pgText = text.replace(/\?/g, () => {
    count++;
    return `$${count}`;
  });
  
  const result = await pool.query(pgText, params);
  return [result.rows];
};

module.exports = {
  pool,
  query
};
