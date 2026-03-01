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
          <div className={`p-1 rounded-xl transition-all duration-200 ${data.primaryCaregiver ? "bg-transparent" : "ring-2 ring-blue-100 bg-blue-50/30"}`}>
            <RadioOption
              options={["부모 공동 양육", "모", "부", "조부모", "기타"]}
              value={data.primaryCaregiver}
              onChange={(v) => update("primaryCaregiver", v)}
              columns={2}
            />
          </div>
          {data.primaryCaregiver === "기타" && (
            <Input
              className={`mt-2 h-12 transition-colors ${data.primaryCaregiverOther ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
              placeholder="기타 양육자"
              value={data.primaryCaregiverOther}
              onChange={(e) => update("primaryCaregiverOther", e.target.value)}
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
            className={`h-12 transition-colors ${data.afterSchoolActivity ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
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
            className={`transition-colors ${data.familyChanges ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
          />
        </div>
      </div>
    </div>
  );
}
