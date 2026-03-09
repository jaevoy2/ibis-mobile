import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';


const { height, width } = Dimensions.get('window')

export default function Viewlist() {
    return (
        <View style={style.headContainer}>
            <Pressable onPress={() => router.back()}>
                <Ionicons name={'arrow-back'} color={'#fff'} size={25} />
            </Pressable>
            <Text style={style.title}>Resident List</Text>
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    title: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 20,
    }
})