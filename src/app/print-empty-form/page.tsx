"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { defaultTeacherInput, defaultParentOpinion, defaultConsentForm } from "@/lib/defaults";
import { ResultDoc2 } from "@/components/result/ResultDoc2";
import { ResultDoc3 } from "@/components/result/ResultDoc3";

// 빈 입력을 밑줄(_)로 표시하도록 렌더링을 덮어씌울 데이터를 생성합니다.
const createEmptyPrintOpinion = () => {
  const empty = { ...defaultParentOpinion };
  const line = "_________________________________";
  
  // 기본 정보
  empty.studentName = "___________________";
  empty.birthDate = "_______년 ____월 ____일";
  empty.guardianName = "___________________";
  empty.guardianRelation = "부 / 모 / 기타(        )";
  empty.guardianPhone = "___________________";
  
  return empty;
};

function PrintEmptyFormContent() {
  const searchParams = useSearchParams();
  const doc = searchParams.get("doc"); // "2" or "3"

  useEffect(() => {
    // 폰트 및 스타일이 로드될 시간을 약간 준 후 인쇄 대화창 띄우기
    const timer = setTimeout(() => {
      window.print();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (doc === "2") {
    // 문서2(의견서)는 빈 양식을 위해 텍스트 대신 밑줄이나 빈 공간을 가진 데이터를 전달합니다.
    // ResultDoc2 컴포넌트 자체를 수정하기엔 사이드이펙트가 크므로,
    // 빈 양식 전용 CSS 클래스(print-empty)를 최상단에 부여하여 처리합니다.
    return (
      <div className="bg-gray-100 min-h-screen print-empty-mode">
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            .print-empty-mode p, .print-empty-mode span, .print-empty-mode td {
              color: transparent !important;
            }
            .print-empty-mode th, .print-empty-mode h1, .print-empty-mode h2, .print-empty-mode h3 {
              color: black !important;
            }
            .print-empty-mode td {
              border-bottom: 1px dotted #999;
              min-height: 2em;
            }
            /* 기타 빈 칸 처리에 필요한 스타일 추가 가능 */
          }
        `}} />
        <ResultDoc2 teacher={defaultTeacherInput} opinion={defaultParentOpinion} isEmptyForm={true} />
      </div>
    );
  }

  if (doc === "3") {
    return (
      <div className="bg-gray-100 min-h-screen">
        <ResultDoc3 teacher={defaultTeacherInput} consent={defaultConsentForm} isEmptyForm={true} />
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
