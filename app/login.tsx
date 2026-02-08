import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// ✅ API 함수 import (경로 확인해주세요!)
import { login } from "../api/auth";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  // 로그인 처리 함수
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("알림", "이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      // 1. 로그인 API 호출
      const response: any = await login({ email, password });

      console.log("로그인 응답:", response.data);

      // 2. 성공 여부 확인 (success: true)
      if (response.data.success) {
        console.log("로그인 성공!");
        // 3. 홈 화면으로 이동 (뒤로가기 방지 replace 사용)
        router.replace("/home");
      } else {
        Alert.alert("로그인 실패", "이메일 또는 비밀번호를 확인해주세요.");
      }
    } catch (error: any) {
      console.error("로그인 에러:", error);
      Alert.alert("오류", "로그인 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          {/* 1. 로고 및 타이틀 */}
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <MaterialCommunityIcons
                name="shield-check"
                size={40}
                color="#0F1D3A"
              />
            </View>
            <Text style={styles.title}>청음</Text>
            <Text style={styles.subtitle}>보이스피싱, 듣고 막아내다</Text>
          </View>

          {/* 2. 입력 폼 */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>이메일</Text>
              <TextInput
                style={styles.input}
                placeholder="example@email.com"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>비밀번호</Text>
              <View style={styles.pwContainer}>
                <TextInput
                  style={styles.inputPw}
                  placeholder="비밀번호 입력"
                  placeholderTextColor="#aaa"
                  secureTextEntry={!showPw}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPw(!showPw)}
                  style={styles.eyeBtn}
                >
                  <MaterialCommunityIcons
                    name={showPw ? "eye" : "eye-off"}
                    size={22}
                    color="#aaa"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* 3. 로그인 버튼 */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginBtnText}>로그인</Text>
              )}
            </TouchableOpacity>

            <View style={styles.links}>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert("준비 중", "비밀번호 찾기 기능은 준비 중입니다.")
                }
              >
                <Text style={styles.linkText}>비밀번호 찾기</Text>
              </TouchableOpacity>
              <View style={styles.bar} />
              <TouchableOpacity onPress={() => router.push("/signup")}>
                <Text style={styles.linkTextBold}>회원가입</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 4. 소셜 로그인 (디자인용) */}
          <View style={styles.socialSection}>
            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.orText}>또는</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={[styles.socialBtn, { backgroundColor: "#FEE500" }]}
              >
                <MaterialCommunityIcons
                  name="chat-processing"
                  size={24}
                  color="#3c1e1e"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.socialBtn,
                  {
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    borderColor: "#ddd",
                  },
                ]}
              >
                <Image
                  source={{
                    uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png",
                  }}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: "center" },

  header: { alignItems: "center", marginBottom: 40 },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#F0F2F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 28, fontWeight: "900", color: "#0F1D3A", marginBottom: 4 },
  subtitle: { fontSize: 16, color: "#888", fontWeight: "500" },

  form: { marginBottom: 24 },
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 52,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  pwContainer: {
    height: 52,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  inputPw: { flex: 1, fontSize: 16, color: "#333", height: "100%" },
  eyeBtn: { padding: 4 },

  actions: { marginBottom: 40 },
  loginBtn: {
    height: 56,
    backgroundColor: "#0F1D3A",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0F1D3A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 20,
  },
  loginBtnText: { color: "#fff", fontSize: 18, fontWeight: "700" },

  links: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  linkText: { color: "#666", fontSize: 14 },
  linkTextBold: { color: "#0F1D3A", fontSize: 14, fontWeight: "700" },
  bar: { width: 1, height: 12, backgroundColor: "#ddd", marginHorizontal: 16 },

  socialSection: { alignItems: "center" },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  line: { flex: 1, height: 1, backgroundColor: "#eee" },
  orText: { marginHorizontal: 10, color: "#aaa", fontSize: 12 },
  socialButtons: { flexDirection: "row", gap: 16 },
  socialBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
});
