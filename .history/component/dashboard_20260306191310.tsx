import { FetchOptions } from "@/app/api/options";
import { db } from "@/app/sql/optionsDB";
import TotalResidentsWidget from "@/component/widget";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, View } from "react-native";



const { height, width } = Dimensions.get('window');

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        handleFetchOptions();
    }, []);

    const handleFetchOptions = async () => {
        try {
            const response = await FetchOptions();
    
            if(!response.error) {
                await handleLocalSync(response.options, response.heads)
            }
        }catch(error: any) {
            Alert.alert('Error', error.message);
        }finally {
            setLoading(false);
        }

    }

    const handleLocalSync = async (options: any[], residents: any[]) => {
        for(const option of options) {
            await db.runAsync(
                `INSERT INTO options ( id, name, category, created_at, updated_at )
                VALUES ( ?, ?, ?, ?, ? )
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
                    option.updated_at
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
    }


    return (
        <View style={{ height, backgroundColor: '#f5f5f5', zIndex: 5 }}>
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

