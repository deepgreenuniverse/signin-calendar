import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', '..', 'signin.db');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Initialize schema
const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
db.exec(schema);

// Ensure default user exists
const ensureUser = db.prepare(`
  INSERT OR IGNORE INTO user (id, username) VALUES (1, 'default_user')
`);
ensureUser.run();

export default db;
