"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioOption } from "./RadioOption";
import type { ParentOpinion } from "@/lib/types";

interface Props {
  data: ParentOpinion;
  update: (key: keyof ParentOpinion, value: string) => void;
}

export function SectionFamily({ data, update }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <Label>가정 내 주 양육자</Label>
        <RadioOption
          options={["부모 공동 양육", "모", "부", "조부모", "기타"]}
          value={data.primaryCaregiver}
          onChange={(v) => update("primaryCaregiver", v)}
        />
        {data.primaryCaregiver === "기타" && (
          <Input
            className="mt-2"
            placeholder="기타 양육자"
            value={data.primaryCaregiverOther}
            onChange={(e) => update("primaryCaregiverOther", e.target.value)}
          />
        )}
      </div>

      <div>
        <Label>형제자매 여부</Label>
        <RadioOption
          options={["없음(외동)", "있음"]}
          value={data.siblings}
          onChange={(v) => update("siblings", v)}
        />
        {data.siblings === "있음" && (
          <div className="mt-2 space-y-3 pl-4 border-l-2 border-gray-200">
            <div className="flex gap-2 items-center">
              <span>총</span>
              <Input
                type="number"
                className="w-16"
                value={data.siblingTotal}
                onChange={(e) => update("siblingTotal", e.target.value)}
              />
              <span>명 중</span>
              <Input
                type="number"
                className="w-16"
                value={data.siblingOrder}
                onChange={(e) => update("siblingOrder", e.target.value)}
              />
              <span>째</span>
            </div>
            <div>
              <Label className="text-sm">형제자매 중 장애 유무</Label>
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
        <Label>다문화 가정 여부</Label>
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
        <Label>방과 후 주 돌봄 형태</Label>
        <RadioOption
          options={[
            "가정 내 돌봄",
            "지역아동센터",
            "다함께돌봄센터",
            "장애인주간보호센터",
            "방과후아카데미",
            "기타",
          ]}
          value={data.afterSchoolCare}
          onChange={(v) => update("afterSchoolCare", v)}
        />
        {data.afterSchoolCare === "기타" && (
          <Input
            className="mt-2"
            placeholder="기타 돌봄 형태"
            value={data.afterSchoolCareOther}
            onChange={(e) => update("afterSchoolCareOther", e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
