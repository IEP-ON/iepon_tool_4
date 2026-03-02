"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { FullFormData, ParentOpinion, ConsentForm } from "@/lib/types";
import { defaultTeacherInput, defaultParentOpinion, defaultConsentForm } from "@/lib/defaults";
import { decryptData } from "@/lib/encryption";
import { ResultDoc1 } from "@/components/result/ResultDoc1";
import { ResultDoc2 } from "@/components/result/ResultDoc2";
import { ResultDoc3 } from "@/components/result/ResultDoc3";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Printer, Loader2, AlertCircle, Clock, CheckCircle2, Copy, Home } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

function ManageContent() {
  const searchParams = useSearchParams();
  const iepId = searchParams.get("iepId");
  const [formData, setFormData] = useState<FullFormData | null>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [encKey, setEncKey] = useState("");
  const [copiedParent, setCopiedParent] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    const keyMatch = hash.match(/key=([a-f0-9]+)/);
    if (keyMatch) setEncKey(keyMatch[1]);
  }, []);

  useEffect(() => {
    async function load() {
      if (!iepId) {
        setError("iepId가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/iep/${iepId}/result`);
        const data = await res.json();

        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }

        setStatus(data.status);

        const hash = window.location.hash;
        const keyMatch = hash.match(/key=([a-f0-9]+)/);
        const key = keyMatch ? keyMatch[1] : "";

        if (data.status === "submitted" && key) {
          let opinion: ParentOpinion = defaultParentOpinion;
          let consent: ConsentForm = defaultConsentForm;

          if (data.opinionEncrypted && data.opinionIv) {
            opinion = await decryptData<ParentOpinion>(data.opinionEncrypted, data.opinionIv, key);
          }
          if (data.consentEncrypted && data.consentIv) {
            consent = await decryptData<ConsentForm>(data.consentEncrypted, data.consentIv, key);
          }
          if (data.signatureUrl && !consent.consentSignatureBase64) {
            consent = { ...consent, consentSignatureBase64: data.signatureUrl };
          }

          setFormData({
            teacher: data.teacherData || defaultTeacherInput,
            opinion,
            consent,
          });
        } else {
          setFormData({
            teacher: data.teacherData || defaultTeacherInput,
            opinion: defaultParentOpinion,
            consent: defaultConsentForm,
          });
        }
      } catch {
        setError("데이터를 불러오는 데 실패했습니다.");
      }

      setLoading(false);
    }

    load();
  }, [iepId]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const formUrl = encKey
    ? `${origin}/form?iepId=${iepId}#key=${encKey}`
    : `${origin}/form?iepId=${iepId}`;

  const handleCopyParent = async () => {
    try {
      await navigator.clipboard.writeText(formUrl);
      setCopiedParent(true);
      setTimeout(() => setCopiedParent(false), 2000);
    } catch {
      alert("링크 복사에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-sm text-center max-w-md w-full border border-red-100">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-medium">{error || "데이터를 불러올 수 없습니다."}</p>
          <Link href="/">
            <Button className="mt-6" variant="outline">홈으로</Button>
          </Link>
        </div>
      </div>
    );
  }

  // 아직 보호자가 제출하지 않은 상태
  if (status !== "submitted") {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
            <h1 className="font-bold text-gray-900">IEP 관리</h1>
            <Link href="/">
              <Button variant="ghost" size="sm"><Home className="w-4 h-4 mr-1" /> 홈</Button>
            </Link>
          </div>
        </header>
        <main className="max-w-3xl mx-auto p-4 pt-8 space-y-6">
          <Card className="border-2 border-amber-200">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">보호자 제출 대기 중</h2>
                <p className="text-gray-500 mt-1">
                  {formData.teacher.schoolName}
                </p>
              </div>
              <p className="text-sm text-gray-600">
                보호자가 아직 의견서와 동의서를 제출하지 않았습니다.<br />
                아래 QR코드 또는 링크를 보호자에게 전달해 주세요.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-gray-900">보호자용 폼 링크</h3>
              <div className="flex justify-center">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                  <QRCodeSVG value={formUrl} size={160} level="H" />
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 font-mono break-all select-all text-center">
                {formUrl}
              </div>
              <Button onClick={handleCopyParent} className="w-full" variant="outline">
                {copiedParent ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copiedParent ? "복사됨!" : "보호자 링크 복사"}
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // 제출 완료 — 복호화된 결과 표시
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="print:hidden sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-gray-900">제출 결과 확인</h1>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                제출 완료
              </span>
            </div>
            <p className="text-xs text-gray-500">{formData.teacher.schoolName} · {formData.opinion?.studentName || "학생"} 학생</p>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm"><Home className="w-4 h-4 mr-1" /> 홈</Button>
            </Link>
            <Button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Printer className="w-4 h-4 mr-2" />
              전체 인쇄
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-8 py-8 px-4 print:space-y-0 print:py-0 print:px-0">
        <div className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none print:break-after-page">
          <ResultDoc1 teacher={formData.teacher} formUrl={formUrl} />
        </div>
        <div className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none print:break-after-page">
          <ResultDoc2 teacher={formData.teacher} opinion={formData.opinion} />
        </div>
        <div className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none">
          <ResultDoc3 teacher={formData.teacher} consent={formData.consent} />
        </div>
      </div>
    </div>
  );
}

export default function ManagePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">로딩 중...</p>
      </div>
    }>
      <ManageContent />
    </Suspense>
  );
}
