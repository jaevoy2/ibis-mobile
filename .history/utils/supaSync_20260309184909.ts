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
    try {
        if (state.isConnected && state.isInternetReachable) {
            try {
                await syncCollection(barangay$, 'barangays');
                await syncCollection(optionProps$, 'options');
                const unsyncedResidents = Object.values(residents$.get()).filter(r => !r.synced);
                for (const residentData of unsyncedResidents) {
                    const cleanedData = sanitizeResidentForInsert(residentData);
                    const { error } = await supabase.from('residents').insert([cleanedData]).select();
    
                    if(error) {
                        console.log(`Supabase insert failed for ${residentData.id}:`, error);
                    }else {
                        residents$[residentData.id].assign({ synced: true })
                    }
                }
    
                await syncCollection(education$, 'educations');

                Alert.alert('Sync Complete', 'All records have been successfully synced.')
            }catch(error) {
                console.log("Sync error: ", error);
            }
        }
    }catch(error) {
        console.log(`Unexpected Error: ${error}`);
    }
});


async function syncCollection<T extends { id: string; synced: number }>(
    store$: any,
    tableName: any,
) {
    const rows = Object.values(store$.get()) as T[];

    const unsynced = rows.filter(row => row.synced === 0);

    for (const row of unsynced) {
        const cleaned = sanitizeData(row);

        const { error } = await supabase.from(tableName).insert([cleaned]);

        if (!error) {
            store$[row.id].assign({ synced: 1 });
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
    const id = generateId();

    const newResidentData: ResidentData = {
        ...residentData,
        id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }
    
    const cleanedData = sanitizeResidentForInsert(newResidentData);

    residents$[id].assign(newResidentData);

    try {
    const { error } = await supabase.from('residents').insert([cleanedData]).select();

    if (error) {
        console.log(`Supabase insert failed for ${id}:`, error);
    } else {
        residents$[id].assign({ synced: true });

        console.log(newResidentData, 'lol');
        console.log(residents$.peek())
        Alert.alert('Success', 'Resident added')

        if(newResidentData.school && newResidentData.school.length > 0) {
            addEducation(newResidentData.school, newResidentData.id)
        }
    }
    } catch (err) {
        console.log(`Unexpected error syncing ${id}:`, err);
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

export async function addEducation(educations: EducationProps[], residentId: string) {
    try {
        for (const education of educations) {
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
    
            try {
                const { error } = await supabase.from('educations').insert([cleanedData]).select();
                if (error) {
                    console.log(`Supabase insert failed for education ${id}:`, error);
                } else {
                    education$[id].assign({ synced: 1 });
                }
            } catch (err) {
                console.log(`Unexpected error adding education ${id}:`, err);
            }
        }
    
        // Alert.alert('Success', 'Education records added');
    }catch(error) {
        console.log(`Unexpected error syncing`, error);
    }
}

