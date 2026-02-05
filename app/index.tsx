import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Landing() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>app name</Text>
        <Text style={styles.subtitle}>진짜속에 숨어있는 가짜를 찾아라</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.btn, styles.google]}
          onPress={() => router.push("/home")}
        >
          <Text style={styles.btnText}>구글 계정 로그인</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, styles.kakao]}
          onPress={() => router.push("/home")}
        >
          <Text style={[styles.btnText, styles.kakaoText]}>
            카카오 계정 로그인
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  header: { alignItems: "center", marginTop: 180 },
  title: {
    fontSize: 40,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: { fontSize: 14, textAlign: "center", color: "#555" },
  actions: { marginTop: "auto", paddingBottom: 90 },
  btn: {
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  google: { backgroundColor: "#e9e9e9" },
  kakao: { backgroundColor: "#FEE500" },
  btnText: { fontSize: 15, fontWeight: "600" },
  kakaoText: { color: "#111" },
});
