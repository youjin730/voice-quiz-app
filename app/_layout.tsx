import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 랜딩 */}
      <Stack.Screen name="index" />
      {/* 홈 */}
      <Stack.Screen name="home" />
      {/* 플레이 */}
      <Stack.Screen name="play" />
    </Stack>
  );
}
