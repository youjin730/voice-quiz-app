import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import AppHeader from "../components/AppHeader";
// ✅ API 함수 불러오기 (경로가 다르면 수정해주세요)
import { getWeeklyReport } from "../api/feedback";

const NAVY = "#0F1D3A";

type TabMode = "SHORT" | "LONG";

export default function FeedbackScreen() {
  const [activeTab, setActiveTab] = useState<TabMode>("SHORT");
  const [isLoading, setIsLoading] = useState(true);

  // 서버에서 받아온 데이터를 저장할 상태
  const [reportData, setReportData] = useState<{
    SHORT: any;
    LONG: any;
  }>({
    SHORT: null,
    LONG: null,
  });

  // 1. 데이터 가져오기 (화면 진입 시 실행)
  useEffect(() => {
    fetchReports();
  }, []);

  // FeedbackScreen 컴포넌트 내부의 fetchReports 함수 수정

  const fetchReports = async () => {
    try {
      setIsLoading(true);

      // ❌ [임시 주석 처리] 백엔드 에러 때문에 API 잠시 끔
      /*
      const [shortRes, longRes] = (await Promise.all([
        getWeeklyReport("short"),
        getWeeklyReport("long"),
      ])) as [any, any];
      */

      // ✅ [임시 추가] 더미 데이터 (화면 확인용)
      console.log("⚠️ 백엔드 DB 에러로 인해 더미 데이터를 보여줍니다.");

      // 가짜 데이터 만들기
      const shortRes = {
        count: 12,
        accuracy: 85,
        weak_type_name: "지인 사칭형",
        one_line_feedback: "지인 사칭형 문제에 조금 더 주의가 필요해요!",
        weak_patterns: ["급한 돈 요구", "휴대폰 고장 핑계"],
        weak_type_code: "impersonation",
      };

      const longRes = {
        count: 5,
        average_score: 72,
        one_line_feedback: "실전 대화 훈련 점수가 상승하고 있습니다.",
        weak_patterns: ["검찰 사칭 대응", "개인정보 요구"],
        weak_type_code: "institution",
      };

      // 상태 업데이트
      setReportData({
        SHORT: {
          count: shortRes?.count || 0,
          accuracy: shortRes?.accuracy ? `${shortRes.accuracy}%` : "0%",
          subStatLabel: "오답 유형",
          subStatValue: shortRes?.weak_type_name || "분석 중",
          oneLine:
            shortRes?.one_line_feedback ||
            "아직 충분한 훈련 데이터가 없습니다.",
          weakPatterns: shortRes?.weak_patterns || [],
          weakType: shortRes?.weak_type_code || null,
        },
        LONG: {
          count: longRes?.count || 0,
          accuracy: longRes?.average_score
            ? `${longRes.average_score}점`
            : "0점",
          oneLine:
            longRes?.one_line_feedback ||
            "실전 훈련을 통해 방어력을 높여보세요.",
          weakPatterns: longRes?.weak_patterns || [],
          weakType: longRes?.weak_type_code || null,
        },
      });
    } catch (error) {
      console.error("리포트 로딩 실패:", error);
      Alert.alert("알림", "리포트를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 현재 탭에 따른 데이터 선택
  // 데이터가 로딩 전이라면 빈 객체({})를 줘서 에러 방지
  const currentData = reportData[activeTab] || {
    count: 0,
    accuracy: "-",
    oneLine: "로딩 중...",
    weakPatterns: [],
  };

  // 3. 로딩 화면
  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          styles.safe,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={NAVY} />
        <Text style={{ marginTop: 10, color: "#666" }}>데이터 분석 중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader title="개인 피드백 리포트" />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 탭 스위처 */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[
              styles.tabBtn,
              activeTab === "SHORT" && styles.tabBtnActive,
            ]}
            onPress={() => setActiveTab("SHORT")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "SHORT" && styles.tabTextActive,
              ]}
            >
              숏폼 (퀴즈)
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabBtn, activeTab === "LONG" && styles.tabBtnActive]}
            onPress={() => setActiveTab("LONG")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "LONG" && styles.tabTextActive,
              ]}
            >
              롱폼 (실전)
            </Text>
          </Pressable>
        </View>

        {/* 메인 학습 리포트 카드 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>학습 리포트 (최근 7일)</Text>

          {/* 통계 박스 */}
          <View style={styles.statsRow}>
            {/* 1. 훈련 횟수 */}
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>훈련 횟수</Text>
              <Text style={styles.statValue}>{currentData.count}회</Text>
              <Text style={styles.statSub}>꾸준함 유지</Text>
            </View>

            {/* 2. 정답률 / 평균 점수 */}
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>
                {activeTab === "SHORT" ? "정답률" : "평균 점수"}
              </Text>
              <Text style={styles.statValue}>{currentData.accuracy}</Text>
              <Text style={styles.statSub}>상위 30%</Text>
            </View>

            {/* 3. 오답 유형 (숏폼일 때만 표시) */}
            {activeTab === "SHORT" && (
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>{currentData.subStatLabel}</Text>
                <Text
                  style={[styles.statValue, { fontSize: 18, marginTop: 4 }]}
                >
                  {currentData.subStatValue}
                </Text>
                <Text style={styles.statSub}>집중 관리</Text>
              </View>
            )}
          </View>

          {/* 한 줄 피드백 */}
          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackTitle}>한 줄 피드백</Text>
            <Text style={styles.feedbackText}>{currentData.oneLine}</Text>
          </View>
        </View>

        {/* 취약 패턴 분석 및 훈련 유도 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>취약 패턴 (개선 포인트)</Text>

          {currentData.weakPatterns && currentData.weakPatterns.length > 0 ? (
            <View style={styles.patternList}>
              {currentData.weakPatterns.map((pattern: string, idx: number) => (
                <View key={idx} style={styles.patternItem}>
                  <View style={styles.dot} />
                  <Text style={styles.patternText}>{pattern}</Text>
                </View>
              ))}
            </View>
          ) : (
            // 취약 패턴이 없을 경우 안내
            <Text style={{ color: "#999", marginBottom: 20 }}>
              분석된 취약 패턴이 없습니다. 훈련을 진행해주세요.
            </Text>
          )}

          {/* 하단 CTA 버튼 */}
          <Pressable
            style={styles.trainBtn}
            onPress={() => {
              // API에서 받은 코드를 넘겨줌 (없으면 기본 숏폼)
              if (currentData.weakType) {
                router.push({
                  pathname: "/train-setup",
                  params: {
                    autoMode: activeTab,
                    targetType: currentData.weakType,
                  },
                });
              } else {
                router.push("/train-setup");
              }
            }}
          >
            <Text style={styles.trainBtnText}>이 유형으로 훈련하기</Text>
          </Pressable>
        </View>

        {/* 필수 행동 가이드 */}
        <View style={[styles.card, { marginBottom: 40 }]}>
          <Text style={[styles.cardTitle, { color: NAVY }]}>
            필수 행동 가이드
          </Text>
          <View style={styles.guideContainer}>
            <Text style={styles.guideText}>
              <Text style={{ fontWeight: "bold" }}>1. </Text>
              수사기관(검찰, 경찰)은 절대로{" "}
              <Text style={{ color: "#EF4444", fontWeight: "bold" }}>
                금전 이체
              </Text>
              나{" "}
              <Text style={{ color: "#EF4444", fontWeight: "bold" }}>
                현금 인출
              </Text>
              을 요구하지 않습니다.
            </Text>
            <View style={styles.divider} />
            <Text style={styles.guideText}>
              <Text style={{ fontWeight: "bold" }}>2. </Text>
              모르는 번호로 온 문자의{" "}
              <Text style={{ color: "#EF4444", fontWeight: "bold" }}>
                URL 링크
              </Text>
              는 절대 클릭하지 마세요.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6F7FB" },
  scroll: { padding: 20 },

  // 탭 스타일
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  tabTextActive: {
    color: NAVY,
    fontWeight: "bold",
  },

  // 카드 공통 스타일
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    // 그림자
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
    marginBottom: 16,
  },

  // 통계 박스 (Flex로 자동 조절)
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 12,
    alignItems: "flex-start",
    justifyContent: "space-between",
    minHeight: 100,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 6,
  },
  statValue: { fontSize: 22, fontWeight: "900", color: "#111" },
  statSub: { fontSize: 11, color: "#9CA3AF", marginTop: 4 },

  // 한 줄 피드백
  feedbackBox: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 16,
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111",
    marginBottom: 6,
  },
  feedbackText: { fontSize: 13, color: "#4B5563", lineHeight: 20 },

  // 취약 패턴 리스트
  patternList: { marginBottom: 20 },
  patternItem: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#111",
    marginRight: 10,
  },
  patternText: { fontSize: 15, color: "#374151", lineHeight: 22 },

  // 훈련하기 버튼
  trainBtn: {
    backgroundColor: NAVY,
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  trainBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },

  // 가이드 섹션
  guideContainer: { gap: 12 },
  guideText: { fontSize: 14, color: "#333", lineHeight: 22 },
  divider: { height: 1, backgroundColor: "#F3F4F6" },
});
