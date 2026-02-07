import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppHeader from "../components/AppHeader";

type TrainingMode = "SHORT" | "LONG";

export default function TrainSetup() {
  const [selectedMode, setSelectedMode] = useState<TrainingMode | null>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ flex: 1 }}>
        <AppHeader title="훈련 설정" />

        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.h1}>어떤 훈련을 진행할까요? 🎯</Text>
          <Text style={styles.sub}>
            순발력을 기르는 숏폼 퀴즈와 실전 방어력을 기르는{"\n"}
            롱폼 시뮬레이션 중 선택해주세요.
          </Text>

          <View style={styles.cardContainer}>
            {/* 1. 숏폼 훈련 카드 */}
            <TrainingCard
              mode="SHORT"
              title="숏폼 훈련 (Speed Quiz)"
              subtitle="순발력 강화 O/X"
              desc="실제 보이스피싱 음성을 듣고 15초 내에 판단하는 훈련입니다."
              tags={["총 5문항", "O/X 퀴즈", "즉시 채점", "AI 피드백"]}
              selected={selectedMode === "SHORT"}
              onPress={() => setSelectedMode("SHORT")}
            />

            {/* 2. 롱폼 훈련 카드 */}
            <TrainingCard
              mode="LONG"
              title="롱폼 훈련 (Role Play)"
              subtitle="실전 시뮬레이션"
              desc="AI 범인과 무전기로 대화하며 상황을 해결하는 방어 훈련입니다."
              tags={[
                "랜덤 시나리오",
                "무전기 대화",
                "음성 대응",
                "방어 리포트",
              ]}
              selected={selectedMode === "LONG"}
              onPress={() => setSelectedMode("LONG")}
            />
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* 하단 고정 CTA */}
        <View style={styles.bottomBar}>
          <Pressable
            disabled={!selectedMode}
            style={[styles.cta, !selectedMode && styles.ctaDisabled]}
            onPress={() => {
              // 경로 수정: play 폴더 없이 바로 app 폴더 아래 파일로 이동
              if (selectedMode === "SHORT") {
                router.push("/short-form");
              } else {
                router.push("/long-form");
              }
            }}
          >
            <Text style={styles.ctaText}>
              {selectedMode
                ? `${selectedMode === "SHORT" ? "숏폼" : "롱폼"} 훈련 시작하기`
                : "훈련 모드를 선택해주세요"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ---------- UI Components ---------- */

function TrainingCard({
  mode,
  title,
  subtitle,
  desc,
  tags,
  selected,
  onPress,
}: {
  mode: TrainingMode;
  title: string;
  subtitle: string;
  desc: string;
  tags: string[];
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, selected && styles.cardSelected]}
    >
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>

        {/* 라디오 버튼 (선택 표시) */}
        <View
          style={[styles.radioCircle, selected && styles.radioCircleSelected]}
        >
          {selected && <View style={styles.radioInner} />}
        </View>
      </View>

      {/* 설명 텍스트 */}
      <Text style={styles.cardDesc}>{desc}</Text>

      {/* 태그 리스트 */}
      <View style={styles.tagRow}>
        {tags.map((tag, idx) => (
          <View key={idx} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6F7FB" },
  scroll: { padding: 20 },

  h1: { fontSize: 24, fontWeight: "900", color: "#111827", marginBottom: 8 },
  sub: { fontSize: 14, color: "#6B7280", lineHeight: 22, marginBottom: 24 },

  cardContainer: { gap: 16 },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardSelected: {
    borderColor: "#0F1D3A",
    backgroundColor: "#FFFFFF",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  cardSubtitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 4,
  },
  cardTitle: { fontSize: 18, fontWeight: "900", color: "#111827" },

  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: {
    borderColor: "#0F1D3A",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#0F1D3A",
  },

  cardDesc: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 22,
    marginBottom: 16,
  },

  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  tagText: { fontSize: 12, fontWeight: "600", color: "#4B5563" },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: "#F6F7FB",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  cta: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#0F1D3A",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F1D3A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0,
    elevation: 0,
  },
  ctaText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
});
