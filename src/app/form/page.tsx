"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { defaultTeacherInput, defaultParentOpinion, defaultConsentForm } from "@/lib/defaults";
import type { TeacherInput, ParentOpinion, ConsentForm } from "@/lib/types";
import { decompress, compress } from "@/lib/codec";
import { SectionBasicInfo } from "@/components/form/SectionBasicInfo";
import { SectionDisability } from "@/components/form/SectionDisability";
import { SectionFamily } from "@/components/form/SectionFamily";
import { SectionHealth } from "@/components/form/SectionHealth";
import { SectionEducation } from "@/components/form/SectionEducation";
import { SectionServices } from "@/components/form/SectionServices";
import { SectionConsent } from "@/components/form/SectionConsent";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, Copy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { sha256, formatConsentCode } from "@/lib/hash";
import { collectMeta } from "@/lib/meta";
import type { ConsentMeta } from "@/lib/types";

function FormContent() {
  const searchParams = useSearchParams();
  const [teacher, setTeacher] = useState<TeacherInput>(defaultTeacherInput);
  
  const [step, setStep] = useState(0);
  const [opinion, setOpinion] = useState<ParentOpinion>(defaultParentOpinion);
  const [consent, setConsent] = useState<ConsentForm>(defaultConsentForm);
  const [copied, setCopied] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [consentCode, setConsentCode] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    const ctx = searchParams.get("ctx");
    if (ctx) {
      try {
        const decoded = decompress<Partial<TeacherInput>>(ctx);
        if (decoded) {
          setTeacher({ ...defaultTeacherInput, ...decoded });
          setOpinion(prev => ({ 
            ...prev, 
            studentName: decoded.studentName || "",
          }));
        }
      } catch (e) {
        console.error("Failed to decode context", e);
      }
    }
  }, [searchParams]);

  const updateOpinion = (key: keyof ParentOpinion, value: any) => {
    setOpinion((prev) => ({ ...prev, [key]: value }));
  };

  const updateConsent = (key: keyof ConsentForm, value: any) => {
    setConsent((prev) => ({ ...prev, [key]: value }));
  };

  // Step 6(동의서) 진입 시 보호자명/관계 자동 채움
  useEffect(() => {
    if (step === 6) {
      setConsent((prev) => ({
        ...prev,
        consentGuardianName: prev.consentGuardianName || opinion.guardianName || "",
        consentGuardianRelation: prev.consentGuardianRelation || (
          opinion.guardianRelation === "기타" ? opinion.guardianRelationOther : opinion.guardianRelation
        ) || "",
        consentDate: prev.consentDate || new Date().toISOString().split("T")[0],
      }));
    }
  }, [step]);

  const steps = [
    { title: "기본 정보", desc: "학생과 보호자의 기본 정보를 입력합니다." },
    { title: "장애 현황", desc: "복지부 및 교육청 등록 현황을 확인합니다." },
    { title: "생활/가정", desc: "우리 아이의 성장 환경과 지원 현황을 파악합니다." },
    { title: "건강/의료", desc: "안전한 학교생활을 위한 건강 정보를 확인합니다." },
    { title: "교육 의견", desc: "이번 학기 교육 목표와 아이의 특성을 공유합니다." },
    { title: "관련 서비스", desc: "방과후, 치료 등 지원 서비스 현황을 파악합니다." },
    { title: "포괄 동의서", desc: "개인정보 및 교육활동에 대한 동의를 확인합니다." }
  ];

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <SectionBasicInfo 
            data={opinion} 
            update={updateOpinion} 
            teacherContext={teacher} 
          />
        );
      case 1:
        return <SectionDisability data={opinion} update={updateOpinion} />;
      case 2:
        return <SectionFamily data={opinion} update={updateOpinion} />;
      case 3:
        return <SectionHealth data={opinion} update={updateOpinion} />;
      case 4:
        return <SectionEducation data={opinion} update={updateOpinion} />;
      case 5:
        return <SectionServices data={opinion} update={updateOpinion} />;
      case 6:
        return (
          <SectionConsent
            data={consent}
            update={updateConsent}
            schoolName={teacher.schoolName}
            teacherName={teacher.teacherName}
            teacherPhone={teacher.teacherPhone}
            principalName={teacher.principalName}
            adminTeacherName={teacher.adminTeacherName}
            schoolAddress={teacher.schoolAddress}
          />
        );
      default:
        return null;
    }
  };

  const handleComplete = async () => {
    const finalOpinion = { ...opinion, writeDate: new Date().toISOString() };
    const finalConsent = { ...consent };
    
    if (!consent.consentDate && !consent.consentGuardianName) {
      finalConsent.consentDate = new Date().toISOString().split('T')[0];
      finalConsent.consentGuardianName = opinion.guardianName;
      finalConsent.consentGuardianRelation = opinion.guardianRelation === "기타" ? opinion.guardianRelationOther : opinion.guardianRelation;
    }

    // SHA-256 문서 해시 생성 (동의 데이터 전체 기준)
    const consentJson = JSON.stringify(finalConsent);
    const docHash = await sha256(consentJson);
    const code = formatConsentCode(docHash);
    setConsentCode(code);

    // IP + 디바이스 지문 수집
    let meta: ConsentMeta | undefined;
    try {
      meta = await collectMeta(docHash);
    } catch {
      meta = undefined;
    }

    const payload = {
      teacher,
      opinion: finalOpinion,
      consent: finalConsent,
      meta,
    };
    
    const encoded = compress(payload);
    const url = `${window.location.origin}/result?d=${encoded}`;
    setResultUrl(url);
    setStep(7);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(resultUrl);
      setCopied(true);
      alert("링크가 복사되었습니다. 선생님께 전달해 주세요.");
    } catch (err) {
      // Fallback
      prompt("아래 링크를 복사하여 선생님께 전달해 주세요.", resultUrl);
      setCopied(true);
    }
  };

  const copyCodeToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(consentCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 3000);
    } catch {
      prompt("아래 코드를 복사하세요", consentCode);
    }
  };

  if (step === 7) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">작성이 완료되었습니다!</h1>
          </div>

          {/* 동의 확인 코드 표시 */}
          {consentCode && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center space-y-2">
              <p className="text-sm font-bold text-blue-900">동의 확인 코드</p>
              <p className="text-3xl font-mono font-bold tracking-widest text-blue-700">{consentCode}</p>
              <p className="text-xs text-blue-600 break-keep">이 코드를 담임 선생님 카카오톡으로 보내주세요. 접수 확인용 코드입니다.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={copyCodeToClipboard}
                className={`w-full h-9 text-sm ${codeCopied ? "border-green-400 text-green-700" : "border-blue-300 text-blue-700"}`}
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                {codeCopied ? "코드 복사됨 ✓" : "코드 복사하기"}
              </Button>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-gray-600 text-sm text-center break-keep">
              아래 버튼으로 완료 링크를 복사한 뒤,<br/>
              담임 선생님께 카카오톡으로 전달해 주세요.
            </p>
            <Button 
              size="lg" 
              onClick={copyToClipboard}
              className={`w-full text-lg h-14 ${copied ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {copied ? "복사 완료! 한 번 더 복사" : "완료 링크 복사하기"}
            </Button>
            <p className="text-xs text-red-500 text-center">
              ※ 링크에는 아이의 개인정보가 포함되어 있습니다.<br/>
              반드시 담임 선생님에게만 전달해 주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Sticky */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="flex justify-between items-end">
            <h1 className="text-lg font-bold text-gray-900 truncate pr-4">
              {teacher.schoolName} 특수학급
            </h1>
            <span className="text-xs font-medium text-gray-500 whitespace-nowrap bg-gray-100 px-2 py-1 rounded-md">
              {teacher.year}학년도 {teacher.semester}학기
            </span>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-blue-600">진행률</span>
              <span className="text-gray-500">{step + 1} / 7 단계</span>
            </div>
            <Progress value={((step + 1) / 7) * 100} className="h-2" />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {steps.map((s, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  step === i 
                    ? "bg-blue-600 text-white shadow-sm" 
                    : step > i 
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-gray-100 text-gray-500 border border-transparent"
                }`}
              >
                {step > i && <Check className="w-3 h-3 inline-block mr-1" />}
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-4 pt-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{steps[step].title}</h2>
          <p className="text-sm text-gray-500">{steps[step].desc}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8">
          {renderStep()}
        </div>
      </div>

      {/* Bottom Floating Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="w-1/3 h-14 rounded-xl font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border-transparent shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            이전
          </Button>
          
          {step < 6 ? (
            <Button
              size="lg"
              onClick={() => setStep(s => Math.min(6, s + 1))}
              className="w-2/3 h-14 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200"
            >
              다음 <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleComplete}
              className="w-2/3 h-14 rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-200"
            >
              완료 및 링크 생성
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ParentFormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">폼을 불러오는 중입니다...</div>}>
      <FormContent />
    </Suspense>
  );
}
