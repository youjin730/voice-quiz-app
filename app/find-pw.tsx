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

export default function FindPwScreen() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleFindPw = () => {
    // 1. 입력값 검증
    if (!id.trim()) {
      Alert.alert("알림", "아이디를 입력해주세요.");
      return;
    }
    if (!name.trim()) {
      Alert.alert("알림", "이름을 입력해주세요.");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("알림", "휴대폰 번호를 입력해주세요.");
      return;
    }

    // 2. (가상) API 호출 결과 시뮬레이션
    Alert.alert(
      "임시 비밀번호 발급 완료",
      `입력하신 휴대폰 번호(${phone})로\n임시 비밀번호가 전송되었습니다.\n로그인 후 반드시 변경해주세요.`,
      [
        {
          text: "로그인하러 가기",
          onPress: () => router.push("/"), // 로그인 화면으로 이동
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="비밀번호 찾기" hideRightIcon={true} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerArea}>
            <Text style={styles.title}>비밀번호를 잊으셨나요?</Text>
            <Text style={styles.subtitle}>
              가입 시 등록한 아이디, 이름, 휴대폰 번호를 입력하면 임시
              비밀번호를 발송해 드립니다.
            </Text>
          </View>

          {/* 입력 폼 */}
          <View style={styles.formArea}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>아이디</Text>
              <TextInput
                style={styles.input}
                placeholder="아이디를 입력하세요"
                value={id}
                onChangeText={setId}
                placeholderTextColor="#aaa"
                autoCapitalize="none"
              />
            </View>

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
                placeholder="숫자만 입력"
                value={phone}
                onChangeText={setPhone}
                keyboardType="number-pad"
                placeholderTextColor="#aaa"
                maxLength={11}
              />
            </View>
          </View>

          {/* 버튼 영역 */}
          <View style={styles.buttonArea}>
            <TouchableOpacity
              style={[
                styles.findButton,
                (!id || !name || !phone) && styles.disabledButton,
              ]}
              onPress={handleFindPw}
              disabled={!id || !name || !phone}
            >
              <Text style={styles.buttonText}>임시 비밀번호 발급</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 24,
    flexGrow: 1,
  },

  headerArea: {
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F1D3A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },

  formArea: {
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
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

  buttonArea: {
    alignItems: "center",
    gap: 16,
  },
  findButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#0F1D3A",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#A0A0A0",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
