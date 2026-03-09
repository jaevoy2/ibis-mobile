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
    educational_attainment_school_id?: number;
    strand_id?: number;
    degree_id?: number;
    school?: string;
    year_graduated?: string,
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
    inactive_type?: boolean;
    date_of_death?: string | null;
    date_of_migration?: string | null;
    place_to_migrate?: string;
    deleted_at?: string | null;
    created_at?: string;
    updated_at?: string;
    deleted?: boolean;
    synced?: boolean;
};


NetInfo.addEventListener(async (state) => {
    try {
        if (state.isConnected && state.isInternetReachable) {
            const unsynced = Object.values(residents$).filter(r => !r.get().synced);
            for (const resident of unsynced) {
                const residentData = resident.get();
                const { error } = await supabase.from('residents').insert([residentData]).select();
    
                handleSyncBackend([residentData])
                if(error) {
                    console.log(`Supabase insert failed for ${residentData.id}:`, error);
                }else {
                    resident.assign({ synced: true });
                }
            }
        }
    }catch(error) {
        console.log(`Unexpected Error: ${error}`);
    }
});

const handleSyncBackend = async (residentsData: Resident[]) => {
    try {
        const res = await fetch(`${API_URL}sync/residents`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-api-key': `${API_KEY}`,
                'Origin': `${ORIGIN}`
            },
            body: JSON.stringify({ residents: residentsData })
        });
    
        const response = await res.json();
    
        if(!res.ok) {
            Alert.alert('Error', response.message);
        }
    
        return response;
    }catch(error) {
        alert(error)
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

export const residents$ = observable<Record<string, Resident>>(
    customSynced({
        supabase,
        collection: "residents",
        actions: ["read", "create", "update", "delete"],
        realtime: true,
        persist: { name: 'residents', retrySync: true },
        retry: { infinite: true }
    }),
);

export async function addResident(residentData: any) {
    const id = generateId();

    const newResidentData: Resident = {
        id,
        ...residentData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }

    residents$[id].assign(newResidentData);

    try {
      const { error } = await supabase.from('residents').insert([newResidentData]).select();

      if (error) {
        console.log(`Supabase insert failed for ${id}:`, error);
      } else {
        residents$[id].assign({ synced: true });
      }
    } catch (err) {
      console.log(`Unexpected error syncing ${id}:`, err);
    }
}
