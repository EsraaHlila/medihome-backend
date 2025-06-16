const express = require('express');
require('dotenv').config();
const pool = require('./db/db');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('MediHome API running');
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`DB connected! Time: ${result.rows[0].now}`);
  } catch (err) {
    res.status(500).send('DB connection failed');
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});