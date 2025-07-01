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

-- nurse requests
CREATE TABLE nurse_req (
  id SERIAL PRIMARY KEY,
  patient_id INT REFERENCES users(id),
  type nur_types NOT NULL,
  zone VARCHAR(100),
  schedule TIMESTAMP,
  assigned_to INT REFERENCES users(id),
  status status_type NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  price INT,
  ser_id INT REFERENCES service_types(id)
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
  description TEXT,
  categorie categories NOT NULL,
  price INT,
  available boolean default false
);

CREATE TYPE role_type AS ENUM ('patient', 'doctor', 'nurse', 'admin');

CREATE TYPE lab_category AS ENUM ('blood_tests');

CREATE TYPE test_category AS ENUM ('general_tests');

CREATE TYPE status_type AS ENUM ('pending','completed','assigned','failed');

ALTER TYPE status_type ADD VALUE 'cancelled';

CREATE TYPE city_list AS ENUM ('Tunis','Sousse','Monastir','Sfax')


CREATE TABLE labs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  category lab_category NOT NULL
);


--teb3a e reports
CREATE TABLE tests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  category test_category NOT NULL,
  lab_id INT REFERENCES labs(id),
  patient_id INT REFERENCES users(id),
  zone VARCHAR(100),
  schedule TIMESTAMP,
  assigned_to INT REFERENCES users(id),
  status status_type NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ser_id INT REFERENCES service_types(id),
  price INT
);


alter table services add price INT;

alter table service_types add price INT;

alter table service_types add categorie categories NOT NULL;
-- *******************************************************************************

ALTER TABLE tests
  ADD COLUMN patient_id INT REFERENCES users(id),
  ADD COLUMN zone VARCHAR(100),
  ADD COLUMN schedule TIMESTAMP,
  ADD COLUMN assigned_to INT REFERENCES users(id),
  ADD COLUMN status status_type,
  ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

  
alter table service_types add available boolean default false;

ALTER TABLE services
ADD COLUMN ser_id INT,
ADD CONSTRAINT fk_service_type FOREIGN KEY (ser_id) REFERENCES service_types(id);

ALTER TABLE tests
ADD COLUMN ser_id INT,
ADD CONSTRAINT fk_service_type FOREIGN KEY (ser_id) REFERENCES service_types(id);

create type categories as enum('nurse','lab');

alter table services drop column type;--fazet not null zeda

ALTER TYPE test_category ADD VALUE 'vitamin';
ALTER TYPE test_category ADD VALUE 'heart';
ALTER TYPE test_category ADD VALUE 'diabetes';

create type nur_types as enum('senior','women','complete_checkup');

alter table services add type nur_types;--fazet not null nzidha

alter table services rename to nurse_req;

ALTER TABLE service_types
ADD CONSTRAINT unique_name_categorie UNIQUE (name);

alter table tests add price INT;


















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


{
  "category": "vitamin",
  "zone": "skanes",
  "schedule": "2025-07-01T10:00:00"
  }