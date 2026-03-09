import { Ionicons } from "@expo/vector-icons";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const { height, width } = Dimensions.get('window');

export default function Settings() {

    return (
        <>
            <View style={{ position: 'absolute', top: 100, paddingHorizontal: 20 }}>
                <Text style={style.title}>Settings</Text>
            </View>
            <View style={{ padding: 20, marginTop: 10, width }}>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '100%', backgroundColor: '#dfdfdf', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 15 }}>
                    <Ionicons name={'person-circle'} size={45} color={'#757575'} />
                    <View>
                        <Text style={{ fontSize: 18 }}>Admin name</Text>
                        <Text style={{ fontSize: 12, opacity: 0.6 }}>admin role</Text>
                    </View>
                </View>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#dfdfdf', padding: 15, marginTop: 15, borderRadius: 8 }}>
                    <Ionicons name={'log-out'} color={'#F4320B'} size={20} />
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