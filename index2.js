const express = require('express');
require('dotenv').config();
const pool = require('./db/db');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('MediHome API running');
});

// Test route to get users
app.get('/users', async (req, res) => {
  const result = await pool.query('SELECT * FROM users');
  res.json(result.rows);
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});