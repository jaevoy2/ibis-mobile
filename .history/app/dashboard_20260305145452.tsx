import TotalResidentsWidget from "@/component/widget";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { FetchOptions } from "./api/options";
// import { initDatabase } from "./sql/optionsDB";


const { height, width } = Dimensions.get('window');

export default function Dashboard() {
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        handleFetchOptions()
    }, []);

    const handleFetchOptions = async () => {
        try {
            const response = await FetchOptions();
    
            if(!response.error) {
                console.log(response.options);
            }
        }catch(error: any) {
            Alert.alert('Error', error.message);
        }finally {
            setLoading(false)
        }

    }


    return (
        <View style={{ flex: 1 }}>
            <View style={style.headContainer}>
                <Text style={style.logo}>iBIS</Text>
            </View>

            {loading == true ? (
                <View style={{ height, alignContent: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size={'large'} color={'#'} />
                </View>
            ) : (
                <>
                    <View style={{ paddingHorizontal: 20 }}>
                        <TotalResidentsWidget total={250} />
                    </View>
                    <Pressable onPress={() => router.push('/form')} style={style.floatBtn}>
                        <Ionicons name={'person-add'} color={'#fff'} size={18} />
                        <Text style={{ fontSize: 16, color: '#fff' }}>Add resident</Text>
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#306060',
        padding: 15,
        borderRadius: 50,
        position: 'absolute',
        bottom: 100,
        right: 20
    }
})