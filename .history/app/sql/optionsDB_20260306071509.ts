import * as SQLite from 'expo-sqlite';


export const db = SQLite.openDatabaseSync('options.db');

export const initDatabase = async () => {
    await db.execAsync(`DROP TABLE IF EXISTS residents;`);
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS residents (
            id TEXT PRIMARY KEY NOT NULL,
            last_name TEXT,
            first_name TEXT,
            middle_name TEXT,
            created_at TEXT,
            updated_at TEXT
        );
    `);
    
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS options (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT,
            category TEXT,
            created_at TEXT,
            updated_at TEXT
        );
    `);
}