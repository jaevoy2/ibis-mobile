import { config } from 'dotenv';
import 'dotenv/config';
import path from path;

config({ path: path.resolve(__dirname, '.env') });


export default ({ config }) => ({
    ...config,
    extra: {
        SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    }
})