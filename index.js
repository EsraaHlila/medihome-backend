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

//route to get all users for admin only
app.get('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const users = await pool.query('SELECT id, name, email, role FROM users');
  res.json(users.rows);
});

//get a user by id(admin only)
app.get('/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { id } = req.params;
  const user = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [id]);
  if (user.rows.length === 0) return res.status(404).send('User not found');
  res.json(user.rows[0]);
});

//get your profile
app.get('/me', authenticateToken, async (req, res) => {
  const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [req.user.id]);
  res.json(result.rows[0]);
});

//update your profile
app.put('/me/update', authenticateToken, async (req, res) => {
  const { name, email, role } = req.body;
  await pool.query(
    `UPDATE users SET name=$1, email=$2, role=$3
     WHERE id = $4`,
    [name, email, role, req.user.id]
  );
  res.send('Profile updated successfully');
});


//update a user (admin only)
app.put('/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { name, email, role } = req.body;
  const { id } = req.params;
  await pool.query('UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4', [name, email, role, id]);
  res.send('User updated');
});


//admins only(doctors, admin and nurses) can add a new service type
app.post('/service-types', authenticateToken, authorizeRoles('admin', 'doctor', 'nurse'), async (req, res) => {
  const { name, description } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO service_types (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );

    res.status(201).json({
      message: 'Service type added successfully',
      serviceType: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to add service type');
  }
});

//get the list of all service types
app.get('/service_types', authenticateToken, authorizeRoles('admin', 'nurse', 'doctor'), async (req, res) => {
  const result = await pool.query('SELECT * FROM service_types');
  res.json(result.rows);
});



//request or create a service(patients only)
app.post('/services/request', authenticateToken, authorizeRoles('patient'), async (req, res) => {
  const { service_type_id, zone, preferred_time } = req.body;
  try {
    await pool.query(
      'INSERT INTO services (patient_id, service_type_id, zone, preferred_time, status) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, service_type_id, zone, preferred_time, 'pending']
    );
    res.status(201).send('Service requested successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to request service');
  }
});



//assign someone to a service(admins only, doctors ,nurses)
app.patch('/services/:id/assign', authenticateToken, authorizeRoles('admin', 'nurse', 'doctor'), async (req, res) => {
  const { id } = req.params;
  const { assigned_to } = req.body;

  await pool.query('UPDATE services SET assigned_to = $1, status = $2 WHERE id = $3', [assigned_to, 'assigned', id]);

  res.send('Service assigned successfully');
});


//get the list of service requests(admins only: admin, doctor and nurses)
app.get('/services', authenticateToken, authorizeRoles('admin', 'nurse', 'doctor'), async (req, res) => {
  const result = await pool.query('SELECT * FROM services');
  res.json(result.rows);
});

//update a service status
app.patch('/services/:id/status', authenticateToken, authorizeRoles('nurse', 'doctor', 'admin'), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query('UPDATE services SET status = $1 WHERE id = $2', [status, id]);
    res.send(`Service status updated to ${status}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update status');
  }
});

//availability management

// manage and modify availability for nurses and doctors
app.post('/availability', authenticateToken, authorizeRoles('nurse', 'doctor'), async (req, res) => {
  const { date, time_slot } = req.body;
  const user_id = req.user.id;

  await pool.query(
    'INSERT INTO availability (user_id, date, time_slot) VALUES ($1, $2, $3)',
    [user_id, date, time_slot]
  );

  res.send('Availability added');
});

// see the availability of someone (for all) it has to be just logged in
app.get('/availability/:user_id', authenticateToken, async (req, res) => {
  const { user_id } = req.params;

  const result = await pool.query('SELECT * FROM availability WHERE user_id = $1', [user_id]);
  res.json(result.rows);
});



//services history:
//admin can view all services requests history
app.get('/services', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const result = await pool.query('SELECT * FROM services');
  res.json(result.rows);
});

//doctors can view services history assigned to them
app.get('/services/doctor', authenticateToken, authorizeRoles('doctor'), async (req, res) => {
    const result = await pool.query('SELECT * FROM services WHERE assigned_to = $1', [req.user.id]);
    res.json(result.rows);
  });

//nurses can view services history assigned to them
app.get('/services/nurse', authenticateToken, authorizeRoles('nurse'), async (req, res) => {
  const result = await pool.query('SELECT * FROM services WHERE assigned_to = $1', [req.user.id]);
  res.json(result.rows);
});

//patients can view their own services requests history
app.get('/services/history', authenticateToken, authorizeRoles('patient'), async (req, res) => {
  const result = await pool.query('SELECT * FROM services WHERE patient_id = $1', [req.user.id]);
  res.json(result.rows);
});


//services status follow up can be viewed by admins only(doctors, nurses, admin)
app.patch('/services/:id/status', authenticateToken, authorizeRoles('admin', 'doctor', 'nurse'), async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    await pool.query('UPDATE services SET status = $1 WHERE id = $2', [status, id]);
    res.send('Service status updated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update service');
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
