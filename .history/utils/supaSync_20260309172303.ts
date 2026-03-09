import { Barangays, EducationProps, OptionProps, ResidentData } from '@/app/form';
import { db, initDatabase } from '@/app/sql/optionsDB';
import { observable } from '@legendapp/state';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import { configureSynced } from '@legendapp/state/sync';
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createClient } from '@supabase/supabase-js';
import { Alert } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Database } from './database.types';



const supabaseUrl = process!.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
throw new Error('Missing Supabase environment variables')
}

const supabase = createClient<Database>(
    supabaseUrl,
    supabaseAnonKey
);

const generateId = () => uuidv4();

NetInfo.addEventListener(async (state) => {
    if (!state.isConnected || !state.isInternetReachable) return;

    try {
        // Sync all collections
        await syncCollection(barangay$, 'barangays');
        await syncCollection(optionProps$, 'options');
        await syncCollection(residents$, 'residents');
        await syncCollection(education$, 'educations');

        Alert.alert('Sync Complete', 'All records have been successfully synced.');
    } catch (err) {
        console.log('Sync error:', err);
    }
});

async function syncCollection<T extends { id: string; synced?: number }>(
    store$: any,
    tableName: any
) {
    const rows = Object.values(store$.get()) as T[];
    const unsynced = rows.filter(r => !r.synced || r.synced === 0);

    for (const row of unsynced) {
        const cleaned = sanitizeData(row);
        const { error } = await supabase.from(tableName).insert([cleaned]).select();
        if (!error) {
            store$[row.id].assign({ synced: 1 });
            // Update SQLite synced
            const fields = Object.keys(cleaned).join(', ');
            const placeholders = Object.keys(cleaned).map(() => '?').join(', ');
            await db.runAsync(
                `UPDATE ${tableName} SET synced = 1 WHERE id = ?`,
                [row.id]
            );
        } else {
            console.log(`Error syncing ${tableName} id=${row.id}`, error);
        }
    }
}


const customSynced = configureSynced(syncedSupabase, {
    persist: {
        plugin: observablePersistAsyncStorage({
            AsyncStorage,
        }),
    },
    generateId,
    supabase,
    changesSince: 'last-sync',
    fieldCreatedAt: 'created_at',
    fieldUpdatedAt: 'updated_at',
    fieldDeleted: 'deleted_at'
});

export const residents$ = observable<Record<string, ResidentData>>(
    customSynced({
        supabase,
        collection: "residents",
        actions: ["read", "create", "update", "delete"],
        realtime: true,
        persist: { name: 'residents', retrySync: true },
        retry: { infinite: true }
    }),
);

export const optionProps$ = observable<Record<string, OptionProps>>(
    customSynced({
        supabase,
        collection: "options",
        actions: ["read", "create", "update", "delete"],
        realtime: true,
        persist: { name: 'options', retrySync: true },
        retry: { infinite: true }
    }),
);

export const barangay$ = observable<Record<string, Barangays>>(
    customSynced({
        supabase,
        collection: "barangays",
        actions: ["read", "create", "update", "delete"],
        realtime: true,
        persist: { name: 'barangays', retrySync: true },
        retry: { infinite: true }
    }),
);

export const education$ = observable<Record<string, EducationProps>>(
    customSynced({
        supabase,
        collection: "educations",
        actions: ["read", "create", "update", "delete"],
        realtime: true,
        persist: { name: 'educations', retrySync: true },
        retry: { infinite: true }
    }),
);



function sanitizeResidentForInsert(resident: any) {
    const {
        ethnicity,
        lgbt,
        school,
        synced,
        ...allowed
    } = resident;

    return {
        ...allowed,
        middle_name: resident.middle_name ?? '',
        voting_eligibility: resident.voting_eligibility ? 1 : 0,
        registered_voter: resident.registered_voter ? 1 : 0,
        osy: resident.osy ? 1 : 0,
        is_4ps_member: resident.is_4ps_member ? 1 : 0,
        pwd: resident.pwd ? 1 : 0,
        senior: resident.senior ? 1 : 0,
        indigent_senior: resident.indigent_senior ? 1 : 0,
        pensioner: resident.pensioner ? 1 : 0,
        ofw: resident.ofw ? 1 : 0,
        indigenous_people: resident.indigenous_people ? 1 : 0,
        solo_parent: resident.solo_parent ? 1 : 0,
        has_ph: resident.has_ph ? 1 : 0,
        has_sss: resident.has_sss ? 1 : 0,
        has_gsis: resident.has_gsis ? 1 : 0,
        has_hdmf: resident.has_hdmf ? 1 : 0,
    };
}


function sanitizeData(data: any) {
    const {
        synced,
        ...allowed
    } = data;

    return {
        ...allowed
    }
}



export async function addResident(residentData: ResidentData) {
    await initDatabase();
    const id = generateId();

    const newResidentData: ResidentData = {
        ...residentData,
        id,
        synced: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const cleaned = sanitizeResidentForInsert(newResidentData);
    residents$[id].assign(newResidentData);

    // Save locally first
    await db.runAsync(
        `INSERT INTO residents (
            id, first_name, last_name, middle_name, suffix_id, civil_status_id,
            sitio_id, sex, date_of_birth, place_of_birth, occupation, citizenship,
            religion_id, voting_eligibility, registered_voter, registered_brgy,
            blood_type_id, contact_number, email, emergency_contact_person,
            emergency_contact_number, relationship_contact_id, lgbtq_id,
            is_4ps_member, pwd, pwd_types_id, senior, indigent_senior,
            pensioner, ofw, indigenous_people, ethnicity_id, ph_number, solo_parent,
            sss_number, gsis_number, hdmf_number, has_ph, has_sss, has_gsis,
            has_hdmf, family_id, status_id, inactive_type, date_of_death,
            date_of_migration, place_to_migrate, resident_photo, death_certificate_photo,
            school, educational_attainment_school_id, strand_id, degree_id, osy,
            reason, synced, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            id,
            cleaned.first_name,
            cleaned.last_name,
            cleaned.middle_name,
            cleaned.suffix_id ?? null,
            cleaned.civil_status_id ?? null,
            cleaned.sitio_id ?? null,
            cleaned.sex ?? null,
            cleaned.date_of_birth ?? null,
            cleaned.place_of_birth ?? null,
            cleaned.occupation ?? null,
            cleaned.citizenship ?? null,
            cleaned.religion_id ?? null,
            cleaned.voting_eligibility ?? 0,
            cleaned.registered_voter ?? 0,
            cleaned.registered_brgy ?? null,
            cleaned.blood_type_id ?? null,
            cleaned.contact_number ?? null,
            cleaned.email ?? null,
            cleaned.emergency_contact_person ?? null,
            cleaned.emergency_contact_number ?? null,
            cleaned.relationship_contact_id ?? null,
            cleaned.lgbtq_id ?? null,
            cleaned.is_4ps_member ?? 0,
            cleaned.pwd ?? 0,
            cleaned.pwd_types_id ?? null,
            cleaned.senior ?? 0,
            cleaned.indigent_senior ?? 0,
            cleaned.pensioner ?? 0,
            cleaned.ofw ?? 0,
            cleaned.indigenous_people ?? 0,
            cleaned.ethnicity_id ?? null,
            cleaned.ph_number ?? null,
            cleaned.solo_parent ?? 0,
            cleaned.sss_number ?? null,
            cleaned.gsis_number ?? null,
            cleaned.hdmf_number ?? null,
            cleaned.has_ph ?? 0,
            cleaned.has_sss ?? 0,
            cleaned.has_gsis ?? 0,
            cleaned.has_hdmf ?? 0,
            cleaned.family_id ?? null,
            cleaned.status_id ?? null,
            cleaned.inactive_type ?? null,
            cleaned.date_of_death ?? null,
            cleaned.date_of_migration ?? null,
            cleaned.place_to_migrate ?? null,
            cleaned.resident_photo ?? null,
            cleaned.death_certificate_photo ?? null,
            cleaned.school ?? null,
            cleaned.educational_attainment_school_id ?? null,
            cleaned.strand_id ?? null,
            cleaned.degree_id ?? null,
            cleaned.osy ?? 0,
            cleaned.reason ?? null,
            0,
            cleaned.created_at,
            cleaned.updated_at
        ]
    );

    // Attempt Supabase sync immediately if connected
    try {
        const { error } = await supabase.from('residents').insert([cleaned]).select();
        if (!error) {
            residents$[id].assign({ synced: 1 });
        }
    } catch (err) {
        console.log(`Error syncing resident ${id}:`, err);
    }
}

export async function addOption(optionData: OptionProps) {
    await initDatabase();
    const id = generateId();

    const newOptionData: OptionProps = {
        ...optionData,
        id,
        synced: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }

    optionProps$[id].assign(newOptionData);
    const cleanedData = sanitizeData(newOptionData);

    await db.runAsync(
        `INSERT INTO options (id, name, category, created_at, updated_at, synced) VALUES (?, ?, ?, ?, ?, ?)`,
        [id, cleanedData.name, cleanedData.category, cleanedData.created_at, cleanedData.updated_at, newOptionData.synced]
    );

    try {
        const { error } = await supabase.from('options').insert([cleanedData]).select();
    if (error) {
        console.log(`Supabase insert failed for ${id}:`, error);
    } else {
        optionProps$[id].assign({ synced: 1 });

        await db.runAsync(
            `UPDATE options SET
                synced = ?
                WHERE id = ?`,
                [ 1, cleanedData.id ]
        )

        Alert.alert('Success', 'Option added')
    }
    } catch (err) {
        console.log(`Unexpected error syncing ${id}:`, err);
    }
}

export async function addBrgys(brgys: Barangays) {
    await initDatabase();
    const id = generateId();

    const newBrgysData: Barangays = {
        ...brgys,
        id,
        synced: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
    
    barangay$[id].assign(newBrgysData);
    const cleanedData = sanitizeData(newBrgysData);

    await db.runAsync(
        `INSERT INTO barangays (id, name, code, municipality, province, region, created_at, updated_at, synced) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [ 
            id, 
            cleanedData.name, 
            cleanedData.code, 
            cleanedData.municipality, 
            cleanedData.province, 
            cleanedData.region, 
            cleanedData.created_at, 
            cleanedData.updated_at, 
            newBrgysData.synced
        ]
    );

    try {
        const { error } = await supabase.from('barangays').insert([cleanedData]).select();
        if (error) {
            console.log(`Supabase insert failed for ${id}:`, error);
        } else {
            barangay$[id].assign({ synced: 1 });

            await db.runAsync(
                `UPDATE barangays SET
                    synced = ?
                    WHERE id = ?`,
                    [ 1, cleanedData.id ]
            )

            Alert.alert('Success', 'Barangay added')
        }
    } catch (err) {
    console.log(`Unexpected error syncing ${id}:`, err);
    }
}

export async function addEducation(educations: EducationProps[] = [], residentId: string) {
    if (!Array.isArray(educations) || educations.length === 0) return;

    try {
        for (const education of educations) {
            if (!education) continue;

            const id = generateId();

            const newEducationData = {
                ...education,
                id,
                synced: 0,
                resident_id: residentId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            const cleanedData = sanitizeData(newEducationData);

            education$[id].assign(cleanedData);

            const { error } = await supabase.from('educations').insert([cleanedData]);

            if (!error) {
                education$[id].assign({ synced: 1 });
            }
        }
    } catch (error) {
        console.log('Unexpected error syncing education', error);
    }
}

