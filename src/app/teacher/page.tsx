"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Building2, User, Calendar, MapPin, Printer } from "lucide-react";
import { defaultTeacherInput } from "@/lib/defaults";
import type { TeacherInput } from "@/lib/types";
import { compress } from "@/lib/codec";
import Link from "next/link";

export default function TeacherPage() {
  const router = useRouter();
  const [data, setData] = useState<TeacherInput>(defaultTeacherInput);

  const update = (key: keyof TeacherInput, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (!data.schoolName || !data.studentName || !data.grade || !data.classNum || !data.teacherName || !data.teacherPhone || !data.meetingStartDate || !data.meetingEndDate || !data.meetingPlace || !data.submissionDeadline) {
      alert("필수 항목을 모두 입력해 주세요.");
      return;
    }
    const ctx = compress(data);
    router.push(`/preview?ctx=${ctx}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          처음으로
        </Link>
        
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">교사 기본 정보 입력</h1>
          <p className="text-gray-500">입력한 정보를 바탕으로 안내장(문서1)이 생성되고, 보호자용 QR코드가 만들어집니다.</p>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                <Building2 className="w-5 h-5 text-blue-600" />
                학교 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="schoolName" className="font-semibold text-gray-700">학교명 <span className="text-red-500">*</span></Label>
                  <Input id="schoolName" placeholder="예: 남대구초등학교" value={data.schoolName} onChange={(e) => update("schoolName", e.target.value)} className="bg-white" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="schoolAddress" className="font-semibold text-gray-700">학교 주소</Label>
                  <Input id="schoolAddress" placeholder="예: 대구광역시 남구 ..." value={data.schoolAddress} onChange={(e) => update("schoolAddress", e.target.value)} className="bg-white" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="principalName" className="font-semibold text-gray-700">교장 성명</Label>
                  <Input id="principalName" value={data.principalName} onChange={(e) => update("principalName", e.target.value)} className="bg-white" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="adminTeacherName" className="font-semibold text-gray-700">교무부장(개인정보보호책임자)</Label>
                  <Input id="adminTeacherName" value={data.adminTeacherName} onChange={(e) => update("adminTeacherName", e.target.value)} className="bg-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                <User className="w-5 h-5 text-indigo-600" />
                학생 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-6 space-y-1.5">
                  <Label htmlFor="studentName" className="font-semibold text-gray-700">학생 성명 <span className="text-red-500">*</span></Label>
                  <Input id="studentName" value={data.studentName} onChange={(e) => update("studentName", e.target.value)} className="bg-white" />
                </div>
                <div className="col-span-6 sm:col-span-3 space-y-1.5">
                  <Label htmlFor="grade" className="font-semibold text-gray-700">학년 <span className="text-red-500">*</span></Label>
                  <Select value={data.grade} onValueChange={(v) => update("grade", v)}>
                    <SelectTrigger id="grade" className="bg-white"><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      {["1학년", "2학년", "3학년", "4학년", "5학년", "6학년"].map(g => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-6 sm:col-span-3 space-y-1.5">
                  <Label htmlFor="classNum" className="font-semibold text-gray-700">반 <span className="text-red-500">*</span></Label>
                  <Input id="classNum" placeholder="예: 3" value={data.classNum} onChange={(e) => update("classNum", e.target.value)} className="bg-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="year" className="font-semibold text-gray-700">학년도</Label>
                  <Input id="year" value={data.year} onChange={(e) => update("year", e.target.value)} className="bg-white" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="semester" className="font-semibold text-gray-700">학기</Label>
                  <Select value={data.semester} onValueChange={(v) => update("semester", v)}>
                    <SelectTrigger id="semester" className="bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1학기</SelectItem>
                      <SelectItem value="2">2학기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                <Printer className="w-5 h-5 text-purple-600" />
                담임교사 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="teacherName" className="font-semibold text-gray-700">담임교사 성명 <span className="text-red-500">*</span></Label>
                  <Input id="teacherName" value={data.teacherName} onChange={(e) => update("teacherName", e.target.value)} className="bg-white" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="teacherPhone" className="font-semibold text-gray-700">연락처 <span className="text-red-500">*</span></Label>
                  <Input id="teacherPhone" placeholder="예: 053-000-0000" value={data.teacherPhone} onChange={(e) => update("teacherPhone", e.target.value)} className="bg-white" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="consultTime" className="font-semibold text-gray-700">상담 가능 시간</Label>
                <Input id="consultTime" placeholder="예: 평일 14:00 ~ 16:30" value={data.consultTime} onChange={(e) => update("consultTime", e.target.value)} className="bg-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                <Calendar className="w-5 h-5 text-green-600" />
                협의회 운영 및 일정
              </CardTitle>
              <CardDescription>협의회를 개최할 수 있는 운영 기간을 지정해주세요. 보호자는 이 기간 내에서 희망 일시를 3순위까지 선택합니다.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="meetingStartDate" className="font-semibold text-gray-700 flex items-center gap-1"><Calendar className="w-3 h-3"/> 운영 시작일 <span className="text-red-500">*</span></Label>
                  <Input type="date" id="meetingStartDate" value={data.meetingStartDate} onChange={(e) => update("meetingStartDate", e.target.value)} className="bg-white" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="meetingEndDate" className="font-semibold text-gray-700 flex items-center gap-1"><Calendar className="w-3 h-3"/> 운영 종료일 <span className="text-red-500">*</span></Label>
                  <Input type="date" id="meetingEndDate" value={data.meetingEndDate} onChange={(e) => update("meetingEndDate", e.target.value)} className="bg-white" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="meetingPlace" className="font-semibold text-gray-700 flex items-center gap-1"><MapPin className="w-3 h-3"/> 장소 <span className="text-red-500">*</span></Label>
                <Input id="meetingPlace" placeholder="예: 특수학급 교실 (201호)" value={data.meetingPlace} onChange={(e) => update("meetingPlace", e.target.value)} className="bg-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                <Printer className="w-5 h-5 text-orange-600" />
                서류 제출 기한
              </CardTitle>
              <CardDescription>보호자 의견서 및 동의서 제출 마감일입니다.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-1.5">
                <Label htmlFor="submissionDeadline" className="font-semibold text-gray-700">제출 기한 <span className="text-red-500">*</span></Label>
                <Input type="date" id="submissionDeadline" value={data.submissionDeadline} onChange={(e) => update("submissionDeadline", e.target.value)} className="bg-white" />
              </div>
            </CardContent>
          </Card>

          <div className="pt-4 pb-12 flex justify-end">
            <Button
              size="lg"
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto px-8 py-6 text-lg rounded-xl shadow-lg"
              disabled={!data.schoolName || !data.studentName || !data.grade || !data.classNum || !data.teacherName || !data.teacherPhone || !data.meetingStartDate || !data.meetingEndDate || !data.meetingPlace || !data.submissionDeadline}
            >
              안내장 미리보기 <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
