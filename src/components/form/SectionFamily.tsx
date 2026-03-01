"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioOption } from "./RadioOption";
import type { ParentOpinion } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface Props {
  data: ParentOpinion;
  update: (key: keyof ParentOpinion, value: any) => void;
}

export function SectionFamily({ data, update }: Props) {
  return (
    <div className="space-y-8">
      <div className="space-y-6 pt-2 border-t border-gray-200">
        <h2 className="text-lg font-bold border-b pb-2">① 가정 환경</h2>

        {/* 주 양육자 */}
        <div className="space-y-2">
          <Label className="text-base font-bold text-gray-900">가정 내 주 양육자</Label>
          <RadioOption
            options={["부모 공동 양육", "모", "부", "조부모", "기타"]}
            value={data.primaryCaregiver}
            onChange={(v) => update("primaryCaregiver", v)}
            columns={2}
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

        {/* 방과 후 돌봄 */}
        <div className="space-y-2">
          <Label className="text-base font-bold text-gray-900">방과 후 주 돌봄 형태</Label>
          <RadioOption
            options={["가정 돌봄 (보호자)", "조부모 돌봄", "돌봄교실/방과후", "지역아동센터", "아이돌보미", "기타"]}
            value={data.afterSchoolCare}
            onChange={(v) => update("afterSchoolCare", v)}
            columns={2}
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

        {/* 형제자매 */}
        <div className="space-y-2">
          <Label className="text-base font-bold text-gray-900">형제자매 여부</Label>
          <RadioOption
            options={["없음(외동)", "있음"]}
            value={data.siblings}
            onChange={(v) => update("siblings", v)}
            columns={2}
          />
          {data.siblings === "있음" && (
            <div className="mt-2 space-y-3 pl-4 border-l-2 border-gray-200">
              <div className="flex gap-2 items-center flex-wrap">
                <span className="text-sm">총</span>
                <Input
                  type="number"
                  className="w-16"
                  value={data.siblingTotal}
                  onChange={(e) => update("siblingTotal", e.target.value)}
                />
                <span className="text-sm">명 중</span>
                <Input
                  type="number"
                  className="w-16"
                  value={data.siblingOrder}
                  onChange={(e) => update("siblingOrder", e.target.value)}
                />
                <span className="text-sm">째</span>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">형제자매 중 장애 여부</Label>
                <RadioOption
                  options={["없음", "있음"]}
                  value={data.siblingDisability}
                  onChange={(v) => update("siblingDisability", v)}
                  columns={2}
                />
              </div>
            </div>
          )}
        </div>

        {/* 특별 지원 필요 가정 */}
        <div className="space-y-2">
          <Label className="text-base font-bold text-gray-900">특별 지원 필요 가정 여부 (선택)</Label>
          <Alert className="bg-blue-50/50 border-blue-100 py-2 px-3">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-xs text-blue-700 ml-1">
              다문화, 한부모, 조손가정 등 맞춤형 지원 누락 방지 목적으로만 사용됩니다. 원치 않으시면 '해당 없음'을 선택하세요.
            </AlertDescription>
          </Alert>
          <RadioOption
            options={["해당 없음", "다문화 가정", "한부모 가정", "조손 가정", "기초생활수급/차상위", "기타"]}
            value={data.multicultural}
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

        {/* 방과 후 주요 활동 */}
        <div className="space-y-2">
          <Label className="text-base font-bold text-gray-900">방과 후 주요 활동 (학원 등)</Label>
          <Input
            placeholder="예: 피아노 학원(주3회), 태권도(매일)"
            value={data.afterSchoolActivity}
            onChange={(e) => update("afterSchoolActivity", e.target.value)}
            className="bg-gray-50 h-12"
          />
        </div>

        {/* 최근 가정 내 변화 */}
        <div className="space-y-2">
          <Label className="text-base font-bold text-gray-900">최근 가정 내 주요 변화 (선택)</Label>
          <Textarea
            placeholder="예: 이사, 동생 출생, 부모 별거 등 학교에서 알아야 할 변화가 있다면 적어주세요."
            value={data.familyChanges}
            onChange={(e) => update("familyChanges", e.target.value)}
            rows={3}
            className="bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
}
