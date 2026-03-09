import { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";


const { height, width } = Dimensions.get('window');

export default function Login() {
    const [passVissible, setpassVissible] = useState(false)

    return (
        <View>
            <View style={style.headContainer}>
                <Text style={style.logo}>iBIS</Text>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    headContainer: {
        backgroundColor: '#306060',
        height: 90,
        width,
        paddingTop: 50
    },
    logo: {
        color: '#fff',
        fontWeight: 800,
        letterSpacing: 2,
        fontSize: 20,
        paddingHorizontal: 20
    },
})