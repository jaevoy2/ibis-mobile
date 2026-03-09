import { Ionicons } from "@expo/vector-icons";
import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native";


const { height, width } = Dimensions.get('window');

export default function Login() {
    return (
        <View style={style.container}>
            <Text style={style.logo}>iBIS</Text>
            <View style={{ paddingHorizontal: 20, paddingVertical: 30, gap: 10 }}>
                <Text style={{ fontSize: 26, color: '#fff', fontWeight: 500 }}>Welcome back,</Text>
                <Text style={{ fontSize: 12, color: '#fff' }}>Sign in to continue</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: '#fff', gap: 45, borderTopRightRadius: 20, borderTopLeftRadius: 20, paddingHorizontal: 25, paddingTop: 50 }}>
                <View>
                    <Text style={{ fontSize: 16 }}>Email</Text>
                    <TextInput style={style.textInput} />
                </View>
                <View>
                    <Text style={{ fontSize: 16 }}>Password</Text>
                    <View style={[style.textInput, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                        <TextInput />
                        <Ionicons name={'lock-closed'} color={'#EB9D0C'} size={20} />
                    </View>
                </View>
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
    }
})