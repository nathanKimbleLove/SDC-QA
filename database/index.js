const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'sdcqa'
})
pool
  .connect()
  .then(a => console.log('connected'))
  .catch(err => console.error('connection error', err.stack));

module.exports = pool;