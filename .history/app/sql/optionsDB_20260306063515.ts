import * as SQLite from 'expo-sqlite';


export const db = SQLite.openDatabaseSync('options.db');

export const initDatabase = async () => {
    await db.execAsync(`PRAGMA foreign_keys = ON;`);

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS options (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT,
            category TEXT,
            created_at TEXT,
            updated_at TEXT
        );
    `);

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS families (
            id TEXT PRIMARY KEY NOT NULL,   
            head_id INTEGER,
            barangay_id INTEGER,
            family_name TEXT,
            income_level_id INTEGER,
            contact_information TEXT,
            origin TEXT,
            created_at TEXT,
            updated_at TEXT,
            FOREIGN KEY (head_id) REFERENCES heads(id) ON DELETE SET NULL
        ); 
    `);

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS heads (
            id TEXT PRIMARY KEY NOT NULL,
            last_name TEXT,
            first_name TEXT,
            middle_name TEXT
        )
    `)
}