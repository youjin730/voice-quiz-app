import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

type Answer = "O" | "X" | "UNKNOWN";

const TOTAL = 5;

export default function Play() {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<Answer | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const progress = useMemo(() => (idx + 1) / TOTAL, [idx]);
  const canNext = selected !== null;

  // 더미 정답
  const getCorrectAnswer = (questionIndex: number): Answer =>
    questionIndex % 2 === 0 ? "X" : "O";

  const onNext = () => {
    if (!selected) return;

    const correct = getCorrectAnswer(idx);
    const isCorrect = selected === correct;

    if (selected !== "UNKNOWN" && isCorrect) setCorrectCount((p) => p + 1);

    if (idx === TOTAL - 1) {
      // ✅ result.tsx는 total/correct를 받도록 수정할 거라 params로 넘김
      router.push({
        pathname: "/short-result",
        params: {
          total: String(TOTAL),
          correct: String(
            selected !== "UNKNOWN" && isCorrect
              ? correctCount + 1
              : correctCount,
          ),
        },
      });
      return;
    }

    setIdx((p) => p + 1);
    setSelected(null);
  };

  const onPrev = () => {
    if (idx === 0) return;
    setIdx((p) => p - 1);
    setSelected(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* 상단 네이비 헤더 */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.topBtn}>
          <Text style={styles.topIcon}>←</Text>
        </Pressable>

        <Text style={styles.topTitle}>app name</Text>

        <Pressable onPress={() => router.push("/mypage")} style={styles.topBtn}>
          <Text style={styles.topRight}>My</Text>
        </Pressable>
      </View>

      {/* 진행바 */}
      <View style={styles.progressWrap}>
        <View style={styles.progressBg} />
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.container}>
        <Text style={styles.qMark}>Q.</Text>
        <Text style={styles.question}>이 음성은 AI 변조(딥페이크)인가요?</Text>

        {/* (원하면 유지) 음성 카드 - 컴팩트 버전 */}
        <View style={styles.audioCard}>
          <View style={styles.playCircle}>
            <Text style={styles.playIcon}>▶</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.audioTitle}>음성 듣기</Text>
            <View style={styles.seekRow}>
              <View style={styles.seekBg} />
              <View style={styles.seekFill} />
            </View>

            <View style={styles.timeRow}>
              <Text style={styles.timeText}>0:03</Text>
              <Text style={styles.timeText}>0:12</Text>
            </View>
          </View>
        </View>

        {/* O / X 카드 (컴팩트 사이즈) */}
        <View style={styles.oxRow}>
          <Pressable
            onPress={() => setSelected("O")}
            style={[
              styles.oxCard,
              styles.oCard,
              selected === "O" && styles.oSelectedBorder,
            ]}
          >
            <Text style={styles.oSymbol}>O</Text>
            <Text style={styles.oxLabel}>그렇다</Text>
          </Pressable>

          <Pressable
            onPress={() => setSelected("X")}
            style={[
              styles.oxCard,
              styles.xCard,
              selected === "X" && styles.xSelectedBorder,
            ]}
          >
            <Text style={styles.xSymbol}>X</Text>
            <Text style={styles.oxLabel}>아니다</Text>
          </Pressable>
        </View>

        {/* 잘 모르겠음: 기본은 회색, 선택 시에만 테두리 */}
        <Pressable
          onPress={() => setSelected("UNKNOWN")}
          style={[
            styles.unknownBtn,
            selected === "UNKNOWN" && styles.unknownSelected,
          ]}
        >
          <Text style={styles.unknownText}>잘 모르겠음</Text>
        </Pressable>

        {/* 하단 버튼 */}
        <View style={styles.bottomRow}>
          <Pressable
            onPress={onPrev}
            disabled={idx === 0}
            style={[styles.prevBtn, idx === 0 && styles.prevDisabled]}
          >
            <Text style={styles.prevText}>이전</Text>
          </Pressable>

          <Pressable
            onPress={onNext}
            disabled={!canNext}
            style={[styles.nextBtn, !canNext && styles.nextDisabled]}
          >
            <Text style={styles.nextText}>다음 문제</Text>
          </Pressable>
        </View>

        <Text style={styles.footerText}>
          {idx + 1}/{TOTAL} · 현재정답(누적): {correctCount}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const NAVY = "#0F1D3A";
const BLUE = "#2F6FED";
const O_BG = "#EAF2FF";
const X_BG = "#FDEAEA";
const X_BORDER = "#EF4444";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  topBar: {
    height: 54,
    backgroundColor: NAVY,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  topBtn: { width: 44, height: 44, justifyContent: "center" },
  topIcon: { color: "#fff", fontSize: 22, fontWeight: "800" },
  topTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },
  topRight: { color: "#fff", fontSize: 16, fontWeight: "800" },

  progressWrap: { height: 6, backgroundColor: "#fff" },
  progressBg: { ...StyleSheet.absoluteFillObject, backgroundColor: "#E5E7EB" },
  progressFill: { height: 6, backgroundColor: BLUE },

  container: { flex: 1, paddingHorizontal: 18, paddingTop: 16 },

  qMark: { color: BLUE, fontSize: 22, fontWeight: "900" },
  // ✅ 질문 크기 줄임 (오른쪽 레퍼런스 느낌)
  question: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
    lineHeight: 34,
  },

  // ✅ 음성 카드도 조금 컴팩트하게
  audioCard: {
    marginTop: 14,
    marginBottom: 100,
    backgroundColor: "#F3F4F6",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  playCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: NAVY,
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: { color: "#fff", fontSize: 20, fontWeight: "900" },
  audioTitle: { fontSize: 16, fontWeight: "900", color: "#111827" },
  seekRow: { marginTop: 8, height: 8, justifyContent: "center" },
  seekBg: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },
  seekFill: {
    width: "18%",
    height: 8,
    borderRadius: 999,
    backgroundColor: BLUE,
  },
  timeRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: { color: "#6B7280", fontSize: 13, fontWeight: "700" },

  // ✅ OX 카드 줄임
  oxRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  oxCard: {
    width: "48%",
    height: 170, // ← 기존 220에서 축소
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  oCard: { backgroundColor: O_BG },
  xCard: { backgroundColor: X_BG },

  // 선택된 것만 테두리
  oSelectedBorder: { borderWidth: 3, borderColor: BLUE },
  xSelectedBorder: { borderWidth: 3, borderColor: X_BORDER },

  // ✅ 심볼/라벨 크기 축소
  oSymbol: { fontSize: 72, fontWeight: "900", color: BLUE },
  xSymbol: { fontSize: 72, fontWeight: "900", color: X_BORDER },
  oxLabel: { fontSize: 18, fontWeight: "900", color: "#111827" },

  // ✅ 잘 모르겠음: 기본 회색, 선택 시만 테두리
  unknownBtn: {
    marginTop: 12,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  unknownSelected: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#111827",
  },
  unknownText: { fontSize: 18, fontWeight: "900", color: "#111827" },

  bottomRow: {
    marginTop: "auto",
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    paddingBottom: 8,
  },
  prevBtn: {
    width: 86,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#EEF2F7",
    alignItems: "center",
    justifyContent: "center",
  },
  prevDisabled: { opacity: 0.5 },
  prevText: { fontSize: 16, fontWeight: "900", color: "#111827" },

  nextBtn: {
    flex: 1,
    height: 54,
    borderRadius: 18,
    backgroundColor: NAVY,
    alignItems: "center",
    justifyContent: "center",
  },
  nextDisabled: { opacity: 0.45 },
  nextText: { fontSize: 18, fontWeight: "900", color: "#fff" },

  footerText: {
    textAlign: "center",
    paddingBottom: 14,
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "700",
  },
});
