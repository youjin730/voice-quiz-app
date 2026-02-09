import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { Audio } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";
import AppHeader from "../components/AppHeader";
import client from "../api/client";
import { uploadRecord } from "../api/experience";

export default function DeepfakeScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultAudioBase64, setResultAudioBase64] = useState<string | null>(
    null,
  );

  // ✅ 재생 상태 관리 (원본/AI 각각)
  const [isOriginalPlaying, setIsOriginalPlaying] = useState(false);
  const [isAiPlaying, setIsAiPlaying] = useState(false);

  const PHISHING_TARGET =
    "엄마, 나 지금 핸드폰 액정이 깨져서 수리 맡겼어. 급하게 결제할 게 있는데 50만원만 이 계좌로 보내줘.";

  // 녹음 시작/종료 로직은 동일
  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status !== "granted") {
        Alert.alert("권한 필요", "마이크 권한을 허용해주세요.");
        return;
      }
      setAudioUri(null);
      setResultAudioBase64(null);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecording(recording);
    } catch (err) {
      console.error(err);
    }
  }

  async function stopRecording() {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      setAudioUri(recording.getURI());
      setRecording(null);
    } catch (err) {
      console.error(err);
    }
  }

  // ✅ 공통 재생 로직 (상태 업데이트 포함)
  const playSound = async (source: any, setPlaying: (val: boolean) => void) => {
    try {
      const { sound } = await Audio.Sound.createAsync(source);

      // 재생 상태 모니터링
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPlaying(status.isPlaying);
          if (status.didJustFinish) {
            setPlaying(false);
            sound.unloadAsync(); // 재생 끝나면 메모리 해제
          }
        }
      });

      await sound.playAsync();
    } catch (e) {
      Alert.alert("오류", "음성을 재생할 수 없습니다.");
      setPlaying(false);
    }
  };

  const handleUploadAndConvert = async () => {
    if (!audioUri) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append("voiceFile", {
      uri: audioUri,
      name: `sample.m4a`,
      type: "audio/m4a",
    } as any);
    formData.append("phishingText", PHISHING_TARGET);

    try {
      const response = await client.post(
        "/api/experience/voice-clone",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      const res = response as any;
      const base64Data =
        res.data?.audioBase64 || res.audioBase64 || res.data?.data?.audioBase64;

      if (base64Data) {
        setResultAudioBase64(base64Data);
        uploadRecord(audioUri, "딥페이크 체험 완료").catch(() => {});
      } else {
        throw new Error("데이터를 찾을 수 없습니다.");
      }
    } catch (error: any) {
      Alert.alert("오류", "생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.flex1}>
      <AppHeader title="딥페이크 체험" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>목소리 딥페이크 체험</Text>

        <View style={styles.guideBox}>
          <Text style={styles.guideText}>
            아무 내용이나 10초 내외로 말씀해주세요.{"\n"}
            (예: 오늘 날씨, 좋아하는 음식 등)
          </Text>
        </View>

        <View style={styles.centerArea}>
          {!audioUri ? (
            <TouchableOpacity
              style={[styles.recordBtn, recording && styles.recordingBtn]}
              onPress={recording ? stopRecording : startRecording}
            >
              <MaterialIcons
                name={recording ? "stop" : "mic"}
                size={50}
                color="white"
              />
              <Text style={styles.recordStatus}>
                {recording ? "녹음 중지" : "녹음 시작"}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.resultBox}>
              {/* 1. 원본 녹음본 카드 */}
              <View
                style={[
                  styles.voiceCard,
                  isOriginalPlaying && styles.activeCard,
                ]}
              >
                <Text style={styles.cardLabel}>원본 녹음본</Text>
                <TouchableOpacity
                  style={[
                    styles.miniPlayBtn,
                    isOriginalPlaying && styles.playingBtn,
                  ]}
                  onPress={() =>
                    playSound({ uri: audioUri }, setIsOriginalPlaying)
                  }
                >
                  <MaterialIcons
                    name={isOriginalPlaying ? "volume-up" : "play-arrow"}
                    size={20}
                    color={isOriginalPlaying ? "#fff" : "#0F1D3A"}
                  />
                  <Text
                    style={[
                      styles.miniPlayText,
                      isOriginalPlaying && { color: "#fff" },
                    ]}
                  >
                    {isOriginalPlaying ? "재생 중..." : "들어보기"}
                  </Text>
                </TouchableOpacity>
              </View>

              {!resultAudioBase64 ? (
                <TouchableOpacity
                  style={styles.uploadBtn}
                  onPress={handleUploadAndConvert}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.btnText}>
                      이 목소리로 가짜 음성 생성
                    </Text>
                  )}
                </TouchableOpacity>
              ) : (
                <View style={styles.fullWidth}>
                  <View style={styles.divider} />

                  {/* 2. AI 복제 음성 카드 */}
                  <View
                    style={[
                      styles.voiceCard,
                      styles.aiCard,
                      isAiPlaying && styles.activeAiCard,
                    ]}
                  >
                    <Text style={[styles.cardLabel, { color: "#C62828" }]}>
                      복제된 가짜 목소리
                    </Text>
                    <Text style={styles.aiScript}>"{PHISHING_TARGET}"</Text>
                    <TouchableOpacity
                      style={[
                        styles.aiPlayBtn,
                        isAiPlaying && styles.aiPlayingBtn,
                      ]}
                      onPress={() =>
                        playSound(
                          {
                            uri: `data:audio/mpeg;base64,${resultAudioBase64}`,
                          },
                          setIsAiPlaying,
                        )
                      }
                    >
                      <MaterialIcons
                        name={isAiPlaying ? "graphic-eq" : "play-circle-filled"}
                        size={22}
                        color="white"
                      />
                      <Text style={styles.aiPlayText}>
                        {isAiPlaying
                          ? "가짜 음성 재생 중..."
                          : "복제 음성 재생"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <TouchableOpacity
                onPress={() => {
                  setAudioUri(null);
                  setResultAudioBase64(null);
                }}
                style={styles.mt20}
              >
                <Text style={styles.retryText}>처음부터 다시 하기</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 24, alignItems: "center" },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 30,
    marginBottom: 20,
    color: "#111",
  },
  guideBox: {
    backgroundColor: "#F1F3F5",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    marginBottom: 40,
  },
  guideText: {
    textAlign: "center",
    fontSize: 15,
    color: "#495057",
    lineHeight: 22,
  },
  centerArea: { width: "100%", alignItems: "center" },
  recordBtn: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#0F1D3A",
    justifyContent: "center",
    alignItems: "center",
  },
  recordingBtn: { backgroundColor: "#E03131" },
  recordStatus: {
    color: "white",
    fontSize: 13,
    marginTop: 5,
    fontWeight: "600",
  },
  resultBox: { width: "100%", alignItems: "center" },

  // 카드 스타일
  voiceCard: {
    backgroundColor: "#F8F9FA",
    padding: 20,
    borderRadius: 15,
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#DEE2E6",
  },
  activeCard: { borderColor: "#0F1D3A", backgroundColor: "#F0F4F8" },
  aiCard: { backgroundColor: "#FFF5F5", borderColor: "#FFE3E3" },
  activeAiCard: { borderColor: "#C62828", backgroundColor: "#FFF0F0" },

  cardLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#888",
    marginBottom: 10,
    textTransform: "uppercase",
  },

  // 원본 재생 버튼 (재생 중일 때 파란색으로 변함)
  miniPlayBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#E9ECEF",
    borderRadius: 20,
  },
  playingBtn: { backgroundColor: "#0F1D3A" },
  miniPlayText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#0F1D3A",
    fontWeight: "600",
  },

  uploadBtn: {
    backgroundColor: "#0F1D3A",
    paddingVertical: 18,
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  // AI 재생 버튼 (재생 중일 때 애니메이션 느낌의 아이콘으로 변경)
  aiScript: {
    fontSize: 15,
    color: "#444",
    marginBottom: 20,
    fontStyle: "italic",
    lineHeight: 22,
  },
  aiPlayBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    backgroundColor: "#C62828",
    borderRadius: 12,
  },
  aiPlayingBtn: { backgroundColor: "#B71C1C" },
  aiPlayText: {
    marginLeft: 8,
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },

  btnText: { color: "white", fontSize: 17, fontWeight: "bold" },
  divider: {
    height: 1,
    backgroundColor: "#EEE",
    width: "100%",
    marginVertical: 20,
  },
  fullWidth: { width: "100%" },
  mt20: { marginTop: 25 },
  retryText: {
    color: "#ADB5BD",
    textDecorationLine: "underline",
    fontSize: 14,
  },
});
