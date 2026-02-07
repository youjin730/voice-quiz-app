import { router } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  title?: string;
  rightText?: string;
  rightIconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  onRightPress?: () => void;
  // [추가됨] 오른쪽 메뉴 숨김 여부 (true면 숨김)
  hideRightIcon?: boolean;
};

export default function AppHeader({
  title = "청 음",
  rightText = "My",
  rightIconName,
  onRightPress,
  // 기본값은 false (보이게 설정)
  hideRightIcon = false,
}: Props) {
  const handleRightPress = () => {
    // 숨김 처리되었으면 클릭 막기
    if (hideRightIcon) return;

    if (onRightPress) {
      onRightPress();
    } else {
      if (rightText || rightIconName) {
        router.push("/mypage"); // 마이페이지 경로는 프로젝트에 맞게 수정
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        {/* 1. 뒤로가기 버튼 */}
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.back}>←</Text>
        </Pressable>

        {/* 2. 타이틀 */}
        <Text style={styles.title}>{title}</Text>

        {/* 3. 오른쪽 영역 (숨김 옵션 적용) */}
        {hideRightIcon ? (
          // 숨길 때는 타이틀 중앙 정렬을 맞추기 위해 투명한 빈 공간만 둠
          <View style={{ minWidth: 20 }} />
        ) : (
          <Pressable style={styles.card} onPress={handleRightPress}>
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
        )}
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
    minWidth: 20,
    alignItems: "flex-end",
  },

  right: { color: "#fff", fontSize: 14, fontWeight: "600" },
});
