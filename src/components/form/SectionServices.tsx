"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioOption } from "./RadioOption";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type { ParentOpinion } from "@/lib/types";

interface Props {
  data: ParentOpinion;
  update: (key: keyof ParentOpinion, value: any) => void;
}

export function SectionServices({ data, update }: Props) {
  const addTherapy = () => {
    update("therapyServices", [...data.therapyServices, { institution: "", area: "", type: "" }]);
  };

  const removeTherapy = (index: number) => {
    update("therapyServices", data.therapyServices.filter((_, i) => i !== index));
  };

  const updateTherapy = (index: number, field: string, value: string) => {
    const updated = data.therapyServices.map((t, i) =>
      i === index ? { ...t, [field]: value } : t
    );
    update("therapyServices", updated);
  };

  return (
    <div className="space-y-6">
      {/* 8. 외부 지원/치료 */}
      <div>
        <Label>방과 후 주요 활동(학원 등)</Label>
        <Input
          placeholder="예: 피아노 학원(주3회), 태권도(매일)"
          value={data.afterSchoolActivity}
          onChange={(e) => update("afterSchoolActivity", e.target.value)}
        />
      </div>

      <div>
        <Label>현재 받고 있는 치료/재활 서비스</Label>
        <div className="space-y-3 mt-2">
          {data.therapyServices.map((t, i) => (
            <div key={i} className="flex gap-2 items-end">
              <div className="flex-1">
                <Label className="text-xs">기관명</Label>
                <Input
                  value={t.institution}
                  onChange={(e) => updateTherapy(i, "institution", e.target.value)}
                  placeholder="예: 00발달센터"
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs">치료 영역</Label>
                <Input
                  value={t.area}
                  onChange={(e) => updateTherapy(i, "area", e.target.value)}
                  placeholder="예: 언어, 놀이"
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs">빈도/시간</Label>
                <Input
                  value={t.type}
                  onChange={(e) => updateTherapy(i, "type", e.target.value)}
                  placeholder="예: 주 2회"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeTherapy(i)}
                className="text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addTherapy}>
            <Plus className="h-4 w-4 mr-1" /> 치료 서비스 추가
          </Button>
        </div>
      </div>

      <h2 className="text-lg font-bold border-b pb-2 pt-4">⑨ 특수교육 관련 서비스 신청</h2>

      <div>
        <Label>방과후학교 특수교육 자유수강권 (교육청)</Label>
        <RadioOption
          options={["신청(이용 중)", "미신청", "해당 없음"]}
          value={data.afterSchoolSpecialEd}
          onChange={(v) => update("afterSchoolSpecialEd", v)}
        />
      </div>

      <div>
        <Label>치료지원 (교육청)</Label>
        <RadioOption
          options={["신청(이용 중)", "미신청", "해당 없음"]}
          value={data.therapySupportInstitution ? "신청(이용 중)" : "미신청"}
          onChange={(v) => {
            if (v === "미신청" || v === "해당 없음") {
              update("therapySupportInstitution", "");
              update("therapySupportArea", "");
            } else if (!data.therapySupportInstitution) {
              update("therapySupportInstitution", " ");
            }
          }}
        />
        {data.therapySupportInstitution !== "" && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Input
              placeholder="이용 기관명"
              value={data.therapySupportInstitution.trim()}
              onChange={(e) => update("therapySupportInstitution", e.target.value)}
            />
            <Input
              placeholder="치료 영역"
              value={data.therapySupportArea}
              onChange={(e) => update("therapySupportArea", e.target.value)}
            />
          </div>
        )}
      </div>

      <div>
        <Label>발달재활서비스 (보건복지부, 바우처)</Label>
        <RadioOption
          options={["신청(이용 중)", "미신청", "해당 없음"]}
          value={data.rehabServiceInstitution ? "신청(이용 중)" : "미신청"}
          onChange={(v) => {
            if (v === "미신청" || v === "해당 없음") {
              update("rehabServiceInstitution", "");
              update("rehabServiceArea", "");
            } else if (!data.rehabServiceInstitution) {
              update("rehabServiceInstitution", " ");
            }
          }}
        />
        {data.rehabServiceInstitution !== "" && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Input
              placeholder="이용 기관명"
              value={data.rehabServiceInstitution.trim()}
              onChange={(e) => update("rehabServiceInstitution", e.target.value)}
            />
            <Input
              placeholder="치료 영역"
              value={data.rehabServiceArea}
              onChange={(e) => update("rehabServiceArea", e.target.value)}
            />
          </div>
        )}
      </div>

      <div>
        <Label>통학지원</Label>
        <RadioOption
          options={["미신청", "통학비 지원 신청", "통학버스 이용"]}
          value={data.transportSupport}
          onChange={(v) => update("transportSupport", v)}
        />
      </div>

      <div>
        <Label>특수교육보조인력 (실무사, 사회복무요원 등) 지원</Label>
        <RadioOption
          options={["필요 없음", "학교 내 생활 전반 지원", "특정 시간/활동 지원"]}
          value={data.assistantSupport}
          onChange={(v) => update("assistantSupport", v)}
        />
      </div>

      <h2 className="text-lg font-bold border-b pb-2 pt-4">⑩ 기타 참고사항</h2>

      <div>
        <Label>최근 가정 내 주요 변화</Label>
        <Input
          placeholder="예: 이사, 동생 출생 등"
          value={data.familyChanges}
          onChange={(e) => update("familyChanges", e.target.value)}
        />
      </div>

      <div>
        <Label>선생님께 남기고 싶은 말씀</Label>
        <Input
          value={data.messageToTeacher}
          onChange={(e) => update("messageToTeacher", e.target.value)}
        />
      </div>
    </div>
  );
}
