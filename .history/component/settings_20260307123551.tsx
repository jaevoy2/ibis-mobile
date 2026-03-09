import { Dimensions, StyleSheet, Text, View } from "react-native";


const { height, width } = Dimensions.get('window');

export default function Settings() {

    return (
        <View style={style.headContainer}>
            <Text style={style.title}>Settings</Text>
        </View>
    )
}


const style = StyleSheet.create({
    headContainer: {
        backgroundColor: '#306060',
        height: 100,
        width,
        paddingTop: 40,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 20,
    }
})