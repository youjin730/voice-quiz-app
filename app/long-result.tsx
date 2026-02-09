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
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppHeader from "../components/AppHeader";
import { getLongsResult } from "../api/training";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const NAVY = "#0F1D3A";
const GREEN = "#10B981";
const RED = "#EF4444";

export default function LongResult() {
  const { sessionId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [isSolutionOpen, setIsSolutionOpen] = useState(true);
  const scoreAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (sessionId) {
      fetchResult();
    } else {
      Alert.alert("오류", "세션 정보가 없습니다.", [
        { text: "확인", onPress: () => router.replace("/home") },
      ]);
    }
  }, [sessionId]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      // ✅ 100% 서버 API 호출
      const response = await getLongsResult(Number(sessionId));

      // API 명세서 구조에 따른 데이터 추출
      const data = response.data?.data || response.data;

      if (data) {
        setResult(data);
        animateScore(data.score || 0);
      } else {
        throw new Error("결과 데이터가 비어있습니다.");
      }
    } catch (error: any) {
      console.error("결과 조회 실패:", error);
      Alert.alert("분석 실패", "서버에서 결과 데이터를 가져오지 못했습니다.", [
        { text: "홈으로", onPress: () => router.replace("/home") },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const animateScore = (targetScore: number) => {
    Animated.timing(scoreAnim, {
      toValue: targetScore,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  };

  const toggleSolution = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSolutionOpen(!isSolutionOpen);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color={NAVY} />
        <Text style={styles.loadingText}>
          AI가 훈련 결과를 분석 중입니다...
        </Text>
      </SafeAreaView>
    );
  }

  // 결과 데이터가 없을 경우 아무것도 렌더링하지 않음 (방어 로직)
  if (!result) return null;

  return (
    <SafeAreaView style={styles.screen}>
      <AppHeader title="훈련 결과 분석" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.scoreSection}>
          <Text style={styles.scoreLabel}>보이스피싱 방어 지수</Text>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreBig}>{result.score ?? 0}</Text>
            <Text style={styles.scoreUnit}>점</Text>
          </View>
          {result.ended_at && (
            <Text style={styles.resultDate}>
              훈련 종료: {new Date(result.ended_at).toLocaleString()}
            </Text>
          )}
        </View>

        {/* AI 총평 섹션 */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="robot" size={20} color={NAVY} />
            <Text style={styles.cardTitle}>AI 종합 평가</Text>
          </View>
          <Text style={styles.summaryText}>
            {result.ai_summary || "분석된 총평이 없습니다."}
          </Text>
        </View>

        {/* 잘한 점 / 보완할 점 섹션 */}
        <View style={styles.analysisRow}>
          <View style={[styles.analysisBox, { borderLeftColor: GREEN }]}>
            <Text style={[styles.analysisLabel, { color: GREEN }]}>
              ✅ 잘한 점
            </Text>
            {result.good_points && result.good_points.length > 0 ? (
              result.good_points.map((p: string, i: number) => (
                <Text key={i} style={styles.pointText}>
                  • {p}
                </Text>
              ))
            ) : (
              <Text style={styles.pointText}>데이터 없음</Text>
            )}
          </View>

          <View style={[styles.analysisBox, { borderLeftColor: RED }]}>
            <Text style={[styles.analysisLabel, { color: RED }]}>
              ❌ 보완할 점
            </Text>
            {result.improvement_points &&
            result.improvement_points.length > 0 ? (
              result.improvement_points.map((p: string, i: number) => (
                <Text key={i} style={styles.pointText}>
                  • {p}
                </Text>
              ))
            ) : (
              <Text style={styles.pointText}>데이터 없음</Text>
            )}
          </View>
        </View>

        {/* AI 코칭 섹션 */}
        <Pressable style={styles.coachingCard} onPress={toggleSolution}>
          <View style={styles.coachingHeader}>
            <Text style={styles.coachingTitle}>💡 전문가 대응 가이드</Text>
            <MaterialCommunityIcons
              name={isSolutionOpen ? "chevron-up" : "chevron-down"}
              size={24}
              color="#666"
            />
          </View>
          {isSolutionOpen && (
            <Text style={styles.coachingText}>
              {result.ai_coaching || "제공된 대응 팁이 없습니다."}
            </Text>
          )}
        </Pressable>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            onPress={() => router.replace("/train-setup")}
            style={styles.primaryBtn}
          >
            <Text style={styles.primaryBtnText}>한 번 더 훈련하기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.replace("/home")}
            style={styles.secondaryBtn}
          >
            <Text style={styles.secondaryBtnText}>홈으로 돌아가기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8F9FA" },
  center: { justifyContent: "center", alignItems: "center" },
  container: { padding: 20 },
  loadingText: { marginTop: 15, color: "#666", fontSize: 16 },
  scoreSection: { alignItems: "center", marginVertical: 30 },
  scoreLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
    marginBottom: 15,
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 6,
    borderColor: NAVY,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  scoreBig: { fontSize: 44, fontWeight: "900", color: NAVY },
  scoreUnit: { fontSize: 16, color: "#999", fontWeight: "600" },
  resultDate: { marginTop: 15, fontSize: 12, color: "#AAA" },
  sectionCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 1,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: "700", marginLeft: 8, color: NAVY },
  summaryText: { fontSize: 15, color: "#444", lineHeight: 24 },
  analysisRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  analysisBox: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 5,
  },
  analysisLabel: { fontSize: 14, fontWeight: "bold", marginBottom: 8 },
  pointText: { fontSize: 13, color: "#555", marginBottom: 4, lineHeight: 18 },
  coachingCard: {
    backgroundColor: "#E7F0FF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
  },
  coachingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coachingTitle: { fontSize: 16, fontWeight: "700", color: "#1565C0" },
  coachingText: {
    marginTop: 15,
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: 15,
  },
  buttonGroup: { gap: 12 },
  primaryBtn: {
    height: 56,
    backgroundColor: NAVY,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontSize: 17, fontWeight: "bold" },
  secondaryBtn: {
    height: 56,
    backgroundColor: "#fff",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  secondaryBtnText: { color: "#333", fontSize: 16, fontWeight: "600" },
});
