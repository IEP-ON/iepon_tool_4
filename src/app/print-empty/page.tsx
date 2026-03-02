"use client";

import { defaultTeacherInput, defaultParentOpinion, defaultConsentForm } from "@/lib/defaults";
import { ResultDoc2 } from "@/components/result/ResultDoc2";
import { ResultDoc3 } from "@/components/result/ResultDoc3";

export default function PrintEmptyPage() {
  const teacher = { ...defaultTeacherInput, year: new Date().getFullYear().toString(), semester: new Date().getMonth() < 7 ? "1" : "2" };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="print:hidden sticky top-0 z-10 bg-white border-b px-4 py-3 flex justify-between items-center">
        <h1 className="font-bold text-gray-900">빈 양식 인쇄</h1>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          인쇄
        </button>
      </div>

      <div className="space-y-8 py-8 print:space-y-0 print:py-0">
        <div className="print:break-after-page">
          <ResultDoc2 teacher={teacher} opinion={defaultParentOpinion} isEmptyForm />
        </div>
        <div>
          <ResultDoc3 teacher={teacher} consent={defaultConsentForm} isEmptyForm />
        </div>
      </div>
    </div>
  );
}
