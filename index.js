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

  console.log('Received token:', token); // Log the token received

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT Verification Error:', err); // Log the JWT error
      return res.status(403).json({ message: 'Invalid token' });
    }
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
    const { name, email, password, role='patient', city, available = false } = req.body;

    if (!name || !email || !password || !city ) /*!role)*/ {
          return res.status(400).json({
            message: 'Missing required fields: name, email, password, city, or role.',
          });
        }


    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // to get the role id from the roles table in order to select a valid role
    //const roleResult = await pool.query('SELECT id FROM roles WHERE name = $1', [role]);


    /*const validRoles = ['admin', 'doctor', 'patient', 'nurse'];
        if (!validRoles.includes(role)) {
          return res.status(400).json({
            message: 'Invalid role selected.',
            validRoles: validRoles
          });
        }*/



    const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
          return res.status(400).json({
            message: 'Email already registered. Please use a different email address.',
          });
        }

    const result = await pool.query(
      'INSERT INTO users (name, email, password, role, available, city) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, hashedPassword, role, available, city]
    );

    res.status(201).json({
      message: 'User registered successfully!',
    });
  } catch (err) {
    console.error(err);

    //email already exists error
    if (err.code === '23505') {
          return res.status(400).json({
            message: 'Email already exists. Please choose another email.',
          });
        }

        // a general server error
        res.status(500).json({
          message: 'Server error. Please try again later.',
        });

  }
});




//login route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    //find the user by searching for the corresponding email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log(result)

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];

    //to compare the password after rehashing
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
        const accessToken = jwt.sign(
		{
			id: user.id,
			email: user.email,
			role: user.role
			},
			JWT_SECRET,
			{ expiresIn: '6h' } // Short-lived access token
			);

			const refreshToken = jwt.sign(
			{ id: user.id },
			JWT_SECRET,
				{ expiresIn: '30d' } // Long-lived refresh token
			);

res.status(200).json({
  message: 'Login successful!',
  accessToken,
  refreshToken,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }
});

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/token/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);

    const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      accessToken: newAccessToken
    });

  } catch (err) {
    console.error(err);
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});








//Protected route accessible only by doctors or nurses
app.get('/api/private', authenticateToken, authorizeRoles('doctor', 'nurse'), (req, res) => {
  res.send('This is a protected route for doctors or nurses');
});

//route to get all users for admin only
app.get('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const users = await pool.query('SELECT id, name, email, role,address, phone_number, city, emergency FROM users');
  res.json(users.rows);
});

//get a user by id(admin only)
app.get('/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { id } = req.params;
  const user = await pool.query('SELECT id, name, email, role,address, phone_number, city, emergency FROM users WHERE id = $1', [id]);
  if (user.rows.length === 0) return res.status(404).send('User not found');
  res.json(user.rows[0]);
});
//get your profile
app.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, address, phone_number, emergency, city FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    // map DB fields to frontend expected structure
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone_number,
        emergency: user.emergency,
        address: user.address,
        city: user.city,
        language: 'English' // placeholder, since not in DB
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});


//update your profile
app.put('/me/update', authenticateToken, async (req, res) => {
  const { name, email, phone_number, address, emergency, city } = req.body;

  try {
    await pool.query(
      `UPDATE users 
       SET name = $1, email = $2, phone_number = $3, address = $4, emergency = $5, city = $6 
       WHERE id = $7`,
      [name, email, phone_number, address, emergency, city, req.user.id]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});



//update a user (admin only)
app.put('/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { name, email, role,address, phone_number, city } = req.body;
  const { id } = req.params;
  await pool.query('UPDATE users SET name=$1, email=$2, role=$3, address=$4, phone_number=$5, city=$6, emergency=$7 WHERE id = $8'
  ,[name, email, role, address, phone_number, city, emergency, req.user.id]);
  res.send('User updated');
});


//admins only(doctors, admin and nurses) can add a new service type
app.post('/service_types/add', authenticateToken, authorizeRoles('admin', 'doctor', 'nurse'), async (req, res) => {
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
app.get('/service_types/all', authenticateToken, authorizeRoles('admin', 'nurse', 'doctor'), async (req, res) => {
  const result = await pool.query('SELECT * FROM service_types');
  res.json(result.rows);
});



//request or create a service(patients only)
app.post('/services/request', authenticateToken, authorizeRoles('patient'), async (req, res) => {
  const { type, zone, schedule } = req.body;
  try {
    await pool.query(
      'INSERT INTO services (patient_id, type, zone, schedule, status) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, type, zone, schedule, 'pending']
    );
    res.status(201).json({ message: 'Service requested successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to request service' });
  }
});



//assign someone to a service(admins only, doctors)
app.patch('/services/:id/assign', authenticateToken, authorizeRoles('admin', 'doctor'), async (req, res) => {
  const { id } = req.params;
  const { assigned_to } = req.body;

  await pool.query('UPDATE services SET assigned_to = $1, status = $2 WHERE id = $3', [assigned_to, 'assigned', id]);

  res.send('Service assigned successfully');
});


//get the list of service requests(admins only: admin, doctor and nurses)
/*app.get('/services', authenticateToken, authorizeRoles('admin', 'nurse', 'doctor'), async (req, res) => {
  const result = await pool.query('SELECT * FROM services');
  res.json(result.rows);
});*/

//update a service status
app.patch('/services/:id/status', authenticateToken, authorizeRoles('nurse', 'doctor', 'admin'), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // status types
  const validStatuses = ['pending', 'assigned', 'completed', 'failed'];

  // check the validity of the status
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: 'Invalid status value.',
      validStatuses: validStatuses
    });
  }

  try {
    const result = await pool.query(
      'UPDATE services SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    res.status(200).json({
      message: `Service status updated to '${status}'`,
      service: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update service status.' });
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
/*app.patch('/services/:id/status', authenticateToken, authorizeRoles('admin', 'doctor', 'nurse'), async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    await pool.query('UPDATE services SET status = $1 WHERE id = $2', [status, id]);
    res.send('Service status updated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update service');
  }
});*/



//search route
app.get('/service_types/search', authenticateToken, async (req, res) => {
  const { q } = req.query;

  try {
    const result = await pool.query(
      'SELECT * FROM service_types WHERE LOWER(name) LIKE LOWER($1)',
      [`%${q}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Search failed');
  }
});

//get all roles route -- for test
app.get('/roles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM roles');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch roles');
  }
});

//route to add a lab
app.post('/labs', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { id } = req.params;
  const { name,category } = req.body;

  // status types
  const validcategory = ['blood_tests'];

  // check the validity of the status
  if (!validcategory.includes(category)) {
    return res.status(400).json({
      message: 'Invalid category value.',
      validcategory: validcategory
    });
  }

  try {
    const result = await pool.query(
      'INSERT INTO labs (name,category) values ($1,$2)',
      [name, category]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    res.status(200).json({
      message: 'lab added successfully!',
      service: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add lab.' });
  }
});

//route to add tests types


app.post('/tests', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { name, description, category, lab_id } = req.body;

  //required fields
  if (!name || !category || !lab_id) {
    return res.status(400).json({
      message: 'Missing required fields: name, category, or lab_id.'
    });
  }

  const validCategories = ['general_tests'];

  if (!validCategories.includes(category)) {
    return res.status(400).json({
      message: 'Invalid test category.',
      validCategories: validCategories
    });
  }

  try {
    const labCheck = await pool.query('SELECT * FROM labs WHERE id = $1', [lab_id]);
    if (labCheck.rowCount === 0) {
      return res.status(404).json({ message: 'Lab not found with the provided lab_id.' });
    }

    const result = await pool.query(
      'INSERT INTO tests (name, description, category, lab_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description || '', category, lab_id]
    );

    res.status(201).json({
      message: 'Test added successfully!',
      test: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add test.' });
  }
});


app.patch('/services/:id/cancel', authenticateToken, authorizeRoles('patient'), async (req, res) => {
  const { id } = req.params;

  try {
    const service = await pool.query('SELECT schedule, patient_id FROM services WHERE id = $1', [id]);

    if (service.rowCount === 0) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    const { schedule, patient_id } = service.rows[0];

    // Only allow the owner of the request to cancel it
    if (patient_id !== req.user.id) {
      return res.status(403).json({ message: 'You are not allowed to cancel this service.' });
    }

    const now = new Date();
    const serviceDate = new Date(schedule);
    const diffInDays = (serviceDate - now) / (1000 * 60 * 60 * 24);

    if (diffInDays < 1) {
      return res.status(400).json({ message: 'You can only cancel the request at least 1 day in advance.' });
    }

    await pool.query('UPDATE services SET status = $1 WHERE id = $2', ['cancelled', id]);
    res.json({ message: 'Service request cancelled successfully.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to cancel the service.' });
  }
});




app.get('/labs/search', authenticateToken, async (req, res) => {
  const { city } = req.query;

  try {
    const result = await pool.query(
      'SELECT * FROM labs WHERE LOWER(city) = LOWER($1)',
      [city]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Search failed');
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



