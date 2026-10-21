CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS users (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text NOT NULL UNIQUE, password_hash text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS tasks (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200), description text, status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo','in_progress','done')), priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high')), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS tasks_user_updated_idx ON tasks (user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS tasks_user_status_idx ON tasks (user_id, status);
