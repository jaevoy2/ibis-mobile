import { config as dotenvConfig } from 'dotenv';
import path from 'path';

dotenvConfig({ path: path.resolve(__dirname, '.env') });


export default ({ config: expoConfig }) => ({
    ...expoConfig,
    extra: {
        EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
        EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
        API_URL: process.env.API_URL,
        API_KEY: process.env.API_KEY,
        ORIGIN: process.env.ORIGIN
    }
})