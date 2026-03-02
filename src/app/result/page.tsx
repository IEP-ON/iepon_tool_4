"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { FullFormData, ParentOpinion, ConsentForm } from "@/lib/types";
import { defaultTeacherInput, defaultParentOpinion, defaultConsentForm } from "@/lib/defaults";
import { decryptData } from "@/lib/encryption";
import { ResultDoc1 } from "@/components/result/ResultDoc1";
import { ResultDoc2 } from "@/components/result/ResultDoc2";
import { ResultDoc3 } from "@/components/result/ResultDoc3";

function ResultContent() {
  const searchParams = useSearchParams();
  const iepId = searchParams.get("iepId");
  const [formData, setFormData] = useState<FullFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!iepId) {
        setError("iepId가 없습니다.");
        setLoading(false);
        return;
      }

      const hash = window.location.hash;
      const keyMatch = hash.match(/key=([a-f0-9]+)/);
      if (!keyMatch) {
        setError("암호화 키가 URL에 포함되어 있지 않습니다.");
        setLoading(false);
        return;
      }

      const key = keyMatch[1];

      try {
        const res = await fetch(`/api/iep/${iepId}/result`);
        const data = await res.json();

        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }

        let opinion: ParentOpinion = defaultParentOpinion;
        let consent: ConsentForm = defaultConsentForm;

        if (data.opinionEncrypted && data.opinionIv) {
          opinion = await decryptData<ParentOpinion>(data.opinionEncrypted, data.opinionIv, key);
        }

        if (data.consentEncrypted && data.consentIv) {
          consent = await decryptData<ConsentForm>(data.consentEncrypted, data.consentIv, key);
        }

        // 서명 URL이 있으면 동의서에 반영
        if (data.signatureUrl && !consent.consentSignatureBase64) {
          consent = { ...consent, consentSignatureBase64: data.signatureUrl };
        }

        setFormData({
          teacher: data.teacherData || defaultTeacherInput,
          opinion,
          consent,
        });
      } catch {
        setError("데이터 복호화에 실패했습니다. URL이 올바른지 확인해주세요.");
      }

      setLoading(false);
    }

    load();
  }, [iepId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">데이터를 복호화하는 중...</p></div>;
  }

  if (error || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-red-500 text-lg">{error || "데이터를 불러올 수 없습니다."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="print:hidden sticky top-0 z-10 bg-white border-b px-4 py-3 flex justify-between items-center">
        <h1 className="font-bold text-gray-900">결과 문서</h1>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          인쇄
        </button>
      </div>

      <div className="space-y-8 py-8 print:space-y-0 print:py-0">
        <div className="print:break-after-page">
          <ResultDoc1 teacher={formData.teacher} />
        </div>
        <div className="print:break-after-page">
          <ResultDoc2 teacher={formData.teacher} opinion={formData.opinion} />
        </div>
        <div>
          <ResultDoc3 teacher={formData.teacher} consent={formData.consent} />
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">불러오는 중...</p></div>}>
      <ResultContent />
    </Suspense>
  );
}
