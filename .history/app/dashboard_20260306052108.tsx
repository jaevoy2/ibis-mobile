import TotalResidentsWidget from "@/component/widget";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { FetchOptions } from "./api/options";
import { db, initDatabase } from "./sql/optionsDB";



const { height, width } = Dimensions.get('window');

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        handleFetchOptions();

        const setup = async () => {

            await initDatabase();

            const options = await db.getAllAsync(`SELECT * FROM options WHERE id = ?`, [1]);
            console.log(options);

        };

        setup();
    }, []);

    const handleFetchOptions = async () => {
        try {
            const response = await FetchOptions();
    
            if(!response.error) {
                await handleLocalSync(response.options, response.families)
            }
        }catch(error: any) {
            Alert.alert('Error', error.message);
        }finally {
            setLoading(false);
        }

    }

    const handleLocalSync = async (options: any[], families: any[]) => {
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

        for (const family of families) {
            await db.runAsync(
                `
                INSERT INTO families ( id, resident_id, barangay_id, family_name, income_level_id, contact_information, origin, created_at, updated_at )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    resident_id = excluded.resident_id,
                    barangay_id = excluded.barangay_id,
                    family_name = excluded.family_name,
                    income_level_id = excluded.income_level_id,
                    contact_information = excluded.contact_information,
                    origin = excluded.origin,
                    updated_at = excluded.updated_at;
                WHERE
                    resident_id != excluded.resident_id OR barangay_id != excluded.barangay_id OR family_name != excluded.family_name OR income_level_id != excluded.income_level_id
                    OR contact_information != excluded.contact_information OR origin != excluded.origin OR updated_at != excluded.updated_at`,
                [
                    family.id,
                    family.resident_id,
                    family.barangay_id,
                    family.family_name,
                    family.income_level_id,
                    family.contact_information,
                    family.origin,
                    family.created_at,
                    family.updated_at
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
                    <ActivityIndicator size={'large'} color={'#'} />
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