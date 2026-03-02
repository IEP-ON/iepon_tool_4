"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { defaultTeacherInput } from "@/lib/defaults";
import type { TeacherInput } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2, School, User, CalendarDays } from "lucide-react";
import { generateKey } from "@/lib/encryption";

export default function TeacherPage() {
  const router = useRouter();
  const [data, setData] = useState<TeacherInput>(defaultTeacherInput);
  const [loading, setLoading] = useState(false);

  const update = (key: keyof TeacherInput, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const isFormValid = () => {
    return !!(
      data.schoolName &&
      data.studentName &&
      data.grade &&
      data.classNum &&
      data.teacherName &&
      data.teacherPhone &&
      data.meetingStartDate &&
      data.meetingEndDate &&
      data.meetingPlace &&
      data.submissionDeadline
    );
  };

  const handleNext = async () => {
    if (!isFormValid()) {
      alert("필수 항목을 모두 입력해 주세요.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/iep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherInput: data }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "저장에 실패했습니다.");
        return;
      }

      const { iepId } = await res.json();
      const key = await generateKey();
      window.location.href = `/preview?iepId=${iepId}#key=${key}`;
    } catch {
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">교사 기본 정보 입력</h1>
          <p className="text-gray-500">입력한 정보를 바탕으로 안내장이 생성되고, 보호자용 QR코드가 만들어집니다.</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <School className="w-5 h-5 mr-2 text-blue-600" />
                학교 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">학교명 <span className="text-red-500">*</span></Label>
                  <Input id="schoolName" placeholder="예: 서울초등학교" value={data.schoolName} onChange={(e) => update("schoolName", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminTeacherName">교무부장 (선택)</Label>
                  <Input id="adminTeacherName" placeholder="성명 입력" value={data.adminTeacherName} onChange={(e) => update("adminTeacherName", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="principalName">교장 성명 (선택)</Label>
                <Input id="principalName" placeholder="성명 입력" value={data.principalName} onChange={(e) => update("principalName", e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <User className="w-5 h-5 mr-2 text-green-600" />
                학생 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-6 space-y-2">
                  <Label htmlFor="studentName">학생 성명 <span className="text-red-500">*</span></Label>
                  <Input id="studentName" placeholder="성명 입력" value={data.studentName} onChange={(e) => update("studentName", e.target.value)} />
                </div>
                <div className="col-span-6 sm:col-span-3 space-y-2">
                  <Label htmlFor="grade">학년 <span className="text-red-500">*</span></Label>
                  <select 
                    id="grade"
                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600" 
                    value={data.grade} 
                    onChange={(e) => update("grade", e.target.value)}
                  >
                    <option value="">선택</option>
                    {["1학년", "2학년", "3학년", "4학년", "5학년", "6학년", "중1", "중2", "중3", "고1", "고2", "고3"].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-6 sm:col-span-3 space-y-2">
                  <Label htmlFor="classNum">반 <span className="text-red-500">*</span></Label>
                  <Input id="classNum" placeholder="예: 3" value={data.classNum} onChange={(e) => update("classNum", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">학년도</Label>
                  <Input id="year" value={data.year} onChange={(e) => update("year", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">학기</Label>
                  <select 
                    id="semester"
                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600" 
                    value={data.semester} 
                    onChange={(e) => update("semester", e.target.value)}
                  >
                    <option value="1">1학기</option>
                    <option value="2">2학기</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <User className="w-5 h-5 mr-2 text-purple-600" />
                특수교사 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teacherName">특수교사 성명 <span className="text-red-500">*</span></Label>
                  <Input id="teacherName" placeholder="성명 입력" value={data.teacherName} onChange={(e) => update("teacherName", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacherPhone">연락처 <span className="text-red-500">*</span></Label>
                  <Input id="teacherPhone" placeholder="010-0000-0000" value={data.teacherPhone} onChange={(e) => update("teacherPhone", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="consultTime">상담 가능 시간 (선택)</Label>
                <Input id="consultTime" placeholder="예: 평일 14:00~16:30" value={data.consultTime} onChange={(e) => update("consultTime", e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <CalendarDays className="w-5 h-5 mr-2 text-orange-600" />
                일정 및 장소
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 border-b pb-2">협의회 운영</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meetingStartDate">운영 시작일 <span className="text-red-500">*</span></Label>
                    <Input id="meetingStartDate" type="date" value={data.meetingStartDate} onChange={(e) => update("meetingStartDate", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meetingEndDate">운영 종료일 <span className="text-red-500">*</span></Label>
                    <Input id="meetingEndDate" type="date" value={data.meetingEndDate} onChange={(e) => update("meetingEndDate", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meetingPlace">장소 <span className="text-red-500">*</span></Label>
                  <Input id="meetingPlace" placeholder="예: 특수학급 교실 (201호)" value={data.meetingPlace} onChange={(e) => update("meetingPlace", e.target.value)} />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-medium text-gray-900 border-b pb-2">서류 제출</h3>
                <div className="space-y-2">
                  <Label htmlFor="submissionDeadline">제출 기한 <span className="text-red-500">*</span></Label>
                  <Input id="submissionDeadline" type="date" value={data.submissionDeadline} onChange={(e) => update("submissionDeadline", e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="pt-6 pb-12">
          <Button 
            size="lg" 
            className="w-full h-14 text-lg rounded-xl shadow-md"
            onClick={handleNext}
            disabled={loading || !isFormValid()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                안내장 생성 및 미리보기
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
          {!isFormValid() && (
            <p className="text-center text-sm text-red-500 mt-3">
              필수 항목(*)을 모두 입력해 주세요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
