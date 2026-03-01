"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioOption } from "./RadioOption";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, AlertTriangle } from "lucide-react";
import type { ParentOpinion, TeacherInput } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";

interface Props {
  data: ParentOpinion;
  update: (key: keyof ParentOpinion, value: any) => void;
  teacherContext?: TeacherInput;
}

export function SectionServices({ data, update, teacherContext }: Props) {
  const [duplicateWarning, setDuplicateWarning] = useState(false);

  // 리스트 관리 함수 (치료지원)
  const addTherapySupport = () => {
    update("therapySupportList", [...(data.therapySupportList || []), { institution: "", days: "", area: "" }]);
  };

  const removeTherapySupport = (index: number) => {
    update("therapySupportList", (data.therapySupportList || []).filter((_, i) => i !== index));
  };

  const updateTherapySupport = (index: number, field: string, value: string) => {
    const updated = (data.therapySupportList || []).map((t, i) =>
      i === index ? { ...t, [field]: value } : t
    );
    update("therapySupportList", updated);
  };

  // 리스트 관리 함수 (발달재활)
  const addRehabService = () => {
    update("rehabServiceList", [...(data.rehabServiceList || []), { institution: "", days: "", area: "" }]);
  };

  const removeRehabService = (index: number) => {
    update("rehabServiceList", (data.rehabServiceList || []).filter((_, i) => i !== index));
  };

  const updateRehabService = (index: number, field: string, value: string) => {
    const updated = (data.rehabServiceList || []).map((t, i) =>
      i === index ? { ...t, [field]: value } : t
    );
    update("rehabServiceList", updated);
  };

  // 영역 중복 체크 (리스트 간의 중복 체크)
  useEffect(() => {
    const therapyAreas = (data.therapySupportList || [])
      .map(t => t.area)
      .join(" ")
      .split(/[\s,]+/)
      .filter(a => a.trim() !== "");
      
    const rehabAreas = (data.rehabServiceList || [])
      .map(r => r.area)
      .join(" ")
      .split(/[\s,]+/)
      .filter(a => a.trim() !== "");
      
    if (therapyAreas.length > 0 && rehabAreas.length > 0) {
      const hasDuplicate = therapyAreas.some(area => 
        rehabAreas.some(rArea => rArea.includes(area) || area.includes(rArea))
      );
      setDuplicateWarning(hasDuplicate);
    } else {
      setDuplicateWarning(false);
    }
  }, [data.therapySupportList, data.rehabServiceList]);

  // 구버전 데이터 마이그레이션 효과 (처음 로드 시)
  useEffect(() => {
    // 이전 단일 필드에 값이 있는데 리스트가 비어있다면 리스트로 옮기기
    if (data.therapySupportInstitution && data.therapySupportInstitution.trim() !== "" && (!data.therapySupportList || data.therapySupportList.length === 0)) {
      update("therapySupportList", [{ 
        institution: data.therapySupportInstitution, 
        days: data.therapySupportDays || "", 
        area: data.therapySupportArea || "" 
      }]);
    }
    
    if (data.rehabServiceInstitution && data.rehabServiceInstitution.trim() !== "" && (!data.rehabServiceList || data.rehabServiceList.length === 0)) {
      update("rehabServiceList", [{ 
        institution: data.rehabServiceInstitution, 
        days: data.rehabServiceDays || "", 
        area: data.rehabServiceArea || "" 
      }]);
    }
  }, []);

  const isGrade34 = teacherContext?.grade === "3" || teacherContext?.grade === "4";
  const isGrade56 = teacherContext?.grade === "5" || teacherContext?.grade === "6";

  return (
    <div className="space-y-8">
      {/* ⑧ 행사/체험 참여 의향 */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold border-b pb-2">⑧ 행사·체험 참여 의향</h2>
        <p className="text-sm text-gray-500 -mt-3">구체적 일정은 매번 별도로 안내드립니다. 아래는 원칙적인 참여 의향을 여쭤보는 항목입니다.</p>

        {isGrade34 && (
          <div className="space-y-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <Label className="font-bold text-gray-800 text-base">생존수영 (안전체험 교육) <span className="text-blue-600 text-sm font-normal ml-1">※ 3~4학년 대상</span></Label>
            <div className={`p-1 -ml-1 rounded-xl transition-all duration-200 ${data.survivalSwimming ? "bg-transparent" : "ring-2 ring-blue-100 bg-blue-50/30"}`}>
              <RadioOption
                options={["참여 가능", "참여 어려움", "미정", "해당 학년 아님"]}
                value={data.survivalSwimming}
                onChange={(v) => {
                  update("survivalSwimming", v);
                  if (v === "참여 가능" || v === "해당 학년 아님") update("survivalSwimmingReason", "");
                }}
                columns={2}
              />
            </div>
            {(data.survivalSwimming === "참여 어려움" || data.survivalSwimming === "미정") && (
              <Input
                className={`mt-2 h-12 transition-colors ${data.survivalSwimmingReason ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
                placeholder="이유 또는 참고사항 (예: 감각 민감, 건강 이유 등)"
                value={data.survivalSwimmingReason}
                onChange={(e) => update("survivalSwimmingReason", e.target.value)}
              />
            )}
          </div>
        )}

        {isGrade56 && (
          <div className="space-y-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <Label className="font-bold text-gray-800 text-base">수학여행/수련활동 <span className="text-blue-600 text-sm font-normal ml-1">※ 5~6학년 대상</span></Label>
            <div className={`p-1 -ml-1 rounded-xl transition-all duration-200 ${data.schoolTrip ? "bg-transparent" : "ring-2 ring-blue-100 bg-blue-50/30"}`}>
              <RadioOption
                options={["참여 가능", "참여 어려움", "미정", "해당 학년 아님"]}
                value={data.schoolTrip}
                onChange={(v) => {
                  update("schoolTrip", v);
                  if (v === "참여 가능" || v === "해당 학년 아님") update("schoolTripReason", "");
                }}
                columns={2}
              />
            </div>
            {(data.schoolTrip === "참여 어려움" || data.schoolTrip === "미정") && (
              <Input
                className={`mt-2 h-12 transition-colors ${data.schoolTripReason ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
                placeholder="이유 또는 참고사항 (예: 숙박 어려움 등)"
                value={data.schoolTripReason}
                onChange={(e) => update("schoolTripReason", e.target.value)}
              />
            )}
          </div>
        )}

        <div className="space-y-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
          <Label className="font-bold text-gray-800 text-base">학부모 참관수업</Label>
          <div className={`p-1 -ml-1 rounded-xl transition-all duration-200 ${data.openClassObservation ? "bg-transparent" : "ring-2 ring-blue-100 bg-blue-50/30"}`}>
            <RadioOption
              options={["참여 가능", "참여 어려움", "미정"]}
              value={data.openClassObservation}
              onChange={(v) => update("openClassObservation", v)}
              columns={3}
            />
          </div>
        </div>

        <div className="space-y-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
          <Label className="font-bold text-gray-800 text-base">일반 현장체험학습</Label>
          <div className={`p-1 -ml-1 rounded-xl transition-all duration-200 ${data.fieldTrip ? "bg-transparent" : "ring-2 ring-blue-100 bg-blue-50/30"}`}>
            <RadioOption
              options={["참여 가능", "참여 어려움", "미정"]}
              value={data.fieldTrip}
              onChange={(v) => update("fieldTrip", v)}
              columns={3}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-gray-200">
        <h2 className="text-lg font-bold border-b pb-2">⑨ 특수교육 관련 서비스 신청 및 이용 현황</h2>

        {/* 1. 자유수강권 */}
        <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
          <Label className="font-bold text-gray-800 text-base">자유수강권 이용 (교육청)</Label>
          <div className={`p-1 -ml-1 rounded-xl transition-all duration-200 ${data.afterSchoolSpecialEd ? "bg-transparent" : "ring-2 ring-blue-100 bg-blue-50/30"}`}>
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
          </div>
          {data.afterSchoolSpecialEd === "이용 중" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">교내 이용 (방과후학교)</Label>
                <Input
                  placeholder="예: 방송댄스 주 2회"
                  value={data.afterSchoolSpecialEdInSchool}
                  onChange={(e) => update("afterSchoolSpecialEdInSchool", e.target.value)}
                  className={`h-12 transition-colors ${data.afterSchoolSpecialEdInSchool ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">교외 이용 (외부 학원 등)</Label>
                <Input
                  placeholder="예: 미술학원 주 1회"
                  value={data.afterSchoolSpecialEdOutSchool}
                  onChange={(e) => update("afterSchoolSpecialEdOutSchool", e.target.value)}
                  className={`h-12 transition-colors ${data.afterSchoolSpecialEdOutSchool ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
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
          <div className={`p-1 -ml-1 rounded-xl transition-all duration-200 ${data.therapySupportInstitution === "이용 중" || (data.therapySupportList && data.therapySupportList.length > 0) || data.therapySupportInstitution === "이용하지 않음" ? "bg-transparent" : "ring-2 ring-blue-100 bg-blue-50/30"}`}>
            <RadioOption
              options={["이용 중", "이용하지 않음"]}
              value={data.therapySupportInstitution === "이용 중" || (data.therapySupportList && data.therapySupportList.length > 0) ? "이용 중" : (data.therapySupportInstitution === "이용하지 않음" ? "이용하지 않음" : "")}
              onChange={(v) => {
                if (v === "이용하지 않음") {
                  update("therapySupportInstitution", "이용하지 않음"); 
                  update("therapySupportList", []);
                } else {
                  update("therapySupportInstitution", "이용 중"); 
                  if (!data.therapySupportList || data.therapySupportList.length === 0) {
                    update("therapySupportList", [{ institution: "", days: "", area: "" }]);
                  }
                }
              }}
              columns={2}
            />
          </div>
          {((data.therapySupportInstitution === "이용 중" || data.therapySupportInstitution === " ") || (data.therapySupportList && data.therapySupportList.length > 0)) && (
            <div className="space-y-3 mt-3">
              {(data.therapySupportList || []).map((t, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-2 bg-white p-3 rounded-lg border border-gray-200 shadow-sm relative pr-10 sm:pr-3">
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs text-gray-500">기관명</Label>
                    <Input
                      placeholder="이용 기관명"
                      value={t.institution}
                      onChange={(e) => updateTherapySupport(i, "institution", e.target.value)}
                      className={`h-10 transition-colors ${t.institution ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs text-gray-500">이용 요일</Label>
                    <Input
                      placeholder="예: 월, 수"
                      value={t.days}
                      onChange={(e) => updateTherapySupport(i, "days", e.target.value)}
                      className={`h-10 transition-colors ${t.days ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs text-gray-500">영역</Label>
                    <Input
                      placeholder="예: 언어, 미술"
                      value={t.area}
                      onChange={(e) => updateTherapySupport(i, "area", e.target.value)}
                      className={`h-10 transition-colors ${duplicateWarning && t.area ? "border-red-400 bg-red-50/30" : t.area ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTherapySupport(i)}
                    className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 sm:self-end text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9 shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addTherapySupport} className="w-full border-dashed border-2 text-blue-600 border-blue-200 hover:bg-blue-50">
                <Plus className="h-4 w-4 mr-1" /> 치료지원 기관 추가
              </Button>
            </div>
          )}
        </div>

        {/* 3. 발달재활서비스 (보건복지부) */}
        <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
          <Label className="font-bold text-gray-800 text-base">발달재활서비스 (보건복지부 바우처)</Label>
          <div className={`p-1 -ml-1 rounded-xl transition-all duration-200 ${data.rehabServiceInstitution === "이용 중" || (data.rehabServiceList && data.rehabServiceList.length > 0) || data.rehabServiceInstitution === "이용하지 않음" ? "bg-transparent" : "ring-2 ring-blue-100 bg-blue-50/30"}`}>
            <RadioOption
              options={["이용 중", "이용하지 않음"]}
              value={data.rehabServiceInstitution === "이용 중" || (data.rehabServiceList && data.rehabServiceList.length > 0) ? "이용 중" : (data.rehabServiceInstitution === "이용하지 않음" ? "이용하지 않음" : "")}
              onChange={(v) => {
                if (v === "이용하지 않음") {
                  update("rehabServiceInstitution", "이용하지 않음"); 
                  update("rehabServiceList", []);
                } else {
                  update("rehabServiceInstitution", "이용 중"); 
                  if (!data.rehabServiceList || data.rehabServiceList.length === 0) {
                    update("rehabServiceList", [{ institution: "", days: "", area: "" }]);
                  }
                }
              }}
              columns={2}
            />
          </div>
          {((data.rehabServiceInstitution === "이용 중" || data.rehabServiceInstitution === " ") || (data.rehabServiceList && data.rehabServiceList.length > 0)) && (
            <div className="space-y-3 mt-3">
              {(data.rehabServiceList || []).map((t, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-2 bg-white p-3 rounded-lg border border-gray-200 shadow-sm relative pr-10 sm:pr-3">
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs text-gray-500">기관명</Label>
                    <Input
                      placeholder="이용 기관명"
                      value={t.institution}
                      onChange={(e) => updateRehabService(i, "institution", e.target.value)}
                      className={`h-10 transition-colors ${t.institution ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs text-gray-500">이용 요일</Label>
                    <Input
                      placeholder="예: 화, 목"
                      value={t.days}
                      onChange={(e) => updateRehabService(i, "days", e.target.value)}
                      className={`h-10 transition-colors ${t.days ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs text-gray-500">영역</Label>
                    <Input
                      placeholder="예: 놀이, 인지"
                      value={t.area}
                      onChange={(e) => updateRehabService(i, "area", e.target.value)}
                      className={`h-10 transition-colors ${duplicateWarning && t.area ? "border-red-400 bg-red-50/30" : t.area ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRehabService(i)}
                    className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 sm:self-end text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9 shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addRehabService} className="w-full border-dashed border-2 text-blue-600 border-blue-200 hover:bg-blue-50">
                <Plus className="h-4 w-4 mr-1" /> 발달재활서비스 기관 추가
              </Button>
            </div>
          )}
        </div>

        {/* 4. 통학지원 */}
        <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
          <Label className="font-bold text-gray-800 text-base">통학비(교통비)지원</Label>
          <div className={`p-1 -ml-1 rounded-xl transition-all duration-200 ${data.transportSupport ? "bg-transparent" : "ring-2 ring-blue-100 bg-blue-50/30"}`}>
            <RadioOption
              options={["통학비 지원 신청", "해당 없음"]}
              value={data.transportSupport}
              onChange={(v) => update("transportSupport", v)}
              columns={2}
            />
          </div>
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
          <div className={`p-1 -ml-1 rounded-xl transition-all duration-200 ${data.assistantSupport ? "bg-transparent" : "ring-2 ring-blue-100 bg-blue-50/30"}`}>
            <RadioOption
              options={["필요 없음", "학교 내 생활 전반 지원", "특정 시간/활동 지원"]}
              value={data.assistantSupport}
              onChange={(v) => {
                update("assistantSupport", v);
                if (v === "필요 없음") update("assistantSupportDetail", "");
              }}
              columns={1}
            />
          </div>
          {data.assistantSupport && data.assistantSupport !== "필요 없음" && (
            <div className="mt-3 space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">지원 내용 상세 의견 (선택)</Label>
              <Textarea
                placeholder="예: 급식 시간 식판 들기 보조, 체육 시간 이동 동선 지원 등 구체적으로 적어주세요."
                value={data.assistantSupportDetail || ""}
                onChange={(e) => update("assistantSupportDetail", e.target.value)}
                rows={3}
                className={`transition-colors ${data.assistantSupportDetail ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-white border-gray-200"}`}
              />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-gray-200">
        <h2 className="text-lg font-bold border-b pb-2">⑩ 기타 참고사항</h2>

        <div className="space-y-2">
          <Label className="text-base font-bold text-gray-900">담임 선생님께 전하고 싶은 말</Label>
          <Textarea
            placeholder="아이에 대해 선생님이 꼭 알아야 할 것, 학교에 바라는 점, 기타 전하고 싶은 내용을 자유롭게 적어주세요."
            value={data.messageToTeacher}
            onChange={(e) => update("messageToTeacher", e.target.value)}
            rows={4}
            className={`transition-colors ${data.messageToTeacher ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
          />
        </div>
      </div>
    </div>
  );
}
