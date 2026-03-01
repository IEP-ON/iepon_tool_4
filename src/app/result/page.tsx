"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState, useEffect } from "react";
import { decompress } from "@/lib/codec";
import { decrypt } from "@/lib/crypto";
import type { FullFormData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { ResultDoc1 } from "@/components/result/ResultDoc1";
import { ResultDoc2 } from "@/components/result/ResultDoc2";
import { ResultDoc3 } from "@/components/result/ResultDoc3";

function ResultContent() {
  const searchParams = useSearchParams();
  const encryptedData = searchParams.get("data");
  const compressedData = searchParams.get("d");
  const [formData, setFormData] = useState<FullFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        // 방법 1: 암호화된 데이터 (data 파라미터 + #key fragment)
        if (encryptedData) {
          const hash = window.location.hash;
          const keyMatch = hash.match(/key=([a-f0-9]+)/);
          if (!keyMatch) {
            setError("암호화 키가 URL에 포함되어 있지 않습니다.");
            setLoading(false);
            return;
          }
          const key = keyMatch[1];
          const decrypted = await decrypt(
            decodeURIComponent(encryptedData),
            key
          );
          if (!decrypted) {
            setError("데이터 복호화에 실패했습니다.");
            setLoading(false);
            return;
          }
          const parsed = decompress<FullFormData>(decrypted);
          if (!parsed) {
            setError("데이터 파싱에 실패했습니다.");
            setLoading(false);
            return;
          }
          setFormData(parsed);
        }
        // 방법 2: 압축만 된 데이터 (d 파라미터, 암호화 없음 - URL 길이 초과 시 fallback)
        else if (compressedData) {
          const parsed = decompress<FullFormData>(compressedData);
          if (!parsed) {
            setError("데이터 파싱에 실패했습니다.");
            setLoading(false);
            return;
          }
          setFormData(parsed);
        } else {
          setError("데이터가 URL에 포함되어 있지 않습니다.");
        }
      } catch {
        setError("데이터 처리 중 오류가 발생했습니다.");
      }
      setLoading(false);
    }
    load();
  }, [encryptedData, compressedData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">데이터를 복호화하는 중...</p>
      </div>
    );
  }

  if (error || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <p className="text-red-600 font-medium">오류</p>
          <p className="text-sm text-gray-600">
            {error || "데이터를 불러올 수 없습니다."}
          </p>
          <p className="text-xs text-gray-400">
            보호자가 보내준 링크가 올바른지 확인해 주세요.
          </p>
        </div>
      </div>
    );
  }

  const { teacher, opinion, consent, meta } = formData;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 상단 바 (인쇄 시 숨김) */}
      <div className="no-print sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold">
              {teacher.studentName} 학생 — IEP 문서
            </h1>
            <p className="text-xs text-gray-500">
              {teacher.year}학년도 {teacher.semester}학기
            </p>
          </div>
          <Button size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-1" />
            전체 인쇄
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl py-6 px-4 space-y-6 print:space-y-0 print:p-0">
        {/* 문서 1 — 안내장 */}
        <div className="bg-white shadow-lg print:shadow-none">
          <ResultDoc1 teacher={teacher} />
        </div>

        {/* 문서 2 — 보호자 의견서 */}
        <div className="bg-white shadow-lg print:shadow-none page-break">
          <ResultDoc2 teacher={teacher} opinion={opinion} />
        </div>

        {/* 문서 3 — 동의서 */}
        <div className="bg-white shadow-lg print:shadow-none page-break">
          <ResultDoc3 teacher={teacher} consent={consent} meta={meta} />
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          로딩 중...
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
