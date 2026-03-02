"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { TeacherInput } from "@/lib/types";
import { defaultTeacherInput } from "@/lib/defaults";
import { ResultDoc1 } from "@/components/result/ResultDoc1";
import { Button } from "@/components/ui/button";
import { Printer, Copy, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

function PreviewContent() {
  const searchParams = useSearchParams();
  const iepId = searchParams.get("iepId");
  const [teacher, setTeacher] = useState<TeacherInput>(defaultTeacherInput);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!iepId) {
      setError("iepId가 없습니다.");
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
        }
      })
      .catch(() => setError("데이터 로드에 실패했습니다."))
      .finally(() => setLoading(false));
  }, [iepId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">안내장을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-sm text-center max-w-md w-full">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 font-bold text-xl">!</span>
          </div>
          <p className="text-gray-900 font-medium">{error}</p>
          <Link href="/teacher">
            <Button className="mt-6 w-full" variant="outline">돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formUrl = typeof window !== "undefined" ? `${window.location.origin}/form?iepId=${iepId}` : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("링크 복사에 실패했습니다.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="print:hidden sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link href="/teacher" className="text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">안내장 미리보기</h1>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={handleCopy}
              variant={copied ? "default" : "outline"}
              className={`flex-1 sm:flex-none ${copied ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
            >
              {copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "복사됨!" : "학부모 링크 복사"}
            </Button>
            <Button
              onClick={() => window.print()}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Printer className="w-4 h-4 mr-2" />
              인쇄
            </Button>
          </div>
        </div>
      </div>
      
      <div className="py-8 px-4 print:py-0 print:px-0">
        <div className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none">
          <ResultDoc1 teacher={teacher} formUrl={formUrl} />
        </div>
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">안내장을 불러오는 중...</p>
      </div>
    }>
      <PreviewContent />
    </Suspense>
  );
}
