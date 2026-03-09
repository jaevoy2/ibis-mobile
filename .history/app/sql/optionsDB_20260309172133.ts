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
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS residents (
            id TEXT PRIMARY KEY NOT NULL,
            first_name TEXT,
            last_name TEXT,
            middle_name TEXT,
            suffix_id INTEGER,
            civil_status_id INTEGER,
            sitio_id INTEGER,
            sex TEXT,
            date_of_birth TEXT,
            place_of_birth TEXT,
            occupation TEXT,
            citizenship TEXT,
            religion_id INTEGER,
            voting_eligibility INTEGER,
            registered_voter INTEGER,
            registered_brgy TEXT,
            blood_type_id INTEGER,
            contact_number TEXT,
            email TEXT,
            emergency_contact_person TEXT,
            emergency_contact_number TEXT,
            relationship_contact_id INTEGER,
            lgbtq_id INTEGER,
            is_4ps_member INTEGER,
            pwd INTEGER,
            pwd_types_id INTEGER,
            senior INTEGER,
            indigent_senior INTEGER,
            pensioner INTEGER,
            ofw INTEGER,
            indigenous_people INTEGER,
            ethnicity_id INTEGER,
            ph_number TEXT,
            solo_parent INTEGER,
            sss_number TEXT,
            gsis_number TEXT,
            hdmf_number TEXT,
            has_ph INTEGER,
            has_sss INTEGER,
            has_gsis INTEGER,
            has_hdmf INTEGER,
            family_id INTEGER,
            status_id INTEGER,
            inactive_type INTEGER,
            date_of_death TEXT,
            date_of_migration TEXT,
            place_to_migrate TEXT,
            resident_photo TEXT,
            death_certificate_photo TEXT,
            school TEXT,
            educational_attainment_school_id INTEGER,
            strand_id INTEGER,
            degree_id INTEGER,
            osy INTEGER,
            reason TEXT,
            synced INTEGER,
            created_at TEXT,
            updated_at TEXT
        );
    `);

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS educations (
            id TEXT PRIMARY KEY NOT NULL,
            brgy_resident_id TEXT,
            educational_attainment_school_id INTEGER,
            strand_id INTEGER,
            degree_id INTEGER,
            school TEXT,
            year_graduated TEXT,
            osy INTEGER,
            synced INTEGER,
            created_at TEXT,
            updated_at TEXT
        );
    `);
}