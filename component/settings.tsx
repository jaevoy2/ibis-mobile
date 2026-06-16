import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Dimensions, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const { height, width } = Dimensions.get('window');

export default function Settings() {
    const [username, setuserName] = useState('');
    const [barangay, setBarangay] = useState('');
    const [visible, setVisible] = useState(false);

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
            <Modal
                visible={visible}
                transparent={true}
                animationType="fade"
            >
                <View>
                    <View>
                        <Text>This is a simple modal</Text>
                        <Pressable
                            onPress={() => setVisible(false)}
                            >
                            <Text style={{ color: "#fff" }}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <View style={{ position: 'absolute', top: 100, paddingHorizontal: 20 }}>
                <Text style={style.title}>Settings</Text>
            </View>
            <View style={{ padding: 20, marginTop: 10, width }}>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-end', width: '100%', backgroundColor: '#f07e1336', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 15 }}>
                    <Ionicons name={'person-circle'} size={45} color={'#F07E13'} />
                    <View>
                        <Text style={{ fontSize: 18, color: '#333333' }}>{username}</Text>
                        <Text style={{ fontSize: 12, opacity: 0.6, color: '#6d6d6d' }}>Barangay {barangay}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => setVisible(true)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 5, backgroundColor: '#5e5e5e1e', padding: 15, marginTop: 15, borderRadius: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Ionicons name={'log-out-outline'} color={'#F4320B'} size={20} />
                        <Text style={{ color: '#F4320B' }}>Logout</Text>
                    </View>
                    <Ionicons name={'chevron-forward'} color={'#636363'} size={18} />
                </TouchableOpacity>
            </View>
        </>
    )
}


const style = StyleSheet.create({
    title: {
        color: '#F07E13',
        fontWeight: '600',
        fontSize: 20,
    }
})