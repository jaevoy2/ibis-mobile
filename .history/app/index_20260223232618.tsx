import { Dimensions, StyleSheet, Text, View } from "react-native";


const { height, width } = Dimensions.get('window');

export default function Login() {
    return (
        <View style={style.container}>
            <Text style={style.logo}>iBIS</Text>
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 22, color: '#fff', fontWeight: 700 }}>Welcome back,</Text>
                <Text style={{ fontSize: 12, color: '#fff' }}>Sign in to continue</Text>
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
    }
})