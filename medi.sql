-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100),
  role role_type NOT NULL,
  available boolean default false,
  phone_number VARCHAR(20),
  city VARCHAR(100),
  address VARCHAR(100),
  emergency VARCHAR(20)
);

-- Service
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  patient_id INT REFERENCES users(id),
  type VARCHAR(50),
  zone VARCHAR(100),
  schedule TIMESTAMP,
  assigned_to INT REFERENCES users(id),
  status status_type NOT NULL,
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

CREATE TYPE role_type AS ENUM ('patient', 'doctor', 'nurse', 'admin');

CREATE TYPE lab_category AS ENUM ('blood_tests');

CREATE TYPE test_category AS ENUM ('general_tests');

CREATE TYPE status_type AS ENUM ('pending','completed','assigned','failed');

ALTER TYPE status_type ADD VALUE 'cancelled';


CREATE TABLE labs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  category lab_category NOT NULL
);

CREATE TABLE tests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  category test_category NOT NULL,
  lab_id INT REFERENCES labs(id)
);

--// get service history
--  app.get('/services/history/:user_id', authenticateToken, async (req, res) => {
--    const { user_id } = req.params;
--
--    const result = await pool.query('SELECT * FROM services WHERE patient_id = $1 ORDER BY schedule DESC', [user_id]);
--   res.json(result.rows);
--  });

--CREATE TABLE roles (
  --id SERIAL PRIMARY KEY,
  --name VARCHAR(50) UNIQUE NOT NULL
--);

--CREATE TABLE service_statuses (
  --id SERIAL PRIMARY KEY,
  --status VARCHAR(50) UNIQUE NOT NULL
--);

--CREATE TABLE lab_categories (
  --id SERIAL PRIMARY KEY,
  --name VARCHAR(50) UNIQUE NOT NULL
--);

--CREATE TABLE test_categories (
  --id SERIAL PRIMARY KEY,
  --name VARCHAR(50) UNIQUE NOT NULL
--);

