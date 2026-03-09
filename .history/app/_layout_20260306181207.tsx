import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle={'light-content'} backgroundColor={'transparent'} translucent />

      <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="navigation" options={{ headerShown: false }} />
          <Stack.Screen name="form" options={{ headerShown: false }} />
      </Stack>
    </>
  )
}