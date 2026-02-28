"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState, useCallback } from "react";
import { decompress, compress } from "@/lib/codec";
import { encrypt } from "@/lib/crypto";
import { defaultParentOpinion, defaultConsentForm } from "@/lib/defaults";
import type { TeacherInput, ParentOpinion, ConsentForm } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionBasicInfo } from "@/components/form/SectionBasicInfo";
import { SectionDisability } from "@/components/form/SectionDisability";
import { SectionFamily } from "@/components/form/SectionFamily";
import { SectionHealth } from "@/components/form/SectionHealth";
import { SectionEducation } from "@/components/form/SectionEducation";
import { SectionServices } from "@/components/form/SectionServices";
import { SectionConsent } from "@/components/form/SectionConsent";
import { ChevronLeft, ChevronRight, Copy, CheckCircle } from "lucide-react";

const STEPS = [
  { id: 0, title: "기본 정보", desc: "학생·보호자 기본 정보" },
  { id: 1, title: "장애·선정 현황", desc: "장애인 등록 및 특수교육 선정" },
  { id: 2, title: "가정·참석", desc: "가정 환경 및 협의회 참석 방법" },
  { id: 3, title: "건강·보조기기", desc: "건강·의료 정보 및 보조기기" },
  { id: 4, title: "교육", desc: "강점, 현재 수준, 교육 목표" },
  { id: 5, title: "서비스·행사", desc: "외부 치료, 학교 행사, 미래 비전" },
  { id: 6, title: "동의서", desc: "개인정보·교육활동 동의 (문서3)" },
];

function FormContent() {
  const searchParams = useSearchParams();
  const ctx = searchParams.get("ctx");

  const teacher = useMemo(() => {
    if (!ctx) return null;
    return decompress<TeacherInput>(ctx);
  }, [ctx]);

  const [step, setStep] = useState(0);
  const [opinion, setOpinion] = useState<ParentOpinion>(() => ({
    ...defaultParentOpinion,
    studentName: teacher?.studentName || "",
  }));
  const [consent, setConsent] = useState<ConsentForm>(defaultConsentForm);
  const [submitted, setSubmitted] = useState(false);
  const [resultUrl, setResultUrl] = useState("");

  const updateOpinion = useCallback(
    (key: keyof ParentOpinion, value: ParentOpinion[keyof ParentOpinion]) => {
      setOpinion((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const updateConsent = useCallback(
    (key: keyof ConsentForm, value: ConsentForm[keyof ConsentForm]) => {
      setConsent((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSubmit = async () => {
    const fullData = {
      teacher: teacher || {},
      opinion,
      consent,
    };
    const compressed = compress(fullData);

    // 민감정보 포함 → AES 암호화
    const { encrypted, key } = await encrypt(compressed);
    const base = window.location.origin;
    const url = `${base}/result?data=${encodeURIComponent(encrypted)}#key=${key}`;

    if (url.length > 8000) {
      // fallback: 압축만 사용 (암호화 없이)
      const fallbackUrl = `${base}/result?d=${compressed}`;
      setResultUrl(fallbackUrl);
    } else {
      setResultUrl(url);
    }
    setSubmitted(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resultUrl);
      alert("링크가 복사되었습니다. 선생님께 전달해 주세요.");
    } catch {
      prompt("아래 링크를 복사하세요:", resultUrl);
    }
  };

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">
              올바른 링크로 접속해 주세요.<br />
              학교에서 제공한 QR코드 또는 링크를 이용해 주세요.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <h2 className="text-xl font-bold text-green-800">작성 완료!</h2>
            <p className="text-sm text-gray-600">
              아래 버튼을 눌러 링크를 복사한 뒤,<br />
              <strong>{teacher.teacherName} 선생님</strong>께 카톡이나 문자로 보내주세요.
            </p>
            <Button size="lg" onClick={handleCopy} className="w-full">
              <Copy className="h-5 w-5 mr-2" />
              완료 링크 복사하기
            </Button>
            <p className="text-xs text-gray-400">
              이 링크에는 작성하신 내용이 암호화되어 담겨 있습니다.<br />
              서버에 데이터가 저장되지 않으므로 링크를 분실하면 복구할 수 없습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <SectionBasicInfo
            data={opinion}
            update={updateOpinion}
            teacherStudentName={teacher.studentName}
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-sm font-bold text-gray-900">
              {teacher.schoolName} 특수학급
            </h1>
            <span className="text-xs text-gray-500">
              {teacher.year}학년도 {teacher.semester}학기
            </span>
          </div>
          {/* 스텝 인디케이터 */}
          <div className="flex gap-1">
            {STEPS.map((s) => (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  s.id === step
                    ? "bg-blue-600"
                    : s.id < step
                      ? "bg-blue-300"
                      : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {STEPS[step].title} ({step + 1}/{STEPS.length})
          </p>
        </div>
      </div>

      {/* 본문 */}
      <div className="mx-auto max-w-2xl px-4 py-6">
        {step === 0 && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm">
            <p className="font-medium text-blue-800 mb-1">
              이 의견서는 동의서(문서3)와 별개입니다.
            </p>
            <p className="text-blue-700 text-xs">
              의견서는 아이의 교육계획을 함께 세우기 위한 소통 자료이고, 동의서는
              개인정보 사용에 관한 동의입니다. 작성하기 어려운 항목은 비워두셔도
              괜찮습니다.
            </p>
          </div>
        )}

        <Card>
          <CardContent className="p-4 sm:p-6">{renderStep()}</CardContent>
        </Card>
      </div>

      {/* 하단 네비게이션 */}
      <div className="sticky bottom-0 bg-white border-t shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            이전
          </Button>

          <span className="text-sm text-gray-500">
            {step < 6 ? "의견서" : "동의서"}
          </span>

          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)}>
              다음
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              완료 및 링크 생성
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FormPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          로딩 중...
        </div>
      }
    >
      <FormContent />
    </Suspense>
  );
}
