const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'sdcqa'
})
client
  .connect()
  .then(a => console.log('connected'))
  .catch(err => console.error('connection error', err.stack));


module.exports = client;
// where id > (page * count - count + 1) AND id < (page * count)