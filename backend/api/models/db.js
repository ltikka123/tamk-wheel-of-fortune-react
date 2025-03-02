
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('../wheel-of-fortune.db');


const pg = require('pg');

const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    password: 'example',
    host: 'localhost',
    port: 5432,
    database: 'fortunewheel',
});

  module.exports = {pool, db};