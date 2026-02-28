"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { decompress } from "@/lib/codec";
import type { TeacherInput } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check } from "lucide-react";

function PreviewContent() {
  const searchParams = useSearchParams();
  const ctx = searchParams.get("ctx");
  const [mounted, setMounted] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const teacher = useMemo(() => {
    if (!ctx) return null;
    return decompress<TeacherInput>(ctx);
  }, [ctx]);

  if (!mounted) return null;

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        잘못된 접근입니다.
      </div>
    );
  }

  // Generate URL for parents
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const formUrl = `${baseUrl}/form?ctx=${ctx}`;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "____년 __월 __일";
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  const formatDeadline = (dateStr: string, day: string) => {
    if (!dateStr) return "__월 __일(__요일)";
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-[210mm] mx-auto space-y-4">
        {/* Actions - hidden when printing */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm print:hidden gap-4">
          <p className="text-sm text-gray-600 font-medium">아래 안내장(문서1)을 인쇄하여 학생 편으로 보내주세요.</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.open(`/print-empty-form?doc=2`, '_blank')} className="text-blue-600 border-blue-200 hover:bg-blue-50">
              빈 의견서 인쇄 (문서2)
            </Button>
            <Button variant="outline" onClick={() => window.open(`/print-empty-form?doc=3`, '_blank')} className="text-blue-600 border-blue-200 hover:bg-blue-50">
              빈 동의서 인쇄 (문서3)
            </Button>
            <Button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700">
              안내장 인쇄하기 (문서1)
            </Button>
          </div>
        </div>

        {/* Document 1 Preview (A4 Size) */}
        <div className="bg-white shadow-md print:shadow-none print:m-0 w-[210mm] h-[297mm] max-h-[297mm] overflow-hidden mx-auto p-10 text-[11pt] leading-relaxed relative border print:border-none box-border flex flex-col">
          {/* Watermark for preview */}
          <div className="absolute top-4 right-4 print:hidden border border-blue-200 bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded font-medium">
            인쇄 미리보기
          </div>

          <div className="text-center mb-6 border-b-2 border-black pb-3 shrink-0">
            <h1 className="text-xl font-bold tracking-tight">
              {teacher.year}학년도 {teacher.semester}학기 개별화교육지원팀 협의회 안내
            </h1>
          </div>

          <div className="flex justify-between items-end mb-6 text-[10pt] shrink-0">
            <div>
              <p className="mb-1"><span className="font-bold mr-2">받는 분:</span>{teacher.studentName} 학생 보호자님</p>
              <p><span className="font-bold mr-2">보내는 분:</span>{teacher.schoolName} 특수학급 특수교사 {teacher.teacherName}</p>
            </div>
            <div className="text-right text-gray-600">
              <p>{teacher.year}년 {new Date().getMonth() + 1}월 {new Date().getDate()}일</p>
            </div>
          </div>

          <div className="mb-6 bg-blue-50/50 print:bg-transparent p-4 rounded-xl shrink-0">
            <p className="text-justify leading-relaxed">
              안녕하세요. {teacher.schoolName} 특수학급 특수교사 {teacher.teacherName}입니다.
              <br /><br />
              새 학기가 시작되었습니다. 우리 아이의 즐거운 학교생활과 의미 있는 성장을 위해, 
              가정과 학교가 함께 이번 학기 교육 계획(IEP)을 의논하는 자리를 마련하고자 합니다.
              <br /><br />
              보호자님의 소중한 의견이 교육 계획에 잘 반영될 수 있도록 많은 관심과 참여 부탁드립니다.
            </p>
          </div>

          <div className="space-y-6 flex-1">
            <section>
              <h2 className="text-[12pt] font-bold mb-3 flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 print:bg-black"></span>
                협의회 일정 및 장소
              </h2>
              <div className="pl-4">
                <table className="w-full border-collapse border border-gray-300 text-[10.5pt]">
                  <tbody>
                    <tr>
                      <th className="border border-gray-300 px-3 py-2 text-left bg-gray-50 w-[25%] font-medium">운영 기간</th>
                      <td className="border border-gray-300 px-3 py-2 font-bold text-blue-900 print:text-black">
                        {formatDate(teacher.meetingStartDate)} ~ {formatDate(teacher.meetingEndDate)}
                      </td>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 px-3 py-2 text-left bg-gray-50 font-medium">장소</th>
                      <td className="border border-gray-300 px-3 py-2">{teacher.schoolName} {teacher.meetingPlace}</td>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 px-3 py-2 text-left bg-gray-50 font-medium">예상 소요시간</th>
                      <td className="border border-gray-300 px-3 py-2">약 30~40분</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-[12pt] font-bold mb-3 flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 print:bg-black"></span>
                참석 방법 (택 1)
              </h2>
              <div className="pl-4">
                <p className="mb-2 text-gray-700 text-[10.5pt]">편하신 방법으로 협의회에 참여하실 수 있습니다. 스마트폰으로 희망하시는 날짜와 시간을 선택해 주시면 일정을 조율하여 연락드리겠습니다.</p>
                <div className="grid grid-cols-3 gap-3 text-[10pt]">
                  <div className="border border-gray-200 p-3 rounded-lg bg-gray-50/50 print:bg-transparent print:border-gray-300">
                    <p className="font-bold text-blue-800 print:text-black mb-1">① 학교 방문 (대면)</p>
                    <p className="text-gray-600 leading-tight">안내된 기간 중 희망하시는 일시에 학교로 방문해 주시면 됩니다.</p>
                  </div>
                  <div className="border border-gray-200 p-3 rounded-lg bg-gray-50/50 print:bg-transparent print:border-gray-300">
                    <p className="font-bold text-blue-800 print:text-black mb-1">② 전화 상담 (유선)</p>
                    <p className="text-gray-600 leading-tight">희망하시는 시간에 담임교사가 전화를 드립니다.</p>
                  </div>
                  <div className="border border-gray-200 p-3 rounded-lg bg-gray-50/50 print:bg-transparent print:border-gray-300">
                    <p className="font-bold text-blue-800 print:text-black mb-1">③ 서면 참여</p>
                    <p className="text-gray-600 leading-tight">일정 조율이 어려우신 경우, 의견서만 작성하여 제출해 주셔도 됩니다.</p>
                  </div>
                </div>
                <p className="text-[10pt] font-medium text-red-600 print:text-black mt-2 flex items-center gap-1.5">
                  <span>💡</span> 참석이 어려우시더라도 스마트폰으로 의견서는 꼭 작성해 주세요.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-[12pt] font-bold mb-3 flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 print:bg-black"></span>
                의견서 및 동의서 제출 방법
              </h2>
              <div className="pl-4">
                <p className="mb-2 text-[10.5pt]">
                  아래의 QR코드를 스마트폰 카메라로 스캔하여 <strong className="text-red-600 print:text-black underline underline-offset-4">{formatDeadline(teacher.submissionDeadline, teacher.submissionDay)}까지</strong> 작성해 주세요.
                </p>
                <div className="flex gap-5 items-center p-4 border-2 border-gray-300 rounded-xl bg-gray-50 print:bg-transparent">
                  <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center border-2 border-gray-300 shrink-0 p-1.5 relative overflow-hidden">
                    <QRCodeSVG
                      value={formUrl}
                      size={85}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <p className="font-bold text-[11.5pt]">스마트폰 간편 제출 안내</p>
                    <ul className="list-disc pl-4 text-gray-700 space-y-1 text-[10.5pt]">
                      <li>스마트폰 기본 카메라 앱을 켜고 왼쪽 QR코드를 비춰주세요.</li>
                      <li>화면에 나타나는 링크를 누르시면 작성 화면으로 이동합니다.</li>
                      <li className="text-[9.5pt] text-gray-500 mt-1.5 list-none -ml-4">※ 제출하신 내용은 안전하게 암호화되어 담당 교사에게만 전달됩니다.</li>
                    </ul>
                    <div className="mt-2 pt-2 border-t border-gray-200 print:hidden">
                      <p className="text-[9.5pt] text-gray-600 mb-1">📱 <b>PC로 접근하시는 경우:</b> 아래 버튼으로 링크를 복사하여 주소창에 붙여넣으세요.</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(formUrl).then(() => {
                            setUrlCopied(true);
                            setTimeout(() => setUrlCopied(false), 2000);
                          });
                        }}
                        className="inline-flex items-center gap-1.5 text-[9pt] px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        {urlCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {urlCopied ? "복사됨!" : "링크 복사"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-300 text-[10pt] text-gray-600 flex justify-between items-center shrink-0">
            <div>
              <p>이 문서는 「장애인 등에 대한 특수교육법」 제22조에 근거하여 발송됩니다.</p>
            </div>
            <div className="text-right bg-gray-50 print:bg-transparent px-3 py-1.5 rounded-lg">
              <p><strong>문의:</strong> 특수교사 {teacher.teacherName} (☎ {teacher.teacherPhone})</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">불러오는 중...</div>}>
      <PreviewContent />
    </Suspense>
  );
}
