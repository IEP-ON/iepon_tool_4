"use client";

import type { ParentOpinion, TeacherInput } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioOption } from "./RadioOption";
import { CalendarDays } from "lucide-react";

interface Props {
  opinion: ParentOpinion;
  updateOpinion: (key: keyof ParentOpinion, value: any) => void;
  teacherContext?: TeacherInput;
}

export function Step1Basic({ opinion, updateOpinion, teacherContext }: Props) {
  const handlePhoneChange = (key: keyof ParentOpinion, value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    let formatted = cleaned;
    if (cleaned.length > 3 && cleaned.length <= 7) {
      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else if (cleaned.length > 7) {
      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
    }
    updateOpinion(key, formatted);
  };

  const disabilityTypes = [
    "시각장애", "청각장애", "지적장애", "지체장애", "정서·행동장애",
    "자폐성장애", "의사소통장애", "학습장애", "건강장애", "발달지체", "직접 입력"
  ];

  const hasHopeDates = opinion.attendanceMethod === "대면 참석" || opinion.attendanceMethod === "유선 참석";

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  return (
    <div className="space-y-6">
      {/* 1. 학생 및 보호자 정보 */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">학생 및 보호자 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-base font-bold">학생 성명</Label>
              <Input
                className={`h-12 ${opinion.studentName ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
                placeholder="학생 이름을 입력하세요"
                value={opinion.studentName}
                onChange={(e) => updateOpinion("studentName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base font-bold">생년월일</Label>
              <Input
                type="date"
                className={`h-12 ${opinion.birthDate ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
                value={opinion.birthDate}
                onChange={(e) => updateOpinion("birthDate", e.target.value)}
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-base font-bold">학년</Label>
              <Input
                className={`h-12 ${opinion.grade ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
                placeholder="예: 1학년"
                value={opinion.grade}
                onChange={(e) => updateOpinion("grade", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base font-bold">반</Label>
              <Input
                className={`h-12 ${opinion.classNum ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
                placeholder="예: 3반"
                value={opinion.classNum}
                onChange={(e) => updateOpinion("classNum", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
            <div className="space-y-2">
              <Label className="text-base font-bold">보호자 성명</Label>
              <Input
                value={opinion.guardianName}
                onChange={(e) => updateOpinion("guardianName", e.target.value)}
                className={`h-12 ${opinion.guardianName ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-white border-gray-200"}`}
                placeholder="보호자 이름을 입력하세요"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-base font-bold">학생과의 관계</Label>
              <RadioOption
                options={["부", "모", "조부모", "기타"]}
                value={opinion.guardianRelation}
                onChange={(v) => updateOpinion("guardianRelation", v)}
                columns={2}
              />
              {opinion.guardianRelation === "기타" && (
                <Input
                  placeholder="관계 직접 입력 (예: 이모, 삼촌)"
                  value={opinion.guardianRelationOther}
                  onChange={(e) => updateOpinion("guardianRelationOther", e.target.value)}
                  className={`mt-2 h-12 ${opinion.guardianRelationOther ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-white border-gray-200"}`}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-base font-bold">연락처</Label>
              <Input
                type="tel"
                placeholder="010-0000-0000"
                value={opinion.guardianPhone}
                onChange={(e) => handlePhoneChange("guardianPhone", e.target.value)}
                className={`h-12 ${opinion.guardianPhone ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-white border-gray-200"}`}
                maxLength={13}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. 가정 환경 */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">가정 환경</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base font-bold text-gray-900">가정 내 주 양육자</Label>
            <div className={`p-1 rounded-xl transition-all duration-200 ${opinion.primaryCaregiver ? "bg-transparent" : "ring-2 ring-blue-100 bg-blue-50/30"}`}>
              <RadioOption
                options={["부모 공동 양육", "모", "부", "조부모", "기타"]}
                value={opinion.primaryCaregiver}
                onChange={(v) => updateOpinion("primaryCaregiver", v)}
                columns={2}
              />
            </div>
            {opinion.primaryCaregiver === "기타" && (
              <Input
                className={`mt-2 h-12 transition-colors ${opinion.primaryCaregiverOther ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
                placeholder="기타 양육자"
                value={opinion.primaryCaregiverOther}
                onChange={(e) => updateOpinion("primaryCaregiverOther", e.target.value)}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-base font-bold text-gray-900">방과 후 주요 활동 (학원 등)</Label>
            <Input
              placeholder="예: 피아노 학원(주3회), 태권도(매일)"
              value={opinion.afterSchoolActivity}
              onChange={(e) => updateOpinion("afterSchoolActivity", e.target.value)}
              className={`h-12 transition-colors ${opinion.afterSchoolActivity ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-bold text-gray-900">최근 가정 내 주요 변화 (선택)</Label>
            <Textarea
              placeholder="예: 이사, 동생 출생, 부모 별거 등 학교에서 알아야 할 변화가 있다면 적어주세요."
              value={opinion.familyChanges}
              onChange={(e) => updateOpinion("familyChanges", e.target.value)}
              rows={3}
              className={`transition-colors ${opinion.familyChanges ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. 장애 및 특수교육 선정 현황 */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">장애 및 특수교육 선정 현황</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 border-b pb-2">복지카드(장애인 등록) 소지 여부</h3>
            <div className={`p-1 rounded-xl transition-all duration-200 ${opinion.disabilityRegistration ? "bg-transparent" : "ring-2 ring-blue-100 bg-blue-50/30"}`}>
              <RadioOption
                options={["소지", "미소지"]}
                value={opinion.disabilityRegistration}
                onChange={(v) => {
                  updateOpinion("disabilityRegistration", v);
                  if (v === "미소지") {
                    updateOpinion("primaryDisability", "");
                    updateOpinion("secondaryDisability", "없음");
                    updateOpinion("secondaryDisabilityType", "");
                    updateOpinion("disabilitySeverity", "");
                    updateOpinion("firstRegistrationDate", "");
                  }
                }}
              />
            </div>
            
            {opinion.disabilityRegistration === "소지" && (
              <div className="space-y-6 pt-4 px-4 bg-gray-50/50 rounded-xl border border-gray-100 pb-4">
                <div className="space-y-3">
                  <Label className="font-medium text-gray-700 block">주장애 유형</Label>
                  <div className={`p-1 rounded-xl transition-all duration-200 ${opinion.primaryDisability ? "bg-transparent" : "ring-2 ring-blue-100 bg-blue-50/30"}`}>
                    <RadioOption
                      options={disabilityTypes}
                      value={disabilityTypes.includes(opinion.primaryDisability) ? opinion.primaryDisability : (opinion.primaryDisability ? "직접 입력" : "")}
                      onChange={(v) => {
                        if (v === "직접 입력") {
                          updateOpinion("primaryDisability", " ");
                        } else {
                          updateOpinion("primaryDisability", v);
                        }
                      }}
                    />
                  </div>
                  {(!disabilityTypes.slice(0, -1).includes(opinion.primaryDisability) && opinion.primaryDisability !== "") && (
                    <Input
                      className="mt-2 bg-white"
                      placeholder="장애 유형 직접 입력"
                      value={opinion.primaryDisability.trim()}
                      onChange={(e) => updateOpinion("primaryDisability", e.target.value)}
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="font-medium text-gray-700 block">장애 정도</Label>
                  <div className={`p-1 rounded-xl transition-all duration-200 ${opinion.disabilitySeverity ? "bg-transparent" : "ring-2 ring-blue-100 bg-blue-50/30"}`}>
                    <RadioOption
                      options={["심한 장애 (기존 1~3급)", "심하지 않은 장애 (기존 4~6급)"]}
                      value={opinion.disabilitySeverity}
                      onChange={(v) => updateOpinion("disabilitySeverity", v)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="font-medium text-gray-900 border-b pb-2">특수교육대상자 선정 영역 (교육청)</h3>
            <div className="space-y-3 pt-2">
              <div className={`p-1 rounded-xl transition-all duration-200 ${opinion.specialEdArea ? "bg-transparent" : "ring-2 ring-blue-100 bg-blue-50/30"}`}>
                <RadioOption
                  options={disabilityTypes}
                  value={disabilityTypes.includes(opinion.specialEdArea) ? opinion.specialEdArea : (opinion.specialEdArea ? "직접 입력" : "")}
                  onChange={(v) => {
                    if (v === "직접 입력") {
                      updateOpinion("specialEdArea", " ");
                    } else {
                      updateOpinion("specialEdArea", v);
                    }
                  }}
                />
              </div>
              {(!disabilityTypes.slice(0, -1).includes(opinion.specialEdArea) && opinion.specialEdArea !== "") && (
                <Input
                  className="mt-2 bg-white"
                  placeholder="선정 장애 영역 직접 입력"
                  value={opinion.specialEdArea.trim()}
                  onChange={(e) => updateOpinion("specialEdArea", e.target.value)}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. 협의회 참석 */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            협의회 참석 희망 및 일정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {teacherContext?.meetingStartDate && teacherContext?.meetingEndDate && (
            <div className="bg-blue-50/50 border border-blue-200 p-4 rounded-xl text-sm">
              <p className="font-bold text-blue-800 mb-1">학교 협의회 운영 기간</p>
              <p className="text-blue-900 text-base">
                {formatDate(teacherContext.meetingStartDate)} ~ {formatDate(teacherContext.meetingEndDate)}
              </p>
              {teacherContext.consultTime && (
                <p className="text-gray-600 mt-2">담임교사 상담 가능 시간: {teacherContext.consultTime}</p>
              )}
            </div>
          )}

          <div className="space-y-4">
            <Label className="text-base font-bold block">원하시는 참석 방법을 선택해 주세요</Label>
            <RadioOption
              options={["대면 참석", "유선 참석", "의견서 제출로 갈음"]}
              value={opinion.attendanceMethod}
              onChange={(v) => {
                updateOpinion("attendanceMethod", v);
                if (v === "의견서 제출로 갈음") {
                  updateOpinion("hopeDate1", ""); updateOpinion("hopeTime1", "");
                  updateOpinion("hopeDate2", ""); updateOpinion("hopeTime2", "");
                  updateOpinion("hopeDate3", ""); updateOpinion("hopeTime3", "");
                }
              }}
              columns={3}
            />
          </div>

          {hasHopeDates && (
            <div className="space-y-4 p-5 bg-gray-50 border border-gray-200 rounded-xl">
              <Label className="text-base font-bold text-gray-900 block mb-2">희망 일시를 3순위까지 입력해 주세요</Label>
              <p className="text-sm text-gray-600 mb-4">선택하신 일정 중 조율하여 최종 일정을 연락드리겠습니다.</p>
              
              <div className="space-y-4">
                {[
                  { rank: 1, dateKey: "hopeDate1", timeKey: "hopeTime1" },
                  { rank: 2, dateKey: "hopeDate2", timeKey: "hopeTime2" },
                  { rank: 3, dateKey: "hopeDate3", timeKey: "hopeTime3" },
                ].map(({ rank, dateKey, timeKey }) => (
                  <div key={rank} className="flex flex-col gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <div className="flex items-center">
                      <span className="font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-md text-sm">{rank}순위</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="space-y-1.5 flex-1">
                        <Label className="text-xs text-gray-500 font-medium">희망일</Label>
                        <Input
                          type="date"
                          min={teacherContext?.meetingStartDate || ""}
                          max={teacherContext?.meetingEndDate || ""}
                          value={opinion[dateKey as keyof ParentOpinion] as string}
                          onChange={(e) => updateOpinion(dateKey as keyof ParentOpinion, e.target.value)}
                          className="h-12 bg-gray-50/50"
                        />
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <Label className="text-xs text-gray-500 font-medium">희망 시간</Label>
                        <Input
                          type="time"
                          value={opinion[timeKey as keyof ParentOpinion] as string}
                          onChange={(e) => updateOpinion(timeKey as keyof ParentOpinion, e.target.value)}
                          className="h-12 bg-gray-50/50"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
