"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { defaultTeacherInput } from "@/lib/defaults";
import { compress } from "@/lib/codec";
import type { TeacherInput } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TeacherPage() {
  const router = useRouter();
  const [form, setForm] = useState<TeacherInput>(defaultTeacherInput);

  const update = (key: keyof TeacherInput, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const encoded = compress(form);
    router.push(`/preview?ctx=${encoded}`);
  };

  const isValid =
    form.schoolName &&
    form.studentName &&
    form.grade &&
    form.classNum &&
    form.teacherName &&
    form.teacherPhone &&
    form.meetingDate &&
    form.meetingHour &&
    form.meetingPlace &&
    form.submissionDeadline;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            처음으로
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          교사 기본 정보 입력
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          입력한 정보를 바탕으로 안내장(문서1)이 생성되고, 보호자용 QR코드가
          만들어집니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">학교 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="schoolName">학교명 *</Label>
                  <Input
                    id="schoolName"
                    placeholder="예: 남대구초등학교"
                    value={form.schoolName}
                    onChange={(e) => update("schoolName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="schoolAddress">학교 주소</Label>
                  <Input
                    id="schoolAddress"
                    placeholder="예: 대구광역시 남구 ..."
                    value={form.schoolAddress}
                    onChange={(e) => update("schoolAddress", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="principalName">교장 성명</Label>
                  <Input
                    id="principalName"
                    value={form.principalName}
                    onChange={(e) => update("principalName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="adminTeacherName">
                    교무부장(개인정보보호책임자)
                  </Label>
                  <Input
                    id="adminTeacherName"
                    value={form.adminTeacherName}
                    onChange={(e) => update("adminTeacherName", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">학생 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="studentName">학생 성명 *</Label>
                  <Input
                    id="studentName"
                    value={form.studentName}
                    onChange={(e) => update("studentName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="grade">학년 *</Label>
                  <Select
                    value={form.grade}
                    onValueChange={(v) => update("grade", v)}
                  >
                    <SelectTrigger id="grade">
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {["1", "2", "3", "4", "5", "6"].map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}학년
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="classNum">반 *</Label>
                  <Input
                    id="classNum"
                    placeholder="예: 3"
                    value={form.classNum}
                    onChange={(e) => update("classNum", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="year">학년도</Label>
                  <Input
                    id="year"
                    value={form.year}
                    onChange={(e) => update("year", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="semester">학기</Label>
                  <Select
                    value={form.semester}
                    onValueChange={(v) => update("semester", v)}
                  >
                    <SelectTrigger id="semester">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1학기</SelectItem>
                      <SelectItem value="2">2학기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">담임교사 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="teacherName">담임교사 성명 *</Label>
                  <Input
                    id="teacherName"
                    value={form.teacherName}
                    onChange={(e) => update("teacherName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="teacherPhone">연락처 *</Label>
                  <Input
                    id="teacherPhone"
                    placeholder="예: 053-000-0000"
                    value={form.teacherPhone}
                    onChange={(e) => update("teacherPhone", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="consultTime">상담 가능 시간</Label>
                <Input
                  id="consultTime"
                  value={form.consultTime}
                  onChange={(e) => update("consultTime", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">협의회 일정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="meetingDate">일시 (날짜) *</Label>
                  <Input
                    id="meetingDate"
                    type="date"
                    value={form.meetingDate}
                    onChange={(e) => {
                      update("meetingDate", e.target.value);
                      if (e.target.value) {
                        const d = new Date(e.target.value);
                        const days = [
                          "일",
                          "월",
                          "화",
                          "수",
                          "목",
                          "금",
                          "토",
                        ];
                        update("meetingDay", days[d.getDay()]);
                      }
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="meetingAmPm">오전/오후</Label>
                  <Select
                    value={form.meetingAmPm}
                    onValueChange={(v) => update("meetingAmPm", v)}
                  >
                    <SelectTrigger id="meetingAmPm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="오전">오전</SelectItem>
                      <SelectItem value="오후">오후</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="meetingHour">시 *</Label>
                    <Input
                      id="meetingHour"
                      placeholder="2"
                      value={form.meetingHour}
                      onChange={(e) => update("meetingHour", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="meetingMinute">분</Label>
                    <Input
                      id="meetingMinute"
                      placeholder="00"
                      value={form.meetingMinute}
                      onChange={(e) => update("meetingMinute", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="meetingPlace">장소 *</Label>
                <Input
                  id="meetingPlace"
                  placeholder="예: 특수학급 교실 (201호)"
                  value={form.meetingPlace}
                  onChange={(e) => update("meetingPlace", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">서류 제출 기한</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="submissionDeadline">제출 기한 *</Label>
                  <Input
                    id="submissionDeadline"
                    type="date"
                    value={form.submissionDeadline}
                    onChange={(e) => {
                      update("submissionDeadline", e.target.value);
                      if (e.target.value) {
                        const d = new Date(e.target.value);
                        const days = [
                          "일",
                          "월",
                          "화",
                          "수",
                          "목",
                          "금",
                          "토",
                        ];
                        update("submissionDay", days[d.getDay()]);
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={!isValid}>
              안내장 미리보기 &rarr;
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
