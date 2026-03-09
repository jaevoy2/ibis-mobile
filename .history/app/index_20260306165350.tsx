import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Login } from "./api/login";


const { height, width } = Dimensions.get('window');

export default function Index() {
    const [passVissible, setpassVissible] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checktoken = async () => {
            const token = await AsyncStorage.getItem('token');

            if(token) {
                router.replace('/dashboard');
            }
        }

        checktoken();
    }, []);

    const handleLogin = async () => {
        setLoading(true);

        if(!email.trim() || !password.trim()) {
            Alert.alert('Invalid', 'Email and password are required.')
            setLoading(false)
            return;
        }

        try {
            const response = await Login(email, password);

            if(!response.error) {
                await AsyncStorage.setItem('token', response.token);
                await AsyncStorage.setItem('user_name', response.user.name);
                await AsyncStorage.setItem('user_id', response.user.id);

                router.replace('/dashboard')
            }
        }catch(error: any) {
            console.log(error.message);
        }
    }
    

    return (
        <View style={style.container}>
            <Text style={style.logo}>iBIS</Text>
            <View style={{ paddingHorizontal: 20, paddingVertical: 30, gap: 10 }}>
                <Text style={{ fontSize: 26, color: '#fff', fontWeight: 500 }}>Welcome back,</Text>
                <Text style={{ fontSize: 12, color: '#fff' }}>Sign in to continue</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: '#fff', gap: 45, borderTopRightRadius: 20, borderTopLeftRadius: 20, paddingHorizontal: 25, paddingTop: 50 }}>
                <View>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Email</Text>
                    <TextInput onChangeText={(text) => setEmail(text)} style={style.textInput} />
                </View>
                <View>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Password</Text>
                    <View style={[style.textInput, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                        <TextInput style={{ width: '80%' }} onChangeText={(text) => setPassword(text)} />
                        <Pressable onPress={() => setpassVissible(!passVissible)}>
                            <Ionicons name={passVissible == true ? 'eye-outline' : 'eye-off-outline'} color={'#EB9D0C'} size={25} />
                        </Pressable>
                    </View>
                </View>
                <Pressable onPress={() => handleLogin()} style={style.btn}>
                    {loading == true ? (
                        <ActivityIndicator size={'small'} color={'#fff'} style={{ alignSelf: 'center' }} />
                    ) : (
                        <Text style={{ fontSize: 16, color: '#fff', fontWeight: '600', textAlign: 'center' }}>SIGN IN</Text>
                    )}
                </Pressable>
                <Text style={style.dev}>
                    @CreativeDevLabs
                </Text>
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
        letterSpacing: 2,
        fontSize: 20,
        paddingHorizontal: 20
    },
    textInput: {
        borderBottomColor: '#dcdcdc',
        borderBottomWidth: 1,
        width: '100%',
    },
    btn: {
        backgroundColor: '#306060',
        paddingVertical: 15,
        alignSelf: 'center',
        width: '100%',
        borderRadius: 8
    },
    dev: {
        color: '#bfbfbf',
        fontSize: 12,
        marginTop: 50,
        textAlign: 'center'
    }
})