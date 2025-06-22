-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100),
  role VARCHAR(20),
  available boolean default false
);

-- Service
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  patient_id INT REFERENCES users(id),
  type VARCHAR(50),
  zone VARCHAR(100),
  schedule TIMESTAMP,
  assigned_to INT REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pending'
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE availability (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  date DATE,
  time_slot VARCHAR(20)
);

CREATE TABLE service_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

--// get service history
--  app.get('/services/history/:user_id', authenticateToken, async (req, res) => {
--    const { user_id } = req.params;
--
--    const result = await pool.query('SELECT * FROM services WHERE patient_id = $1 ORDER BY schedule DESC', [user_id]);
--   res.json(result.rows);
--  });