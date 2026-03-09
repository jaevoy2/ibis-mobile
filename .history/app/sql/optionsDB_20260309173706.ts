import * as SQLite from 'expo-sqlite';


export const db = SQLite.openDatabaseSync('options.db');

export const initDatabase = async () => {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS heads (
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
            updated_at TEXT,
            synced INTEGER
        );
    `);

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS barangays (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT,
            code TEXT,
            municipality TEXT,
            province TEXT,
            region TEXT,
            created_at TEXT,
            updated_at TEXT,
            synced INTEGER
        );
    `);
    
}