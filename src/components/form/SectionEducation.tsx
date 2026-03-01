"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioOption } from "./RadioOption";
import type { ParentOpinion } from "@/lib/types";

interface Props {
  data: ParentOpinion;
  update: (key: keyof ParentOpinion, value: any) => void;
}

export function SectionEducation({ data, update }: Props) {
  return (
    <div className="space-y-6">
      {/* ④ 강점과 특성 */}
      <h2 className="text-lg font-bold border-b pb-2">④ 우리 아이의 강점과 특성</h2>

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

      {/* ⑤ 현재 수준 */}
      <h2 className="text-lg font-bold border-b pb-2 pt-4">⑤ 가정에서 바라본 현재 수준</h2>
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

      {/* ⑥ 교육 목표 */}
      <h2 className="text-lg font-bold border-b pb-2 pt-4">⑥ 이번 학기 교육 목표 요구사항</h2>

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

      {/* ⑦ 진로/미래 비전 */}
      <h2 className="text-lg font-bold border-b pb-2 pt-4">⑦ 진로 및 장기적 비전 (선택)</h2>
      <p className="text-sm text-gray-500">지금 당장의 목표가 아닌, 아이의 미래에 대한 보호자의 기대와 방향을 공유해 주세요.</p>

      <div>
        <Label>졸업 후 진로 방향 (희망)</Label>
        <RadioOption
          options={["일반 직업", "복지관 연계 취업", "주간보호 이용", "자립생활", "기타"]}
          value={data.careerDirection}
          onChange={(v) => {
            update("careerDirection", v);
            if (v !== "기타") update("careerDirectionOther", "");
          }}
          columns={2}
        />
        {data.careerDirection === "기타" && (
          <Input
            className="mt-2"
            placeholder="기타 진로 방향을 적어주세요"
            value={data.careerDirectionOther}
            onChange={(e) => update("careerDirectionOther", e.target.value)}
          />
        )}
      </div>

      <div>
        <Label>5년 후 아이의 모습에 대한 기대</Label>
        <Textarea
          placeholder="예: 혼자 대중교통을 이용할 수 있으면 좋겠어요. 좋아하는 일을 하며 살았으면 해요."
          value={data.fiveYearVision}
          onChange={(e) => update("fiveYearVision", e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <Label>교육에서 가장 중요하게 생각하는 가치</Label>
        <Textarea
          placeholder="예: 자립심, 사회성, 행복감, 안전, 의사소통 능력 등"
          value={data.educationValue}
          onChange={(e) => update("educationValue", e.target.value)}
          rows={2}
        />
      </div>
    </div>
  );
}
