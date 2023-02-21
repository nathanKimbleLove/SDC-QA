const { Pool } = require('pg');
const env = require('dotenv')
env.config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})
pool
  .connect()
  .then(a => console.log('connected'))
  .catch(err => console.error('connection error', err.stack));

module.exports = pool;