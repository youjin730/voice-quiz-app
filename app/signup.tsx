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
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppHeader from "../components/AppHeader";
import { signup } from "../api/auth";

export default function SignupScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 입력 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  // const [address, setAddress] = useState(""); // 주소 제거함
  const [phone, setPhone] = useState("");

  // 비밀번호 보이기/숨기기 토글
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // 유효성 검사 (비밀번호 일치만 확인)
  const isPwMatch = password && confirmPw && password === confirmPw;

  // ✅ [수정됨] 주소(address) 제거, 비밀번호 길이 제한 없음 (그냥 입력만 하면 됨)
  const isFormValid =
    email.length > 0 &&
    password.length > 0 &&
    confirmPw.length > 0 &&
    name.length > 0 &&
    birth.length > 0 &&
    // address &&  <-- 제거됨
    phone.length > 0 &&
    isPwMatch;

  const handleSignup = async () => {
    if (!isFormValid) {
      Alert.alert("입력 오류", "모든 정보를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      // ✅ [수정] 명세서에 맞춰서 딱 4개만 보냅니다!
      const userData = {
        email: email,
        password: password,
        name: name,
        // 전화번호에서 하이픈(-) 제거해서 숫자만 보냄
        phone: phone.replace(/-/g, ""),
      };

      // birth, address는 안 보냅니다!
      console.log("보내는 데이터:", userData); // 로그로 확인

      // API 호출 (주소는 /api/auth/register 로 잘 되어있는지 확인!)
      await signup(userData);

      Alert.alert("가입 완료", "청음의 회원이 되신 것을 환영합니다!", [
        {
          text: "로그인하러 가기",
          onPress: () => router.replace("/"),
        },
      ]);
      // app/signup.tsx 의 catch 부분 교체
      // app/signup.tsx 하단
    } catch (error: any) {
      // 1. 에러의 정체를 낱낱이 파헤쳐서 로그에 찍습니다.
      console.log("================ 에러 상세 로그 ================");
      console.log("1. 에러 상태 코드:", error.response?.status);
      console.log(
        "2. 서버 응답 데이터:",
        JSON.stringify(error.response?.data, null, 2),
      );
      console.log("================================================");

      // 2. 화면에도 에러 내용을 띄워줍니다.
      const serverMsg =
        error.response?.data?.message || JSON.stringify(error.response?.data);

      Alert.alert(
        "회원가입 실패",
        `이유: ${serverMsg ? serverMsg : "서버 연결 오류"}\n(상태코드: ${error.response?.status})`,
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader title="회원가입" hideRightIcon={true} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* 상단 안내 문구 */}
          <View style={styles.headerTextBox}>
            <Text style={styles.welcomeText}>환영합니다!</Text>
            <Text style={styles.subText}>
              회원가입을 위해{"\n"}정보를 입력해주세요.
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
                  placeholder="아이디 입력"
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
                  placeholder="비밀번호 입력" // 8자 이상 문구 제거
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
                  placeholder="비밀번호 재입력"
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
                  placeholder="이름 입력"
                  placeholderTextColor="#bbb"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* 5. 생년월일 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>생년월일</Text>
              <View style={styles.inputBox}>
                <MaterialCommunityIcons
                  name="calendar-month"
                  size={20}
                  color="#888"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="예: 990101"
                  placeholderTextColor="#bbb"
                  keyboardType="number-pad"
                  maxLength={8}
                  value={birth}
                  onChangeText={setBirth}
                />
              </View>
            </View>

            {/* 6. 휴대폰 번호 */}
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
                  placeholder="전화번호 입력"
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

        {/* 가입 완료 버튼 */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitBtn,
              (!isFormValid || loading) && styles.disabledBtn,
            ]}
            onPress={handleSignup}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>가입 완료하기</Text>
            )}
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
