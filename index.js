const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 3000;
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'medihome',
  password: 'oracle',
  port: 5432,
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied:insufficient permissions' });
    }
    next();
  };
}
//example route
app.get('/', (req, res) => {
  res.send('MediHome backend is running!');
});
//register route
app.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, available=false} = req.body;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      'INSERT INTO users (name, email, password, role,available) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, hashedPassword, role, available]
    );

    res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        role: result.rows[0].role,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

//login route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    //find the user by searching for the corresponding email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];

    //to compare the password after rehashing
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            role: user.role
          },
          JWT_SECRET,
          { expiresIn: '1h' }
        );

        console.log(token)

    res.status(200).json({
      message: 'Login successful!',
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


//Protected route accessible only by doctors or nurses
app.get('/api/private', authenticateToken, authorizeRoles('doctor', 'nurse'), (req, res) => {
  res.send('This is a protected route for doctors or nurses');
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
