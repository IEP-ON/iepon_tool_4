"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { defaultTeacherInput, defaultParentOpinion, defaultConsentForm } from "@/lib/defaults";
import { ResultDoc2 } from "@/components/result/ResultDoc2";
import { ResultDoc3 } from "@/components/result/ResultDoc3";

function PrintEmptyFormContent() {
  const searchParams = useSearchParams();
  const doc = searchParams.get("doc"); // "2" or "3"

  useEffect(() => {
    // 자동 인쇄 창 띄우기 (약간의 지연 후 렌더링 완료 시)
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (doc === "2") {
    return (
      <div className="bg-gray-100 min-h-screen">
        <ResultDoc2 teacher={defaultTeacherInput} opinion={defaultParentOpinion} />
      </div>
    );
  }

  if (doc === "3") {
    return (
      <div className="bg-gray-100 min-h-screen">
        <ResultDoc3 teacher={defaultTeacherInput} consent={defaultConsentForm} />
      </div>
    );
  }

  return <div>잘못된 접근입니다.</div>;
}

export default function PrintEmptyFormPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PrintEmptyFormContent />
    </Suspense>
  );
}
