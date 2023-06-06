const { Pool } = require('pg')
const pool = new Pool({
  user: 'damian',
  host: 'localhost',
  database: 'pern_bp',
  password: 'root',
  port: 5432,
})

module.exports = {
  query: (text, params) => pool.query(text, params),
}
