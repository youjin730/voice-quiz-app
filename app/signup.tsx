import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppHeader from "../components/AppHeader"; // 경로 확인 필요

export default function SignupScreen() {
  const router = useRouter();

  // 입력 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // 비밀번호 보이기/숨기기 토글
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // 간단한 유효성 검사 (비밀번호 일치 여부)
  const isPwMatch = password && confirmPw && password === confirmPw;
  const isFormValid =
    email && password && confirmPw && name && phone && isPwMatch;

  const handleSignup = () => {
    if (!isFormValid) {
      Alert.alert("입력 오류", "모든 정보를 올바르게 입력해주세요.");
      return;
    }

    // TODO: 백엔드 회원가입 API 호출 로직 들어갈 곳

    Alert.alert("가입 완료", "청음의 회원이 되신 것을 환영합니다!", [
      { text: "로그인하러 가기", onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader title="회원가입" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* 상단 안내 문구 */}
          <View style={styles.headerTextBox}>
            <Text style={styles.welcomeText}>환영합니다!</Text>
            <Text style={styles.subText}>
              안전한 보이스피싱 방어를 위해{"\n"}필수 정보를 입력해주세요.
            </Text>
          </View>

          {/* === 입력 폼 === */}
          <View style={styles.formContainer}>
            {/* 1. 이메일 (ID) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>이메일 아이디</Text>
              <View style={styles.inputBox}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color="#888"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="example@email.com"
                  placeholderTextColor="#bbb"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* 2. 비밀번호 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>비밀번호</Text>
              <View style={styles.inputBox}>
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  color="#888"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="영문, 숫자 포함 8자 이상"
                  placeholderTextColor="#bbb"
                  secureTextEntry={!showPw}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPw(!showPw)}>
                  <MaterialCommunityIcons
                    name={showPw ? "eye" : "eye-off"}
                    size={20}
                    color="#bbb"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* 3. 비밀번호 확인 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>비밀번호 확인</Text>
              <View
                style={[
                  styles.inputBox,
                  !isPwMatch && confirmPw.length > 0 && styles.errorBorder,
                ]}
              >
                <MaterialCommunityIcons
                  name="lock-check-outline"
                  size={20}
                  color="#888"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="비밀번호를 한 번 더 입력하세요"
                  placeholderTextColor="#bbb"
                  secureTextEntry={!showConfirmPw}
                  value={confirmPw}
                  onChangeText={setConfirmPw}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPw(!showConfirmPw)}
                >
                  <MaterialCommunityIcons
                    name={showConfirmPw ? "eye" : "eye-off"}
                    size={20}
                    color="#bbb"
                  />
                </TouchableOpacity>
              </View>
              {/* 비밀번호 불일치 메시지 */}
              {confirmPw.length > 0 && !isPwMatch && (
                <Text style={styles.errorText}>
                  비밀번호가 일치하지 않습니다.
                </Text>
              )}
            </View>

            {/* 4. 이름 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>이름</Text>
              <View style={styles.inputBox}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={20}
                  color="#888"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="실명을 입력해주세요"
                  placeholderTextColor="#bbb"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* 5. 휴대폰 번호 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>휴대폰 번호</Text>
              <View style={styles.inputBox}>
                <MaterialCommunityIcons
                  name="cellphone"
                  size={20}
                  color="#888"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="010-0000-0000"
                  placeholderTextColor="#bbb"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>
          </View>

          {/* 하단 여백 */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* 가입 완료 버튼 (하단 고정 느낌) */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitBtn, !isFormValid && styles.disabledBtn]}
            onPress={handleSignup}
            disabled={!isFormValid}
          >
            <Text style={styles.submitText}>가입 완료하기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { padding: 24 },

  headerTextBox: { marginTop: 20, marginBottom: 40 },
  welcomeText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F1D3A",
    marginBottom: 10,
  },
  subText: { fontSize: 16, color: "#666", lineHeight: 24 },

  formContainer: { gap: 20 },

  inputGroup: { marginBottom: 5 },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  errorBorder: { borderColor: "#FF5252", backgroundColor: "#FFEBEE" },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: "#333", height: "100%" },

  errorText: { color: "#FF5252", fontSize: 12, marginTop: 6, marginLeft: 4 },

  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  submitBtn: {
    height: 56,
    backgroundColor: "#0F1D3A",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0F1D3A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  disabledBtn: {
    backgroundColor: "#CFD8DC",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
