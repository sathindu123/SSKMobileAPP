import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        
        <StatusBar 
          barStyle="dark-content" 
          translucent={false} 
          backgroundColor="#ffffff" 
        />

        <Stack screenOptions={{ headerShown: false }} />

      </SafeAreaView>
    </SafeAreaProvider>
  );
}