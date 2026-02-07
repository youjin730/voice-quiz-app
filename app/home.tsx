import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppHeader from "../components/AppHeader";

export default function Home() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 메인 홈 화면이므로 마이페이지 아이콘 노출 (기본값) */}
      <AppHeader />

      <ScrollView contentContainerStyle={styles.container}>
        {/* 메뉴 1: 목소리 사칭 방어훈련 (가장 강조된 메인 카드) */}
        <Pressable
          style={[styles.card, styles.mainCard]}
          onPress={() => router.push("/train-setup")}
        >
          <View style={styles.iconBoxMain}>
            <MaterialCommunityIcons
              name="shield-account"
              size={32}
              color="#fff"
            />
          </View>
          <View style={styles.cardTextBox}>
            <Text style={[styles.cardTitle, { color: "#fff" }]}>
              목소리 사칭 방어훈련
            </Text>
            <Text style={[styles.cardDesc, { color: "#E3F2FD" }]}>
              수사관/대출 사칭 유형별 실전 훈련
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#fff" />
        </Pressable>

        {/* 메뉴 2: 내 목소리 딥페이크 체험 */}
        <Pressable style={styles.card} onPress={() => router.push("/deepfake")}>
          <View style={[styles.iconBox, { backgroundColor: "#E3F2FD" }]}>
            <MaterialCommunityIcons
              name="microphone-outline"
              size={24}
              color="#1565C0"
            />
          </View>
          <View style={styles.cardTextBox}>
            <Text style={styles.cardTitle}>내 목소리 딥페이크 체험</Text>
            <Text style={styles.cardDesc}>AI가 복제한 내 목소리 들어보기</Text>
          </View>
        </Pressable>

        {/* 메뉴 3: 개인 피드백 리포트 */}
        <Pressable style={styles.card} onPress={() => router.push("/feedback")}>
          <View style={[styles.iconBox, { backgroundColor: "#F3E5F5" }]}>
            <MaterialCommunityIcons
              name="chart-bar"
              size={24}
              color="#7B1FA2"
            />
          </View>
          <View style={styles.cardTextBox}>
            <Text style={styles.cardTitle}>개인 피드백 리포트</Text>
            <Text style={styles.cardDesc}>나의 취약점 분석 및 행동 가이드</Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 50 },
  logoContainer: { alignItems: "center", marginVertical: 30 },
  logoTitle: {
    fontSize: 40,
    fontWeight: "900",
    color: "#0F1D3A",
    fontFamily: "serif", // 플랫폼에 따라 폰트 적용이 다를 수 있음
  },
  logoSubtitle: { fontSize: 14, color: "#666", marginTop: 5 },
  card: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  mainCard: {
    backgroundColor: "#0F1D3A",
    borderColor: "#0F1D3A",
    paddingVertical: 30,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconBoxMain: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardTextBox: { flex: 1 },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  cardDesc: { fontSize: 13, color: "#666" },
});
