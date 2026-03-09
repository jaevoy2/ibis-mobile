import { Dimensions, StyleSheet, View } from "react-native";


const { height, width } = Dimensions.get('screen');

export default function Login() {
    return (
        <View style={style.container}>
            
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: '#306060',
        height,
        width
    }
})