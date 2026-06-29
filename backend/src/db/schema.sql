CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  avatar TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS signin_record (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  signin_date DATE NOT NULL,
  signin_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  note TEXT DEFAULT '',
  FOREIGN KEY (user_id) REFERENCES user(id),
  UNIQUE(user_id, signin_date)
);

CREATE INDEX IF NOT EXISTS idx_signin_user_date ON signin_record(user_id, signin_date);
