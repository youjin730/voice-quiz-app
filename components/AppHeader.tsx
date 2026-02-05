import { router } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

type Props = {
  title?: string;
  rightText?: string;
  onRightPress?: () => void;
};

export default function AppHeader({
  title = "app name",
  rightText = "마이페이지",
  onRightPress,
}: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.back}>←</Text>
        </Pressable>

        <Text style={styles.title}>{title}</Text>

        <Pressable style={styles.card} onPress={() => router.push("/mypage")}>
          <Text style={styles.right}>{rightText}</Text>
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
  back: { color: "#fff", fontSize: 20, fontWeight: "700" },
  title: { color: "#fff", fontSize: 16, fontWeight: "700" },
  right: { color: "#fff", fontSize: 12, fontWeight: "600" },
});
