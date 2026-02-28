"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioOption } from "./RadioOption";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, AlertTriangle } from "lucide-react";
import type { ParentOpinion } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";

interface Props {
  data: ParentOpinion;
  update: (key: keyof ParentOpinion, value: any) => void;
}

export function SectionServices({ data, update }: Props) {
  const [duplicateWarning, setDuplicateWarning] = useState(false);

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

  // 영역 중복 체크
  useEffect(() => {
    if (
      data.therapySupportArea &&
      data.rehabServiceArea &&
      data.therapySupportInstitution && 
      data.rehabServiceInstitution
    ) {
      // 쉼표나 띄어쓰기로 구분된 영역을 배열로 만들어 교집합 확인
      const therapyAreas = data.therapySupportArea.split(/[\s,]+/).filter(a => a.trim() !== "");
      const rehabAreas = data.rehabServiceArea.split(/[\s,]+/).filter(a => a.trim() !== "");
      
      const hasDuplicate = therapyAreas.some(area => 
        rehabAreas.some(rArea => rArea.includes(area) || area.includes(rArea))
      );
      
      setDuplicateWarning(hasDuplicate);
    } else {
      setDuplicateWarning(false);
    }
  }, [data.therapySupportArea, data.rehabServiceArea, data.therapySupportInstitution, data.rehabServiceInstitution]);

  return (
    <div className="space-y-8">
      {/* 8. 외부 지원/치료 */}
      <div className="space-y-6">
        <div>
          <Label className="text-base font-bold text-gray-900 mb-2 block">방과 후 주요 활동 (학원 등)</Label>
          <Input
            placeholder="예: 피아노 학원(주3회), 태권도(매일)"
            value={data.afterSchoolActivity}
            onChange={(e) => update("afterSchoolActivity", e.target.value)}
            className="bg-gray-50 h-12"
          />
        </div>

        <div>
          <Label className="text-base font-bold text-gray-900 mb-2 block">현재 받고 있는 치료/재활 서비스</Label>
          <div className="space-y-3 mt-2">
            {data.therapyServices.map((t, i) => (
              <div key={i} className="flex gap-2 items-end bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <Label className="text-xs text-gray-500 mb-1 block">기관명</Label>
                  <Input
                    value={t.institution}
                    onChange={(e) => updateTherapy(i, "institution", e.target.value)}
                    placeholder="예: 00발달센터"
                    className="bg-white"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-gray-500 mb-1 block">치료 영역</Label>
                  <Input
                    value={t.area}
                    onChange={(e) => updateTherapy(i, "area", e.target.value)}
                    placeholder="예: 언어, 놀이"
                    className="bg-white"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-gray-500 mb-1 block">빈도/시간</Label>
                  <Input
                    value={t.type}
                    onChange={(e) => updateTherapy(i, "type", e.target.value)}
                    placeholder="예: 주 2회"
                    className="bg-white"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTherapy(i)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-10 w-10 shrink-0"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addTherapy} className="w-full border-dashed border-2 text-blue-600 border-blue-200 hover:bg-blue-50">
              <Plus className="h-4 w-4 mr-1" /> 치료 서비스 추가
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-gray-200">
        <h2 className="text-lg font-bold border-b pb-2">⑨ 특수교육 관련 서비스 신청 및 이용 현황</h2>

        {/* 1. 자유수강권 */}
        <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
          <Label className="font-bold text-gray-800 text-base">자유수강권 이용 (교육청)</Label>
          <RadioOption
            options={["이용 중", "이용하지 않음"]}
            value={data.afterSchoolSpecialEd}
            onChange={(v) => {
              update("afterSchoolSpecialEd", v);
              if (v === "이용하지 않음") {
                update("afterSchoolSpecialEdInSchool", "");
                update("afterSchoolSpecialEdOutSchool", "");
              }
            }}
            columns={2}
          />
          {data.afterSchoolSpecialEd === "이용 중" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">교내 이용 (방과후학교)</Label>
                <Input
                  placeholder="예: 방송댄스 주 2회"
                  value={data.afterSchoolSpecialEdInSchool}
                  onChange={(e) => update("afterSchoolSpecialEdInSchool", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">교외 이용 (외부 학원 등)</Label>
                <Input
                  placeholder="예: 미술학원 주 1회"
                  value={data.afterSchoolSpecialEdOutSchool}
                  onChange={(e) => update("afterSchoolSpecialEdOutSchool", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {duplicateWarning && (
          <Alert className="bg-red-50 border-red-200 text-red-800">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertDescription className="ml-2 font-medium">
              주의: 교육청 치료지원과 보건복지부 발달재활서비스에서 동일한 치료 영역(예: 언어치료)을 중복으로 지원받는 것은 부정 사용에 해당합니다. 영역이 겹치지 않도록 확인해 주세요.
            </AlertDescription>
          </Alert>
        )}

        {/* 2. 치료지원 (교육청) */}
        <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
          <Label className="font-bold text-gray-800 text-base">치료지원 (교육청)</Label>
          <RadioOption
            options={["이용 중", "이용하지 않음"]}
            value={data.therapySupportInstitution ? "이용 중" : "이용하지 않음"}
            onChange={(v) => {
              if (v === "이용하지 않음") {
                update("therapySupportInstitution", "");
                update("therapySupportDays", "");
                update("therapySupportArea", "");
              } else if (!data.therapySupportInstitution) {
                update("therapySupportInstitution", " "); // 트리거
              }
            }}
            columns={2}
          />
          {data.therapySupportInstitution !== "" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">기관명</Label>
                <Input
                  placeholder="이용 기관명"
                  value={data.therapySupportInstitution.trim()}
                  onChange={(e) => update("therapySupportInstitution", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">이용 요일</Label>
                <Input
                  placeholder="예: 월, 수"
                  value={data.therapySupportDays}
                  onChange={(e) => update("therapySupportDays", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">영역</Label>
                <Input
                  placeholder="예: 언어, 미술"
                  value={data.therapySupportArea}
                  onChange={(e) => update("therapySupportArea", e.target.value)}
                  className={duplicateWarning && data.therapySupportArea ? "border-red-400 bg-red-50/30" : ""}
                />
              </div>
            </div>
          )}
        </div>

        {/* 3. 발달재활서비스 (보건복지부) */}
        <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
          <Label className="font-bold text-gray-800 text-base">발달재활서비스 (보건복지부 바우처)</Label>
          <RadioOption
            options={["이용 중", "이용하지 않음"]}
            value={data.rehabServiceInstitution ? "이용 중" : "이용하지 않음"}
            onChange={(v) => {
              if (v === "이용하지 않음") {
                update("rehabServiceInstitution", "");
                update("rehabServiceDays", "");
                update("rehabServiceArea", "");
              } else if (!data.rehabServiceInstitution) {
                update("rehabServiceInstitution", " "); // 트리거
              }
            }}
            columns={2}
          />
          {data.rehabServiceInstitution !== "" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">기관명</Label>
                <Input
                  placeholder="이용 기관명"
                  value={data.rehabServiceInstitution.trim()}
                  onChange={(e) => update("rehabServiceInstitution", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">이용 요일</Label>
                <Input
                  placeholder="예: 화, 목"
                  value={data.rehabServiceDays}
                  onChange={(e) => update("rehabServiceDays", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">영역</Label>
                <Input
                  placeholder="예: 놀이, 인지"
                  value={data.rehabServiceArea}
                  onChange={(e) => update("rehabServiceArea", e.target.value)}
                  className={duplicateWarning && data.rehabServiceArea ? "border-red-400 bg-red-50/30" : ""}
                />
              </div>
            </div>
          )}
        </div>

        {/* 4. 통학지원 */}
        <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
          <Label className="font-bold text-gray-800 text-base">통학비(교통비)지원</Label>
          <RadioOption
            options={["통학비 지원 신청", "해당 없음"]}
            value={data.transportSupport}
            onChange={(v) => update("transportSupport", v)}
            columns={2}
          />
          {data.transportSupport === "통학비 지원 신청" && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              💡 통학비 지원 신청을 선택하셨습니다. 추후 학교에서 관련 신청 서류를 별도로 안내해 드릴 예정입니다.
            </div>
          )}
        </div>

        {/* 5. 보조인력 */}
        <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
          <Label className="font-bold text-gray-800 text-base block mb-1">특수교육보조인력 (실무사, 사회복무요원 등) 지원</Label>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 mb-3">
            ⚠️ <b>안내:</b> 보조인력 지원을 신청하시더라도 학교의 인력 배치 상황 및 우선순위(중증장애 등)에 따라 <b>무조건 반영되기는 어려울 수 있음</b>을 양해 부탁드립니다.
          </div>
          <RadioOption
            options={["필요 없음", "학교 내 생활 전반 지원", "특정 시간/활동 지원"]}
            value={data.assistantSupport}
            onChange={(v) => update("assistantSupport", v)}
            columns={1}
          />
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-gray-200">
        <h2 className="text-lg font-bold border-b pb-2">⑩ 기타 참고사항</h2>

        <div>
          <Label className="text-base font-bold text-gray-900 mb-2 block">최근 가정 내 주요 변화</Label>
          <Input
            placeholder="예: 이사, 동생 출생 등"
            value={data.familyChanges}
            onChange={(e) => update("familyChanges", e.target.value)}
            className="bg-gray-50 h-12"
          />
        </div>

        {/* 선생님께 남기고 싶은 말씀 항목 삭제됨 */}
      </div>
    </div>
  );
}
