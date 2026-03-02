"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { TeacherInput } from "@/lib/types";
import { defaultTeacherInput } from "@/lib/defaults";
import { ResultDoc1 } from "@/components/result/ResultDoc1";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Printer, Copy, CheckCircle2, Loader2, ArrowLeft, Bookmark, ExternalLink, AlertTriangle } from "lucide-react";
import Link from "next/link";

function PreviewContent() {
  const searchParams = useSearchParams();
  const iepId = searchParams.get("iepId");
  const [teacher, setTeacher] = useState<TeacherInput>(defaultTeacherInput);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedParent, setCopiedParent] = useState(false);
  const [copiedManage, setCopiedManage] = useState(false);
  const [encKey, setEncKey] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    const keyMatch = hash.match(/key=([a-f0-9]+)/);
    if (keyMatch) setEncKey(keyMatch[1]);
  }, []);

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

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const formUrl = encKey
    ? `${origin}/form?iepId=${iepId}#key=${encKey}`
    : `${origin}/form?iepId=${iepId}`;
  const manageUrl = encKey
    ? `${origin}/manage?iepId=${iepId}#key=${encKey}`
    : "";

  const handleCopyParent = async () => {
    try {
      await navigator.clipboard.writeText(formUrl);
      setCopiedParent(true);
      setTimeout(() => setCopiedParent(false), 2000);
    } catch {
      alert("링크 복사에 실패했습니다.");
    }
  };

  const handleCopyManage = async () => {
    try {
      await navigator.clipboard.writeText(manageUrl);
      setCopiedManage(true);
      setTimeout(() => setCopiedManage(false), 2000);
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
              onClick={handleCopyParent}
              variant={copiedParent ? "default" : "outline"}
              className={`flex-1 sm:flex-none ${copiedParent ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
            >
              {copiedParent ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copiedParent ? "복사됨!" : "학부모 링크 복사"}
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

      {/* 교사용 관리 링크 안내 */}
      {manageUrl && (
        <div className="print:hidden max-w-4xl mx-auto px-4 pt-6">
          <Card className="border-2 border-amber-300 bg-amber-50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-3 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-amber-900 text-base">교사용 관리 링크 — 반드시 저장하세요!</h3>
                  <p className="text-sm text-amber-800 mt-1">
                    아래 링크로 보호자 제출 현황 확인 및 결과 열람이 가능합니다.<br />
                    이 링크를 잃어버리면 제출된 결과를 복호화할 수 없습니다.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 bg-white border border-amber-200 rounded-lg px-3 py-2 text-xs text-gray-600 break-all font-mono select-all">
                  {manageUrl}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    onClick={handleCopyManage}
                    size="sm"
                    variant={copiedManage ? "default" : "outline"}
                    className={copiedManage ? "bg-green-600 hover:bg-green-700 text-white" : "border-amber-300"}
                  >
                    {copiedManage ? <CheckCircle2 className="w-4 h-4 mr-1" /> : <Bookmark className="w-4 h-4 mr-1" />}
                    {copiedManage ? "복사됨!" : "링크 복사"}
                  </Button>
                  <Link href={manageUrl} target="_blank">
                    <Button size="sm" variant="outline" className="border-amber-300">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      열기
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
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
