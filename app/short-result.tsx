import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import AppHeader from "../components/AppHeader"; // 경로 확인 필요 (app/play 안에 있다면 ../../)
// ✅ API 함수 import
import { getShortsSessionResult } from "../api/training";

export default function Result() {
  const params = useLocalSearchParams();

  // 파라미터 파싱
  const sessionId = params.sessionId ? Number(params.sessionId) : null;
  const initialTotal = params.total ? Number(params.total) : 5;
  const initialCorrect = params.correct ? Number(params.correct) : 0;

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>({
    total: initialTotal,
    correct: initialCorrect,
    ai_feedback: null,
  });

  // 1. 결과 데이터 가져오기
  useEffect(() => {
    if (sessionId) {
      fetchResult();
    } else {
      // 세션 ID 없이 들어온 경우 (단순 확인용)
      setLoading(false);
    }
  }, [sessionId]);

  const fetchResult = async () => {
    try {
      // ✅ 서버에서 상세 결과(AI 피드백 포함) 조회
      // 만약 조회 API가 없다면 finishShortsSession의 응답을 그대로 params로 넘겨받아도 됨
      const data: any = await getShortsSessionResult(sessionId!);

      console.log("숏폼 결과 데이터:", data);

      setResult({
        total: data.total_questions || initialTotal,
        correct: data.correct_count ?? initialCorrect,
        ai_feedback: data.ai_feedback || data.feedback || null, // 필드명 확인 필요
      });
    } catch (error) {
      console.error("결과 조회 실패:", error);
      // 실패해도 파라미터로 받은 점수는 보여줌
    } finally {
      setLoading(false);
    }
  };

  // 점수 계산
  const totalNum = result.total;
  const correctNum = result.correct;
  const safeTotal = totalNum === 0 ? 1 : totalNum;
  const percent = Math.round((correctNum / safeTotal) * 100);

  // 버튼 액션
  const handleRetry = () => {
    // 훈련 설정 화면으로 이동 (또는 바로 다시 시작)
    router.replace("/train-setup");
  };

  const handleHome = () => {
    router.replace("/home");
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.screen,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#0F1D3A" />
        <Text style={{ marginTop: 10, color: "#666" }}>결과 분석 중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <AppHeader title="채점 및 결과" />

      <ScrollView contentContainerStyle={styles.container}>
        {/* 점수 카드 */}
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
          훈련 데이터를 분석하여 AI가 제공하는 요약 리포트입니다.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>훈련 요약</Text>
          <Text style={styles.cardBody}>
            {result.ai_feedback
              ? result.ai_feedback
              : "아직 충분한 분석 데이터가 없습니다.\n꾸준히 훈련하면 더 정교한 피드백을 받을 수 있습니다."}
          </Text>
        </View>

        {/* 팁 박스 (고정) */}
        <View
          style={[
            styles.card,
            {
              marginTop: 16,
              backgroundColor: "#F9FAFB",
              borderColor: "transparent",
            },
          ]}
        >
          <Text style={styles.cardTitle}>💡 안전 가이드</Text>
          <Text style={styles.cardBody}>
            • 급하게 행동을 요구하거나, 송금/개인정보 요청이 있으면 위험
            신호예요.{"\n"}• 확신이 없으면 “잘 모르겠음” 선택 후 끊고 확인하는
            습관이 안전합니다.
          </Text>
        </View>

        {/* 하단 버튼 */}
        <Pressable onPress={handleRetry} style={styles.btn}>
          <Text style={styles.btnText}>다시 훈련하기</Text>
        </Pressable>

        <Pressable onPress={handleHome} style={styles.btnGhost}>
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
    marginTop: 24,
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
    padding: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4B5563",
    lineHeight: 22,
  },

  btn: {
    marginTop: 30,
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
