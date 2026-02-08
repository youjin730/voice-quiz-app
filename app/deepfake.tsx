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
import client from "../api/client"; // ✅ API 클라이언트 불러오기

export default function DeepfakeScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 서버 통신 대기
  const [resultUrl, setResultUrl] = useState<string | null>(null); // 결과 URL

  // 1. 녹음 시작
  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status !== "granted") {
        Alert.alert("권한 필요", "마이크 사용 권한을 허용해주세요.");
        return;
      }

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

  // 2. 녹음 종료
  async function stopRecording() {
    if (!recording) return;
    setRecording(null);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setAudioUri(uri);
  }

  // 3. [핵심] 서버로 파일 전송 (API 연동 적용)
  const handleUploadAndConvert = async () => {
    if (!audioUri) return;
    setIsLoading(true);

    // ✅ FormData 생성 (파일 전송용)
    const formData = new FormData();

    // 리액트 네이티브에서 파일 보낼 때 포맷 (uri, name, type 필수)
    formData.append("voiceFile", {
      uri: audioUri,
      name: "recording.m4a", // 파일명
      type: "audio/m4a", // 파일 타입
    } as any);

    try {
      // ✅ 진짜 서버 API 호출 (POST /api/uploads/voice)
      // client.ts의 설정을 따르지만, 파일 업로드는 헤더가 달라서 따로 지정
      const response = (await client.post("/api/uploads/voice", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: (data) => {
          return data; // FormData 변형 방지
        },
      })) as any;

      // ✅ 서버 응답 처리
      // 백엔드 명세: { success: true, data: { url: "...", ... } }
      // client.ts 인터셉터가 data 알맹이만 주므로 response는 { url, key, ... } 형태
      console.log("업로드 성공:", response);

      if (response && response.url) {
        setResultUrl(response.url); // 결과 URL 저장
        Alert.alert("완료", "목소리 변환이 완료되었습니다.");

        // (선택사항) 기록 저장 API 호출
        // await client.post("/api/experience/records", { originalUrl: response.url, note: "딥페이크 체험" });
      } else {
        throw new Error("서버 응답에 URL이 없습니다.");
      }
    } catch (error) {
      console.error("업로드 실패:", error);
      Alert.alert("오류", "파일 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. 결과 재생 (Expo Audio SoundObject 사용)
  const playResult = async () => {
    if (!resultUrl) return;
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: resultUrl },
        { shouldPlay: true },
      );
      // 재생 끝날 때까지 기다리거나, 그냥 실행
    } catch (e) {
      Alert.alert("재생 오류", "오디오를 재생할 수 없습니다.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <AppHeader title="딥페이크 체험" />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.desc}>
          10초간 목소리를 녹음하면,{"\n"}AI가 내 목소리로 사칭 범죄 음성을
          생성합니다.
        </Text>

        <View style={styles.centerArea}>
          {!audioUri ? (
            // 녹음 전/중
            <TouchableOpacity
              style={[styles.recordBtn, recording && styles.recordingBtn]}
              onPress={recording ? stopRecording : startRecording}
            >
              <MaterialIcons
                name={recording ? "stop" : "mic"}
                size={50}
                color="white"
              />
            </TouchableOpacity>
          ) : (
            // 녹음 완료
            <View style={styles.resultBox}>
              <Text style={styles.completeText}>녹음 완료!</Text>

              {!resultUrl ? (
                // 변환 전: 업로드 버튼
                <TouchableOpacity
                  style={styles.uploadBtn}
                  onPress={handleUploadAndConvert}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <ActivityIndicator
                        color="#fff"
                        style={{ marginRight: 10 }}
                      />
                      <Text style={styles.btnText}>서버로 전송 중...</Text>
                    </View>
                  ) : (
                    <Text style={styles.btnText}>AI 딥페이크 생성하기</Text>
                  )}
                </TouchableOpacity>
              ) : (
                // 변환 완료: 재생 버튼
                <View style={{ width: "100%" }}>
                  <TouchableOpacity
                    style={styles.playBtn}
                    onPress={playResult} // ✅ 실제 재생 함수 연결
                  >
                    <MaterialIcons
                      name="play-circle-filled"
                      size={24}
                      color="white"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={[styles.btnText, { fontSize: 18 }]}>
                      변조된 목소리 듣기
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.warningText}>
                    ※ 주의: 실제 범죄에 악용될 수 있을 만큼 정교합니다.
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={() => {
                  setAudioUri(null);
                  setResultUrl(null);
                }}
                style={{ marginTop: 20 }}
              >
                <Text
                  style={{ color: "#888", textDecorationLine: "underline" }}
                >
                  다시 녹음하기
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, alignItems: "center" },
  desc: {
    textAlign: "center",
    color: "#666",
    marginBottom: 40,
    marginTop: 150,
    lineHeight: 22,
  },
  centerArea: { width: "100%", alignItems: "center" },
  recordBtn: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#0F1D3A",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  recordingBtn: {
    backgroundColor: "#D32F2F",
    borderWidth: 4,
    borderColor: "#FFCDD2",
  },

  resultBox: { width: "100%", alignItems: "center" },
  completeText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  uploadBtn: {
    backgroundColor: "#0F1D3A",
    paddingVertical: 16,
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
  },
  playBtn: {
    backgroundColor: "#1565C0",
    paddingVertical: 18,
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  btnText: { color: "white", fontSize: 16, fontWeight: "bold" },
  warningText: {
    marginTop: 10,
    color: "#D32F2F",
    fontSize: 12,
    textAlign: "center",
  },
});
