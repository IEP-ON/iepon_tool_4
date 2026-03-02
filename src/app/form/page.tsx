"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { defaultTeacherInput, defaultParentOpinion, defaultConsentForm } from "@/lib/defaults";
import type { TeacherInput, ParentOpinion, ConsentForm } from "@/lib/types";
import { generateKey, encryptData, sha256 } from "@/lib/encryption";

function FormContent() {
  const searchParams = useSearchParams();
  const iepId = searchParams.get("iepId");
  const [teacher, setTeacher] = useState<TeacherInput>(defaultTeacherInput);
  const [opinion, setOpinion] = useState<ParentOpinion>(defaultParentOpinion);
  const [consent, setConsent] = useState<ConsentForm>(defaultConsentForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!iepId) {
      setError("iepId가 없습니다. QR코드를 다시 스캔해주세요.");
      setLoading(false);
      return;
    }

    fetch(`/api/iep/${iepId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setTeacher(data.teacherData);
          setOpinion((prev) => ({
            ...prev,
            studentName: data.teacherData.studentName || "",
          }));
        }
      })
      .catch(() => setError("데이터 로드에 실패했습니다."))
      .finally(() => setLoading(false));
  }, [iepId]);

  const updateOpinion = (key: keyof ParentOpinion, value: ParentOpinion[keyof ParentOpinion]) => {
    setOpinion((prev) => ({ ...prev, [key]: value }));
  };

  const updateConsent = (key: keyof ConsentForm, value: ConsentForm[keyof ConsentForm]) => {
    setConsent((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!iepId) return;

    setSubmitting(true);
    try {
      const key = await generateKey();
      const { encrypted: opinionEncrypted, iv: opinionIv } = await encryptData(opinion, key);
      const { encrypted: consentEncrypted, iv: consentIv } = await encryptData(consent, key);
      const guardianNameHash = await sha256(opinion.guardianName || "anonymous");

      const res = await fetch(`/api/iep/${iepId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opinionEncrypted,
          opinionIv,
          consentEncrypted,
          consentIv,
          guardianNameHash,
          signatureBase64: consent.consentSignatureBase64 || "",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "제출에 실패했습니다.");
        return;
      }

      window.location.href = `/result?iepId=${iepId}#key=${key}`;
    } catch {
      alert("제출 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">불러오는 중...</p></div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">보호자 의견서 및 동의서</h1>
          <p className="text-gray-500 mt-1">{teacher.schoolName} · {teacher.teacherName} 선생님</p>
          <p className="text-sm text-gray-400">학생: {teacher.studentName}</p>
        </div>

        {/* 기본 정보 섹션 - 플레이스홀더 (디자인은 다른 LLM이 담당) */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="font-bold text-gray-800 border-b pb-2">1. 기본 정보</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">보호자 성명</label>
              <input className="w-full border rounded-lg px-3 py-2 text-base" value={opinion.guardianName} onChange={(e) => updateOpinion("guardianName", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">관계</label>
              <select className="w-full border rounded-lg px-3 py-2 text-base bg-white" value={opinion.guardianRelation} onChange={(e) => updateOpinion("guardianRelation", e.target.value)}>
                <option value="">선택</option>
                <option value="어머니">어머니</option>
                <option value="아버지">아버지</option>
                <option value="조부모">조부모</option>
                <option value="기타">기타</option>
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
              <input className="w-full border rounded-lg px-3 py-2 text-base" placeholder="010-0000-0000" value={opinion.guardianPhone} onChange={(e) => updateOpinion("guardianPhone", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">생년월일</label>
              <input type="date" className="w-full border rounded-lg px-3 py-2 text-base" value={opinion.birthDate} onChange={(e) => updateOpinion("birthDate", e.target.value)} />
            </div>
          </div>
        </div>

        {/* 동의서 간소화 섹션 */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="font-bold text-gray-800 border-b pb-2">동의서</h2>
          <div className="space-y-3">
            {[
              { key: "consent1" as const, label: "기본 개인정보 수집·이용 동의" },
              { key: "consent2" as const, label: "건강·장애 민감정보 수집·이용 동의" },
              { key: "consent3" as const, label: "제3자 정보 제공 동의" },
              { key: "consent4_handover" as const, label: "교내 정보 공유 동의" },
              { key: "consent9_firstAid" as const, label: "응급처치 동의" },
              { key: "consent9_119" as const, label: "119 신고 및 이송 동의" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">{item.label}</span>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1">
                    <input type="radio" name={item.key} checked={consent[item.key] === true} onChange={() => updateConsent(item.key, true)} />
                    <span className="text-sm">동의</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name={item.key} checked={consent[item.key] === false} onChange={() => updateConsent(item.key, false)} />
                    <span className="text-sm">미동의</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 서명 */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="font-bold text-gray-800 border-b pb-2">서명</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">보호자 성명 (서명자)</label>
            <input className="w-full border rounded-lg px-3 py-2 text-base" value={consent.consentGuardianName} onChange={(e) => updateConsent("consentGuardianName", e.target.value)} />
          </div>
          <p className="text-xs text-gray-400">* 서명 패드는 디자인 단계에서 추가 예정 (현재는 텍스트 확인으로 대체)</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">확인 문구 입력</label>
            <input className="w-full border rounded-lg px-3 py-2 text-base" placeholder="위 내용에 동의합니다" value={consent.consentTypingConfirm} onChange={(e) => updateConsent("consentTypingConfirm", e.target.value)} />
          </div>
        </div>

        <div className="pb-12">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "제출 중..." : "의견서 및 동의서 제출"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">불러오는 중...</p></div>}>
      <FormContent />
    </Suspense>
  );
}
