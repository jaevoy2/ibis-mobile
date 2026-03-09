import { Dimensions, StyleSheet, Text, View } from "react-native";


const { height, width } = Dimensions.get('window');

export default function Login() {
    return (
        <View style={style.container}>
            <Text style={style.logo}>iBIS</Text>
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
        fontWeight: 600,
        letterSpacing: 1,
        fontSize: 20,
        paddingHorizontal: 20
    }
})