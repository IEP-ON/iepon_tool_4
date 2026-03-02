"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { TeacherInput } from "@/lib/types";
import { defaultTeacherInput } from "@/lib/defaults";
import { ResultDoc1 } from "@/components/result/ResultDoc1";

function PreviewContent() {
  const searchParams = useSearchParams();
  const iepId = searchParams.get("iepId");
  const [teacher, setTeacher] = useState<TeacherInput>(defaultTeacherInput);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">불러오는 중...</p></div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-red-500">{error}</p></div>;
  }

  const formUrl = typeof window !== "undefined" ? `${window.location.origin}/form?iepId=${iepId}` : "";

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">안내장 미리보기</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(formUrl).then(() => alert("학부모 폼 링크가 복사되었습니다."))}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
            >
              학부모 링크 복사
            </button>
            <button
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              인쇄
            </button>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <ResultDoc1 teacher={teacher} formUrl={formUrl} />
        </div>
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">불러오는 중...</p></div>}>
      <PreviewContent />
    </Suspense>
  );
}
