import { Ionicons } from "@expo/vector-icons";
import { Dimensions, StyleSheet, Text, View } from "react-native";


const { height, width } = Dimensions.get('window');

export default function Settings() {

    return (
        <>
            <View style={{ position: 'absolute', top: 100, paddingHorizontal: 20 }}>
                <Text style={style.title}>Settings</Text>
            </View>
            <View style={{ padding: 20, marginTop: 20, width }}>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '100%', backgroundColor: '#dfdfdf', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 15 }}>
                    <Ionicons name={'person-circle'} size={24} />
                    <View>
                        <Text style={{ fontSize: 18 }}>Admin name</Text>
                        <Text style={{ fontSize: 12, opacity: 0.7 }}>admin role</Text>
                    </View>
                </View>
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