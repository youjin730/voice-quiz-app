import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppHeader from "../components/AppHeader";

// 가상의 분석 데이터 (백엔드에서 받아올 데이터 구조)
const MOCK_REPORT = {
  userName: "분홍샌들의겸손한치타",
  totalScore: 65, // 종합 점수
  tier: "주의", // 등급: 안전 / 주의 / 위험

  // 유형별 방어력 (100점 만점)
  stats: {
    investigator: 40, // 수사관 사칭 (취약)
    loan: 85, // 대출 빙자
    family: 90, // 가족 사칭
  },

  // 가장 취약한 부분 (분석 로직에 의해 결정됨)
  weaknessType: "INVESTIGATOR" as "INVESTIGATOR" | "LOAN" | "FAMILY",
};

export default function FeedbackScreen() {
  const router = useRouter();

  // 취약 유형별 맞춤 피드백 데이터
  const feedbackContent = {
    INVESTIGATOR: {
      title: "수사기관 사칭에 특히 약하시네요!",
      desc: "검찰이나 경찰을 사칭하며 '계좌가 범죄에 연루되었다'고 압박할 때 당황하는 경향이 있습니다.",
      guideTitle: "수사기관 사칭 방어 수칙",
      guideRules: [
        "수사기관은 절대 전화로 돈을 요구하지 않습니다.",
        "앱 설치나 링크 클릭을 유도하면 무조건 끊으세요.",
        "소환장은 등기 우편으로만 발송됩니다.",
      ],
    },
    LOAN: {
      title: "저금리 대출 유혹을 조심하세요!",
      desc: "기존 대출을 갚으면 저금리로 바꿔준다는 말에 흔들리는 경향이 보입니다.",
      guideTitle: "대출 사기 방어 수칙",
      guideRules: [
        "금융사는 '선입금'이나 '상환 자금'을 개인 계좌로 요구하지 않습니다.",
        "신용등급 상향비, 보증비 명목의 입금은 100% 사기입니다.",
        "반드시 해당 금융사 대표번호로 직접 확인하세요.",
      ],
    },
    FAMILY: {
      title: "가족의 다급한 목소리에 속지 마세요!",
      desc: "가족이 납치되거나 다쳤다는 말에 이성적인 판단을 놓치는 경우가 있습니다.",
      guideTitle: "지인 사칭 방어 수칙",
      guideRules: [
        "돈을 요구하면 일단 전화를 끊고 당사자에게 다시 거세요.",
        "목소리가 똑같아도 딥페이크일 수 있습니다.",
        "둘만의 암호를 미리 정해두는 것이 좋습니다.",
      ],
    },
  };

  // 현재 사용자의 취약점에 맞는 콘텐츠 가져오기
  const currentFeedback = feedbackContent[MOCK_REPORT.weaknessType];

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <AppHeader title="개인 피드백 리포트" />

      <ScrollView contentContainerStyle={styles.container}>
        {/* 1. 종합 점수 카드 */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreTitle}>
              {MOCK_REPORT.userName}님의 방어력
            </Text>
            <View style={[styles.tierBadge, { backgroundColor: "#FF9800" }]}>
              <Text style={styles.tierText}>{MOCK_REPORT.tier} 단계</Text>
            </View>
          </View>

          <Text style={styles.totalScore}>{MOCK_REPORT.totalScore}점</Text>
          <Text style={styles.scoreDesc}>
            평균보다 조금 낮아요.{"\n"}조금 더 훈련이 필요합니다!
          </Text>
        </View>

        {/* 2. 유형별 분석 차트 (Custom Progress Bar) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>유형별 방어력 분석</Text>
          <View style={styles.chartBox}>
            <StatBar
              label="수사관 사칭"
              score={MOCK_REPORT.stats.investigator}
              color="#FF5252"
            />
            <StatBar
              label="대출/금융"
              score={MOCK_REPORT.stats.loan}
              color="#4CAF50"
            />
            <StatBar
              label="가족/지인"
              score={MOCK_REPORT.stats.family}
              color="#2196F3"
            />
          </View>
        </View>

        {/* 3. AI 맞춤 분석 (취약점) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI 취약점 진단</Text>
          <View
            style={[
              styles.feedbackBox,
              { backgroundColor: "#FFF3E0", borderColor: "#FFE0B2" },
            ]}
          >
            <View style={styles.feedbackHeader}>
              <MaterialCommunityIcons
                name="alert-decagram"
                size={24}
                color="#F57C00"
              />
              <Text style={styles.feedbackTitle}>{currentFeedback.title}</Text>
            </View>
            <Text style={styles.feedbackDesc}>{currentFeedback.desc}</Text>
          </View>
        </View>

        {/* 4. 행동 강령 가이드 */}
        <View style={styles.section}>
          <View style={styles.guideBox}>
            <Text style={styles.guideHeader}>{currentFeedback.guideTitle}</Text>
            {currentFeedback.guideRules.map((rule, index) => (
              <View key={index} style={styles.ruleRow}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={18}
                  color="#0F1D3A"
                  style={{ marginTop: 2 }}
                />
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

// [컴포넌트] 막대 그래프 바
function StatBar({
  label,
  score,
  color,
}: {
  label: string;
  score: number;
  color: string;
}) {
  return (
    <View style={styles.statRow}>
      <View style={{ width: 80 }}>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            { width: `${score}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.statScore}>{score}점</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },

  // 점수 카드
  scoreCard: {
    backgroundColor: "#0F1D3A", // 브랜드 컬러
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  scoreHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  scoreTitle: { color: "rgba(255,255,255,0.8)", fontSize: 16, marginRight: 8 },
  tierBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  tierText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  totalScore: {
    fontSize: 48,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 8,
  },
  scoreDesc: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    lineHeight: 20,
  },

  // 공통 섹션
  section: { marginBottom: 30 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#333",
    marginBottom: 16,
  },

  // 차트 박스
  chartBox: { backgroundColor: "#F8F9FA", padding: 20, borderRadius: 16 },
  statRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  statLabel: { fontSize: 14, fontWeight: "600", color: "#555" },
  barBackground: {
    flex: 1,
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  barFill: { height: "100%", borderRadius: 5 },
  statScore: {
    width: 30,
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    textAlign: "right",
  },

  // 취약점 피드백 박스
  feedbackBox: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  feedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E65100",
    marginLeft: 8,
    flex: 1,
  },
  feedbackDesc: { fontSize: 14, color: "#5D4037", lineHeight: 22 },

  // 가이드 박스
  guideBox: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 16,
    padding: 20,
    backgroundColor: "#fff",
  },
  guideHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F1D3A",
    marginBottom: 16,
  },
  ruleRow: { flexDirection: "row", marginBottom: 12, alignItems: "flex-start" },
  ruleText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});
