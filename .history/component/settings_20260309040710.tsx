import { Ionicons } from "@expo/vector-icons";
import { Dimensions, StyleSheet, Text, View } from "react-native";


const { height, width } = Dimensions.get('window');

export default function Settings() {

    return (
        <View style={{ position: 'absolute', top: 100, paddingHorizontal: 20 }}>
            <Text style={style.title}>Settings</Text>
            <View style={{ paddingVertical: 20 }}>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: '#f3f3f3', borderRadius: 8, padding: 10 }}>
                    <Ionicons name={'person-circle'} size={24} />
                    <View>
                        <Text>Admin name</Text>
                        <Text>admin role</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}


const style = StyleSheet.create({
    title: {
        color: '#306060',
        fontWeight: '600',
        fontSize: 20,
    }
})