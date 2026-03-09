import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, TextInput, View } from "react-native";


const { height, width } = Dimensions.get('window');

export default function Login() {
    const [passVissible, setpassVissible] = useState(false)

    return (
        <View style={style.container}>
            <Text style={style.logo}>iBIS</Text>
            <View style={{ paddingHorizontal: 20, paddingVertical: 30, gap: 10 }}>
                <Text style={{ fontSize: 26, color: '#fff', fontWeight: 500 }}>Welcome back,</Text>
                <Text style={{ fontSize: 12, color: '#fff' }}>Sign in to continue</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: '#fff', gap: 45, borderTopRightRadius: 20, borderTopLeftRadius: 20, paddingHorizontal: 25, paddingTop: 50 }}>
                <View>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Email</Text>
                    <TextInput style={style.textInput} />
                </View>
                <View>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Password</Text>
                    <View style={[style.textInput, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                        <TextInput />
                        <Pressable onPress={() => setpassVissible(!passVissible)}>
                            <Ionicons name={passVissible == true ? 'lock-open' : 'lock-closed'} color={'#EB9D0C'} size={25} />
                        </Pressable>
                    </View>
                </View>
                <Pressable style={style.btn}>
                    <Text style={{ fontSize: 16, color: '#fff', fontWeight: '600', textAlign: 'center' }}>SIGN IN</Text>
                </Pressable>
                <Text style={style.dev}>
                    @CreativeDevLabs
                </Text>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: '#306060',
        height,
        width,
        paddingTop: 50
    },
    logo: {
        color: '#fff',
        fontWeight: 800,
        letterSpacing: 1,
        fontSize: 20,
        paddingHorizontal: 20
    },
    textInput: {
        borderBottomColor: '#dcdcdc',
        borderBottomWidth: 1,
        width: '100%',
    },
    btn: {
        backgroundColor: '#306060',
        paddingVertical: 15,
        alignSelf: 'center',
        width: '100%',
        borderRadius: 8
    },
    dev: {
        color: '#bfbfbf',
        fontSize: 12,
        position: 'absolute',
        bottom: 80,
        left: '50%',
        transform: [{ translateX: '-50%' }],
        width: '100%'
    }
})