import { router } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
} from "react-native";
import AppHeader from "../components/AppHeader";

const { width } = Dimensions.get("window");
const NAVY = "#0F1D3A";

type TabMode = "SHORT" | "LONG";

export default function FeedbackScreen() {
  const [activeTab, setActiveTab] = useState<TabMode>("SHORT");

  // MOCK DATA: 숏폼(퀴즈) 데이터 -> 3가지 지표 유지
  const shortData = {
    count: 24,
    accuracy: "58%",
    subStatLabel: "오답 유형",
    subStatValue: "대출 권유",
    oneLine:
      "확신이 없을 땐 '잘 모르겠음' 선택이 안전합니다. 대출 권유 유형에서 오답률이 높습니다.",
    weakPatterns: [
      "저금리 대출 문자에 링크 클릭 유도",
      "기존 대출 상환을 위한 선입금 요구",
    ],
    weakType: "LOAN", // 대출 사칭
  };

  // MOCK DATA: 롱폼(실전) 데이터 -> 방어 등급 제거 (2가지 지표만 사용)
  const longData = {
    count: 12,
    accuracy: "85점", // 롱폼은 점수
    // subStatLabel, subStatValue 제거됨
    oneLine:
      "기관 사칭 상황에서 당황하여 침묵하는 시간이 깁니다. 더 단호하게 끊는 연습이 필요합니다.",
    weakPatterns: [
      "검찰/경찰 사칭 시 목소리 떨림 감지",
      "압박 질문('공무집행방해')에 답변 못함",
    ],
    weakType: "INVESTIGATOR", // 기관 사칭
  };

  // 현재 탭에 따른 데이터 선택
  const currentData = activeTab === "SHORT" ? shortData : longData;

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader title="개인 피드백 리포트" />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 1. 탭 스위처 (Short vs Long) */}
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

        {/* 2. 메인 학습 리포트 카드 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>학습 리포트 (최근 7일)</Text>

          {/* 통계 박스 (Flex로 자동 조절) */}
          <View style={styles.statsRow}>
            {/* 1. 훈련 횟수 (공통) */}
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>훈련 횟수</Text>
              <Text style={styles.statValue}>{currentData.count}회</Text>
              <Text style={styles.statSub}>꾸준함 유지</Text>
            </View>

            {/* 2. 정답률 / 평균 점수 (공통) */}
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
                <Text style={styles.statLabel}>{shortData.subStatLabel}</Text>
                <Text
                  style={[styles.statValue, { fontSize: 18, marginTop: 4 }]}
                >
                  {shortData.subStatValue}
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

        {/* 3. 취약 패턴 분석 및 훈련 유도 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>취약 패턴 (개선 포인트)</Text>

          <View style={styles.patternList}>
            {currentData.weakPatterns.map((pattern, idx) => (
              <View key={idx} style={styles.patternItem}>
                <View style={styles.dot} />
                <Text style={styles.patternText}>{pattern}</Text>
              </View>
            ))}
          </View>

          {/* 하단 CTA 버튼 */}
          <Pressable
            style={styles.trainBtn}
            onPress={() => {
              // 해당 모드와 취약 유형을 가지고 훈련 설정으로 이동
              router.push("/train-setup");
            }}
          >
            <Text style={styles.trainBtnText}>이 유형으로 훈련하기</Text>
          </Pressable>
        </View>

        {/* 4. 필수 행동 가이드 */}
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
    flex: 1, // 아이템 개수에 따라 너비 자동 분배 (2개면 50%, 3개면 33%)
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
