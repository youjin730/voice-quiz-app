import { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import AppHeader from "../components/AppHeader";

type Choice = "AI" | "HUMAN" | "UNKNOWN";

export default function Play() {
  const [selected, setSelected] = useState<Choice | null>(null);
  const canSubmit = useMemo(() => selected !== null, [selected]);

  return (
    <View style={{ flex: 1 }}>
      {/* ✅ 헤더는 return 안에서 렌더되어야 보임 */}
      <AppHeader onRightPress={() => Alert.alert("마이페이지")} />

      {/* ✅ 기존 컨텐츠 */}
      <View style={styles.container}>
        <Text style={styles.level}>레벨 1</Text>
        <Text style={styles.desc}>소리를 듣고 맞춰주세요</Text>

        <View style={styles.player}>
          <Text style={{ fontSize: 28 }}>🔊</Text>
          {/* 나중에 expo-av로 음성 재생 붙이면 됨 */}
        </View>

        <View style={styles.row}>
          {(["AI", "HUMAN", "UNKNOWN"] as Choice[]).map((c) => (
            <Pressable
              key={c}
              onPress={() => setSelected(c)}
              style={[styles.choice, selected === c && styles.choiceSelected]}
            >
              <Text style={styles.choiceText}>
                {c === "AI" ? "AI" : c === "HUMAN" ? "인간" : "잘모르겠음"}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          disabled={!canSubmit}
          style={[styles.submit, !canSubmit && styles.submitDisabled]}
          onPress={() => Alert.alert("제출", `선택: ${selected}`)}
        >
          <Text style={styles.submitText}>선택 완료</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  level: { marginTop: 10, fontSize: 14, fontWeight: "600" },
  desc: { marginTop: 6, fontSize: 16, fontWeight: "700" },
  player: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
    height: 180,
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 40 },
  choice: {
    width: "31%",
    height: 90,
    borderRadius: 12,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  choiceSelected: { backgroundColor: "#9fb7d6" },
  choiceText: { fontSize: 14, fontWeight: "700" },
  submit: {
    marginTop: "auto",
    height: 52,
    borderRadius: 12,
    backgroundColor: "#0F1D3A",
    alignItems: "center",
    justifyContent: "center",
  },
  submitDisabled: { backgroundColor: "#b9c2d3" },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
