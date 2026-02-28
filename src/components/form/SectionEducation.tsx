"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ParentOpinion } from "@/lib/types";

interface Props {
  data: ParentOpinion;
  update: (key: keyof ParentOpinion, value: ParentOpinion[keyof ParentOpinion]) => void;
}

export function SectionEducation({ data, update }: Props) {
  return (
    <div className="space-y-6">
      {/* ⑤ 강점과 특성 */}
      <h2 className="text-lg font-bold border-b pb-2">⑤ 우리 아이의 강점과 특성</h2>

      <div>
        <Label>잘하는 것, 좋아하는 것</Label>
        <Textarea
          placeholder="자유롭게 적어주세요"
          value={data.strengths}
          onChange={(e) => update("strengths", e.target.value)}
        />
      </div>

      <div>
        <Label>아이만의 특별한 특성이나 장점</Label>
        <Textarea
          placeholder="자유롭게 적어주세요"
          value={data.uniqueTraits}
          onChange={(e) => update("uniqueTraits", e.target.value)}
        />
      </div>

      {/* ⑥ 현재 수준 */}
      <h2 className="text-lg font-bold border-b pb-2 pt-4">⑥ 가정에서 바라본 현재 수준</h2>
      <p className="text-sm text-gray-500">해당 영역만 편하게 적어주세요.</p>

      {[
        { key: "levelLearning" as const, label: "학습", hint: "읽기·쓰기·수 개념 등" },
        { key: "levelCommunication" as const, label: "의사소통", hint: "표현 방법, 지시 이해 수준" },
        { key: "levelSocial" as const, label: "사회성·정서", hint: "또래·어른과의 관계, 감정 표현·조절" },
        { key: "levelSelfCare" as const, label: "자조기술", hint: "식사·용변·옷입기·손씻기" },
        { key: "levelMotor" as const, label: "운동", hint: "걷기·달리기·가위질·쓰기 등" },
        { key: "levelBehavior" as const, label: "행동 특성", hint: "어려움을 주는 행동이 있다면" },
      ].map(({ key, label, hint }) => (
        <div key={key}>
          <Label>
            {label} <span className="text-xs text-gray-400 font-normal">({hint})</span>
          </Label>
          <Textarea
            placeholder="자유롭게 적어주세요"
            value={data[key] as string}
            onChange={(e) => update(key, e.target.value)}
            rows={2}
          />
        </div>
      ))}

      {/* ⑦ 교육 목표 */}
      <h2 className="text-lg font-bold border-b pb-2 pt-4">⑦ 이번 학기 교육 목표 요구사항</h2>

      <div>
        <Label>가장 우선적으로 지도받고 싶은 목표나 영역</Label>
        <Textarea
          value={data.priorityGoal}
          onChange={(e) => update("priorityGoal", e.target.value)}
        />
      </div>

      <div>
        <Label>선호하는 교육 방법</Label>
        <Textarea
          placeholder="예: 그림 자료, 반복 연습, 놀이 중심, 실물 교구 등"
          value={data.preferredMethod}
          onChange={(e) => update("preferredMethod", e.target.value)}
          rows={2}
        />
      </div>

      <div>
        <Label>평가 방식에 대한 의견</Label>
        <Textarea
          placeholder="예: 과정 중심, 포트폴리오, 수행 관찰 등"
          value={data.evaluationOpinion}
          onChange={(e) => update("evaluationOpinion", e.target.value)}
          rows={2}
        />
      </div>

      <div>
        <Label>가정에서 함께 연계하고 싶은 내용</Label>
        <Textarea
          value={data.homeConnection}
          onChange={(e) => update("homeConnection", e.target.value)}
          rows={2}
        />
      </div>
    </div>
  );
}
