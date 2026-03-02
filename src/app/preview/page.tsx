"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { TeacherInput } from "@/lib/types";
import { defaultTeacherInput } from "@/lib/defaults";
import { ResultDoc1 } from "@/components/result/ResultDoc1";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Printer, Copy, CheckCircle2, Loader2, ArrowLeft, Bookmark, ExternalLink, AlertTriangle, Users } from "lucide-react";
import Link from "next/link";

interface BatchIep {
  iep_id: string;
  status: string;
  teacher_data: TeacherInput;
}

function PreviewContent() {
  const searchParams = useSearchParams();
  const iepId = searchParams.get("iepId"); // 기존 단일 호환용
  const batchId = searchParams.get("batchId");
  const [ieps, setIeps] = useState<BatchIep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedParent, setCopiedParent] = useState<string | null>(null);
  const [copiedManage, setCopiedManage] = useState(false);
  const [encKey, setEncKey] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    const keyMatch = hash.match(/key=([a-f0-9]+)/);
    if (keyMatch) setEncKey(keyMatch[1]);
  }, []);

  useEffect(() => {
    if (!iepId && !batchId) {
      setError("문서 ID가 없습니다.");
      setLoading(false);
      return;
    }

    if (batchId) {
      fetch(`/api/batch/${batchId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setIeps(data.ieps || []);
          }
        })
        .catch(() => setError("데이터 로드에 실패했습니다."))
        .finally(() => setLoading(false));
    } else if (iepId) {
      fetch(`/api/iep/${iepId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setIeps([{ iep_id: iepId, status: data.status, teacher_data: data.teacherData }]);
          }
        })
        .catch(() => setError("데이터 로드에 실패했습니다."))
        .finally(() => setLoading(false));
    }
  }, [iepId, batchId]);

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
  
  const getFormUrl = (id: string) => encKey ? `${origin}/form?iepId=${id}#key=${encKey}` : `${origin}/form?iepId=${id}`;
  
  // Dashboard URL로 대체 (개별 manage URL 대신 전체 확인)
  const dashboardUrl = `${origin}/dashboard`;

  const handleCopyParent = async (id: string) => {
    try {
      await navigator.clipboard.writeText(getFormUrl(id));
      setCopiedParent(id);
      setTimeout(() => setCopiedParent(null), 2000);
    } catch {
      alert("링크 복사에 실패했습니다.");
    }
  };

  const handleCopyManage = async () => {
    // Deprecated: 대시보드로 이동
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="print:hidden sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link href="/teacher" className="text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">안내장 미리보기 (총 {ieps.length}명)</h1>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={() => window.print()}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Printer className="w-4 h-4 mr-2" />
              전체 인쇄
            </Button>
          </div>
        </div>
      </div>

      {/* 교사용 안내 */}
      <div className="print:hidden max-w-4xl mx-auto px-4 pt-6">
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-blue-900 text-base">학생 {ieps.length}명 분의 안내장이 생성되었습니다.</h3>
                <p className="text-sm text-blue-800 mt-1 mb-3">
                  아래 안내장을 일괄 인쇄하여 학부모님께 배부하시거나, 개별 링크를 복사하여 메신저로 전달하실 수 있습니다.
                </p>
                <div className="bg-white/60 p-3 rounded-md text-sm border border-blue-100 flex items-center justify-between">
                  <span>추후 <strong>홈 &gt; 제출 현황 확인(대시보드)</strong>에서 <strong>내 전화번호</strong>로 전체 제출 상태를 확인할 수 있습니다.</span>
                  <Link href={dashboardUrl}>
                    <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 bg-white">
                      대시보드 이동
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="py-8 px-4 print:py-0 print:px-0 bg-gray-100">
        {ieps.map((iep, index) => (
          <div key={iep.iep_id} className="max-w-[210mm] mx-auto bg-white shadow-lg mb-8 print:shadow-none print:mb-0 print:break-after-page relative">
            
            {/* 링크 복사 버튼 (화면에만 보임) */}
            <div className="print:hidden absolute top-4 right-4 z-10">
              <Button
                size="sm"
                onClick={() => handleCopyParent(iep.iep_id)}
                variant={copiedParent === iep.iep_id ? "default" : "outline"}
                className={copiedParent === iep.iep_id ? "bg-green-600 hover:bg-green-700 text-white" : "bg-white shadow-sm"}
              >
                {copiedParent === iep.iep_id ? <CheckCircle2 className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                {copiedParent === iep.iep_id ? "복사됨" : `학생 ${index + 1} 링크 복사`}
              </Button>
            </div>

            {/* 개별 문서 렌더링 (단일 페이지 강제) */}
            <ResultDoc1 teacher={iep.teacher_data} formUrl={getFormUrl(iep.iep_id)} />
          </div>
        ))}
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
