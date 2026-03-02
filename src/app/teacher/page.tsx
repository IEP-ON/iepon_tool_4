"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { defaultTeacherInput } from "@/lib/defaults";
import type { TeacherInput } from "@/lib/types";

export default function TeacherPage() {
  const router = useRouter();
  const [data, setData] = useState<TeacherInput>(defaultTeacherInput);
  const [loading, setLoading] = useState(false);

  const update = (key: keyof TeacherInput, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    if (!data.schoolName || !data.studentName || !data.grade || !data.classNum || !data.teacherName || !data.teacherPhone || !data.meetingStartDate || !data.meetingEndDate || !data.meetingPlace || !data.submissionDeadline) {
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
      router.push(`/preview?iepId=${iepId}`);
    } catch {
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">교사 기본 정보 입력</h1>
        <p className="text-gray-500">입력한 정보를 바탕으로 안내장이 생성되고, 보호자용 QR코드가 만들어집니다.</p>

        <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-gray-800">학교 정보</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">학교명 *</label>
              <input className="w-full border rounded-lg px-3 py-2 text-base" placeholder="예: 서울초등학교" value={data.schoolName} onChange={(e) => update("schoolName", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">교무부장</label>
              <input className="w-full border rounded-lg px-3 py-2 text-base" value={data.adminTeacherName} onChange={(e) => update("adminTeacherName", e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">교장 성명</label>
            <input className="w-full border rounded-lg px-3 py-2 text-base" value={data.principalName} onChange={(e) => update("principalName", e.target.value)} />
          </div>
        </div>

        <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-gray-800">학생 정보</h2>
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">학생 성명 *</label>
              <input className="w-full border rounded-lg px-3 py-2 text-base" value={data.studentName} onChange={(e) => update("studentName", e.target.value)} />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">학년 *</label>
              <select className="w-full border rounded-lg px-3 py-2 text-base bg-white" value={data.grade} onChange={(e) => update("grade", e.target.value)}>
                <option value="">선택</option>
                {["1학년", "2학년", "3학년", "4학년", "5학년", "6학년", "중1", "중2", "중3", "고1", "고2", "고3"].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">반 *</label>
              <input className="w-full border rounded-lg px-3 py-2 text-base" placeholder="예: 3" value={data.classNum} onChange={(e) => update("classNum", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">학년도</label>
              <input className="w-full border rounded-lg px-3 py-2 text-base" value={data.year} onChange={(e) => update("year", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">학기</label>
              <select className="w-full border rounded-lg px-3 py-2 text-base bg-white" value={data.semester} onChange={(e) => update("semester", e.target.value)}>
                <option value="1">1학기</option>
                <option value="2">2학기</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-gray-800">특수교사 정보</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">특수교사 성명 *</label>
              <input className="w-full border rounded-lg px-3 py-2 text-base" value={data.teacherName} onChange={(e) => update("teacherName", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">연락처 *</label>
              <input className="w-full border rounded-lg px-3 py-2 text-base" placeholder="010-0000-0000" value={data.teacherPhone} onChange={(e) => update("teacherPhone", e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상담 가능 시간</label>
            <input className="w-full border rounded-lg px-3 py-2 text-base" placeholder="예: 평일 14:00~16:30" value={data.consultTime} onChange={(e) => update("consultTime", e.target.value)} />
          </div>
        </div>

        <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-gray-800">협의회 운영 및 일정</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">운영 시작일 *</label>
              <input type="date" className="w-full border rounded-lg px-3 py-2 text-base" value={data.meetingStartDate} onChange={(e) => update("meetingStartDate", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">운영 종료일 *</label>
              <input type="date" className="w-full border rounded-lg px-3 py-2 text-base" value={data.meetingEndDate} onChange={(e) => update("meetingEndDate", e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">장소 *</label>
            <input className="w-full border rounded-lg px-3 py-2 text-base" placeholder="예: 특수학급 교실 (201호)" value={data.meetingPlace} onChange={(e) => update("meetingPlace", e.target.value)} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-gray-800 mb-3">서류 제출 기한</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제출 기한 *</label>
            <input type="date" className="w-full border rounded-lg px-3 py-2 text-base" value={data.submissionDeadline} onChange={(e) => update("submissionDeadline", e.target.value)} />
          </div>
        </div>

        <div className="pb-12">
          <button
            onClick={handleNext}
            disabled={loading || !data.schoolName || !data.studentName || !data.grade || !data.classNum || !data.teacherName || !data.teacherPhone || !data.meetingStartDate || !data.meetingEndDate || !data.meetingPlace || !data.submissionDeadline}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "저장 중..." : "안내장 미리보기 →"}
          </button>
        </div>
      </div>
    </div>
  );
}
