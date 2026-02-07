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
} from "react-native";
import { router } from "expo-router";
import AppHeader from "../components/AppHeader";

export default function FindIdScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // 아이디 찾기 버튼 클릭 핸들러
  const handleFindId = () => {
    // 1. 입력값 검증
    if (!name.trim()) {
      Alert.alert("알림", "이름을 입력해주세요.");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("알림", "휴대폰 번호를 입력해주세요.");
      return;
    }

    // 2. 결과 알림창 (비밀번호 찾기 버튼 연결됨)
    Alert.alert(
      "아이디 찾기 성공",
      `${name}님의 아이디는\n[ cheongeum_user ] 입니다.`,
      [
        {
          text: "로그인하러 가기",
          onPress: () => router.push("/"),
          style: "default",
        },
        {
          text: "비밀번호 찾기",
          onPress: () => router.push("/find-pw"), // 여기가 핵심입니다!
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
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
                (!name || !phone) && styles.disabledButton,
              ]}
              onPress={handleFindId}
              disabled={!name || !phone}
            >
              <Text style={styles.buttonText}>아이디 찾기</Text>
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
