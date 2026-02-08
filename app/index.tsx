import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
  Linking,
  TouchableOpacity,
  Dimensions,
  Alert, // 알림창 추가
} from "react-native";
import {
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome,
} from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function Landing() {
  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  // 소셜 로그인 핸들러 (임시)
  const handleSocialLogin = (provider: string) => {
    // 나중에 백엔드 API 연동 시 여기에 로직 추가
    Alert.alert(
      "알림",
      `${provider} 로그인은 현재 준비 중입니다.\n일반 로그인을 이용해주세요.`,
    );
  };

  return (
    <View style={styles.container}>
      {/* 1. 상단 & 중단: 브랜드 로고 및 로그인 */}
      <View style={styles.upperSection}>
        {/* 로고 영역 */}
        <View style={styles.logoArea}>
          <Text style={styles.logoHanja}>淸音</Text>
          <View style={styles.logoLine} />
          <Text style={styles.logoKorean}>청 음</Text>
          <Text style={styles.subtitle}>진짜 속에 숨어있는 가짜를 찾아라</Text>
        </View>

        {/* 로그인 버튼 영역 */}
        <View style={styles.loginArea}>
          {/* 1) [수정됨] 일반 로그인 버튼 -> 로그인 페이지로 이동 */}
          <Pressable
            style={[styles.loginBtn, styles.generalLogin]}
            onPress={() => router.push("/login")}
          >
            <MaterialCommunityIcons
              name="email-outline"
              size={20}
              color="#333"
              style={styles.btnIcon}
            />
            <Text style={styles.loginText}>이메일로 로그인</Text>
          </Pressable>

          {/* 2) 구글 로그인 버튼 */}
          <Pressable
            style={[styles.loginBtn, styles.google]}
            onPress={() => handleSocialLogin("Google")}
          >
            <AntDesign
              name="google"
              size={20}
              color="#333"
              style={styles.btnIcon}
            />
            <Text style={[styles.loginText, styles.googleText]}>
              구글 계정으로 시작
            </Text>
          </Pressable>

          {/* 3) 카카오 로그인 버튼 */}
          <Pressable
            style={[styles.loginBtn, styles.kakao]}
            onPress={() => handleSocialLogin("Kakao")}
          >
            <FontAwesome
              name="comment"
              size={20}
              color="#3B1E1E"
              style={styles.btnIcon}
            />
            <Text style={[styles.loginText, styles.kakaoText]}>
              카카오 계정으로 시작
            </Text>
          </Pressable>

          {/* 4) 회원가입 | 아이디 찾기 링크 */}
          <View style={styles.linkContainer}>
            <TouchableOpacity
              onPress={() => router.push("/signup")}
              hitSlop={10}
            >
              <Text style={styles.linkText}>회원가입</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              onPress={() => Alert.alert("알림", "준비 중입니다.")}
              hitSlop={10}
            >
              <Text style={styles.linkText}>아이디 찾기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 2. 하단: 긴급 신고 센터 */}
      <View style={styles.bottomSection}>
        <View style={styles.emergencyHeader}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={18}
            color="#666"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.emergencyLabel}>긴급 신고 및 상담 바로가기</Text>
        </View>

        <View style={styles.iconRow}>
          {/* 경찰청 */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => handleCall("112")}
          >
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="alarm-light"
                size={26}
                color="#0F1D3A"
              />
            </View>
            <Text style={styles.iconText}>112 신고</Text>
          </TouchableOpacity>

          {/* 금융감독원 */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => handleCall("1332")}
          >
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="bank-outline"
                size={26}
                color="#0F1D3A"
              />
            </View>
            <Text style={styles.iconText}>금감원</Text>
          </TouchableOpacity>

          {/* KISA */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => handleCall("118")}
          >
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="shield-alert-outline"
                size={26}
                color="#0F1D3A"
              />
            </View>
            <Text style={styles.iconText}>KISA</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  upperSection: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 20,
  },

  logoArea: {
    alignItems: "center",
    marginBottom: 60,
    marginTop: 80, // 상단 여백 조정
  },
  logoHanja: {
    fontSize: 64,
    fontWeight: "900",
    color: "#0F1D3A",
    fontFamily: Platform.OS === "ios" ? "Times New Roman" : "serif",
  },
  logoLine: {
    width: 24,
    height: 3,
    backgroundColor: "#0F1D3A",
    marginVertical: 16,
  },
  logoKorean: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F1D3A",
    letterSpacing: 14,
    marginLeft: 14,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },

  loginArea: {
    gap: 12,
  },
  loginBtn: {
    height: 52,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  btnIcon: { marginRight: 10 },
  loginText: { fontSize: 16, fontWeight: "700", color: "#333" },

  generalLogin: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#0F1D3A",
  },

  google: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  googleText: { color: "#333" },

  kakao: { backgroundColor: "#FEE500" },
  kakaoText: { color: "#3B1E1E" },

  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  linkText: {
    color: "#888",
    fontSize: 13,
    fontWeight: "500",
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: "#ccc",
    marginHorizontal: 16,
  },

  bottomSection: {
    backgroundColor: "#F8F9FA",
    paddingTop: 30,
    paddingBottom: 50,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 5,
  },
  emergencyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  emergencyLabel: {
    fontSize: 13,
    color: "#888",
    fontWeight: "600",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 40,
  },
  iconBtn: {
    alignItems: "center",
    gap: 8,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },
  iconText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
});
