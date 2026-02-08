import { router } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  title?: string;
  rightText?: string;
  rightIconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  onRightPress?: () => void;
  hideRightIcon?: boolean;
  // [추가됨] 뒤로가기 숨김 여부
  hideBack?: boolean;
};

export default function AppHeader({
  title = "청 음",
  rightText = "My",
  rightIconName,
  onRightPress,
  hideRightIcon = false,
  // 기본값 false (평소엔 보임)
  hideBack = false,
}: Props) {
  const handleRightPress = () => {
    if (hideRightIcon) return;

    if (onRightPress) {
      onRightPress();
    } else {
      if (rightText || rightIconName) {
        router.push("/mypage");
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        {/* ✅ [수정된 부분] 1. 뒤로가기 버튼 영역 */}
        {hideBack ? (
          // 1-A. 숨김 모드일 때: 타이틀 중앙 정렬을 위해 투명한 빈 공간 배치
          <View style={{ minWidth: 30 }} />
        ) : (
          // 1-B. 보임 모드일 때: 뒤로가기 버튼 표시
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            style={{ minWidth: 30 }}
          >
            {/* 아이콘으로 바꾸고 싶으면 여기 Text 대신 Icon을 넣으면 됩니다 */}
            <Text style={styles.back}>←</Text>
          </Pressable>
        )}

        {/* 2. 타이틀 */}
        <Text style={styles.title}>{title}</Text>

        {/* 3. 오른쪽 영역 */}
        {hideRightIcon ? (
          <View style={{ minWidth: 30 }} />
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
    minWidth: 30, // 좌우 대칭을 위해 너비를 맞춤
    alignItems: "flex-end",
  },

  right: { color: "#fff", fontSize: 14, fontWeight: "600" },
});
