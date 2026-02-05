import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppHeader from "../components/AppHeader";

export default function SettingScreen() {
  const router = useRouter();

  // 설정 상태 관리 (실제로는 저장소나 API와 연동 필요)
  const [pushEnabled, setPushEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: "#F6F7FB" }}>
      {/* 헤더: 뒤로가기 버튼 포함 */}
      <AppHeader title="설정" rightText="" />

      <ScrollView contentContainerStyle={styles.container}>
        {/* 1. 알림 설정 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림 설정</Text>
          <View style={styles.card}>
            {/* 훈련 알림 */}
            <View style={styles.row}>
              <View>
                <Text style={styles.rowLabel}>훈련 알림 받기</Text>
                <Text style={styles.rowDesc}>
                  매일 정해진 시간에 훈련 알림을 보냅니다.
                </Text>
              </View>
              <Switch
                trackColor={{ false: "#D1D1D6", true: "#0F1D3A" }}
                thumbColor={"#fff"}
                onValueChange={() => setPushEnabled(!pushEnabled)}
                value={pushEnabled}
              />
            </View>

            <View style={styles.divider} />

            {/* 마케팅 동의 */}
            <View style={styles.row}>
              <Text style={styles.rowLabel}>마케팅 정보 수신 동의</Text>
              <Switch
                trackColor={{ false: "#D1D1D6", true: "#0F1D3A" }}
                thumbColor={"#fff"}
                onValueChange={() => setMarketingEnabled(!marketingEnabled)}
                value={marketingEnabled}
              />
            </View>
          </View>
        </View>

        {/* 3. 앱 정보 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>앱 정보</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.linkRow}
              onPress={() =>
                Alert.alert("최신 버전", "현재 최신 버전을 사용 중입니다.")
              }
            >
              <Text style={styles.rowLabel}>버전 정보</Text>
              <View style={styles.rightContent}>
                <Text style={styles.versionText}>1.0.0</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color="#bbb"
                />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.linkRow}>
              <Text style={styles.rowLabel}>이용약관</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="#bbb"
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.linkRow}>
              <Text style={styles.rowLabel}>개인정보 처리방침</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="#bbb"
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.linkRow}>
              <Text style={styles.rowLabel}>오픈소스 라이선스</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="#bbb"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. 회원 탈퇴 (Danger Zone) */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() =>
            Alert.alert(
              "회원 탈퇴",
              "정말 탈퇴하시겠습니까? 모든 훈련 기록이 삭제됩니다.",
              [
                { text: "취소", style: "cancel" },
                {
                  text: "탈퇴",
                  style: "destructive",
                  onPress: () => router.replace("/"),
                },
              ],
            )
          }
        >
          <Text style={styles.deleteText}>회원 탈퇴</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },

  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#666",
    marginBottom: 8,
    marginLeft: 4,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
    // 그림자
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },

  rowLabel: { fontSize: 16, color: "#333", fontWeight: "500" },
  rowDesc: { fontSize: 12, color: "#999", marginTop: 2, maxWidth: 200 },

  divider: { height: 1, backgroundColor: "#F0F0F0" },

  rightContent: { flexDirection: "row", alignItems: "center" },
  versionText: { fontSize: 14, color: "#888", marginRight: 4 },

  deleteBtn: { alignItems: "center", padding: 15 },
  deleteText: {
    color: "#FF5252",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
