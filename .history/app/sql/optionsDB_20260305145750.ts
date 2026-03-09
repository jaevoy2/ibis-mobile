import * as SQLite from 'expo-sqlite';


const db = await SQLite.openDatabaseAsync('options.bd');

export const initDatabase = () => {
    db.execAsync(`
        CREATE TABLE IF NOT EXISTS options (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT,
            category TEXT,
            created_at TEXT,
            updated_at TEXT
        );
    `);

    db.execAsync(`
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