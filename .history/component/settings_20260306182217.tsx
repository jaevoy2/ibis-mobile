import { Dimensions, StyleSheet, View } from "react-native";


const { height, width } = Dimensions.get('window');

export default function Settings() {

    return (
        <View />
    )
}


const style = StyleSheet.create({
    headContainer: {
        backgroundColor: '#306060',
        height: 90,
        width,
        paddingTop: 50,
        marginBottom: 20
    },
    logo: {
        color: '#fff',
        fontWeight: 800,
        letterSpacing: 2,
        fontSize: 20,
        paddingHorizontal: 20
    }
})