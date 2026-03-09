import { FetchOptions } from "@/app/api/options";
import { db, initDatabase } from "@/app/sql/optionsDB";
import TotalResidentsWidget from "@/component/widget";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, View } from "react-native";



const { height, width } = Dimensions.get('window');

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [barangay, setBarangay] = useState('');
    
    useEffect(() => {
        const getBarangay = async () => {
            const brgy = await AsyncStorage.getItem('barangay');

            if(brgy) {
                setBarangay(brgy);
            }
        }

        getBarangay();
        handleFetchOptions();
    }, []);

    const handleFetchOptions = async () => {
        try {
            const response = await FetchOptions();
    
            if(!response.error) {
                await handleLocalSync(response.options, response.heads, response.barangays)
            }
        }catch(error: any) {
            Alert.alert('Error', error.message);
        }finally {
            setLoading(false)
        }

    }

    const handleLocalSync = async (options: any[], residents: any[], barangays: any[]) => {
        await initDatabase();
        for(const option of options) {
            await db.runAsync(
                `INSERT INTO options ( id, name, category, created_at, updated_at, synced )
                VALUES ( ?, ?, ?, ?, ? , ? )
                ON CONFLICT(id) DO UPDATE SET
                    name = excluded.name,
                    category = excluded.category,
                    updated_at = excluded.updated_at;
                WHERE 
                    name != excluded.name OR category != excluded.category OR updated_at != excluded.updated_at `,
                [
                    option.id,
                    option.name,
                    option.category,
                    option.created_at,
                    option.updated_at,
                    1
                ]
            );
        }
        for(const resident of residents) {
            await db.runAsync(
                `INSERT INTO heads ( id, last_name, first_name, middle_name, created_at, updated_at )
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    last_name = excluded.last_name,
                    first_name = excluded.first_name,
                    middle_name = excluded.middle_name,
                    updated_at = excluded.updated_at
                WHERE
                    last_name != excluded.last_name OR first_name != excluded.first_name OR middle_name != excluded.middle_name OR updated_at != excluded.updated_at`,
                [
                    resident.id,
                    resident.last_name,
                    resident.first_name,
                    resident.middle_name,
                    resident.created_at,
                    resident.updated_at
                ]
            );
        }
        for(const barangay of barangays) {
            await db.runAsync(
                `INSERT INTO barangays ( id, name, code, municipality, province, region, created_at, updated_at, synced )
                VALUES ( ?, ?, ?, ?, ?, ?, ?, ? , ?)
                ON CONFLICT(id) DO UPDATE SET
                    name = excluded.name,
                    code = excluded.code,
                    municipality = excluded.municipality,
                    province = excluded.province,
                    region = excluded.region,
                    updated_at = excluded.updated_at
                WHERE
                    name != excluded.name OR code != excluded.code OR municipality != excluded.municipality OR province != excluded.province OR region != excluded.region OR updated_at != excluded.updated_at`,
                [
                    barangay.id,
                    barangay.name,
                    barangay.code,
                    barangay.municipality,
                    barangay.province,
                    barangay.region,
                    barangay.created_at,
                    barangay.updated_at,
                    1
                ]
            );
        }
    }


    return (
        <View style={{ height, backgroundColor: '#f5f5f5' }}>
            {loading == true ? (
                <View style={{ height, paddingTop: 250, alignItems: 'center' }}>
                    <ActivityIndicator size={'large'} color={'#306060'} />
                </View>
            ) : (
                <>
                    <View style={{ paddingHorizontal: 20 }}>
                        <TotalResidentsWidget total={250} />
                    </View>
                </>
            )}
        </View>
    )
}

