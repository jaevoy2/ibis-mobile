import * as SQLite from 'expo-sqlite';


export const db = SQLite.openDatabaseSync('options.db');

export const initDatabase = async () => {
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
            resident_id INTEGER,
            barangay_id INTEGER,
            family_name TEXT,
            income_level_id INTEGER,
            contact_information TEXT,
            origin TEXT,
            created_at TEXT,
            updated_at TEXT
        ); 
    `);
}