"use client";

import { useState } from "react";
import { defaultTeacherInput } from "@/lib/defaults";
import type { TeacherInput } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Loader2, School, User, CalendarDays, Lock, AlertCircle, Info, ShieldAlert } from "lucide-react";
import { generateKey, sha256 } from "@/lib/encryption";
import { useTutorial } from "@/hooks/useTutorial";

export default function TeacherPage() {
  const [data, setData] = useState<TeacherInput>(defaultTeacherInput);
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");

  useTutorial({
    tutorialId: "teacher-page-v1",
    steps: [
      {
        element: "#tutorial-teacher-info",
        popover: {
          title: "교사 및 학교 정보 입력",
          description: "학부모에게 발송될 안내장에 표시될 학교명, 학급 학생 수 등을 입력합니다.",
          side: "top",
          align: "start",
        },
      },
      {
        element: "#tutorial-meeting-info",
        popover: {
          title: "운영 일정 및 담당자",
          description: "협의회 운영 기간, 장소, 학부모의 의견서 제출 기한을 설정합니다.",
          side: "top",
          align: "start",
        },
      },
      {
        element: "#teacherPhone",
        popover: {
          title: "관리자 ID (연락처)",
          description: "학부모가 제출한 데이터를 나중에 열람할 때 아이디로 사용됩니다. 내선번호 사용을 권장합니다.",
          side: "top",
          align: "start",
        },
      },
      {
        element: "#pin",
        popover: {
          title: "관리자 비밀번호",
          description: "열람을 위한 숫자 4자리 비밀번호를 설정하세요. 이 비밀번호는 반드시 기억해 두어야 합니다.",
          side: "top",
          align: "start",
        },
      },
      {
        element: "#tutorial-submit",
        popover: {
          title: "안내장 생성",
          description: "모든 필수 항목을 입력하고 이 버튼을 누르면 학부모용 안내장 세트가 생성됩니다.",
          side: "top",
          align: "center",
        },
      },
    ],
  });

  const update = (key: keyof TeacherInput, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const isPinValid = () => pin.length === 4 && /^[0-9]{4}$/.test(pin) && pin === pinConfirm;

  const isFormValid = () => {
    return !!(
      data.schoolName &&
      data.studentCount &&
      parseInt(data.studentCount) > 0 &&
      data.teacherName &&
      data.teacherPhone &&
      data.meetingStartDate &&
      data.meetingEndDate &&
      data.meetingPlace &&
      data.submissionDeadline &&
      isPinValid()
    );
  };

  const handleNext = async () => {
    if (!isFormValid()) {
      alert("필수 항목을 모두 입력해 주세요.");
      return;
    }

    setLoading(true);
    try {
      const teacherPinHash = await sha256(pin);
      const key = await generateKey();
      const res = await fetch("/api/iep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherInput: data, teacherPinHash, encryptionKey: key }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "저장에 실패했습니다.");
        return;
      }

      const { batchId } = await res.json();
      window.location.href = `/preview?batchId=${batchId}#key=${key}`;
    } catch {
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-2xl mb-4">
            <School className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">개별화교육계획(IEP) 시작하기</h1>
          <p className="text-gray-500 text-lg">기본 정보를 입력하고 학생별 안내장을 생성하세요</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white/80 backdrop-blur-sm" id="tutorial-teacher-info">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm">1</span>
                교사 및 학교 정보
              </CardTitle>
              <CardDescription>학부모에게 발송될 안내장에 포함되는 기본 정보입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">학교명 <span className="text-red-500">*</span></Label>
                  <Input id="schoolName" placeholder="예: 서울초등학교" value={data.schoolName} onChange={(e) => update("schoolName", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentCount">해당 학급 특수교육대상학생 수 <span className="text-red-500">*</span></Label>
                  <Input 
                    id="studentCount" 
                    type="number" 
                    min="1" 
                    max="100"
                    placeholder="예: 5" 
                    value={data.studentCount} 
                    onChange={(e) => update("studentCount", e.target.value)} 
                  />
                  <p className="text-xs text-gray-500">입력한 수만큼 개별 학생용 문서세트(QR)가 생성됩니다.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="year">학년도</Label>
                  <Input id="year" placeholder="예: 2024" value={data.year} onChange={(e) => update("year", e.target.value)} />
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

              <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="principalName">교장 성명 (선택)</Label>
                  <Input id="principalName" placeholder="성명 입력" value={data.principalName} onChange={(e) => update("principalName", e.target.value)} />
                  <p className="text-xs text-gray-500 leading-relaxed flex items-start gap-1">
                    <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-blue-500" />
                    안내장 하단 결재란에 표시되며, 개인정보 수집·이용 동의서의 수집 주체(학교장) 명시를 위해 사용됩니다.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminTeacherName">교무부장 성명 (선택)</Label>
                  <Input id="adminTeacherName" placeholder="성명 입력" value={data.adminTeacherName} onChange={(e) => update("adminTeacherName", e.target.value)} />
                  <p className="text-xs text-gray-500 leading-relaxed flex items-start gap-1">
                    <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-blue-500" />
                    안내장 발신 섹션 및 동의서의 개인정보 취급/행정책임자로 표기됩니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. 운영 일정 및 담당자 */}
          <Card className="border-orange-100 shadow-sm overflow-hidden" id="tutorial-meeting-info">
            <CardHeader className="bg-orange-50/50 pb-4 border-b border-orange-100">
              <CardTitle className="flex items-center text-lg text-orange-900">
                <CalendarDays className="w-5 h-5 mr-2 text-orange-600" />
                운영 일정 및 담당자
              </CardTitle>
              <CardDescription>개별화교육지원팀 협의회 운영 관련 일정과 담당 교사 정보입니다.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                  협의회 일정 및 장소
                </h3>
                <div className="grid sm:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="meetingStartDate">운영 기간 <span className="text-red-500">*</span></Label>
                      <div className="flex items-center gap-2">
                        <Input id="meetingStartDate" type="date" value={data.meetingStartDate} onChange={(e) => update("meetingStartDate", e.target.value)} />
                        <span className="text-gray-400">~</span>
                        <Input id="meetingEndDate" type="date" value={data.meetingEndDate} onChange={(e) => update("meetingEndDate", e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meetingPlace">협의회 장소 <span className="text-red-500">*</span></Label>
                      <Input id="meetingPlace" placeholder="예: 특수학급 교실 (201호)" value={data.meetingPlace} onChange={(e) => update("meetingPlace", e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="submissionDeadline" className="text-orange-700">의견서/동의서 제출 기한 <span className="text-red-500">*</span></Label>
                    <Input id="submissionDeadline" type="date" value={data.submissionDeadline} onChange={(e) => update("submissionDeadline", e.target.value)} className="border-orange-200 focus-visible:ring-orange-500" />
                    <p className="text-xs text-gray-500">이 기한이 지나면 학부모의 폼 작성이 제한될 수 있습니다.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                  담당 교사 정보
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="teacherName">특수교사 성명 <span className="text-red-500">*</span></Label>
                    <Input id="teacherName" placeholder="성명 입력" value={data.teacherName} onChange={(e) => update("teacherName", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="consultTime">상담 가능 시간 (선택)</Label>
                    <Input id="consultTime" placeholder="예: 평일 14:00~16:30" value={data.consultTime} onChange={(e) => update("consultTime", e.target.value)} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. 보안 및 열람 권한 */}
          <Card className="border-red-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-red-50/50 pb-4 border-b border-red-100">
              <CardTitle className="flex items-center text-lg text-red-900">
                <ShieldAlert className="w-5 h-5 mr-2 text-red-600" />
                보안 및 관리자 권한
              </CardTitle>
              <CardDescription>학부모가 제출한 데이터를 안전하게 열람하기 위한 설정입니다.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800 text-sm mb-2">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                <div className="space-y-1.5">
                  <p className="font-semibold text-amber-900 text-base">연락처와 PIN 번호가 곧 열람 계정입니다.</p>
                  <p>여기에 입력한 연락처와 PIN 번호를 조합하여 대시보드에 로그인하게 됩니다. <strong>개인정보 보호를 위해 교사 개인 휴대폰 번호 대신 가급적 학교 대표번호나 교무실 내선번호 사용을 권장합니다.</strong></p>
                  <p className="text-amber-700 mt-1">※ 같은 내선번호를 사용하시더라도 선생님마다 <strong>비밀번호(PIN)를 다르게 설정하시면 각자의 학생 데이터가 완전히 분리되어 별도로 저장/관리</strong>됩니다.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="teacherPhone">교사 연락처 (관리자 ID) <span className="text-red-500">*</span></Label>
                  <Input id="teacherPhone" placeholder="예: 02-1234-5678 (내선번호 권장)" value={data.teacherPhone} onChange={(e) => update("teacherPhone", e.target.value)} />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pin">비밀번호 (숫자 4자리) <span className="text-red-500">*</span></Label>
                    <Input
                      id="pin"
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="숫자 4자리 입력"
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pinConfirm">비밀번호 확인 <span className="text-red-500">*</span></Label>
                    <Input
                      id="pinConfirm"
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="동일하게 재입력"
                      value={pinConfirm}
                      onChange={(e) => setPinConfirm(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
                    />
                  </div>
                  {pin.length === 4 && pinConfirm.length > 0 && pin !== pinConfirm && (
                    <p className="text-sm text-red-500 font-medium flex items-center gap-1"><AlertCircle className="w-4 h-4" /> 비밀번호가 일치하지 않습니다.</p>
                  )}
                  {isPinValid() && (
                    <p className="text-sm text-green-600 font-medium flex items-center gap-1"><Lock className="w-4 h-4" /> 비밀번호가 설정되었습니다.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </form>

        <div className="pt-4 pb-12" id="tutorial-submit">
          <Button 
            size="lg" 
            className="w-full h-14 text-lg rounded-xl shadow-lg transition-all hover:-translate-y-0.5"
            onClick={handleNext}
            disabled={loading || !isFormValid()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                생성 중...
              </>
            ) : (
              <>
                입력 완료 및 안내장 생성
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
          {!isFormValid() && (
            <p className="text-center text-sm text-red-500 mt-4 font-medium flex items-center justify-center gap-1">
              <AlertCircle className="w-4 h-4" /> 필수 항목(*)을 모두 입력해 주세요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
