import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppHeader from "../components/AppHeader";

export default function MyPage() {
  // 더미 데이터
  const user = {
    name: "분홍샌들의겸손한치타",
    email: "user@example.com",
    provider: "kakao", // 'kakao' | 'google'
    joinDate: "2024.02.15",
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ✅ 수정된 부분: 우측 아이콘 강제 설정 */}
      <AppHeader
        title="마이페이지"
        rightIconName="cog-outline"
        onRightPress={() => router.push("/setting")}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 1. 프로필 카드 */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={40} color="#9CA3AF" />
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.providerBadge}>
              <MaterialCommunityIcons
                name={user.provider === "kakao" ? "message" : "google"}
                size={14}
                color="#000"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.badgeText}>
                {user.provider === "kakao" ? "카카오 로그인" : "구글 로그인"}
              </Text>
            </View>
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
            onPress={() => alert("알림 설정")}
          />
          <MenuItem
            icon="shield-check-outline"
            label="개인정보 처리방침"
            onPress={() => alert("개인정보 처리방침")}
          />
          <MenuItem
            icon="file-document-outline"
            label="이용약관"
            onPress={() => alert("이용약관")}
          />
          <MenuItem
            icon="help-circle-outline"
            label="문의하기"
            onPress={() => alert("문의하기")}
          />
        </View>

        {/* 3. 하단 버튼 (로그아웃/탈퇴) */}
        <View style={styles.footerSection}>
          <Pressable
            style={styles.logoutBtn}
            onPress={() => alert("로그아웃 되었습니다.")}
          >
            <Text style={styles.logoutText}>로그아웃</Text>
          </Pressable>
          <Pressable
            style={styles.deleteBtn}
            onPress={() => alert("회원탈퇴 진행")}
          >
            <Text style={styles.deleteText}>회원탈퇴</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 메뉴 아이템 컴포넌트
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
