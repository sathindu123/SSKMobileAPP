import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Auth පිටුවල header එක සාමාන්‍යයෙන් පෙන්වන්නේ නැත
      }}
    />
  );
}