    import { observable } from '@legendapp/state';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import { configureSynced } from '@legendapp/state/sync';
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { Alert } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Database } from './database.types';



    const supabaseUrl = process!.env.EXPO_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    const extras = Constants.expoConfig?.extra ?? {};
    const API_URL = extras.API_URL as string;
    const API_KEY = extras.API_KEY as string;
    const ORIGIN = extras.ORIGIN as string;

    if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient<Database>(
        supabaseUrl,
        supabaseAnonKey
    );

    const generateId = () => uuidv4();

    type School = {
        educational_attainment_school_id?: number;
        strand_id?: number;
        degree_id?: number;
        school?: string;
        year_graduated?: string;
    };

    type Resident = {
        id: string;
        last_name: string;
        first_name: string;
        middle_name: string;
        suffix_id?: number;
        civil_status_id?: number;
        sitio_id?: number;
        sex?: string;
        date_of_birth?: string | null;
        place_of_birth?: string;
        occupation?: string;
        citizenship?: string;
        religion_id?: number;
        voting_eligibility?: boolean;
        registered_voter?: boolean;
        registered_brgy?: string;
        blood_type_id?: number;
        contact_number?: string;
        email?: string;
        emergency_contact_person?: string;
        emergency_contact_number?: string;
        relationship_contact_id?: number;
        schools: School[];
        osy?: boolean;
        lgbtq_id?: number;
        is_4ps_member?: boolean;
        pwd?: boolean;
        pwd_types_id?: number;
        senior?: boolean;
        indigent_senior?: boolean;
        pensioner?: boolean;
        ofw?: boolean;
        family_id?: number | null;
        indigenous_people?: boolean;
        ethnicity_id?: number;
        ph_number?: string;
        solo_parent?: boolean;
        sss_number?: string;
        gsis_number?: string;
        hdmf_number?: string;
        resident_photo?: string;
        death_certificate_photo?: string;
        has_ph?: boolean;
        has_sss?: boolean;
        has_gsis?: boolean;
        has_hdmf?: boolean;
        status_id?: number;
        inactive_type?: number;
        date_of_death?: string | null;
        date_of_migration?: string | null;
        place_to_migrate?: string;
        created_at?: string;
        updated_at?: string;
        synced?: boolean;
    };

    NetInfo.addEventListener(async (state) => {
        try {
            if (state.isConnected && state.isInternetReachable) {
                const unsynced = Object.values(residents$.get()).filter(r => !r.synced);
                for (const residentData of unsynced) {
                    const cleanedData = sanitizeResidentForInsert(residentData);
                    const { error } = await supabase.from('brgys_residents').insert([cleanedData]).select();

                    if(error) {
                        console.log(`Supabase insert failed for ${residentData.id}:`, error);
                    }else {
                        residents$[residentData.id].assign({ synced: true })

                        if (residentData.schools?.length) {
                            const schools = residentData.schools.map((s: any) => ({
                                resident_id: residentData.id,
                                educational_attainment_school_id: s.educational_attainment_school_id,
                                strand_id: s.strand_id,
                                degree_id: s.degree_id,
                                school: s.school,
                                year_graduated: s.year_graduated,
                            }));

                            const { error: schoolError } = await supabase
                                .from('resident_schools')
                                .insert(schools);

                            if (schoolError) {
                                console.log("School insert failed:", schoolError);
                            }
                        }
                    }
                }
                Alert.alert('Sync Complete', 'All resident records have been successfully synced.');
            }
        }catch(error) {
            console.log(`Unexpected Error: ${error}`);
        }
    });


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

    export const residents$ = observable<Record<string, Resident>>(
        customSynced({
            supabase,
            collection: "brgys_residents",
            actions: ["read", "create", "update", "delete"],
            realtime: true,
            persist: { name: 'brgy_residents', retrySync: true },
            retry: { infinite: true }
        }),
    );

    function sanitizeResidentForInsert(resident: any) {
        const {
            ethnicity,
            lgbt,
            schools,
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


    export async function addResident(residentData: any) {
        
        const id = generateId();

        const newResidentData: Resident = {
            id,
            ...residentData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
        
        const cleanedData = sanitizeResidentForInsert(newResidentData);

        residents$[id].assign(newResidentData);

        try {
        const { error } = await supabase.from('brgys_residents').insert([cleanedData]).select();

        if (error) {
            console.log(`Supabase insert failed for ${id}:`, error);
        } else {
            if (residentData.schools?.length) {

                const schools = residentData.schools.map((s: any) => ({
                    resident_id: id,
                    educational_attainment_school_id: s.educational_attainment_school_id,
                    strand_id: s.strand_id,
                    degree_id: s.degree_id,
                    school: s.school,
                    year_graduated: s.year_graduated,
                }));

                const { error: schoolError } = await supabase
                    .from('resident_schools')
                    .insert(schools);

                if (schoolError) {
                    console.log("School insert failed:", schoolError);
                }
            }

            residents$[id].assign({ synced: true });
            Alert.alert('Success', 'Resident added')
        }
        } catch (err) {
        console.log(`Unexpected error syncing ${id}:`, err);
        }
    }
