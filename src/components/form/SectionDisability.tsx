"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioOption } from "./RadioOption";
import type { ParentOpinion } from "@/lib/types";

interface Props {
  data: ParentOpinion;
  update: (key: keyof ParentOpinion, value: ParentOpinion[keyof ParentOpinion]) => void;
}

export function SectionDisability({ data, update }: Props) {
  return (
    <div className="space-y-6">
      {/* A. 장애인 등록 현황 */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold border-b pb-2">A. 장애인 등록 현황 (복지부 등록)</h2>

        <div>
          <Label>등록 여부</Label>
          <RadioOption
            options={["등록됨", "미등록", "신청 중"]}
            value={data.disabilityRegistration}
            onChange={(v) => update("disabilityRegistration", v)}
            columns={3}
          />
        </div>

        <div>
          <Label>주장애 유형</Label>
          <RadioOption
            options={[
              "지체", "뇌병변", "시각", "청각", "언어", "지적",
              "자폐성", "정신", "신장", "심장", "호흡기", "간",
              "안면", "장루", "뇨루",
            ]}
            value={data.primaryDisability}
            onChange={(v) => update("primaryDisability", v)}
            columns={3}
          />
        </div>

        <div>
          <Label>부장애 유형</Label>
          <RadioOption
            options={["해당 없음", "있음"]}
            value={data.secondaryDisability}
            onChange={(v) => update("secondaryDisability", v)}
          />
          {data.secondaryDisability === "있음" && (
            <Input
              className="mt-2"
              placeholder="부장애 유형"
              value={data.secondaryDisabilityType}
              onChange={(e) => update("secondaryDisabilityType", e.target.value)}
            />
          )}
        </div>

        <div>
          <Label>장애 정도</Label>
          <RadioOption
            options={["심한 장애 (구 1~3급)", "심하지 않은 장애 (구 4~6급)"]}
            value={data.disabilitySeverity}
            onChange={(v) => update("disabilitySeverity", v)}
            columns={1}
          />
        </div>

        <div>
          <Label>최초 등록일</Label>
          <Input
            type="date"
            value={data.firstRegistrationDate}
            onChange={(e) => update("firstRegistrationDate", e.target.value)}
          />
        </div>
      </div>

      {/* B. 특수교육대상자 선정 현황 */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold border-b pb-2">B. 특수교육대상자 선정 현황 (교육청 선정)</h2>

        <div className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
          장애인 등록(복지부)과 특수교육대상자 선정(교육청)은 서로 다른 제도입니다.
          등록이 없어도 선정될 수 있고, 반대도 마찬가지입니다.
        </div>

        <div>
          <Label>선정 여부</Label>
          <RadioOption
            options={["선정됨", "미선정", "신청 중"]}
            value={data.specialEdSelection}
            onChange={(v) => update("specialEdSelection", v)}
            columns={3}
          />
        </div>

        <div>
          <Label>선정 장애 영역</Label>
          <RadioOption
            options={[
              "시각", "청각", "지적", "지체", "정서·행동",
              "자폐성", "의사소통", "학습", "건강", "발달지체",
            ]}
            value={data.specialEdArea}
            onChange={(v) => update("specialEdArea", v)}
            columns={3}
          />
        </div>

        <div>
          <Label>최초 선정일</Label>
          <Input
            type="date"
            value={data.firstSelectionDate}
            onChange={(e) => update("firstSelectionDate", e.target.value)}
          />
        </div>

        <div>
          <Label>현재 배치 형태</Label>
          <RadioOption
            options={["특수학급", "일반학급(순회지원)", "특수학교"]}
            value={data.currentPlacement}
            onChange={(v) => update("currentPlacement", v)}
            columns={1}
          />
        </div>
      </div>
    </div>
  );
}
