import { router } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
// 1. 아이콘 라이브러리 임포트
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  title?: string;
  rightText?: string;
  // 2. 오른쪽 아이콘 이름 Prop 추가 (선택적)
  rightIconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  onRightPress?: () => void;
};

export default function AppHeader({
  title = "청 음",
  rightText = "My", // 기본값은 빈 문자열로 설정
  rightIconName, // 아이콘 이름 받기
  onRightPress,
}: Props) {
  const handleRightPress = () => {
    if (onRightPress) {
      onRightPress();
    } else {
      // 기본 동작이 필요하다면 여기에 작성 (예: router.push("/mypage"))
      // 현재는 아이콘/텍스트가 없으면 눌러도 아무 일도 안 일어나게 두는 게 안전합니다.
      if (rightText || rightIconName) {
        router.push("/mypage");
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.back}>←</Text>
        </Pressable>

        <Text style={styles.title}>{title}</Text>

        <Pressable style={styles.card} onPress={handleRightPress}>
          {/* 3. 조건부 렌더링: 아이콘 이름이 있으면 아이콘을, 없으면 텍스트를 표시 */}
          {rightIconName ? (
            <MaterialCommunityIcons
              name={rightIconName}
              size={24}
              color="#fff"
            />
          ) : (
            <Text style={styles.right}>{rightText}</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: "#0F1D3A" },
  header: {
    height: 56,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0F1D3A",
  },
  back: { color: "#fff", fontSize: 24, fontWeight: "700" },
  title: { color: "#fff", fontSize: 16, fontWeight: "700" },

  card: {
    padding: 4,
    justifyContent: "center",
    minWidth: 40,
    alignItems: "flex-end",
  },

  right: { color: "#fff", fontSize: 14, fontWeight: "600" },
});
