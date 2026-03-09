import Dashboard from "@/component/dashboard";
import Settings from "@/component/settings";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const { height, width } = Dimensions.get('window');
const views = ['dashboard', 'settings'];

export default function Navigation() {
    const [view, setView] = useState('dashboard');
        const [barangay, setBarangay] = useState('');

    useEffect(() => {
        const getBarangay = async () => {
            const brgy = await AsyncStorage.getItem('barangay');

            if(brgy) {
                setBarangay(brgy);
            }
        }

        getBarangay()
    }, [])
    

    return (
        <View style={{ flex: 1, width }}>
            <View style={style.headContainer}>
                <Text style={style.logo}>{barangay.toUpperCase()} iBIS</Text>
            </View>

            {view == 'dashboard' ? (
                <Dashboard />
            ) : (
                <Settings />
            )}

            <Pressable onPress={() => router.push('/form')} style={style.floatBtn}>
                <Ionicons name={'person-add'} color={'#fff'} size={30} />
            </Pressable>

            <View style={{ position: 'absolute', bottom: 50, alignSelf: 'center', width: 80, height: 80, borderRadius: 40, backgroundColor: '#f5f5f5', zIndex: 5 }} />
            <View style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 8, position: 'absolute', bottom: 0, flexDirection: 'row', justifyContent: 'space-between',
                    paddingHorizontal: 20, alignItems: 'center', width, backgroundColor: '#fff', height: 80 }}>
                <TouchableOpacity onPress={() => setView('dashboard')} style={{ padding: 20, flexDirection: 'column', alignItems: 'center' }}>
                    <MaterialCommunityIcons name={view == 'dashboard' ? 'view-dashboard' : 'view-dashboard-outline'} size={25} color={ view == 'dashboard' ? '#306060' : '#000' } />
                    <Text style={{ color: view == 'dashboard' ? '#306060' : '#000', fontSize: 13 }}>Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setView('settings')} style={{ padding: 20, flexDirection: 'column', alignItems: 'center' }}>
                    <Ionicons name={ view == 'settings' ? 'settings' : 'settings-outline'} color={ view == 'settings' ? '#306060' : '#000' } size={25} />
                    <Text style={{ color: view == 'settings' ? '#306060' : '#000', fontSize: 13 }}>Settings</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
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
        fontSize: 20,
        paddingHorizontal: 20
    },
    floatBtn: {
        backgroundColor: '#306060',
        padding: 18,
        borderRadius: 50,
        position: 'absolute',
        bottom: 60,
        elevation: 5,
        zIndex: 8,
        alignSelf: 'center'
    }
})
