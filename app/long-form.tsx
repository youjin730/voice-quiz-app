import { router } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Pressable,
  Dimensions,
  Vibration,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const SCENARIO = {
  title: "010-XXXX-XXXX", // 모르는 번호 느낌
  opponent: "서울지검 김철수 수사관",
  mission: "상대방이 '계좌 번호'를 요구하면\n즉시 거절하고 전화를 끊으세요.",
};

export default function LongFormScreen() {
  // 상태: 통화중(CONNECTED) -> 종료됨(ENDED)
  const [callStatus, setCallStatus] = useState<"CONNECTED" | "ENDED">(
    "CONNECTED",
  );
  const [turn, setTurn] = useState<"AI" | "USER">("AI");
  const [isTalking, setIsTalking] = useState(false);

  // 애니메이션 값
  const micScale = useRef(new Animated.Value(1)).current; // 버튼 크기
  const waveAnim = useRef(new Animated.Value(1)).current; // 파형

  // 1. 시작하자마자 AI 발화 (매칭 화면 삭제)
  useEffect(() => {
    simulateAISpeaking();
  }, []);

  // 2. 파형 애니메이션 (AI 말할 때만)
  useEffect(() => {
    let loop: Animated.CompositeAnimation;
    if (turn === "AI" && callStatus === "CONNECTED") {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
    } else {
      waveAnim.setValue(1);
    }
    return () => loop?.stop();
  }, [turn, callStatus]);

  // AI 턴 시뮬레이션
  const simulateAISpeaking = () => {
    if (callStatus === "ENDED") return;
    setTurn("AI");
    // 4초 뒤에 사용자 턴으로 넘김
    setTimeout(() => {
      setTurn("USER");
    }, 4000);
  };

  // 버튼 꾹 눌렀을 때 (말하기 시작)
  const handlePressIn = () => {
    if (turn === "AI") return;
    setIsTalking(true);
    // 햅틱 피드백 (진동) - 폰에서만 작동
    Vibration.vibrate(50);

    // 버튼 커지는 애니메이션
    Animated.spring(micScale, {
      toValue: 0.9, // 눌리는 느낌 (작아짐)
      useNativeDriver: true,
    }).start();
  };

  // 버튼 뗐을 때 (말하기 끝)
  const handlePressOut = () => {
    if (turn === "AI") return;
    setIsTalking(false);

    // 버튼 원래대로
    Animated.spring(micScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    // 1초 뒤 AI가 다시 말함
    setTimeout(simulateAISpeaking, 1000);
  };

  // 통화 종료 (현실적인 종료 처리)
  const handleHangUp = () => {
    setCallStatus("ENDED");
    // 1.5초 뒤 결과 페이지로 이동
    setTimeout(() => {
      router.replace("/long-result");
    }, 1500);
  };

  /* ---------------- 화면: 통화 종료됨 ---------------- */
  if (callStatus === "ENDED") {
    return (
      <View style={[styles.container, styles.endedContainer]}>
        <MaterialCommunityIcons name="phone-hangup" size={60} color="#EF4444" />
        <Text style={styles.endedText}>통화 종료</Text>
        <Text style={styles.endedSub}>00:42</Text>
      </View>
    );
  }

  /* ---------------- 화면: 통화 중 ---------------- */
  return (
    <SafeAreaView style={styles.container}>
      {/* 1. 상단 정보 */}
      <View style={styles.header}>
        <Text style={styles.scenarioTitle}>보이스피싱 의심 전화</Text>
        <Text style={styles.opponentName}>{SCENARIO.opponent}</Text>
        <Text style={styles.timer}>00:12</Text>
      </View>

      {/* 2. 중앙 비주얼 (상태 표시) */}
      <View style={styles.visualizerContainer}>
        {/* 상대방 말할 때 파형 */}
        {turn === "AI" && (
          <Animated.View
            style={[styles.waveCircle, { transform: [{ scale: waveAnim }] }]}
          >
            <MaterialCommunityIcons
              name="account-voice"
              size={40}
              color="#fff"
            />
          </Animated.View>
        )}

        {/* 내가 말할 때 (버튼 누르고 있을 때) 시각 효과 */}
        {isTalking && (
          <View style={styles.micActiveIndicator}>
            <MaterialCommunityIcons
              name="microphone"
              size={48}
              color="#22C55E"
            />
            <Text style={styles.micActiveText}>내 목소리 전송 중...</Text>
          </View>
        )}

        {/* 대기 중 텍스트 */}
        {!isTalking && turn === "USER" && (
          <Text style={styles.instructionText}>버튼을 누르고 말하세요</Text>
        )}
      </View>

      {/* 3. 하단 컨트롤러 */}
      <View style={styles.footer}>
        {/* PTT 버튼 (가운데 크게) */}
        <Animated.View
          style={[styles.pttWrapper, { transform: [{ scale: micScale }] }]}
        >
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={turn === "AI"}
            style={({ pressed }) => [
              styles.pttButton,
              turn === "AI" && styles.pttDisabled, // AI 턴일 때 회색
              isTalking && styles.pttActive, // 말할 때 초록색
            ]}
          >
            <MaterialCommunityIcons
              name={isTalking ? "microphone" : "microphone-outline"}
              size={40}
              color={turn === "AI" ? "#999" : "#fff"}
            />
            <Text style={[styles.pttText, turn === "AI" && { color: "#999" }]}>
              {turn === "AI"
                ? "상대방 말하는 중"
                : isTalking
                  ? "말하는 중"
                  : "누르고 말하기"}
            </Text>
          </Pressable>
        </Animated.View>

        {/* 종료 버튼 (아래쪽 빨간 버튼) */}
        <TouchableOpacity style={styles.hangUpButton} onPress={handleHangUp}>
          <MaterialCommunityIcons name="phone-hangup" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#151C2C" }, // 딥 다크 네이비

  // --- 통화 종료 화면 ---
  endedContainer: { alignItems: "center", justifyContent: "center" },
  endedText: { color: "#fff", fontSize: 24, fontWeight: "bold", marginTop: 20 },
  endedSub: { color: "#888", fontSize: 16, marginTop: 8 },

  // --- 헤더 ---
  header: { alignItems: "center", marginTop: 40 },
  scenarioTitle: { color: "#94A3B8", fontSize: 14, marginBottom: 8 },
  opponentName: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  timer: { color: "#fff", fontSize: 16, fontWeight: "300", opacity: 0.8 },

  // --- 중앙 비주얼 ---
  visualizerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // AI 파형
  waveCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(239, 68, 68, 0.2)", // Red tint
    borderWidth: 2,
    borderColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },

  // 내 마이크 활성 표시
  micActiveIndicator: { alignItems: "center", gap: 10 },
  micActiveText: { color: "#22C55E", fontSize: 16, fontWeight: "700" },

  instructionText: { color: "#64748B", fontSize: 16 },

  // --- 하단 컨트롤 ---
  footer: {
    paddingBottom: 50,
    alignItems: "center",
    paddingHorizontal: 30,
    gap: 30,
  },

  // 말하기 버튼 (PTT)
  pttWrapper: { width: "100%", alignItems: "center" },
  pttButton: {
    width: "100%",
    height: 80,
    borderRadius: 24,
    backgroundColor: "#334155", // 기본: 다크 그레이
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  pttActive: {
    backgroundColor: "#22C55E", // 활성: 밝은 초록색
    borderColor: "#22C55E",
    shadowColor: "#22C55E",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20, // 네온 효과
    elevation: 10,
  },
  pttDisabled: {
    opacity: 0.6,
  },
  pttText: { fontSize: 18, fontWeight: "700", color: "#fff" },

  // 종료 버튼
  hangUpButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
});
