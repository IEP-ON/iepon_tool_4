"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioOption } from "./RadioOption";
import type { ParentOpinion } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

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
          </div>
        )}
      </div>

      <div className="pt-2">
        <Label className="flex items-center gap-2 text-sm leading-none font-medium text-gray-700 block mb-2">특별 지원 필요 가정 여부 (선택)</Label>
        <Alert className="bg-blue-50/50 border-blue-100 mb-3 py-2 px-3">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-xs text-blue-700 ml-1">
            수집된 정보는 다문화, 한부모, 조손가정 등 맞춤형 교육정책 및 복지 지원 누락을 방지하기 위한 목적으로만 사용됩니다. 해당하지 않거나 원치 않으시면 '해당 없음'을 선택해 주세요.
          </AlertDescription>
        </Alert>
        <RadioOption
          options={["해당 없음", "다문화 가정", "한부모 가정", "조손 가정", "기초생활수급/차상위", "기타"]}
          value={data.multicultural} // 기존 필드 재사용하되 의미 확장
          onChange={(v) => update("multicultural", v)}
          columns={2}
        />
        {(data.multicultural === "다문화 가정" || data.multicultural === "기타") && (
          <Input
            className="mt-2"
            placeholder={data.multicultural === "다문화 가정" ? "가정 내 주 사용 언어" : "기타 지원 필요 형태"}
            value={data.multiculturalLanguage}
            onChange={(e) => update("multiculturalLanguage", e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
