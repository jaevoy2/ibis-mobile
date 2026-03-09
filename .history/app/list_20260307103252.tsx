import { Ionicons } from '@expo/vector-icons';
import { Dimensions, StyleSheet, Text, View } from 'react-native';


const { height, width } = Dimensions.get('window')

export default function Viewlist() {
    return (
        <View style={style.headContainer}>
            <Ionicons name={'arrow-back'} color={'#fff'} size={20} />
            <Text style={style.logo}>Resident List</Text>
        </View>
    )
}

const style = StyleSheet.create({
    headContainer: {
        backgroundColor: '#306060',
        height: 90,
        width,
        paddingTop: 50,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    logo: {
        color: '#fff',
        fontWeight: 800,
        letterSpacing: 2,
        fontSize: 20,
        paddingHorizontal: 20
    }
})