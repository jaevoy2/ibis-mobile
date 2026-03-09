import { observable } from '@legendapp/state';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import { configureSynced } from '@legendapp/state/sync';
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
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

export const residents$ = observable(
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

    residents$[id].assign({
        id,
        ...residentData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    });
}

