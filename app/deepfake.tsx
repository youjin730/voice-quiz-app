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

export default function DeepfakeScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 서버 통신 및 AI 생성 대기
  const [resultUrl, setResultUrl] = useState<string | null>(null); // 완성된 딥페이크 URL

  // 1. 녹음 시작
  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status !== "granted") return;

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

  // 3. [핵심] 서버로 파일 전송 (S3 업로드 -> AI 변환)
  const handleUploadAndConvert = async () => {
    if (!audioUri) return;
    setIsLoading(true);

    // 실제 백엔드 전송 로직 (FormData 사용)
    const formData = new FormData();
    formData.append("file", {
      uri: audioUri,
      type: "audio/m4a", // 녹음 파일 타입
      name: "user_voice.m4a",
    } as any);

    try {
      // === [서버 시뮬레이션] ===
      // 실제 코드: const response = await fetch('YOUR_API_URL/voice-cloning', { method: 'POST', body: formData });

      console.log("1. 백엔드로 파일 전송 중...");
      console.log("2. 백엔드에서 S3 업로드 중...");
      console.log("3. ElevenLabs API에 텍스트와 S3 URL 전달...");

      // 4초 딜레이로 AI 생성 시간 흉내
      setTimeout(() => {
        setIsLoading(false);
        setResultUrl("https://example.com/fake_voice.mp3"); // 결과 URL 반환 가정
        Alert.alert("완료", "내 목소리가 딥페이크로 변조되었습니다.");
      }, 4000);
    } catch (error) {
      Alert.alert("오류", "서버 통신 실패");
      setIsLoading(false);
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
                      <Text style={styles.btnText}>AI 변환 중...</Text>
                    </View>
                  ) : (
                    <Text style={styles.btnText}>AI 딥페이크 생성하기</Text>
                  )}
                </TouchableOpacity>
              ) : (
                // 변환 완료: 재생 버튼
                // [수정] 여기 View에 width: '100%'를 추가했습니다!
                <View style={{ width: "100%" }}>
                  <TouchableOpacity
                    style={styles.playBtn}
                    onPress={() =>
                      Alert.alert("재생", "변조된 목소리가 재생됩니다.")
                    }
                  >
                    {/* 아이콘과 텍스트 크기를 좀 더 키워서 시원하게 만듦 */}
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
    paddingVertical: 18, // 높이도 살짝 키움
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center", // 가운데 정렬 추가
    flexDirection: "row", // 아이콘과 텍스트 가로 배치

    // 그림자 추가해서 더 버튼답게
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
