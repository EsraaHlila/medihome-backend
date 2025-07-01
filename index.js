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
// lezem nchoufoha fazet kifeh nrefreshiou
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








//Protected route accessible only by doctors or nurses-exemple
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


//admins only(doctors, admin and nurses) can add a new service type he must add to the enum first and then add it here


app.post('/service_types/add', authenticateToken, authorizeRoles('admin', 'doctor', 'nurse'), async (req, res) => {
  const { name, description, price, categorie } = req.body;

  const validCategories = ['nurse', 'lab'];

  // ✅ Validate the category
  if (!validCategories.includes(categorie)) {
    return res.status(400).json({
      message: 'Invalid categorie value.',
      validCategories
    });
  }

  // ✅ Strict validation for the service name
  if (!/^[a-z_]{3,30}$/i.test(name)) {
    return res.status(400).json({
      message: 'Invalid name format. It should be 3-30 characters, lowercase letters and underscores only.'
    });
  }

  try {
    // Determine the appropriate enum type
    const enumType = categorie === 'lab' ? 'test_category' : 'nur_types';

    // Check if the name already exists in the enum
    const enumCheck = await pool.query(`
      SELECT e.enumlabel
      FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      WHERE t.typname = $1 AND e.enumlabel = $2
    `, [enumType, name]);

    // Add the name to the enum if it doesn't exist
    if (enumCheck.rowCount === 0) {
      await pool.query(`ALTER TYPE ${enumType} ADD VALUE IF NOT EXISTS '${name}'`);
    }

    // Insert the new service type
    const result = await pool.query(
      'INSERT INTO service_types (name, description, price, categorie) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, price, categorie]
    );

    res.status(201).json({
      message: 'Service type added successfully',
      serviceType: result.rows[0]
    });

  } catch (err) {
	  
	  if (err.code === '23505') { // unique_violation error code in PostgreSQL
    return res.status(409).json({ message: 'Service type with this name already exists.' });
  }
    console.error('Error adding service type:', err);
    res.status(500).send('Failed to add service type');
  }
});




/*app.post('/service_types/add', authenticateToken, authorizeRoles('admin', 'doctor', 'nurse'), async (req, res) => {
  const { name, description, price, categorie } = req.body;
  
  const validcat = ['nurse', 'lab'];

  if (!validcat.includes(status)) {
    return res.status(400).json({
      message: 'Invalid categorie value.',
      validcat: validcat
    });
  }
  
  const validname = ['vitamin','heart','diabetes','senior','women','complete_checkup'];

  if (!validname.includes(status)) {
    return res.status(400).json({
      message: 'Invalid name value.',
      validcat: validcat
    });
  }

  try {
    const result = await pool.query(
      'INSERT INTO service_types (name, description, price, categorie) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, price, categorie]
    );

    res.status(201).json({
      message: 'Service type added successfully',
      serviceType: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to add service type');
  }
});*/

//get the list of all service types
app.get('/service_types/all', authenticateToken, authorizeRoles('admin', 'nurse', 'doctor'), async (req, res) => {
  const result = await pool.query('SELECT * FROM service_types');
  res.json(result.rows);
});



//request or create a blood test



app.post('/services/lab', authenticateToken, authorizeRoles('patient'), async (req, res) => {
  const { category, zone, schedule } = req.body;

  try {
    // Step 1: Find service type by name (category) and lab
    const serviceTypeResult = await pool.query(
      'SELECT id, price FROM service_types WHERE name = $1 AND categorie = $2',
      [category, 'lab']
    );

    if (serviceTypeResult.rowCount === 0) {
      return res.status(404).json({ message: 'Lab service type not found.' });
    }

    const { id: ser_id, price } = serviceTypeResult.rows[0];

    // Step 2: Insert the test (category is required by the schema)
    await pool.query(
      `INSERT INTO tests (patient_id, category, zone, schedule, price, status, ser_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [req.user.id, category, zone, schedule, price, 'pending', ser_id]
    );

    res.status(201).json({ message: 'Lab test requested successfully' });

  } catch (err) {
    console.error('Error requesting lab test:', err);
    res.status(500).json({ message: 'Failed to request lab test' });
  }
});





/*app.post('/services/lab', authenticateToken, authorizeRoles('patient'), async (req, res) => {
  const { category, zone, schedule } = req.body;
  try {
    await pool.query(
      'INSERT INTO tests (patient_id, category, zone, schedule, price, status) VALUES ($1, $2, $3, $4, $5, $6)',
      [req.user.id, category, zone, schedule, `select price from service_types where category = categorie `, 'pending']
    );
    res.status(201).json({ message: 'Test requested successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to request test' });
  }
});*/






//request a nurse service



app.post('/services/nurse', authenticateToken, authorizeRoles('patient'), async (req, res) => {
  const { type, zone, schedule } = req.body;

  try {
    const serviceTypeResult = await pool.query(
      'SELECT id, price FROM service_types WHERE name = $1 AND categorie = $2',
      [type, 'nurse']
    );

    if (serviceTypeResult.rowCount === 0) {
      return res.status(404).json({ message: 'Nurse service type not found.' });
    }

    const { price } = serviceTypeResult.rows[0];

    await pool.query(
      'INSERT INTO nurse_req (patient_id, zone, schedule, price, status) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, zone, schedule, price, 'pending']
    );

    res.status(201).json({ message: 'Nurse service requested successfully' });

  } catch (err) {
    console.error('Error requesting nurse service:', err);
    res.status(500).json({ message: 'Failed to request nurse service' });
  }
});






/*app.post('/services/nurse', authenticateToken, authorizeRoles('patient'), async (req, res) => {
  const { type, zone, schedule } = req.body;
  try {
    await pool.query(
      'INSERT INTO services (patient_id, type, zone, schedule, price, status) VALUES ($1, $2, $3, $4, $5, $6)',
      [req.user.id, type, zone, schedule, `select price from service_types where type = categorie`, 'pending']
    );
    res.status(201).json({ message: 'Service requested successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to request service' });
  }
});*/





//assign someone to a service(admins only, doctors)---------------------------------------------------



app.patch('/services/:id/assign', authenticateToken, authorizeRoles('admin', 'doctor', 'nurse'), async (req, res) => {
  const { id } = req.params;
  const { assigned_to } = req.body;

  try {
    // 1. Try nurse_req
    const nurseResult = await pool.query(`
      SELECT st.categorie AS category
      FROM nurse_req s
      JOIN service_types st ON s.ser_id = st.id
      WHERE s.id = $1
    `, [id]);

    // 2. Try tests
    const labResult = await pool.query(`
      SELECT st.categorie AS category
      FROM tests t
      JOIN service_types st ON t.ser_id = st.id
      WHERE t.id = $1
    `, [id]);

    let category = null;
    let tableToUpdate = null;

    if (nurseResult.rowCount > 0) {
      category = nurseResult.rows[0].category;
      tableToUpdate = 'nurse_req';
    } else if (labResult.rowCount > 0) {
      category = labResult.rows[0].category;
      tableToUpdate = 'tests';
    } else {
      return res.status(404).json({ error: 'Service not found' });
    }

    // 3. Assign in the correct table
    await pool.query(
      `UPDATE ${tableToUpdate} SET assigned_to = $1, status = $2 WHERE id = $3`,
      [assigned_to, 'assigned', id]
    );

    res.send('Service assigned successfully');
  } catch (error) {
    console.error('Error assigning service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});






/*app.patch('/services/:id/assign', authenticateToken, authorizeRoles('admin', 'doctor','nurse'), async (req, res) => {
  const { id } = req.params;
  const { assigned_to } = req.body;
  try {
    // 1. Get the service_type and its category
    const serviceResult = await pool.query(`
      SELECT categorie 
      FROM service_types st
      WHERE st.id = services.ser_id`);

    if (serviceResult.rowCount === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }	
	const category = serviceResult.rows[0].category;
if (category === 'nurse') {
      await pool.query('UPDATE services SET assigned_to = $1, status = $2 WHERE id = $3', [assigned_to, 'assigned', id]);
    } else if (category === 'lab') {
      await pool.query('UPDATE tests SET assigned_to = $1, status = $2 WHERE id = $3', [assigned_to, 'assigned', id]);
    } else {
      return res.status(400).json({ error: 'Unknown service category' });
    }

  res.send('Service assigned successfully');
});*/

//update a service status------------------------------------------------------




app.patch('/services/:id/status', authenticateToken, authorizeRoles('nurse', 'doctor', 'admin'), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'assigned', 'completed', 'failed'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: 'Invalid status value.',
      validStatuses: validStatuses
    });
  }

  try {
    // 1. Try to find the service in nurse_req
    const nurseResult = await pool.query(`
      SELECT st.categorie AS category
      FROM nurse_req s
      JOIN service_types st ON s.ser_id = st.id
      WHERE s.id = $1
    `, [id]);

    // 2. Try to find the service in tests
    const labResult = await pool.query(`
      SELECT st.categorie AS category
      FROM tests t
      JOIN service_types st ON t.ser_id = st.id
      WHERE t.id = $1
    `, [id]);

    let category = null;
    let tableToUpdate = null;

    if (nurseResult.rowCount > 0) {
      category = nurseResult.rows[0].category;
      tableToUpdate = 'nurse_req';
    } else if (labResult.rowCount > 0) {
      category = labResult.rows[0].category;
      tableToUpdate = 'tests';
    } else {
      return res.status(404).json({ message: 'Service not found.' });
    }

    // 3. Update the correct table
    const updateResult = await pool.query(
      `UPDATE ${tableToUpdate} SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ message: 'Record not found in the corresponding table.' });
    }

    res.status(200).json({
      message: `Status updated to '${status}' for ${category} service.`,
      updated: updateResult.rows[0]
    });

  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ message: 'Failed to update service status.' });
  }
});





/*app.patch('/services/:id/status', authenticateToken, authorizeRoles('nurse', 'doctor', 'admin'), async (req, res) => {
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
*/
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
  const result = await pool.query('SELECT * FROM services and tests');
  res.json(result.rows);
});

//doctors can view services history assigned to them
app.get('/services/doctor', authenticateToken, authorizeRoles('doctor'), async (req, res) => {
    const result = await pool.query('SELECT * FROM services and tests WHERE assigned_to = $1', [req.user.id]);
    res.json(result.rows);
  });

//nurses can view services history assigned to them
app.get('/services/nurse', authenticateToken, authorizeRoles('nurse'), async (req, res) => {
  const result = await pool.query('SELECT * FROM services and tests WHERE assigned_to = $1', [req.user.id]);
  res.json(result.rows);
});

//patients can view their own services requests history
app.get('/services/history', authenticateToken, authorizeRoles('patient'), async (req, res) => {
  const result = await pool.query('SELECT * FROM services and tests WHERE patient_id = $1', [req.user.id]);
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

//route to add tests types-zeyed-------------------------------------------------------------------------------


/*app.post('/tests', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { name, description, category, lab_id } = req.body;

  //required fields
  if (!name || !category || !lab_id) {
    return res.status(400).json({
      message: 'Missing required fields: name, category, or lab_id.'
    });
  }

  const validCategories = ['general_tests','vitamin','heart','diabetes'];

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
*/
//cancel a service-----------------------------------------------------


app.patch('/services/:id/cancel', authenticateToken, authorizeRoles('patient'), async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Check if it's a nurse request in nurse_req
    const nurseResult = await pool.query(`
      SELECT s.schedule, s.patient_id, st.categorie AS category
      FROM nurse_req s
      JOIN service_types st ON s.ser_id = st.id
      WHERE s.id = $1
    `, [id]);

    // 2. Check if it's a lab test in tests
    const labResult = await pool.query(`
      SELECT t.schedule, t.patient_id, st.categorie AS category
      FROM tests t
      JOIN service_types st ON t.ser_id = st.id
      WHERE t.id = $1
    `, [id]);

    let serviceData = null;
    let tableToUpdate = null;

    if (nurseResult.rowCount > 0) {
      serviceData = nurseResult.rows[0];
      tableToUpdate = 'nurse_req';
    } else if (labResult.rowCount > 0) {
      serviceData = labResult.rows[0];
      tableToUpdate = 'tests';
    } else {
      return res.status(404).json({ message: 'Service not found.' });
    }

    const { schedule, patient_id, category } = serviceData;

    // Verify that the requester is the patient who created the service
    if (patient_id !== req.user.id) {
      return res.status(403).json({ message: 'You are not allowed to cancel this service.' });
    }

    // Only allow cancellation if at least 1 day in advance
    const now = new Date();
    const serviceDate = new Date(schedule);
    const diffInDays = (serviceDate - now) / (1000 * 60 * 60 * 24);

    if (diffInDays < 1) {
      return res.status(400).json({ message: 'You can only cancel the request at least 1 day in advance.' });
    }

    await pool.query(
      `UPDATE ${tableToUpdate} SET status = $1 WHERE id = $2`,
      ['cancelled', id]
    );

    res.json({ message: 'Service request cancelled successfully.' });

  } catch (err) {
    console.error('Error cancelling service:', err);
    res.status(500).json({ message: 'Failed to cancel the service.' });
  }
});




/*app.patch('/services/:id/cancel', authenticateToken, authorizeRoles('patient'), async (req, res) => {
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
*/



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



//change the availability of a servie type


app.patch('/service_types/:id/availability', authenticateToken, authorizeRoles('admin', 'doctor','nurse'), async (req, res) => {
  const { id } = req.params;
  const { available } = req.body;

  // Validate availability is a boolean
  if (typeof available !== 'boolean') {
    return res.status(400).json({
      message: '`available` must be a boolean value (true or false).'
    });
  }

  try {
    const result = await pool.query(
      'UPDATE service_types SET available = $1 WHERE id = $2 RETURNING *',
      [available, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Service type not found.' });
    }

    res.status(200).json({
      message: `Availability updated successfully.`,
      updatedServiceType: result.rows[0]
    });

  } catch (err) {
    console.error('Error updating availability:', err);
    res.status(500).json({ message: 'Failed to update service availability.' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



