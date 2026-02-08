import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Pressable,
  Vibration,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
// ✅ API 함수 가져오기
import {
  startLongsSession,
  finishLongsSession,
  getScenarios,
} from "../api/training";
import client from "../api/client";

export default function LongFormScreen() {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [scenarioTitle, setScenarioTitle] = useState("랜덤 훈련 준비 중...");

  const [callStatus, setCallStatus] = useState<"CONNECTED" | "ENDED">(
    "CONNECTED",
  );
  const [turn, setTurn] = useState<"AI" | "USER">("AI");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 처음엔 로딩 중

  const [aiLastText, setAiLastText] = useState("연결 중입니다...");
  const [isAiFinished, setIsAiFinished] = useState(false);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const micScale = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(1)).current;
  const [turnCount, setTurnCount] = useState(1); // 대화 턴 번호 관리

  // 1. 화면 켜지자마자 실행
  useEffect(() => {
    initRandomSession();
    return () => {
      if (soundRef.current) soundRef.current.unloadAsync();
    };
  }, []);

  // 2. 파동 애니메이션
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

  // ✅ [핵심] 랜덤 시나리오 선택 & 세션 시작
  const initRandomSession = async () => {
    try {
      // 1) 마이크 권한 확인
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status !== "granted") {
        Alert.alert("알림", "마이크 권한이 필요합니다.");
        router.back();
        return;
      }

      // 2) 시나리오 목록 가져오기 (랜덤 뽑기 위해)
      const scenariosRes: any = await getScenarios();
      const items =
        scenariosRes.data?.data?.items || scenariosRes.data?.items || [];

      if (items.length === 0) {
        Alert.alert("알림", "준비된 시나리오가 없습니다.");
        router.back();
        return;
      }

      // 3) 랜덤 뽑기! 🎲
      const randomIndex = Math.floor(Math.random() * items.length);
      const randomScenario = items[randomIndex];
      setScenarioTitle(randomScenario.title); // 화면에 제목 표시

      console.log(
        `🎲 당첨된 시나리오: [${randomScenario.id}] ${randomScenario.title}`,
      );

      // 4) 뽑힌 시나리오 ID로 세션 시작
      const sessionRes: any = await startLongsSession(randomScenario.id);
      const realSessionId = sessionRes.data?.data?.sessionId;

      if (realSessionId) {
        setSessionId(realSessionId);
        setAiLastText("여보세요? 서울중앙지검 수사관입니다."); // 초기 멘트 (혹은 서버에서 받기)
        setIsLoading(false); // 로딩 끝, 훈련 시작!

        // 2초 뒤 사용자 턴
        setTimeout(() => setTurn("USER"), 2000);
      } else {
        throw new Error("세션 ID 없음");
      }
    } catch (error) {
      console.error("랜덤 세션 시작 실패:", error);
      Alert.alert("오류", "훈련을 시작할 수 없습니다.");
      router.back();
    }
  };

  // ... (이하 녹음, 전송, 재생 로직은 기존과 동일) ...
  // (복잡해질까봐 생략하지 않고, 기존 코드를 그대로 유지하세요)

  const startRecording = async () => {
    try {
      if (turn === "AI" || isLoading || isAiFinished) return;
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      recordingRef.current = recording;
      setIsRecording(true);
      Vibration.vibrate(50);
      Animated.spring(micScale, {
        toValue: 0.9,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      console.error(err);
    }
  };

  // app/training/long-form.tsx 파일 안의 stopRecordingAndSend 함수

  // app/training/long-form.tsx

  // (컴포넌트 상단에 state 추가 필요)

  const stopRecordingAndSend = async () => {
    if (!recordingRef.current) return;

    try {
      setIsRecording(false);
      setIsLoading(true);
      Animated.spring(micScale, { toValue: 1, useNativeDriver: true }).start();

      // 1. 녹음 종료
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      if (!uri || !sessionId) {
        console.error("❌ 파일 또는 세션 ID 없음");
        setIsLoading(false);
        return;
      }

      console.log(`📤 전송 시작 (Turn: ${turnCount})`);

      // 2. FormData 생성 (명세서 규격 준수!)
      const formData = new FormData();

      // ✅ [필수 1] 세션 ID
      formData.append("sessionId", sessionId.toString());

      // ✅ [필수 2] 턴 번호 (이게 없어서 에러 났을 확률 1순위)
      formData.append("turnNo", turnCount.toString());

      // ✅ [필수 3] 입력 모드
      formData.append("inputMode", "voice");

      // ✅ [필수 4] 사용자 프로필 (명세서에 있으므로 더미 데이터라도 보냄)
      // (기존 코드에 없었으면 빈 JSON이라도 보내야 안전함)
      const dummyProfile = JSON.stringify({
        user_profile: { name: "사용자", scenario_type: "loan" },
      });
      formData.append("userProfileJson", dummyProfile);

      // ✅ [필수 5] 메타 데이터 (null 대신 빈 객체 문자열 전송)
      formData.append(
        "meta",
        JSON.stringify({ sttConfidence: null, durationMs: null }),
      );

      // ✅ [필수 6] 오디오 파일
      const fileData = {
        uri: uri,
        type: "audio/m4a", // 안드로이드라면 'audio/mp4' 확인 필요
        name: "voice.m4a",
      };
      // 명세서엔 안 나왔지만 보통 파일 필드명은 'voiceFile' 아니면 'file'입니다.
      // 일단 'voiceFile'로 시도!
      formData.append("file", fileData as any);

      // 3. 서버 전송
      const response = await client.post(
        "/api/training/longs/messages",
        formData,
        {
          // ✅ 헤더 설정을 아예 삭제하거나, 빈 객체로 두세요.
          // Axios가 알아서 "multipart/form-data; boundary=..." 를 만들어줍니다.
          headers: {
            Accept: "application/json", // 이건 괜찮음
          },
          transformRequest: (data) => data,
        },
      );

      console.log("✅ 전송 성공:", response.data);

      const resData = response.data?.data;
      if (resData) {
        const { aiText, status, aiAudioUrl } = resData;

        // 다음 턴을 위해 번호 증가
        setTurnCount((prev) => prev + 1);

        if (aiText) setAiLastText(aiText);
        setTurn("AI");

        if (status === "finished") {
          setIsAiFinished(true);
          setAiLastText(aiText || "통화가 종료되었습니다.");
        }

        // 오디오 재생
        if (aiAudioUrl) {
          const fullUrl = aiAudioUrl.startsWith("http")
            ? aiAudioUrl
            : `${client.defaults.baseURL}${aiAudioUrl}`;
          await playAiVoice(fullUrl, status === "finished");
        } else {
          if (status === "finished") handleHangUp();
          else setTimeout(() => setTurn("USER"), 2000);
        }
      }
    } catch (error: any) {
      console.error("🔥 전송 실패!");
      // 에러 상세 확인
      if (error.response?.data?.error) {
        console.log(
          "범인(에러상세):",
          JSON.stringify(error.response.data.error, null, 2),
        );
        Alert.alert("전송 실패", "서버 규격 불일치: 로그 확인 필요");
      } else {
        Alert.alert("전송 실패", "네트워크 오류");
      }
      setTurn("USER");
    } finally {
      setIsLoading(false);
    }
  };

  const playAiVoice = async (url: string, isFinished: boolean) => {
    try {
      if (soundRef.current) await soundRef.current.unloadAsync();
      const { sound } = await Audio.Sound.createAsync({ uri: url });
      soundRef.current = sound;
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          if (isFinished) handleHangUp();
          else setTurn("USER");
        }
      });
    } catch (e) {
      if (isFinished) handleHangUp();
      else setTurn("USER");
    }
  };

  const handleHangUp = async () => {
    try {
      setCallStatus("ENDED");
      if (soundRef.current) await soundRef.current.stopAsync();
      if (sessionId) await finishLongsSession(sessionId);
      setTimeout(() => {
        router.replace({ pathname: "/long-result", params: { sessionId } });
      }, 1500);
    } catch (e) {
      router.replace("/home");
    }
  };

  if (callStatus === "ENDED") {
    return (
      <View style={[styles.container, styles.endedContainer]}>
        <MaterialCommunityIcons name="phone-hangup" size={60} color="#EF4444" />
        <Text style={styles.endedText}>통화 종료</Text>
        <Text style={styles.endedSub}>훈련 결과를 분석 중입니다...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* ✅ 제목도 랜덤으로 뽑힌 걸 보여줌 */}
        <Text style={styles.scenarioTitle}>{scenarioTitle}</Text>
        <Text style={styles.opponentName}>AI 보이스피싱범</Text>
        <Text style={styles.timer}>실전 훈련 중</Text>
      </View>

      <View style={styles.visualizerContainer}>
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
        {isLoading && (
          <ActivityIndicator
            size="large"
            color="#22C55E"
            style={{ marginTop: 20 }}
          />
        )}

        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitleText}>{aiLastText}</Text>
        </View>

        {!isRecording && !isLoading && turn === "USER" && !isAiFinished && (
          <Text style={styles.instructionText}>버튼을 누르고 말하세요</Text>
        )}
      </View>

      <View style={styles.footer}>
        <Animated.View
          style={[styles.pttWrapper, { transform: [{ scale: micScale }] }]}
        >
          <Pressable
            onPressIn={startRecording}
            onPressOut={stopRecordingAndSend}
            disabled={turn === "AI" || isLoading || isAiFinished}
            style={({ pressed }) => [
              styles.pttButton,
              (turn === "AI" || isLoading || isAiFinished) &&
                styles.pttDisabled,
              isRecording && styles.pttActive,
            ]}
          >
            <MaterialCommunityIcons
              name={isRecording ? "microphone" : "microphone-outline"}
              size={40}
              color={
                turn === "AI" || isLoading || isAiFinished ? "#999" : "#fff"
              }
            />
            <Text
              style={[
                styles.pttText,
                (turn === "AI" || isLoading || isAiFinished) && {
                  color: "#999",
                },
              ]}
            >
              {isAiFinished
                ? "통화 종료됨"
                : turn === "AI"
                  ? "상대방 말하는 중"
                  : isLoading
                    ? "연결 중..."
                    : isRecording
                      ? "말하는 중..."
                      : "누르고 말하기"}
            </Text>
          </Pressable>
        </Animated.View>
        <TouchableOpacity style={styles.hangUpButton} onPress={handleHangUp}>
          <MaterialCommunityIcons name="phone-hangup" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#151C2C" },
  endedContainer: { alignItems: "center", justifyContent: "center" },
  endedText: { color: "#fff", fontSize: 24, fontWeight: "bold", marginTop: 20 },
  endedSub: { color: "#888", fontSize: 16, marginTop: 8 },
  header: { alignItems: "center", marginTop: 40 },
  scenarioTitle: { color: "#94A3B8", fontSize: 14, marginBottom: 8 },
  opponentName: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  timer: { color: "#fff", fontSize: 16, fontWeight: "300", opacity: 0.8 },
  visualizerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  waveCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderWidth: 2,
    borderColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  subtitleContainer: {
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  subtitleText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 26,
  },
  instructionText: { color: "#64748B", fontSize: 16, marginTop: 10 },
  footer: {
    paddingBottom: 50,
    alignItems: "center",
    paddingHorizontal: 30,
    gap: 30,
  },
  pttWrapper: { width: "100%", alignItems: "center" },
  pttButton: {
    width: "100%",
    height: 80,
    borderRadius: 24,
    backgroundColor: "#334155",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  pttActive: { backgroundColor: "#22C55E", borderColor: "#22C55E" },
  pttDisabled: { opacity: 0.6 },
  pttText: { fontSize: 18, fontWeight: "700", color: "#fff" },
  hangUpButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
});
