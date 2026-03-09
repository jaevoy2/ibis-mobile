import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const { height, width } = Dimensions.get('window');

export default function Settings() {
    const [username, setuserName] = useState('');
    const [barangay, setBarangay] = useState('');

    useEffect(() => {
        const getData = async () => {
            const brgy = await AsyncStorage.getItem('barangay');
            const name = await AsyncStorage.getItem('user_name');

            if(brgy && name) {
                setuserName(name);
                setBarangay(brgy)
            }
        }

        getData()
    }, [])

    return (
        <>
            <View style={{ position: 'absolute', top: 100, paddingHorizontal: 20 }}>
                <Text style={style.title}>Settings</Text>
            </View>
            <View style={{ padding: 20, marginTop: 10, width }}>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '100%', backgroundColor: '#dfdfdf', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 15 }}>
                    <Ionicons name={'person-circle'} size={45} color={'#757575'} />
                    <View>
                        <Text style={{ fontSize: 18 }}>{username}</Text>
                        <Text style={{ fontSize: 12, opacity: 0.6 }}>{barangay}</Text>
                    </View>
                </View>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#f4320b1e', padding: 15, marginTop: 15, borderRadius: 8 }}>
                    <Ionicons name={'log-out-outline'} color={'#F4320B'} size={20} />
                    <Text style={{ color: '#F4320B' }}>Logout</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}


const style = StyleSheet.create({
    title: {
        color: '#306060',
        fontWeight: '600',
        fontSize: 20,
    }
})