"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { defaultTeacherInput, defaultParentOpinion, defaultConsentForm } from "@/lib/defaults";
import type { TeacherInput, ParentOpinion, ConsentForm } from "@/lib/types";
import { encryptData, sha256 } from "@/lib/encryption";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

// Step Components (will be implemented next)
import { Step1Basic } from "@/components/form/Step1Basic";
import { Step2Health } from "@/components/form/Step2Health";
import { Step3Education } from "@/components/form/Step3Education";
import { Step4Consent } from "@/components/form/Step4Consent";

const STEPS = [
  { id: "basic", title: "기본 정보" },
  { id: "health", title: "건강 및 특성" },
  { id: "education", title: "교육 및 지원" },
  { id: "consent", title: "동의 및 서명" },
];

function FormContent() {
  const searchParams = useSearchParams();
  const iepId = searchParams.get("iepId");
  const [teacher, setTeacher] = useState<TeacherInput>(defaultTeacherInput);
  const [opinion, setOpinion] = useState<ParentOpinion>(defaultParentOpinion);
  const [consent, setConsent] = useState<ConsentForm>(defaultConsentForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [encKey, setEncKey] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    const keyMatch = hash.match(/key=([a-f0-9]+)/);
    if (keyMatch) setEncKey(keyMatch[1]);
  }, []);

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

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((p) => p + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((p) => p - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!iepId) return;
    if (!consent.consentGuardianName || !consent.consentTypingConfirm) {
      alert("서명란의 보호자 성명과 확인 문구를 입력해주세요.");
      return;
    }

    if (!encKey) {
      alert("암호화 키가 없습니다. QR코드를 다시 스캔해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const { encrypted: opinionEncrypted, iv: opinionIv } = await encryptData(opinion, encKey);
      const { encrypted: consentEncrypted, iv: consentIv } = await encryptData(consent, encKey);
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

      window.location.href = `/result?iepId=${iepId}#key=${encKey}`;
    } catch {
      alert("제출 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">폼을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full text-center p-6 py-12">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-xl font-bold">!</span>
          </div>
          <p className="text-gray-900 font-medium text-lg">{error}</p>
        </Card>
      </div>
    );
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-24">
      {/* Header (Sticky) */}
      <header className="bg-white border-b sticky top-0 z-20 px-4 py-3 shadow-sm">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h1 className="font-bold text-gray-900">의견서 및 동의서 작성</h1>
              <p className="text-xs text-gray-500">{teacher.schoolName} · {teacher.studentName} 학생</p>
            </div>
            <div className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              보안 암호화
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500 font-medium">
              <span>{STEPS[currentStep].title}</span>
              <span>{currentStep + 1} / {STEPS.length}</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 pt-6 space-y-6">
        <div className={currentStep === 0 ? "block" : "hidden"}>
          <Step1Basic opinion={opinion} updateOpinion={updateOpinion} />
        </div>
        <div className={currentStep === 1 ? "block" : "hidden"}>
          <Step2Health opinion={opinion} updateOpinion={updateOpinion} />
        </div>
        <div className={currentStep === 2 ? "block" : "hidden"}>
          <Step3Education opinion={opinion} updateOpinion={updateOpinion} />
        </div>
        <div className={currentStep === 3 ? "block" : "hidden"}>
          <Step4Consent consent={consent} updateConsent={updateConsent} />
        </div>
      </main>

      {/* Bottom Navigation (Fixed) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <div className="max-w-2xl mx-auto flex gap-3">
          {currentStep > 0 && (
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrev}
              disabled={submitting}
              className="flex-1"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              이전
            </Button>
          )}
          
          {currentStep < STEPS.length - 1 ? (
            <Button
              size="lg"
              onClick={handleNext}
              className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white"
            >
              다음
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-[2] bg-green-600 hover:bg-green-700 text-white"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  안전하게 제출 중...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  작성 완료 및 제출
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FormPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500">준비 중...</p>
      </div>
    }>
      <FormContent />
    </Suspense>
  );
}
