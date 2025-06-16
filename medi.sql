-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100),
  role VARCHAR(20),
  available boolean default false
);

-- Service Requests
CREATE TABLE service_requests (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES users(id),
  service_type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  scheduled_at TIMESTAMP
);
