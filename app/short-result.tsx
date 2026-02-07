import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppHeader from "../components/AppHeader";

export default function Result() {
  const { total, correct } = useLocalSearchParams<{
    total?: string;
    correct?: string;
  }>();

  // ✅ 숫자 파싱 (없으면 0 처리)
  const totalNum = Math.max(0, parseInt(total ?? "0", 10) || 0);
  const correctNum = Math.max(0, parseInt(correct ?? "0", 10) || 0);

  const safeTotal = totalNum === 0 ? 1 : totalNum; // 0 나눗셈 방지
  const percent = Math.round((correctNum / safeTotal) * 100);

  return (
    <SafeAreaView style={styles.screen}>
      <AppHeader title="채점 및 결과" />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreBig}>
            {correctNum}/{totalNum}
          </Text>
          <Text style={styles.scoreSub}>
            정답률 {totalNum === 0 ? 0 : percent}%
          </Text>
        </View>

        <Text style={styles.sectionTitle}>AI 맞춤 피드백</Text>
        <Text style={styles.sectionDesc}>
          현재는 점수만 전달받아 요약만 보여줘요. (오답별 피드백은 추후 data
          payload 연결 시 표시 가능)
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>요약</Text>
          <Text style={styles.cardBody}>
            • 급하게 행동을 요구하거나, 송금/개인정보 요청이 있으면 위험
            신호예요.{"\n"}• “기관/수사관 사칭”, “대출/수수료”, “가족 긴급상황”
            키워드에 특히 주의하세요.{"\n"}• 확신이 없으면 “잘 모르겠음” 선택 후
            끊고 확인하는 습관이 안전합니다.
          </Text>
        </View>

        <Pressable
          onPress={() => router.replace("/short-result")}
          style={styles.btn}
        >
          <Text style={styles.btnText}>다시 훈련하기</Text>
        </Pressable>

        <Pressable onPress={() => router.replace("/")} style={styles.btnGhost}>
          <Text style={styles.btnGhostText}>홈으로</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const NAVY = "#0F1D3A";

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 18, paddingBottom: 28 },

  scoreCard: {
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    padding: 18,
    alignItems: "center",
  },
  scoreBig: { fontSize: 40, fontWeight: "900", color: "#111827" },
  scoreSub: { marginTop: 6, fontSize: 14, fontWeight: "900", color: "#374151" },

  sectionTitle: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
  },
  sectionDesc: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    lineHeight: 18,
  },

  card: {
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
  },
  cardTitle: { fontSize: 14, fontWeight: "900", color: "#111827" },
  cardBody: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "700",
    color: "#4B5563",
    lineHeight: 19,
  },

  btn: {
    marginTop: 16,
    height: 56,
    borderRadius: 16,
    backgroundColor: NAVY,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "900" },

  btnGhost: {
    marginTop: 10,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  btnGhostText: { color: "#111827", fontSize: 16, fontWeight: "900" },
});
