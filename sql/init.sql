-- init.sql for Mada PERFECT Import
-- Create roles
CREATE TABLE IF NOT EXISTS roles (id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL);
INSERT INTO roles (name) VALUES ('superadmin'),('gerant'),('caissier') ON CONFLICT DO NOTHING;

-- users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(200),
  role_id INT REFERENCES roles(id),
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- products
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(100) UNIQUE,
  name TEXT NOT NULL,
  brand VARCHAR(100),
  family VARCHAR(100),
  unit VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- depots & stocks
CREATE TABLE IF NOT EXISTS depots (id SERIAL PRIMARY KEY, name VARCHAR(150) NOT NULL, location TEXT);

CREATE TABLE IF NOT EXISTS stocks (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id),
  depot_id INT REFERENCES depots(id),
  quantity NUMERIC DEFAULT 0,
  purchase_price NUMERIC,
  sale_price NUMERIC,
  UNIQUE(product_id, depot_id)
);

-- clients
CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  phone VARCHAR(50),
  email VARCHAR(150),
  address TEXT
);

-- invoices
CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE,
  client_id INT REFERENCES clients(id),
  user_id INT REFERENCES users(id),
  date TIMESTAMP DEFAULT NOW(),
  total_amount NUMERIC,
  status VARCHAR(50) DEFAULT 'brouillon'
);

CREATE TABLE IF NOT EXISTS invoice_items (
  id SERIAL PRIMARY KEY,
  invoice_id INT REFERENCES invoices(id),
  product_id INT REFERENCES products(id),
  quantity NUMERIC,
  unit_price NUMERIC,
  total_price NUMERIC
);

-- Insert default superadmin user
-- Username: TONY0987654321
-- Password: admin123
-- bcrypt hash generated previously:
INSERT INTO users (username, password_hash, full_name, role_id)
VALUES ('TONY0987654321', '$2b$12$D3Q5ADjeU5Zs9m4xLrF9hO5Qz3oDk38zU6s5iGq4jCH2Xv3U/3FhC', 'Tony Superadmin', 1)
ON CONFLICT (username) DO NOTHING;
