import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const { height, width } = Dimensions.get('window');

export default function Navigation() {
    const pathname = usePathname();


    return (
        <View style={{ position: 'absolute', bottom: 0 }}>
            <Pressable onPress={() => router.push('/form')} style={style.floatBtn}>
                <Ionicons name={'person-add'} color={'#fff'} size={30} />
            </Pressable>

            <View style={{ position: 'absolute', bottom: 50, alignSelf: 'center', width: 80, height: 80, borderRadius: 40, backgroundColor: '#f5f5f5', zIndex: 5 }} />
            <View style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 8, position: 'absolute', bottom: 0, flexDirection: 'row', justifyContent: 'space-between',
                    paddingHorizontal: 20, alignItems: 'center', width, backgroundColor: '#fff', height: 80 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 20, flexDirection: 'column', alignItems: 'center' }}>
                    <MaterialCommunityIcons name={'view-dashboard'} size={25} color={ pathname == '/index' ? '#306060' : '#000' } />
                    <Text style={{ color: pathname == '/index' ? '#306060' : '#000', fontSize: 13 }}>Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 20, flexDirection: 'column', alignItems: 'center' }}>
                    <Ionicons name={'settings-outline'} color={ pathname == '/settings' ? '#306060' : '#000' } size={25} />
                    <Text style={{ color: pathname == '/settings' ? '#306060' : '#000', fontSize: 13 }}>Settings</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
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