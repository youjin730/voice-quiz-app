import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 1. 로그인 전 화면들 */}
      <Stack.Screen name="index" /> {/* 랜딩 */}
      <Stack.Screen name="login" /> {/* 로그인 */}
      <Stack.Screen name="signup" /> {/* 회원가입 */}
      {/* 2. 홈 (로그인 후 메인) - 🚨 여기가 중요합니다! */}
      <Stack.Screen
        name="home"
        options={{
          // 🚫 왼쪽으로 밀어서 뒤로가기(스와이프) 금지
          gestureEnabled: false,
          // (선택) 화면 전환 효과를 '페이드'로 주면 뒤로가기가 아니라 새로 뜬 느낌을 줍니다.
          animation: "fade",
        }}
      />
      {/* 3. 나머지 기능 화면들 (여기선 뒤로가기 가능) */}
      <Stack.Screen name="play" />
      <Stack.Screen name="mypage" />
      <Stack.Screen name="setting" />
      <Stack.Screen name="train-setup" />
      <Stack.Screen name="deepfake" />
      <Stack.Screen name="feedback" />
    </Stack>
  );
}
