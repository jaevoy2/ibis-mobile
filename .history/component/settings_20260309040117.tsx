import { Dimensions, StyleSheet, Text, View } from "react-native";


const { height, width } = Dimensions.get('window');

export default function Settings() {

    return (
        <View style={{ backgroundColor: '#000' }}>
            <Text style={style.title}>Settings</Text>
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