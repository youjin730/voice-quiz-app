import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppHeader from "../components/AppHeader";
// ✅ API 함수 불러오기
import { getMyProfile, logout } from "../api/auth";

export default function MyPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. 내 정보 가져오기 (화면 로드 시)
  useEffect(() => {
    fetchProfile();
  }, []);

  // app/MyPage.tsx 내부의 fetchProfile 함수 교체

  const fetchProfile = async () => {
    try {
      setLoading(true);

      // 1. API 호출
      const response = await getMyProfile();

      // 🔍 로그로 확인해보세요 (개발자 도구 터미널)
      console.log("서버 전체 응답:", response.data);

      // 2. 데이터 꺼내기 (구조: response.data.data)
      if (response.data && response.data.success) {
        console.log("가져온 유저 정보:", response.data.data);
        setUser(response.data.data); // ✅ 여기에 진짜 정보가 들어있음!
      } else {
        console.log("데이터 형식이 다르거나 실패함");
        setUser(null);
      }
    } catch (error: any) {
      console.error("프로필 로딩 실패:", error);

      // 만약 401(인증 실패) 에러라면 로그인이 풀린 것임
      if (error.response?.status === 401) {
        console.log("로그인이 필요합니다.");
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 2. 로그아웃 처리
  const handleLogout = async () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          try {
            await logout(); // 서버에 로그아웃 요청
            router.replace("/"); // 랜딩 페이지로 이동
          } catch (e) {
            console.error(e);
            // 서버 에러 나도 일단 화면 이동은 시켜줌
            router.replace("/");
          }
        },
      },
    ]);
  };

  // 로딩 화면
  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.safe,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#0F1D3A" />
      </SafeAreaView>
    );
  }

  // 데이터가 없을 때 (로그인 안 된 상태 등)
  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <AppHeader title="마이페이지" />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>로그인 정보가 없습니다.</Text>
          <Pressable
            onPress={() => router.replace("/")}
            style={{ marginTop: 20, padding: 10 }}
          >
            <Text style={{ color: "blue" }}>로그인하러 가기</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* 우측 아이콘 강제 설정 */}
      <AppHeader
        title="마이페이지"
        rightIconName="cog-outline"
        onRightPress={() => router.push("/setting")}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 1. 프로필 카드 */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            {/* 프로필 이미지가 있으면 보여주고 없으면 아이콘 */}
            {user.profile_image ? (
              // 이미지 컴포넌트 필요 (여기선 아이콘으로 대체)
              <MaterialCommunityIcons
                name="account"
                size={40}
                color="#9CA3AF"
              />
            ) : (
              <MaterialCommunityIcons
                name="account"
                size={40}
                color="#9CA3AF"
              />
            )}
          </View>

          {/* 서버 필드명에 따라 수정 필요 (name or nickname) */}
          <Text style={styles.userName}>
            {user.name || user.nickname || "사용자"}
          </Text>
          <Text style={styles.userEmail}>{user.email || "-"}</Text>

          <View style={styles.badgeRow}>
            {/* 소셜 로그인 정보가 있으면 표시 */}
            {user.provider && (
              <View
                style={[
                  styles.providerBadge,
                  user.provider === "google" && {
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    borderColor: "#ddd",
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={user.provider === "kakao" ? "message" : "google"}
                  size={14}
                  color={user.provider === "kakao" ? "#3C1E1E" : "#333"}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.badgeText,
                    user.provider === "google" && { color: "#333" },
                  ]}
                >
                  {user.provider === "kakao" ? "카카오 로그인" : "구글 로그인"}
                </Text>
              </View>
            )}
            {/* 일반 로그인일 경우 뱃지 안 보이게 하거나 '이메일 로그인' 표시 */}
          </View>

          <Pressable
            style={styles.editBtn}
            onPress={() => router.push("/profile-edit")}
          >
            <Text style={styles.editBtnText}>프로필 수정</Text>
          </Pressable>
        </View>

        {/* 2. 메뉴 리스트 (계정 설정) */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>계정 설정</Text>

          <MenuItem
            icon="bell-outline"
            label="알림 설정"
            onPress={() =>
              Alert.alert("준비 중", "알림 설정 기능은 준비 중입니다.")
            }
          />
          <MenuItem
            icon="shield-check-outline"
            label="개인정보 처리방침"
            onPress={() =>
              Alert.alert("안내", "개인정보 처리방침 페이지로 이동합니다.")
            }
          />
          <MenuItem
            icon="file-document-outline"
            label="이용약관"
            onPress={() => Alert.alert("안내", "이용약관 페이지로 이동합니다.")}
          />
          <MenuItem
            icon="help-circle-outline"
            label="문의하기"
            onPress={() => Alert.alert("안내", "고객센터로 연결합니다.")}
          />
        </View>

        {/* 3. 하단 버튼 (로그아웃/탈퇴) */}
        <View style={styles.footerSection}>
          <Pressable style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </Pressable>
          <Pressable
            style={styles.deleteBtn}
            onPress={() =>
              Alert.alert("회원탈퇴", "정말 탈퇴하시겠습니까?", [
                { text: "취소", style: "cancel" },
                {
                  text: "탈퇴하기",
                  style: "destructive",
                  onPress: () =>
                    Alert.alert("알림", "탈퇴 처리는 고객센터에 문의해주세요."),
                },
              ])
            }
          >
            <Text style={styles.deleteText}>회원탈퇴</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 메뉴 아이템 컴포넌트 (그대로 사용)
function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <MaterialCommunityIcons name={icon} size={22} color="#4B5563" />
        <Text style={styles.menuText}>{label}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6F7FB" },
  scroll: { padding: 20 },

  // 프로필 카드
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  userName: { fontSize: 20, fontWeight: "800", color: "#111", marginBottom: 4 },
  userEmail: { fontSize: 14, color: "#6B7280", marginBottom: 16 },
  badgeRow: { flexDirection: "row", marginBottom: 20 },
  providerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE500", // 카카오 컬러
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { fontSize: 12, fontWeight: "600", color: "#3C1E1E" },
  editBtn: {
    width: "100%",
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  editBtnText: { fontSize: 14, fontWeight: "600", color: "#374151" },

  // 메뉴 섹션
  menuSection: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9CA3AF",
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuText: { fontSize: 15, fontWeight: "600", color: "#1F2937" },

  // 하단 버튼
  footerSection: { flexDirection: "row", justifyContent: "center", gap: 20 },
  logoutBtn: { padding: 10 },
  logoutText: {
    fontSize: 14,
    color: "#6B7280",
    textDecorationLine: "underline",
  },
  deleteBtn: { padding: 10 },
  deleteText: {
    fontSize: 14,
    color: "#EF4444",
    textDecorationLine: "underline",
  },
});
