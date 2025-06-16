-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100),
  role VARCHAR(20) -- 'patient', 'doctor', or 'nurse'
);

-- Doctors
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  specialization VARCHAR(100),
  available BOOLEAN DEFAULT TRUE
);

-- Nurses
CREATE TABLE nurses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  shift VARCHAR(50),
  available BOOLEAN DEFAULT TRUE
);

-- Service Requests
CREATE TABLE service_requests (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES users(id),
  service_type VARCHAR(50), -- 'doctor', 'nurse', etc.
  status VARCHAR(50) DEFAULT 'pending',
  scheduled_at TIMESTAMP
);
