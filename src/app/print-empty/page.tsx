"use client";

import { defaultTeacherInput, defaultParentOpinion, defaultConsentForm } from "@/lib/defaults";
import { ResultDoc2 } from "@/components/result/ResultDoc2";
import { ResultDoc3 } from "@/components/result/ResultDoc3";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrintEmptyPage() {
  const teacher = { ...defaultTeacherInput, year: new Date().getFullYear().toString(), semester: new Date().getMonth() < 7 ? "1" : "2" };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="print:hidden sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-gray-900">빈 양식 인쇄</h1>
          </div>
          <Button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Printer className="w-4 h-4 mr-2" />
            인쇄
          </Button>
        </div>
      </div>

      <div className="space-y-8 py-8 px-4 print:space-y-0 print:py-0 print:px-0">
        <div className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none print:break-after-page">
          <ResultDoc2 teacher={teacher} opinion={defaultParentOpinion} isEmptyForm />
        </div>
        <div className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none">
          <ResultDoc3 teacher={teacher} consent={defaultConsentForm} isEmptyForm />
        </div>
      </div>
    </div>
  );
}
