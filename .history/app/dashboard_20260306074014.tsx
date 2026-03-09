import TotalResidentsWidget from "@/component/widget";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { FetchOptions } from "./api/options";
import { db } from "./sql/optionsDB";



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
                await handleLocalSync(response.options, response.families, response.heads)
            }
        }catch(error: any) {
            Alert.alert('Error', error.message);
        }finally {
            setLoading(false);
        }

    }

    const handleLocalSync = async (options: any[], families: any[], residents: any[]) => {
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
                    resident.firt_name,
                    resident.middle_name,
                    resident.created_at,
                    resident.updated_at
                ]
            );
        }
    }


    return (
        <View style={{ flex: 1 }}>
            <View style={style.headContainer}>
                <Text style={style.logo}>iBIS</Text>
            </View>

            {loading == true ? (
                <View style={{ height, paddingTop: 250, alignItems: 'center' }}>
                    <ActivityIndicator size={'large'} color={'#306060'} />
                </View>
            ) : (
                <>
                    <View style={{ paddingHorizontal: 20 }}>
                        <TotalResidentsWidget total={250} />
                    </View>
                    <Pressable onPress={() => router.push('/form')} style={style.floatBtn}>
                        <Ionicons name={'person-add'} color={'#fff'} size={30} />
                    </Pressable>
                </>
            )}
        </View>
    )
}


const style = StyleSheet.create({
    headContainer: {
        backgroundColor: '#306060',
        height: 90,
        width,
        paddingTop: 50,
        marginBottom: 20
    },
    logo: {
        color: '#fff',
        fontWeight: 800,
        letterSpacing: 2,
        fontSize: 20,
        paddingHorizontal: 20
    },
    floatBtn: {
        backgroundColor: '#306060',
        padding: 15,
        borderRadius: 50,
        position: 'absolute',
        bottom: 100,
        right: 20,
        elevation: 2
    }
})