import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av"; // 오디오 재생용
import { MaterialCommunityIcons } from "@expo/vector-icons";
// ✅ API 함수 import
import {
  getShortsQuiz,
  startShortsSession,
  submitShortsAnswer,
  finishShortsSession,
} from "../api/training";

// 답변 타입 (서버는 "real" | "fake", 화면은 O/X)
type Answer = "O" | "X" | "UNKNOWN";

export default function Play() {
  const params = useLocalSearchParams();
  // 카테고리가 있으면 받음 (없으면 전체)
  const categoryCode = params.category as string;

  // 상태 관리
  const [loading, setLoading] = useState(true);
  const [quizList, setQuizList] = useState<any[]>([]); // 문제 목록
  const [sessionId, setSessionId] = useState<number | null>(null); // 세션 ID

  const [idx, setIdx] = useState(0); // 현재 문제 번호 (0부터 시작)
  const [selected, setSelected] = useState<Answer | null>(null); // 내가 고른 답
  const [correctCount, setCorrectCount] = useState(0); // 맞은 개수
  const [sound, setSound] = useState<Audio.Sound | null>(null); // 오디오 객체
  const [isPlaying, setIsPlaying] = useState(false); // 재생 중 여부

  // 진행률 계산
  const total = quizList.length;
  const progress = useMemo(
    () => (total > 0 ? (idx + 1) / total : 0),
    [idx, total],
  );
  const canNext = selected !== null;

  // 1. 초기 데이터 로드 (문제 가져오기 + 세션 시작)
  useEffect(() => {
    initQuiz();
    return () => {
      // 컴포넌트 나갈 때 오디오 정리
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // 2. 문제 바뀔 때마다 오디오 로드
  useEffect(() => {
    if (quizList.length > 0 && idx < total) {
      loadAudio(quizList[idx].audioUrl);
    }
  }, [idx, quizList]);

  // short-form.tsx 내부 initQuiz 함수 수정

  // Play.tsx (short-form.tsx) 내부

  const initQuiz = async () => {
    try {
      setLoading(true);

      // 1) 세션 시작 요청
      const sessionRes: any = await startShortsSession(5);
      console.log("세션 응답:", sessionRes.data);

      // 🚨 [수정] axios.data -> backend.data -> sessionId
      const realSessionId = sessionRes.data?.data?.sessionId;

      if (realSessionId) {
        setSessionId(realSessionId);
        console.log("✅ 세션 ID 확보:", realSessionId);
      } else {
        console.error("세션 ID가 없습니다.", sessionRes.data);
      }

      // 2) 문제 목록 가져오기
      const quizRes: any = await getShortsQuiz(categoryCode, 5);
      console.log("퀴즈 응답:", quizRes.data);

      // 🚨 [수정] axios.data -> backend.data -> items
      const items = quizRes.data?.data?.items;

      if (items && items.length > 0) {
        setQuizList(items);
      } else {
        console.log("빈 리스트 도착");
        throw new Error("문제 목록이 비어있습니다.");
      }
    } catch (error) {
      console.error("퀴즈 로딩 실패:", error);
      Alert.alert("오류", "문제를 불러오지 못했습니다.");
      router.back();
    } finally {
      setLoading(false);
    }
  };
  // Play.tsx 내부의 loadAudio 함수 수정

  // ✅ 내 서버 주소 (client.ts에 있는 그 주소!)
  const BASE_URL = "https://hypsometric-katabolically-kelsie.ngrok-free.dev";

  const loadAudio = async (url: string) => {
    try {
      console.log("🎵 원본 오디오 URL:", url); // 로그 확인 필수!

      if (!url) {
        console.error("오디오 URL이 비어있습니다.");
        return;
      }

      // [핵심 수정] URL이 'http'로 시작하지 않으면 앞에 도메인을 붙여준다!
      const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;

      console.log("🔗 변환된 오디오 URL:", fullUrl);

      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: fullUrl },
        { shouldPlay: true }, // 로드되면 바로 재생 (원하면 false)
      );
      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          newSound.setPositionAsync(0);
        }
      });
    } catch (error) {
      console.error("❌ 오디오 로드 실패:", error);
      Alert.alert("오류", "오디오 파일을 불러올 수 없습니다.");
    }
  };

  // 재생/일시정지 토글
  const togglePlay = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  // Play.tsx (short-form.tsx) 내부

  const onNext = async () => {
    if (!selected || !sessionId) return;

    try {
      // ... (userChoice 계산 로직은 그대로 유지) ...
      let userChoice: "real" | "fake" = "real";
      if (selected === "O") userChoice = "fake";
      else if (selected === "X") userChoice = "real";

      const currentQuiz = quizList[idx];

      // 1. 정답 제출 API 호출
      const response: any = await submitShortsAnswer({
        sessionId: sessionId,
        roundNo: idx + 1,
        shortId: currentQuiz.id,
        userChoice: userChoice,
        timeMs: 5000,
      });

      // 🚨 [수정] axios.data -> backend.data -> isCorrect
      // 명세서: { success: true, data: { isCorrect: true, ... } }
      const resultData = response.data?.data;

      console.log("채점 결과:", resultData);

      // 정답 여부 카운트
      if (resultData && resultData.isCorrect) {
        setCorrectCount((prev) => prev + 1);
      }

      // 2. 마지막 문제라면 결과 페이지로
      if (idx === total - 1) {
        await finishShortsSession(sessionId);

        router.replace({
          pathname: "/short-result",
          params: {
            sessionId: sessionId,
            total: String(total),
            // 마지막 문제 정답이면 +1 해서 보냄
            correct: String(
              resultData?.isCorrect ? correctCount + 1 : correctCount,
            ),
          },
        });
        return;
      }

      // 3. 다음 문제로 이동
      setIdx((prev) => prev + 1);
      setSelected(null);
    } catch (error) {
      console.error("답안 제출 실패:", error);
      // 에러 시에도 다음 문제로 넘어가게 처리
      if (idx < total - 1) {
        setIdx((prev) => prev + 1);
        setSelected(null);
      }
    }
  };

  // 이전 버튼 (단순 이동)
  const onPrev = () => {
    if (idx === 0) return;
    setIdx((p) => p - 1);
    setSelected(null);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0F1D3A" />
        <Text style={{ marginTop: 10 }}>문제를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* 상단 네이비 헤더 */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.topBtn}>
          <Text style={styles.topIcon}>←</Text>
        </Pressable>

        <Text style={styles.topTitle}>숏폼 훈련</Text>

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
        <Text style={styles.qMark}>Q{idx + 1}.</Text>
        <Text style={styles.question}>이 음성은 AI 변조(딥페이크)인가요?</Text>

        {/* 음성 카드 */}
        <View style={styles.audioCard}>
          <Pressable onPress={togglePlay} style={styles.playCircle}>
            <MaterialCommunityIcons
              name={isPlaying ? "pause" : "play"}
              size={30}
              color="#fff"
            />
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text style={styles.audioTitle}>
              {isPlaying ? "재생 중..." : "음성 듣기"}
            </Text>
            {/* 오디오 파형 느낌의 바 */}
            <View style={styles.seekRow}>
              <View style={styles.seekBg} />
              <View
                style={[styles.seekFill, { width: isPlaying ? "60%" : "0%" }]}
              />
            </View>

            <View style={styles.timeRow}>
              <Text style={styles.timeText}>0:00</Text>
              <Text style={styles.timeText}>0:15</Text>
            </View>
          </View>
        </View>

        {/* O / X 카드 */}
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
            <Text style={styles.oxLabel}>그렇다 (가짜)</Text>
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
            <Text style={styles.oxLabel}>아니다 (진짜)</Text>
          </Pressable>
        </View>

        {/* 잘 모르겠음 */}
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
            <Text style={styles.nextText}>
              {idx === total - 1 ? "결과 보기" : "다음 문제"}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.footerText}>
          {idx + 1}/{total} · 현재 정답: {correctCount}개
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
  topBtn: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
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
  question: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
    lineHeight: 34,
  },

  audioCard: {
    marginTop: 14,
    marginBottom: 40, // 공간 조정
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

  oxRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  oxCard: {
    width: "48%",
    height: 150,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  oCard: { backgroundColor: O_BG },
  xCard: { backgroundColor: X_BG },

  oSelectedBorder: { borderWidth: 3, borderColor: BLUE },
  xSelectedBorder: { borderWidth: 3, borderColor: X_BORDER },

  oSymbol: { fontSize: 60, fontWeight: "900", color: BLUE },
  xSymbol: { fontSize: 60, fontWeight: "900", color: X_BORDER },
  oxLabel: { fontSize: 16, fontWeight: "900", color: "#111827" },

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
