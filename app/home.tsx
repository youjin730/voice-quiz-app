import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AppHeader from "../components/AppHeader";

export default function Home() {
  return (
    <View style={{ flex: 1 }}>
      <AppHeader />

      <View style={styles.container}>
        <Pressable
          style={styles.card}
          onPress={() => router.push("/train-setup")}
        >
          <Text style={styles.cardText}>목소리 사칭 방어훈련 </Text>
        </Pressable>
        <Pressable style={styles.card}>
          <Text style={styles.cardText}>내 목소리 딥페이크 체험</Text>
        </Pressable>
        <Pressable style={styles.card}>
          <Text style={styles.cardText}>개인 피드백</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#eee",
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  cardText: { fontSize: 15, fontWeight: "600" },
});
