"use client";

import type { ParentOpinion } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface Props {
  opinion: ParentOpinion;
  updateOpinion: (key: keyof ParentOpinion, value: any) => void;
}

const TEXTAREA_CLS = "flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 resize-none";

export function Step3Education({ opinion, updateOpinion }: Props) {
  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900">학생 특성 및 교육 목표</h2>
        <p className="text-gray-500 mt-1">학생의 강점, 현재 수준, 교육 목표를 알려주세요.</p>
      </div>

      {/* ───── 강점 및 고유 특성 ───── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">강점 및 고유 특성</CardTitle>
          <CardDescription>학생이 잘하는 것과 특별한 성향을 적어주세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="strengths">학생의 강점 및 관심사</Label>
            <textarea id="strengths" rows={3} className={TEXTAREA_CLS} placeholder="예: 퍼즐 맞추기를 아주 좋아합니다. 숫자 기억력이 뛰어납니다." value={opinion.strengths} onChange={(e) => updateOpinion("strengths", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="uniqueTraits">선생님이 알아두시면 좋을 특성</Label>
            <textarea id="uniqueTraits" rows={3} className={TEXTAREA_CLS} placeholder="예: 큰 소리가 나면 귀를 막고 불안해합니다." value={opinion.uniqueTraits} onChange={(e) => updateOpinion("uniqueTraits", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* ───── 현재 수준 (6영역) ───── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">가정에서 관찰되는 현재 수준</CardTitle>
          <CardDescription>각 영역에서 아이의 현재 모습을 간략히 적어주세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {([
            { key: "levelLearning", label: "학습 (읽기·쓰기·수 개념 등)", ph: "예: 한글 자음 모음을 읽을 수 있으나 받침 단어는 어려워합니다." },
            { key: "levelCommunication", label: "의사소통 (말하기·듣기·표현)", ph: "예: 2~3어절로 의사표현이 가능합니다." },
            { key: "levelSocial", label: "사회성 (또래관계·규칙 이해)", ph: "예: 또래에 관심은 있으나 대화 시작이 어렵습니다." },
            { key: "levelSelfCare", label: "자조·일상생활 (식사·위생·옷입기)", ph: "예: 혼자 밥먹기 가능, 세수/양치 보조 필요" },
            { key: "levelMotor", label: "운동 (대근육·소근육)", ph: "예: 달리기 가능, 가위질과 글씨쓰기는 어려워합니다." },
            { key: "levelBehavior", label: "행동 (행동 특성·자기조절)", ph: "예: 관심 없는 활동 시 자리 이탈이 잦습니다." },
          ] as { key: keyof ParentOpinion; label: string; ph: string }[]).map(({ key, label, ph }) => (
            <div key={key} className="space-y-1">
              <Label className="text-sm">{label}</Label>
              <textarea rows={2} className={TEXTAREA_CLS} placeholder={ph} value={(opinion[key] as string) || ""} onChange={(e) => updateOpinion(key, e.target.value)} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ───── 교육 목표 ───── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">교육 목표 및 지도 방법</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>이번 학기 최우선 교육 목표</Label>
            <textarea rows={3} className={TEXTAREA_CLS} placeholder="예: 친구들과 인사하기, 스스로 화장실 가기 등" value={opinion.priorityGoal} onChange={(e) => updateOpinion("priorityGoal", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>효과적인 지도 방법 (보상/벌 등)</Label>
            <textarea rows={2} className={TEXTAREA_CLS} placeholder="예: 잘했을 때 좋아하는 스티커를 주면 좋습니다." value={opinion.preferredMethod} onChange={(e) => updateOpinion("preferredMethod", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>평가 방식에 대한 의견</Label>
            <textarea rows={2} className={TEXTAREA_CLS} placeholder="예: 실기 평가보다 구술이나 관찰로 평가해 주시면 좋겠습니다." value={opinion.evaluationOpinion} onChange={(e) => updateOpinion("evaluationOpinion", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>가정과 연계하여 지도할 부분</Label>
            <textarea rows={2} className={TEXTAREA_CLS} placeholder="예: 가정에서도 매일 10분씩 한글 따라쓰기를 하고 있습니다." value={opinion.homeConnection} onChange={(e) => updateOpinion("homeConnection", e.target.value)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
