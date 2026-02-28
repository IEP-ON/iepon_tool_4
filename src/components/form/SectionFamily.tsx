"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioOption } from "./RadioOption";
import type { ParentOpinion } from "@/lib/types";

interface Props {
  data: ParentOpinion;
  update: (key: keyof ParentOpinion, value: ParentOpinion[keyof ParentOpinion]) => void;
}

export function SectionFamily({ data, update }: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold border-b pb-2">① 가정 환경</h2>

      <div>
        <Label>주양육자 구성</Label>
        <RadioOption
          options={["부모 동거", "부만", "모만", "조부모", "시설", "기타"]}
          value={data.primaryCaregiver}
          onChange={(v) => update("primaryCaregiver", v)}
          columns={3}
        />
        {data.primaryCaregiver === "기타" && (
          <Input
            className="mt-2"
            placeholder="구체적으로 입력"
            value={data.primaryCaregiverOther}
            onChange={(e) => update("primaryCaregiverOther", e.target.value)}
          />
        )}
      </div>

      <div>
        <Label>형제자매</Label>
        <RadioOption
          options={["없음", "있음"]}
          value={data.siblings}
          onChange={(v) => update("siblings", v)}
        />
        {data.siblings === "있음" && (
          <div className="mt-2 grid gap-2 grid-cols-2">
            <div>
              <Label className="text-xs">총 몇 명</Label>
              <Input
                placeholder="예: 3"
                value={data.siblingTotal}
                onChange={(e) => update("siblingTotal", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">몇째</Label>
              <Input
                placeholder="예: 2"
                value={data.siblingOrder}
                onChange={(e) => update("siblingOrder", e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">형제 중 장애 여부</Label>
              <RadioOption
                options={["없음", "있음"]}
                value={data.siblingDisability}
                onChange={(v) => update("siblingDisability", v)}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <Label>다문화 가정</Label>
        <RadioOption
          options={["아니오", "예"]}
          value={data.multicultural}
          onChange={(v) => update("multicultural", v)}
        />
        {data.multicultural === "예" && (
          <Input
            className="mt-2"
            placeholder="가정 내 주 사용 언어"
            value={data.multiculturalLanguage}
            onChange={(e) => update("multiculturalLanguage", e.target.value)}
          />
        )}
      </div>

      <div>
        <Label>방과 후 주 돌봄</Label>
        <RadioOption
          options={["부모", "조부모", "돌봄교실", "지역아동센터", "복지관", "기타"]}
          value={data.afterSchoolCare}
          onChange={(v) => update("afterSchoolCare", v)}
          columns={3}
        />
        {data.afterSchoolCare === "기타" && (
          <Input
            className="mt-2"
            placeholder="구체적으로 입력"
            value={data.afterSchoolCareOther}
            onChange={(e) => update("afterSchoolCareOther", e.target.value)}
          />
        )}
      </div>

      <h2 className="text-lg font-bold border-b pb-2 pt-4">② 협의회 참석 방법 (필수)</h2>

      <RadioOption
        options={["대면 참석", "유선 참석", "의견서로 갈음"]}
        value={data.attendanceMethod}
        onChange={(v) => update("attendanceMethod", v)}
        columns={1}
      />
      {data.attendanceMethod === "유선 참석" && (
        <div className="mt-2">
          <Label>연락 가능 시간대</Label>
          <Input
            placeholder="예: 오후 2시~4시"
            value={data.availableTime}
            onChange={(e) => update("availableTime", e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
