"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useRef } from "react";
import { decompress, compress } from "@/lib/codec";
import type { TeacherInput } from "@/lib/types";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Copy } from "lucide-react";
import Link from "next/link";

function PreviewContent() {
  const searchParams = useSearchParams();
  const ctx = searchParams.get("ctx");
  const printRef = useRef<HTMLDivElement>(null);

  const teacher = useMemo(() => {
    if (!ctx) return null;
    return decompress<TeacherInput>(ctx);
  }, [ctx]);

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const formUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const base = window.location.origin;
    const encoded = compress(teacher);
    return `${base}/form?ctx=${encoded}`;
  }, [teacher]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "____년 __월 __일";
    const d = new Date(dateStr);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  const formatDeadline = (dateStr: string, day: string) => {
    if (!dateStr) return "__월 __일(__요일)";
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}월 ${d.getDate()}일(${day}요일)`;
  };

  const handlePrint = () => window.print();

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(formUrl);
      alert("보호자용 링크가 복사되었습니다.");
    } catch {
      prompt("아래 링크를 복사하세요:", formUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="no-print sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link
            href={`/teacher`}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            수정하기
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyUrl}>
              <Copy className="h-4 w-4 mr-1" />
              보호자 링크 복사
            </Button>
            <Button size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-1" />
              인쇄
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl py-6 px-4">
        <div
          ref={printRef}
          className="bg-white shadow-lg mx-auto print:shadow-none"
          style={{ maxWidth: "210mm" }}
        >
          {/* A4 1페이지 최적화: compact 레이아웃 */}
          <div className="px-10 py-6 print:px-0 print:py-0 text-[11px] print:text-[9pt] leading-snug">
            {/* 제목 */}
            <div className="text-center mb-3">
              <h1 className="text-base print:text-[12pt] font-bold">
                {teacher.year}학년도 {teacher.semester}학기 개별화교육지원팀 협의회 개최 안내
              </h1>
            </div>

            {/* 수발신 */}
            <div className="mb-3 text-[10px] print:text-[8pt]">
              <p>
                <strong>수신:</strong> {teacher.studentName} 학생 보호자님
              </p>
              <p>
                <strong>발신:</strong> {teacher.schoolName} 특수학급 담임교사{" "}
                {teacher.teacherName}
              </p>
            </div>

            {/* 인사말 */}
            <div className="mb-2">
              <p>
                안녕하세요. {teacher.schoolName} 특수학급 담임교사{" "}
                {teacher.teacherName}입니다. 새 학기가 시작되었습니다. 아이와
                함께하는 하루하루가 성장으로 가득 차길 바라는 마음으로 이
                안내장을 드립니다.
              </p>
            </div>

            {/* 개최 목적 */}
            <div className="mb-2">
              <h2 className="font-bold text-[11px] print:text-[9pt] mb-0.5">
                [개최 목적 및 법적 근거]
              </h2>
              <p>
                이 협의회는 「장애인 등에 대한 특수교육법」 제22조제1항 및 동법
                시행규칙 제4조에 따라, 매 학기 시작일로부터 30일 이내에
                개별화교육계획(IEP)을 수립하기 위해 개최합니다.{" "}
                <strong>
                  {teacher.studentName} 학생의 교육 주체인 보호자님의 의견이
                  교육계획에 실질적으로 반영
                </strong>
                되도록 하기 위함입니다.
              </p>
            </div>

            {/* 구성원 */}
            <div className="mb-2">
              <h2 className="font-bold text-[11px] print:text-[9pt] mb-0.5">
                [협의회 구성원]
              </h2>
              <p className="mb-0.5">
                보호자님은 팀의 <strong>정식 구성원</strong>입니다.
              </p>
              <table className="w-full border-collapse text-[10px] print:text-[8pt]">
                <thead>
                  <tr className="bg-gray-100 print:bg-gray-200">
                    <th className="border px-2 py-0.5 text-left w-1/3">
                      구성원
                    </th>
                    <th className="border px-2 py-0.5 text-left">역할</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-2 py-0.5 font-medium">보호자</td>
                    <td className="border px-2 py-0.5">
                      가정에서 바라본 아이의 현재 수준·요구사항 공유
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-0.5 font-medium">
                      특수학급 담임교사
                    </td>
                    <td className="border px-2 py-0.5">
                      IEP 수립·실행 총괄
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-0.5 font-medium">
                      통합학급 담임교사
                    </td>
                    <td className="border px-2 py-0.5">
                      통합교육 현황 및 협력 방안 공유
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-0.5 font-medium">
                      관련서비스 담당
                    </td>
                    <td className="border px-2 py-0.5">
                      치료지원·보조인력 현황 안내 (해당 시)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 일정 */}
            <div className="mb-2">
              <h2 className="font-bold text-[11px] print:text-[9pt] mb-0.5">
                [협의회 개최 일정]
              </h2>
              <table className="w-full border-collapse text-[10px] print:text-[8pt]">
                <tbody>
                  <tr>
                    <td className="border px-2 py-0.5 font-medium bg-gray-50 w-1/4">
                      일시
                    </td>
                    <td className="border px-2 py-0.5">
                      {formatDate(teacher.meetingDate)} ({teacher.meetingDay}
                      요일) {teacher.meetingAmPm} {teacher.meetingHour}시{" "}
                      {teacher.meetingMinute || "00"}분
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-0.5 font-medium bg-gray-50">
                      장소
                    </td>
                    <td className="border px-2 py-0.5">
                      {teacher.schoolName} {teacher.meetingPlace}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-0.5 font-medium bg-gray-50">
                      소요시간
                    </td>
                    <td className="border px-2 py-0.5">약 30~40분 예정</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 권리 안내 + 참석 방법 */}
            <div className="mb-2">
              <h2 className="font-bold text-[11px] print:text-[9pt] mb-0.5">
                [보호자님의 권리 및 참석 방법]
              </h2>
              <p className="mb-1">
                「특수교육법」 제16조제4항에 따라 보호자님께는{" "}
                <strong>의견을 충분히 진술할 권리</strong>가 있습니다.
              </p>
              <ul className="list-none space-y-0.5 ml-2">
                <li>
                  <strong>① 대면 참석</strong> — 지정 일시에 학교로 직접
                  오십니다.
                </li>
                <li>
                  <strong>② 유선 참석</strong> — 지정 시간에 담임교사가 전화로
                  협의합니다.
                </li>
                <li>
                  <strong>③ 의견서 제출로 갈음</strong> — 동봉된 의견서(문서2)를
                  작성하여 제출해 주세요.
                </li>
              </ul>
              <p className="mt-1 font-medium text-[10px]">
                ※ 참석이 어려우시더라도 의견서만큼은 꼭 작성해 주세요.
                보호자님의 목소리가 아이의 교육계획에 담깁니다.
              </p>
            </div>

            {/* 제출 안내 */}
            <div className="mb-2">
              <h2 className="font-bold text-[11px] print:text-[9pt] mb-0.5">
                [제출 안내]
              </h2>
              <p className="mb-1">
                아래 서류를{" "}
                <strong>
                  {formatDeadline(
                    teacher.submissionDeadline,
                    teacher.submissionDay
                  )}
                  까지
                </strong>{" "}
                제출해 주세요.
              </p>
              <table className="w-full border-collapse text-[10px] print:text-[8pt]">
                <thead>
                  <tr className="bg-gray-100 print:bg-gray-200">
                    <th className="border px-2 py-0.5 text-left">문서</th>
                    <th className="border px-2 py-0.5 text-left">내용</th>
                    <th className="border px-2 py-0.5 text-center w-16">
                      필수
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-2 py-0.5 font-medium">문서 2</td>
                    <td className="border px-2 py-0.5">보호자 의견서</td>
                    <td className="border px-2 py-0.5 text-center">★</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-0.5 font-medium">문서 3</td>
                    <td className="border px-2 py-0.5">
                      개인정보·교육활동 동의서
                    </td>
                    <td className="border px-2 py-0.5 text-center">★</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-0.5 font-medium">
                      참석 방법
                    </td>
                    <td className="border px-2 py-0.5">
                      문서2 내 ②항에 표기
                    </td>
                    <td className="border px-2 py-0.5 text-center">★</td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-1 text-[9px] print:text-[7pt]">
                제출 방법: 아이 편에 봉투에 넣어 전달 또는 아래 QR코드로 온라인
                제출 (온라인 제출 시 동의 클릭은 서명과 동일한 효력 —
                「전자서명법」 제3조)
              </p>
            </div>

            {/* 학기말 + 문의 + QR 가로 배치 */}
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <div className="mb-2">
                  <h2 className="font-bold text-[11px] print:text-[9pt] mb-0.5">
                    [학기 말 결과 통보]
                  </h2>
                  <p className="text-[10px] print:text-[8pt]">
                    「특수교육법 시행규칙」 제4조제4항에 따라 학기 말에 IEP에
                    따른 학업성취도 평가 결과를 서면으로 안내드립니다.
                  </p>
                </div>
                <div>
                  <h2 className="font-bold text-[11px] print:text-[9pt] mb-0.5">
                    [문의]
                  </h2>
                  <p className="text-[10px] print:text-[8pt]">
                    특수학급 담임 {teacher.teacherName} | ☎{" "}
                    {teacher.teacherPhone} | 상담 가능 시간:{" "}
                    {teacher.consultTime}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-center">
                <div className="border p-2 inline-block">
                  {formUrl && <QRCodeSVG value={formUrl} size={80} />}
                </div>
                <p className="text-[8px] print:text-[6pt] mt-0.5 text-gray-500">
                  온라인 제출 QR
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          로딩 중...
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}
