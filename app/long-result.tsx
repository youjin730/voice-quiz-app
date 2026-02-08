import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppHeader from "../components/AppHeader"; // 경로 주의 (app/play 안에 있다면 ../../)
// ✅ API 함수 import
import { getLongsResult } from "../api/training";

// 안드로이드 애니메이션 설정
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const NAVY = "#0F1D3A";

export default function LongResult() {
  const { sessionId } = useLocalSearchParams(); // URL 파라미터로 받은 세션 ID
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null); // 서버 데이터 저장
  const [isSolutionOpen, setIsSolutionOpen] = useState(false);
  const scoreAnim = useRef(new Animated.Value(0)).current;

  // 1. 데이터 가져오기
  useEffect(() => {
    fetchResult();
  }, []);

  const fetchResult = async () => {
    try {
      if (!sessionId) {
        // 테스트용 MOCK 데이터 (세션 ID 없이 들어왔을 때)
        setResult(MOCK_RESULT);
        animateScore(MOCK_RESULT.score);
        setLoading(false);
        return;
      }

      // ✅ 진짜 서버 데이터 요청
      // (API 주소가 명확하지 않으면 백엔드 개발자에게 문의 필요)
      // 여기서는 임시로 'finish' 응답을 재활용하거나 별도 조회 API 사용 가정
      const data: any = await getLongsResult(Number(sessionId));

      console.log("결과 데이터:", data);
      setResult(data);
      animateScore(data.score || 0);
    } catch (error) {
      console.error("결과 조회 실패:", error);
      Alert.alert("알림", "결과를 불러오지 못했습니다.");
      // 에러 나도 화면은 보여주기 위해 Mock 데이터 사용 가능
      setResult(MOCK_RESULT);
      animateScore(MOCK_RESULT.score);
    } finally {
      setLoading(false);
    }
  };

  const animateScore = (targetScore: number) => {
    Animated.timing(scoreAnim, {
      toValue: targetScore,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const toggleSolution = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSolutionOpen(!isSolutionOpen);
  };

  // 로딩 화면
  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.screen,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={NAVY} />
        <Text style={{ marginTop: 10, color: "#666" }}>결과 분석 중...</Text>
      </SafeAreaView>
    );
  }

  // 데이터가 없을 때 (방어 코드)
  if (!result) return null;

  return (
    <SafeAreaView style={styles.screen}>
      <AppHeader title="훈련 결과" />

      <ScrollView contentContainerStyle={styles.container}>
        {/* 1. 점수 섹션 */}
        <View style={styles.scoreSection}>
          <Text style={styles.scoreLabel}>훈련 성적표</Text>
          <View style={styles.scoreRow}>
            {/* Animated.Text가 없으므로 state나 ref값 직접 표시 */}
            {/* 복잡한 애니메이션 대신 그냥 텍스트로 표시하거나 Animated.createAnimatedComponent 사용 */}
            <Text style={styles.scoreBig}>{result.score || 0}</Text>
            <Text style={styles.scoreUnit}>점</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* 2. 상세 데이터 */}
        <Text style={styles.sectionTitle}>상세 분석 데이터</Text>

        <View style={styles.gridContainer}>
          {/* 위험 키워드 감지 */}
          <View style={[styles.gridItem, { width: "100%" }]}>
            <Text style={styles.gridLabel}>위험 키워드 감지</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={[
                  styles.gridValue,
                  {
                    color: (result.riskCount || 0) > 0 ? "#EF4444" : "#10B981",
                  },
                ]}
              >
                {result.riskCount || 0}회
              </Text>
              <Text style={{ fontSize: 14, color: "#666" }}>
                {(result.riskCount || 0) === 0 ? "(안전함)" : "(주의 필요)"}
              </Text>
            </View>
          </View>
        </View>

        {/* 3. 총평 & 피드백 */}
        <Text style={styles.sectionTitle}>총평 & AI 코칭</Text>

        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackLabel}>총평</Text>
          <Text style={styles.feedbackText}>
            {result.ai_summary ||
              result.totalComment ||
              "분석된 총평이 없습니다."}
          </Text>

          <View style={styles.separator} />

          {/* 잘한 점 */}
          <Text style={[styles.feedbackLabel, { color: "#10B981" }]}>
            ✅ 잘한 점
          </Text>
          {(result.good_points || result.goodPoints || []).map(
            (text: string, i: number) => (
              <Text key={i} style={styles.feedbackText}>
                • {text}
              </Text>
            ),
          )}
          {!result.good_points && !result.goodPoints && (
            <Text style={styles.feedbackText}>-</Text>
          )}

          {/* 보완할 점 */}
          {(result.improvement_points || result.badPoints || []).length > 0 && (
            <>
              <View style={styles.separator} />
              <Text style={[styles.feedbackLabel, { color: "#EF4444" }]}>
                ❌ 보완할 점
              </Text>
              {(result.improvement_points || result.badPoints || []).map(
                (text: string, i: number) => (
                  <Text key={i} style={styles.feedbackText}>
                    • {text}
                  </Text>
                ),
              )}
            </>
          )}
        </View>

        {/* 4. 전문가 솔루션 (서버 데이터 없으면 숨김) */}
        {result.ai_coaching && (
          <Pressable style={styles.solutionBox} onPress={toggleSolution}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.solutionTitle}>전문가의 솔루션 보기</Text>
              <MaterialCommunityIcons
                name={isSolutionOpen ? "chevron-up" : "chevron-down"}
                size={20}
                color="#666"
              />
            </View>
            {isSolutionOpen && (
              <View
                style={{
                  marginTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: "#eee",
                  paddingTop: 12,
                }}
              >
                <Text style={styles.solutionText}>{result.ai_coaching}</Text>
              </View>
            )}
          </Pressable>
        )}

        {/* 5. 버튼 */}
        <Pressable
          onPress={() => router.replace("/train-setup")}
          style={styles.btn}
        >
          <Text style={styles.btnText}>다시 훈련하기</Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/home")}
          style={styles.btnGhost}
        >
          <Text style={styles.btnGhostText}>홈으로</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

// 기본값 (에러 시 보여줄 데이터)
const MOCK_RESULT = {
  score: 85,
  riskCount: 1,
  totalComment:
    "대체로 잘 대처하셨으나, 당황해서 답변이 늦어진 구간이 있습니다.",
  goodPoints: ["상대의 협박을 무시하고 도발한 점"],
  badPoints: ["초반에 당황하여 침묵한 점"],
  ai_coaching:
    "진짜 검사는 절대 전화로 체포한다고 협박하지 않습니다. 무조건 끊으세요.",
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 24, paddingBottom: 40 },

  // 점수 섹션
  scoreSection: { alignItems: "center", marginBottom: 24 },
  scoreLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  scoreRow: { flexDirection: "row", alignItems: "baseline" },
  scoreBig: { fontSize: 64, fontWeight: "900", color: NAVY, lineHeight: 70 },
  scoreUnit: {
    fontSize: 24,
    fontWeight: "600",
    color: "#9CA3AF",
    marginLeft: 4,
  },

  divider: { height: 1, backgroundColor: "#F3F4F6", marginBottom: 24 },

  // 섹션 타이틀
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },

  // 그리드
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 32,
  },
  gridItem: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 16,
    justifyContent: "center",
  },
  gridLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 6,
  },
  gridValue: { fontSize: 18, fontWeight: "800" },

  // 피드백 카드
  feedbackCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  feedbackText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
    fontWeight: "500",
    marginBottom: 4,
  },
  separator: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 12 },

  // 전문가 솔루션 박스
  solutionBox: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  solutionTitle: { fontSize: 14, fontWeight: "bold", color: "#333" },
  solutionText: { fontSize: 14, color: "#4B5563", lineHeight: 22 },

  // 버튼
  btn: {
    marginTop: 10,
    height: 56,
    borderRadius: 16,
    backgroundColor: NAVY,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "900" },

  btnGhost: {
    marginTop: 12,
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
