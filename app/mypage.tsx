import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppHeader from "../components/AppHeader";

type Summary = {
  userName: string;
  provider: "google" | "kakao";
  familyLinked: boolean;
  stats: {
    periodDays: 7 | 30;
    totalAttempts: number;
    correctCount: number;
    wrongCount: number;
    unknownCount: number;
  };
  weakPatterns: string[];
  lastTrainedAt: string; // ISO or readable
};

export default function MyPage() {
  // ✅ 더미 데이터: 나중에 API로 치환
  const summary: Summary = {
    userName: "분홍샌들의겸손한치타",
    provider: "kakao",
    familyLinked: false,
    stats: {
      periodDays: 7,
      totalAttempts: 24,
      correctCount: 14,
      wrongCount: 6,
      unknownCount: 4,
    },
    weakPatterns: ["기관 사칭 상황에서 흔들림", "긴 문장 음성에서 불확실↑"],
    lastTrainedAt: "2026-02-05 09:12",
  };

  const rates = useMemo(() => {
    const total = summary.stats.totalAttempts || 1;
    const correctRate = Math.round((summary.stats.correctCount / total) * 100);
    const unknownRate = Math.round((summary.stats.unknownCount / total) * 100);
    return { correctRate, unknownRate };
  }, [summary]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ flex: 1 }}>
        <AppHeader
          title="마이페이지"
          rightText="설정"
          onRightPress={() => {
            // 설정 화면이 없으면 일단 안내만
            // 나중에 router.push("/settings")로 교체
            // eslint-disable-next-line no-alert
            alert("설정(추후 연결)");
          }}
        />

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* 1) 프로필 영역 */}
          <View style={styles.profileWrap}>
            <View style={styles.avatar} />
            <Text style={styles.name}>{summary.userName}</Text>
            <Text style={styles.subLine}>
              {summary.provider === "kakao" ? "카카오 로그인" : "구글 로그인"} ·{" "}
              최근 훈련 {summary.lastTrainedAt}
            </Text>

            <Pressable
              style={styles.editBtn}
              onPress={() => alert("내 정보 수정(추후 연결)")}
            >
              <Text style={styles.editBtnText}>내 정보 수정</Text>
            </Pressable>
          </View>

          {/* 2) 퀵 액션 바 (참고 이미지 느낌) */}
          <View style={styles.quickBar}>
            <QuickAction
              label="훈련 이어하기"
              sub="오늘 1문제"
              onPress={() => router.push("/play")}
            />
            <Divider />
            <QuickAction
              label="가족 연결"
              sub={summary.familyLinked ? "연결됨" : "미연결"}
              onPress={() => alert("가족 연결(추후 API)")}
              badge={!summary.familyLinked ? "!" : undefined}
            />
            <Divider />
            <QuickAction
              label="리포트"
              sub="자세히 보기"
              onPress={() => alert("리포트 상세(추후 연결)")}
            />
          </View>

          {/* 3) 리포트 요약 카드 */}
          <SectionCard title={`학습 리포트 (${summary.stats.periodDays}일)`}>
            <View style={styles.metricsRow}>
              <Metric
                title="훈련 횟수"
                value={`${summary.stats.totalAttempts}회`}
                hint="짧게 자주"
              />
              <Metric
                title="정답률"
                value={`${rates.correctRate}%`}
                hint="AI/인간 구분"
              />
              <Metric
                title="잘 모르겠음"
                value={`${rates.unknownRate}%`}
                hint="의심은 안전"
              />
            </View>

            <View style={styles.tipBox}>
              <Text style={styles.tipTitle}>한 줄 피드백</Text>
              <Text style={styles.tipText}>
                확신이 없을 땐 “잘 모르겠음” 선택이 안전합니다. 다음 훈련에서
                같은 유형을 반복 학습하세요.
              </Text>
            </View>
          </SectionCard>

          {/* 4) 취약 패턴 / 추천 훈련 */}
          <SectionCard title="취약 패턴(개선 포인트)">
            {summary.weakPatterns.map((p, idx) => (
              <View key={`${p}-${idx}`} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>{p}</Text>
              </View>
            ))}

            <Pressable
              style={styles.primaryBtn}
              onPress={() => router.push("/play")}
            >
              <Text style={styles.primaryBtnText}>이 유형으로 훈련하기</Text>
            </Pressable>
          </SectionCard>

          {/* 5) 계정/기타 */}
          <SectionCard title="계정">
            <RowItem
              left="로그아웃"
              right=">"
              onPress={() => alert("로그아웃(추후 연결)")}
            />
            <RowItem
              left="이용약관"
              right=">"
              onPress={() => alert("이용약관(추후 연결)")}
            />
            <RowItem
              left="문의하기"
              right=">"
              onPress={() => alert("문의하기(추후 연결)")}
            />
          </SectionCard>

          <View style={{ height: 28 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ---------- Components ---------- */

function QuickAction({
  label,
  sub,
  onPress,
  badge,
}: {
  label: string;
  sub: string;
  onPress: () => void;
  badge?: string;
}) {
  return (
    <Pressable style={styles.quickItem} onPress={onPress}>
      <View style={styles.quickIcon}>
        {badge ? <Text style={styles.badge}>{badge}</Text> : null}
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
      <Text style={styles.quickSub}>{sub}</Text>
    </Pressable>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={{ marginTop: 10 }}>{children}</View>
    </View>
  );
}

function Metric({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint: string;
}) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricHint}>{hint}</Text>
    </View>
  );
}

function RowItem({
  left,
  right,
  onPress,
}: {
  left: string;
  right: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.rowItem} onPress={onPress}>
      <Text style={styles.rowLeft}>{left}</Text>
      <Text style={styles.rowRight}>{right}</Text>
    </Pressable>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6F7FB" },

  scroll: { padding: 16 },

  profileWrap: {
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 12,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#D9D9D9",
    marginBottom: 12,
  },
  name: { fontSize: 20, fontWeight: "800", marginBottom: 6 },
  subLine: { fontSize: 12, color: "#6B7280", textAlign: "center" },
  editBtn: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
  },
  editBtnText: { fontSize: 12, fontWeight: "700", color: "#111827" },

  quickBar: {
    flexDirection: "row",
    backgroundColor: "#5C74E6",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    marginBottom: 14,
  },
  quickItem: { flex: 1, alignItems: "center" },
  quickIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.25)",
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },
  quickLabel: { color: "#fff", fontSize: 13, fontWeight: "800" },
  quickSub: { color: "rgba(255,255,255,0.9)", fontSize: 11, marginTop: 2 },
  divider: {
    width: 1,
    marginVertical: 4,
    backgroundColor: "rgba(255,255,255,0.25)",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
  },
  cardTitle: { fontSize: 14, fontWeight: "900", color: "#111827" },

  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  metric: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    borderRadius: 14,
    padding: 12,
  },
  metricTitle: { fontSize: 11, color: "#6B7280", fontWeight: "700" },
  metricValue: { fontSize: 18, fontWeight: "900", marginTop: 6 },
  metricHint: { fontSize: 11, color: "#6B7280", marginTop: 6 },

  tipBox: {
    marginTop: 12,
    backgroundColor: "#F6F7FB",
    borderRadius: 14,
    padding: 12,
  },
  tipTitle: { fontSize: 12, fontWeight: "900", marginBottom: 6 },
  tipText: { fontSize: 12, color: "#374151", lineHeight: 18 },

  listItem: { flexDirection: "row", alignItems: "flex-start", marginTop: 8 },
  bullet: { width: 16, fontSize: 14, marginTop: 1 },
  listText: { flex: 1, fontSize: 13, color: "#111827", lineHeight: 18 },

  primaryBtn: {
    marginTop: 14,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#0F1D3A",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "900" },

  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#EEF2F7",
  },
  rowLeft: { fontSize: 13, fontWeight: "700", color: "#111827" },
  rowRight: { fontSize: 13, color: "#9CA3AF", fontWeight: "900" },
});
