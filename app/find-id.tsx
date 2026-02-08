import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator, // 로딩 표시용 추가
} from "react-native";
import { router } from "expo-router";
import AppHeader from "../components/AppHeader";
// ✅ API 함수 불러오기
import { findId } from "../api/auth";

export default function FindIdScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  // 아이디 찾기 버튼 클릭 핸들러
  const handleFindId = async () => {
    // 1. 입력값 검증
    if (!name.trim()) {
      Alert.alert("알림", "이름을 입력해주세요.");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("알림", "휴대폰 번호를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);

      // 2. ✅ 서버 API 호출
      // 서버 응답 예시: { userId: "cheongeum_user", ... }
      const response: any = await findId(name, phone);

      // 3. 성공 처리
      if (response && response.userId) {
        Alert.alert(
          "아이디 찾기 성공",
          `${name}님의 아이디는\n[ ${response.userId} ] 입니다.`,
          [
            {
              text: "로그인하러 가기",
              onPress: () => router.replace("/"), // push 대신 replace 권장 (뒤로가기 방지)
              style: "default",
            },
            {
              text: "비밀번호 찾기",
              onPress: () => router.push("/find-pw"),
            },
          ],
        );
      } else {
        // 성공은 했지만 아이디가 없는 이상한 경우
        throw new Error("아이디를 찾을 수 없습니다.");
      }
    } catch (error: any) {
      console.error("아이디 찾기 실패:", error);
      // 에러 메시지 처리 (서버가 주는 메시지 or 기본 메시지)
      const message =
        error.response?.data?.error?.message ||
        "일치하는 회원 정보가 없습니다.";
      Alert.alert("찾기 실패", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* AppHeader가 없어서 에러난다면 
         <View style={{height: 50}}><Text>헤더</Text></View> 등으로 임시 대체 
      */}
      <AppHeader title="아이디 찾기" hideRightIcon={true} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerArea}>
            <Text style={styles.title}>계정을 잊으셨나요?</Text>
            <Text style={styles.subtitle}>
              가입 시 등록한 이름과 휴대폰 번호를 입력해주세요.
            </Text>
          </View>

          <View style={styles.formArea}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>이름</Text>
              <TextInput
                style={styles.input}
                placeholder="이름을 입력하세요"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#aaa"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>휴대폰 번호</Text>
              <TextInput
                style={styles.input}
                placeholder="숫자만 입력 (예: 01012345678)"
                value={phone}
                onChangeText={setPhone}
                keyboardType="number-pad"
                placeholderTextColor="#aaa"
                maxLength={11}
              />
            </View>
          </View>

          <View style={styles.buttonArea}>
            <TouchableOpacity
              style={[
                styles.findButton,
                (!name || !phone || isLoading) && styles.disabledButton,
              ]}
              onPress={handleFindId}
              disabled={!name || !phone || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>아이디 찾기</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.textLinkButton}
              onPress={() => router.push("/find-pw")}
            >
              <Text style={styles.textLink}>비밀번호 찾기 &gt;</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 24, flexGrow: 1 },
  headerArea: { marginTop: 20, marginBottom: 40 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F1D3A",
    marginBottom: 8,
  },
  subtitle: { fontSize: 14, color: "#666", lineHeight: 20 },
  formArea: { marginBottom: 40 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#F8F9FA",
  },
  buttonArea: { alignItems: "center", gap: 16 },
  findButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#0F1D3A",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: { backgroundColor: "#A0A0A0" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  textLinkButton: { padding: 10 },
  textLink: { color: "#666", fontSize: 14, textDecorationLine: "underline" },
});
