const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Initialize database schema
const fs = require('fs');
const path = require('path');
const schemaPath = path.join(__dirname, '../../database/schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

pool.query(schema)
    .then(() => console.log('Database schema initialized.'))
    .catch(err => console.error('Error initializing schema:', err.message));

// Wrapper to mimic mysql2 promise behavior so we don't have to rewrite routes
module.exports = {
    query: async (sql, params = []) => {
        // Convert ? placeholders to $1, $2, etc. for PostgreSQL
        let paramIndex = 1;
        const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
        
        try {
            const result = await pool.query(pgSql, params);
            // mysql2 returns [rows, fields]. We mimic this structure.
            return [result.rows, result.fields];
        } catch (err) {
            throw err;
        }
    },
    // Raw pool access if needed
    pool
};
