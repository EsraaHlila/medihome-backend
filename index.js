const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// PostgreSQL connection config
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'medihome',
  password: 'oracle',
  port: 5432,
});

// Test API
app.get('/', (req, res) => {
  res.send('MediHome backend is running!');
});


app.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, password, role]
    );

    res.status(201).json({ message: 'User registered!', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
