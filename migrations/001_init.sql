CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  password_hash TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  provider TEXT,
  provider_subscription_id TEXT,
  plan_id TEXT,
  status TEXT,
  trial_starts_at TIMESTAMP,
  trial_ends_at TIMESTAMP,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  provider TEXT,
  provider_payment_id TEXT,
  amount INTEGER,
  currency TEXT,
  status TEXT,
  raw_payload JSONB,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tools (
  id SERIAL PRIMARY KEY,
  name TEXT,
  description TEXT,
  public BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS usage_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  tool_id INTEGER,
  action TEXT,
  input_hash TEXT,
  output_hash TEXT,
  input_preview TEXT,
  output_preview TEXT,
  ip_address TEXT,
  user_agent TEXT,
  duration_ms INTEGER,
  timestamp TIMESTAMP DEFAULT now()
);
