import Dashboard from "@/component/dashboard";
import Settings from "@/component/settings";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const { height, width } = Dimensions.get('window');

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
        <View style={{ flex: 1, width, position: 'relative' }}>
            <View style={style.headContainer}>
                <Text style={style.logo}>{barangay} iBIS</Text>
            </View>

        {/* ayohon pani */}
            {view == 'dashboard' ? (
                <Dashboard />
            ) : (
                <Settings />
            )}

            <Pressable onPress={() => router.push('/addResidentForm')} style={style.floatBtn}>
                <Ionicons name={'person-add'} color={'#fff'} size={30} />
            </Pressable>

            <View style={{ position: 'absolute', bottom: 50, alignSelf: 'center', width: 80, height: 80, borderRadius: 40, backgroundColor: '#f5f5f5', zIndex: 5 }} />
            <View style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 8, position: 'absolute', bottom: 0, flexDirection: 'row', justifyContent: 'space-between',
                    alignItems: 'center', width, backgroundColor: '#fff', height: 80 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '50%' }}>
                        <TouchableOpacity onPress={() => setView('dashboard')} style={{ paddingVertical: 10, flexDirection: 'column', alignItems: 'center', width: '45%' }}>
                            <MaterialCommunityIcons name={view == 'dashboard' ? 'view-dashboard' : 'view-dashboard-outline'} size={22} color={ view == 'dashboard' ? '#F07E13' : '#00000085' } />
                            <Text style={{ color: view == 'dashboard' ? '#F07E13' : '#00000085', fontSize: 12 }}>Dashboard</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setView('families')} style={{ paddingVertical: 10, flexDirection: 'column', alignItems: 'center', width: '45%' }}>
                            <Ionicons name={view == 'families' ? 'people' : 'people-outline'} size={22} color={ view == 'families' ? '#F07E13' : '#00000085' } />
                            <Text style={{ color: view == 'families' ? '#F07E13' : '#00000085', fontSize: 12 }}>Families</Text>
                        </TouchableOpacity>
                    </View>
                
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '50%', justifyContent: 'flex-end' }}>
                        <TouchableOpacity onPress={() => setView('households')} style={{ paddingVertical: 10, flexDirection: 'column', alignItems: 'center', width: '45%' }}>
                            <Ionicons name={view == 'households' ? 'home' : 'home-outline'} size={22} color={ view == 'households' ? '#F07E13' : '#00000085' } />
                            <Text style={{ color: view == 'households' ? '#F07E13' : '#00000085', fontSize: 12 }}>Households</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setView('settings')} style={{ paddingVertical: 10, flexDirection: 'column', alignItems: 'center', width: '45%' }}>
                            <Ionicons name={ view == 'settings' ? 'settings' : 'settings-outline'} color={ view == 'settings' ? '#F07E13' : '#00000085' } size={22} />
                            <Text style={{ color: view == 'settings' ? '#F07E13' : '#00000085', fontSize: 12 }}>Settings</Text>
                        </TouchableOpacity>
                    </View>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    headContainer: {
        backgroundColor: '#F07E13',
        height: 90,
        width,
        paddingTop: 50,
        marginBottom: 20
    },
    logo: {
        color: '#fff',
        fontWeight: 800,
        letterSpacing: 1,
        fontSize: 20,
        paddingHorizontal: 20
    },
    floatBtn: {
        backgroundColor: '#F07E13',
        padding: 18,
        borderRadius: 50,
        position: 'absolute',
        bottom: 60,
        elevation: 5,
        zIndex: 8,
        alignSelf: 'center'
    }
})
