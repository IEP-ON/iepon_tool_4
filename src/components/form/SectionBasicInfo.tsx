"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioOption } from "./RadioOption";
import type { ParentOpinion, TeacherInput } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalendarDays, Info } from "lucide-react";

interface Props {
  data: ParentOpinion;
  update: (key: keyof ParentOpinion, value: any) => void;
  teacherContext?: TeacherInput;
}

export function SectionBasicInfo({ data, update, teacherContext }: Props) {
  const formatDate = (d: string) => {
    if (!d) return "";
    const dt = new Date(d);
    return `${dt.getFullYear()}년 ${dt.getMonth() + 1}월 ${dt.getDate()}일`;
  };

  // 휴대폰 번호 자동 하이픈 포맷팅 함수
  const handlePhoneChange = (key: keyof ParentOpinion, value: string) => {
    const onlyNums = value.replace(/[^0-9]/g, "");
    let formatted = onlyNums;
    
    if (onlyNums.length <= 3) {
      formatted = onlyNums;
    } else if (onlyNums.length <= 7) {
      formatted = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
    } else if (onlyNums.length <= 11) {
      formatted = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7)}`;
    } else {
      // 11자리 초과시 잘라내기
      formatted = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
    }
    
    update(key, formatted);
  };

  const hasHopeDates = data.attendanceMethod === "대면 참석" || data.attendanceMethod === "유선 참석";

  return (
    <div className="space-y-8">
      {/* 안내 메시지 */}
      <Alert className="bg-blue-50/50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800 font-bold mb-2">작성 전 안내사항</AlertTitle>
        <AlertDescription className="text-gray-600 space-y-1">
          <p>• 이 의견서는 동의서(문서3)와 별개로, 우리 아이의 맞춤형 교육계획(IEP)을 함께 세우기 위한 소통 자료입니다.</p>
          <p>• 답변하기 어려운 항목은 비워두셔도 괜찮습니다.</p>
          <p>• 작성 중 내용이 자동으로 저장되지 않으니 한 번에 작성해 주세요.</p>
        </AlertDescription>
      </Alert>

      {/* 기본 정보 */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold border-b-2 border-gray-800 pb-2">0. 기본 정보</h2>
        
        <div className="grid gap-6">
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-base font-bold">학생 성명</Label>
              <Input
                value={data.studentName}
                onChange={(e) => update("studentName", e.target.value)}
                className={`h-12 ${data.studentName ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
                placeholder="학생 이름을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base font-bold">생년월일</Label>
              <Input
                type="date"
                value={data.birthDate}
                onChange={(e) => update("birthDate", e.target.value)}
                className={`h-12 ${data.birthDate ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-gray-50 border-gray-200"}`}
              />
            </div>
          </div>

          <div className="space-y-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
            <div className="space-y-2">
              <Label className="text-base font-bold">보호자 성명</Label>
              <Input
                value={data.guardianName}
                onChange={(e) => update("guardianName", e.target.value)}
                className={`h-12 ${data.guardianName ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-white border-gray-200"}`}
                placeholder="보호자 이름을 입력하세요"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-base font-bold">학생과의 관계</Label>
              <RadioOption
                options={["부", "모", "조부모", "기타"]}
                value={data.guardianRelation}
                onChange={(v) => update("guardianRelation", v)}
                columns={2}
              />
              {data.guardianRelation === "기타" && (
                <Input
                  placeholder="관계 직접 입력 (예: 이모, 삼촌)"
                  value={data.guardianRelationOther}
                  onChange={(e) => update("guardianRelationOther", e.target.value)}
                  className={`mt-2 h-12 ${data.guardianRelationOther ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-white border-gray-200"}`}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-base font-bold">연락처</Label>
              <Input
                type="tel"
                placeholder="010-0000-0000"
                value={data.guardianPhone}
                onChange={(e) => handlePhoneChange("guardianPhone", e.target.value)}
                className={`h-12 ${data.guardianPhone ? "bg-white border-blue-300 ring-1 ring-blue-100" : "bg-white border-gray-200"}`}
                maxLength={13}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 협의회 참석 및 일정 */}
      <div className="space-y-6 pt-6 border-t border-gray-200">
        <h2 className="text-xl font-bold border-b-2 border-gray-800 pb-2 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-blue-600" />
          협의회 참석 희망 및 일정
        </h2>

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
            value={data.attendanceMethod}
            onChange={(v) => {
              update("attendanceMethod", v);
              // 일정 초기화
              if (v === "의견서 제출로 갈음") {
                update("hopeDate1", ""); update("hopeTime1", "");
                update("hopeDate2", ""); update("hopeTime2", "");
                update("hopeDate3", ""); update("hopeTime3", "");
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
                        value={data[dateKey as keyof ParentOpinion] as string}
                        onChange={(e) => update(dateKey as keyof ParentOpinion, e.target.value)}
                        className="h-12 bg-gray-50/50"
                      />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <Label className="text-xs text-gray-500 font-medium">희망 시간</Label>
                      <Input
                        type="time"
                        value={data[timeKey as keyof ParentOpinion] as string}
                        onChange={(e) => update(timeKey as keyof ParentOpinion, e.target.value)}
                        className="h-12 bg-gray-50/50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
