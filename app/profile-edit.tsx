import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppHeader from "../components/AppHeader";
// ✅ API 함수 불러오기
import { getMyProfile, updateProfile } from "../api/auth";

const NAVY = "#0F1D3A";

export default function ProfileEdit() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 입력 상태 관리
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // 1. 초기 데이터 불러오기
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data: any = await getMyProfile();
      // 서버 필드명에 맞춰서 state 설정
      setName(data.name || data.nickname || "");
      setPhone(data.phone || "");
      setEmail(data.email || "");
    } catch (error) {
      console.error("프로필 로딩 실패:", error);
      Alert.alert("오류", "정보를 불러오지 못했습니다.");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  // 2. 저장 버튼 핸들러
  const handleSave = async () => {
    // 유효성 검사
    if (name.trim().length < 2) {
      Alert.alert("알림", "닉네임은 2글자 이상 입력해주세요.");
      return;
    }

    try {
      setSaving(true);

      // 변경할 데이터만 전송
      await updateProfile({
        name: name,
        phone: phone,
        // profile_image: ... (이미지 변경은 별도 로직 필요)
      });

      Alert.alert("성공", "프로필이 수정되었습니다.", [
        { text: "확인", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("수정 실패:", error);
      Alert.alert("오류", "프로필 수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.safe,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={NAVY} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader title="프로필 수정" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* 1. 프로필 사진 변경 영역 */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <MaterialCommunityIcons
                name="account"
                size={60}
                color="#9CA3AF"
              />
              <Pressable
                style={styles.cameraBadge}
                onPress={() =>
                  Alert.alert("준비 중", "사진 변경 기능은 추후 지원됩니다.")
                }
              >
                <MaterialCommunityIcons name="camera" size={18} color="#fff" />
              </Pressable>
            </View>
            <Text style={styles.avatarHint}>프로필 사진 변경</Text>
          </View>

          {/* 2. 입력 폼 영역 */}
          <View style={styles.formSection}>
            {/* 닉네임 입력 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>닉네임</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="닉네임을 입력하세요"
                placeholderTextColor="#9CA3AF"
              />
              <Text style={styles.helperText}>
                * 2~10자 이내의 한글, 영문, 숫자를 사용해주세요.
              </Text>
            </View>

            {/* 이메일 (수정 불가) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>이메일 (로그인 계정)</Text>
              <View style={[styles.inputView, styles.disabledInput]}>
                <Text style={{ color: "#6B7280" }}>{email}</Text>
                <MaterialCommunityIcons name="lock" size={16} color="#9CA3AF" />
              </View>
            </View>

            {/* 전화번호 입력 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>휴대폰 번호</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="010-0000-0000"
              />
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* 3. 하단 저장 버튼 */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>저장하기</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  scroll: { padding: 24 },

  // 아바타 섹션
  avatarSection: { alignItems: "center", marginBottom: 32 },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    position: "relative",
  },
  cameraBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: NAVY,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarHint: { fontSize: 14, color: "#6B7280", fontWeight: "600" },

  // 폼 섹션
  formSection: { gap: 24 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: "700", color: "#111827" },

  // TextInput 스타일
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#111",
    backgroundColor: "#fff",
  },
  // View로 만든 Input 모양 (Read Only용)
  inputView: {
    height: 52,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  disabledInput: {
    backgroundColor: "#F9FAFB",
    borderColor: "#F3F4F6",
  },
  helperText: { fontSize: 12, color: "#9CA3AF", marginLeft: 4 },

  // 하단 버튼
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  saveBtn: {
    height: 56,
    backgroundColor: NAVY,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: { fontSize: 16, fontWeight: "bold", color: "#fff" },
});
