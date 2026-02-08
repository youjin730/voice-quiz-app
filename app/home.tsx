import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppHeader from "../components/AppHeader";
import { getScenarios } from "../api/training";

// 브랜드 컬러 상수
const NAVY = "#0F1D3A";

export default function Home() {
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  // 🎲 랜덤 훈련 시작 함수
  const handleRandomStart = async () => {
    try {
      setLoading(true); // 로딩 시작 (버튼 비활성화 등을 위해)

      // 1. 시나리오 목록을 가져옴
      const response: any = await getScenarios();
      const items = response.data?.data?.items || response.data?.items || [];

      if (items.length > 0) {
        // 2. 랜덤 인덱스 뽑기 (0 ~ 개수-1)
        const randomIndex = Math.floor(Math.random() * items.length);
        const selectedScenario = items[randomIndex];

        console.log("시나리오:", selectedScenario.title);

        // 3. 바로 롱폼(통화) 화면으로 이동!
        router.push({
          pathname: "/long-form",
          params: {
            scenarioId: selectedScenario.id, // 당첨된 ID
            title: selectedScenario.title,
            category: selectedScenario.category,
          },
        });
      } else {
        // 데이터가 없을 때 (혹시 모를 대비)
        Alert.alert("알림", "준비된 훈련 시나리오가 없습니다.");
      }
    } catch (error) {
      console.error("랜덤 시작 실패:", error);
      // 에러 나면 그냥 1번 시나리오로 강제 이동 (테스트용)
      router.push({
        pathname: "/long-form",
        params: {
          scenarioId: 1,
          title: "보이스피싱 실전 훈련",
          category: "loan",
        },
      });
    } finally {
      setLoading(false); // 로딩 끝
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#F6F7FB" }}>
      <AppHeader hideBack={true} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* 메뉴 1: 목소리 사칭 방어훈련 (메인 - 네이비 배경) */}
        {/* 메인 카드는 그대로 강조 유지 */}
        <Pressable
          style={[styles.card, styles.mainCard]}
          onPress={() => router.push("/train-setup")}
        >
          <View style={styles.iconBoxMain}>
            <MaterialCommunityIcons
              name="shield-account"
              size={32}
              color="#fff"
            />
          </View>
          <View style={styles.cardTextBox}>
            <Text style={[styles.cardTitle, { color: "#fff" }]}>
              목소리 사칭 방어훈련
            </Text>
            <Text style={[styles.cardDesc, { color: "#E3F2FD" }]}>
              수사관/대출 사칭 유형별 실전 훈련
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#fff" />
        </Pressable>

        {/* 메뉴 2: 내 목소리 딥페이크 체험 */}
        <Pressable style={styles.card} onPress={() => router.push("/deepfake")}>
          {/* 기존 파란색 배경 -> 연한 회색 + 네이비 아이콘으로 변경 */}
          <View style={styles.iconBoxSub}>
            <MaterialCommunityIcons
              name="microphone-outline"
              size={24}
              color={NAVY} // 브랜드 컬러로 통일
            />
          </View>
          <View style={styles.cardTextBox}>
            <Text style={styles.cardTitle}>내 목소리 딥페이크 체험</Text>
            <Text style={styles.cardDesc}>AI가 복제한 내 목소리 들어보기</Text>
          </View>
        </Pressable>

        {/* 메뉴 3: 개인 피드백 리포트 */}
        <Pressable style={styles.card} onPress={() => router.push("/feedback")}>
          {/* 기존 보라색 배경 -> 연한 회색 + 네이비 아이콘으로 변경 */}
          <View style={styles.iconBoxSub}>
            <MaterialCommunityIcons
              name="chart-bar"
              size={24}
              color={NAVY} // 브랜드 컬러로 통일
            />
          </View>
          <View style={styles.cardTextBox}>
            <Text style={styles.cardTitle}>개인 피드백 리포트</Text>
            <Text style={styles.cardDesc}>나의 취약점 분석 및 행동 가이드</Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 50 },

  // 카드 공통 스타일
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF", // 깨끗한 흰색 배경
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    alignItems: "center",
    // 그림자 효과로 고급스러움 추가
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "transparent", // 테두리 제거 (그림자로 대체)
  },

  // 메인 카드 (첫 번째) 스타일
  mainCard: {
    backgroundColor: NAVY,
    paddingVertical: 28,
    // 메인 카드는 그림자를 좀 더 진하게
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },

  // 메인 카드 아이콘 박스 (반투명)
  iconBoxMain: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)", // 흰색 반투명
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  // 서브 카드 아이콘 박스 (수정된 부분!)
  iconBoxSub: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#F1F5F9", // 아주 연한 회색 (깔끔함)
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  cardTextBox: { flex: 1 },

  cardTitle: {
    fontSize: 16,
    fontWeight: "800", // 폰트 굵기 강화
    color: "#111827",
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
});
