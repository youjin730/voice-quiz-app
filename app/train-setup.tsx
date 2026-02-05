import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppHeader from "../components/AppHeader";

type Mode = "SHORT" | "LONG";
type ScenarioKey = "INVESTIGATOR" | "LOAN" | "FAMILY" | "DELIVERY" | "PARTTIME";

const SCENARIOS: {
  key: ScenarioKey;
  title: string;
  desc: string;
  emoji: string;
}[] = [
  {
    key: "INVESTIGATOR",
    title: "기관/수사관 사칭",
    desc: "계좌·사건 연루를 빌미로 압박",
    emoji: "🕵️",
  },
  {
    key: "LOAN",
    title: "대출/금융 사칭",
    desc: "저금리 대환·수수료 요구",
    emoji: "💳",
  },
  {
    key: "FAMILY",
    title: "가족/지인 사칭",
    desc: "급한 상황을 만들어 송금 유도",
    emoji: "👨‍👩‍👧",
  },
  {
    key: "DELIVERY",
    title: "택배/문자 링크",
    desc: "링크 클릭·앱 설치 유도",
    emoji: "📦",
  },
  {
    key: "PARTTIME",
    title: "알바/구인 사기",
    desc: "인증·선입금 요구",
    emoji: "🧾",
  },
];

export default function TrainSetup() {
  const [mode, setMode] = useState<Mode>("SHORT");
  const [selected, setSelected] = useState<ScenarioKey[]>([]);

  const maxPick = 3;

  const canStart = useMemo(() => selected.length > 0, [selected]);

  const modeDesc =
    mode === "SHORT"
      ? "10~15초 음성 · 빠르게 감 잡기"
      : "30~60초 음성 · 맥락 속에서 판단하기";

  function toggleScenario(key: ScenarioKey) {
    setSelected((prev) => {
      const exists = prev.includes(key);
      if (exists) return prev.filter((k) => k !== key);
      if (prev.length >= maxPick) return prev; // 최대 선택 제한
      return [...prev, key];
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ flex: 1 }}>
        {/* 오른쪽 텍스트 없음 */}
        <AppHeader title="훈련 설정" />

        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.h1}>오늘의 훈련을 고르세요 🎯</Text>
          <Text style={styles.sub}>
            숏폼/롱폼을 선택하고, 시나리오를 최대 {maxPick}개까지 고를 수
            있어요.
          </Text>

          {/* 1) 숏폼/롱폼 선택 (단일) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>훈련 방식</Text>

            <View style={styles.modeRow}>
              <ModeChip
                label="숏폼"
                selected={mode === "SHORT"}
                onPress={() => setMode("SHORT")}
              />
              <ModeChip
                label="롱폼"
                selected={mode === "LONG"}
                onPress={() => setMode("LONG")}
              />
            </View>

            <View style={styles.hintBubble}>
              <Text style={styles.hintText}>{modeDesc}</Text>
            </View>
          </View>

          {/* 2) 시나리오 선택 (최대 3개) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>시나리오 선택</Text>

            <View style={styles.helperRow}>
              <Text style={styles.helperText}>
                최대 {maxPick}개까지 선택 가능
              </Text>
              <Text style={styles.helperCount}>
                {selected.length}/{maxPick}
              </Text>
            </View>

            {SCENARIOS.map((s) => (
              <ScenarioCard
                key={s.key}
                emoji={s.emoji}
                title={s.title}
                desc={s.desc}
                selected={selected.includes(s.key)}
                disabled={
                  !selected.includes(s.key) && selected.length >= maxPick
                }
                onPress={() => toggleScenario(s.key)}
              />
            ))}
          </View>

          <View style={{ height: 90 }} />
        </ScrollView>

        {/* 하단 고정 CTA */}
        <View style={styles.bottomBar}>
          <Pressable
            disabled={!canStart}
            style={[styles.cta, !canStart && styles.ctaDisabled]}
            onPress={() => {
              // ✅ 다음 화면에 mode/selected를 넘기고 싶으면 query로 넘길 수 있음
              // 예: router.push({ pathname: "/play", params: { mode, scenarios: selected.join(",") } })
              router.push("/play");
            }}
          >
            <Text style={styles.ctaText}>
              {canStart
                ? "선택 완료 · 훈련 시작"
                : "시나리오를 1개 이상 선택하세요"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ---------- UI Components ---------- */

function ModeChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.modeChip, selected && styles.modeChipSelected]}
    >
      <Text
        style={[styles.modeChipText, selected && styles.modeChipTextSelected]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ScenarioCard({
  emoji,
  title,
  desc,
  selected,
  disabled,
  onPress,
}: {
  emoji: string;
  title: string;
  desc: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.card,
        selected && styles.cardSelected,
        disabled && styles.cardDisabled,
      ]}
    >
      <View style={styles.cardLeft}>
        <View style={styles.iconCircle}>
          <Text style={{ fontSize: 18 }}>{emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDesc}>{desc}</Text>
        </View>
      </View>

      <View
        style={[styles.checkCircle, selected && styles.checkCircleSelected]}
      >
        <Text style={[styles.checkText, selected && styles.checkTextSelected]}>
          ✓
        </Text>
      </View>
    </Pressable>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6F7FB" },

  scroll: { padding: 16 },

  h1: { fontSize: 22, fontWeight: "900", marginTop: 10, color: "#111827" },
  sub: { marginTop: 8, fontSize: 13, color: "#6B7280", lineHeight: 18 },

  section: { marginTop: 18 },
  sectionTitle: { fontSize: 14, fontWeight: "900", color: "#111827" },

  modeRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  modeChip: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  modeChipSelected: {
    borderWidth: 2,
    borderColor: "#22C55E",
    backgroundColor: "#F0FDF4",
  },
  modeChipText: { fontSize: 14, fontWeight: "800", color: "#111827" },
  modeChipTextSelected: { color: "#166534" },

  hintBubble: {
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  hintText: { fontSize: 12, color: "#374151", fontWeight: "700" },

  helperRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  helperText: { fontSize: 12, color: "#6B7280", fontWeight: "700" },
  helperCount: { fontSize: 12, color: "#111827", fontWeight: "900" },

  card: {
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: "#22C55E",
    backgroundColor: "#F0FDF4",
  },
  cardDisabled: { opacity: 0.5 },

  cardLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontSize: 15, fontWeight: "900", color: "#111827" },
  cardDesc: { marginTop: 4, fontSize: 12, color: "#6B7280" },

  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircleSelected: { backgroundColor: "#22C55E" },
  checkText: { fontSize: 16, fontWeight: "900", color: "#9CA3AF" },
  checkTextSelected: { color: "#FFFFFF" },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: "rgba(246,247,251,0.95)",
  },
  cta: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaDisabled: { backgroundColor: "#B9C2D3" },
  ctaText: { color: "#FFFFFF", fontSize: 15, fontWeight: "900" },
});
