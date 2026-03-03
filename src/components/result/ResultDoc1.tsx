"use client";

import type { TeacherInput } from "@/lib/types";
import { QRCodeSVG } from "qrcode.react";

interface Doc1Overrides {
  introText?: string;
  estimatedTime?: string;
  method1Desc?: string;
  method2Desc?: string;
  method3Desc?: string;
}

interface Props {
  teacher: TeacherInput;
  formUrl?: string;
  overrides?: Doc1Overrides;
  handwrittenMode?: boolean;
}

export function ResultDoc1({ teacher, formUrl, overrides, handwrittenMode }: Props) {
  const DEFAULT_INTRO = `안녕하세요. ${teacher.schoolName} 특수학급 담임교사 ${teacher.teacherName}입니다.
새로운 학기를 맞이하여, 우리 아이가 학교에서 한 뼘 더 성장하고 행복한 일상을 누릴 수 있도록 개별화교육계획(IEP)을 수립할 시기가 되었습니다.
학생 개개인의 교육적 요구에 꼭 맞는 맞춤형 지원을 위해, 가정과 학교가 함께 지혜를 모으는 뜻깊은 자리를 마련하고자 합니다.
보호자님의 귀한 의견이 우리 아이를 위한 교육 계획의 소중한 밑거름이 될 수 있도록 따뜻한 관심과 참여를 부탁드립니다.`;
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "____년 __월 __일";
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  const formatDeadline = (dateStr: string) => {
    if (!dateStr) return "__월 __일";
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  return (
    <div className="mx-auto w-[210mm] h-[297mm] p-[12mm] bg-white print:p-[2mm] print:m-0 print:w-full print:h-[281mm] print:shadow-none text-[10pt] leading-tight flex flex-col relative print:break-after-page overflow-hidden">
      <div className="text-center mb-4 border-b-2 border-black pb-2 shrink-0">
        <h1 className="text-[15pt] font-bold tracking-tight">
          {teacher.year}학년도 {teacher.semester}학기 개별화교육지원팀 협의회 안내
        </h1>
        <div className="text-right text-gray-600 mt-1 text-[9pt]">
          <p>{teacher.year}년 {new Date().getMonth() + 1}월 {new Date().getDate()}일</p>
        </div>
      </div>

      <div className="mb-4 bg-[#f2fcf9] print:bg-transparent p-3.5 rounded-xl border border-teal-100/50 print:border-none print:p-0 shrink-0">
        <p className="text-justify leading-relaxed text-[10.5pt] whitespace-pre-line font-serif text-gray-800">
          {overrides?.introText || DEFAULT_INTRO}
        </p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col space-y-5">
        <section className="shrink-0">
          <h2 className="text-[11pt] font-bold mb-1.5 flex items-center text-gray-900">
            <span className="w-1.5 h-1.5 bg-gray-800 rounded-full mr-2 print:bg-black"></span>
            협의회 일정 및 장소
          </h2>
          <div className="pl-3.5">
            <table className="w-full border-collapse border border-gray-400">
              <tbody>
                <tr>
                  <th className="border border-gray-400 px-3 py-1.5 text-left bg-[#f2fcf9] w-[25%] font-bold text-gray-800">운영 기간</th>
                  <td className="border border-gray-400 px-3 py-1.5 font-bold text-gray-900">
                    {formatDate(teacher.meetingStartDate)} ~ {formatDate(teacher.meetingEndDate)}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-400 px-3 py-1.5 text-left bg-[#f2fcf9] font-bold text-gray-800">장소</th>
                  <td className="border border-gray-400 px-3 py-1.5 text-gray-900">{teacher.schoolName} {teacher.meetingPlace}</td>
                </tr>
                <tr>
                  <th className="border border-gray-400 px-3 py-1.5 text-left bg-[#f2fcf9] font-bold text-gray-800">예상 소요시간</th>
                  <td className="border border-gray-400 px-3 py-1.5 text-gray-900">{overrides?.estimatedTime || "약 30~40분"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="shrink-0">
          <h2 className="text-[11pt] font-bold mb-1.5 flex items-center text-gray-900">
            <span className="w-1.5 h-1.5 bg-gray-800 rounded-full mr-2 print:bg-black"></span>
            협의회 참석 방법
          </h2>
          <div className="pl-3.5">
            <p className="mb-1 text-gray-700 text-[9.5pt]">편하신 방법으로 협의회에 참여하실 수 있습니다.</p>
            <div className="grid grid-cols-3 gap-2 text-[9pt]">
              <div className="border border-gray-300 p-2 rounded-lg bg-[#f2fcf9] print:bg-transparent print:border-gray-400">
                <p className="font-bold text-gray-900 mb-0.5">① 학교 방문 (대면)</p>
                <p className="text-gray-700 leading-snug">{overrides?.method1Desc || "안내된 기간 중 희망하시는 일시에 학교로 방문해 주시면 됩니다."}</p>
              </div>
              <div className="border border-gray-300 p-2 rounded-lg bg-[#f2fcf9] print:bg-transparent print:border-gray-400">
                <p className="font-bold text-gray-900 mb-0.5">② 전화 상담 (유선)</p>
                <p className="text-gray-700 leading-snug">{overrides?.method2Desc || "희망하시는 시간에 담임교사가 전화를 드립니다."}</p>
              </div>
              <div className="border border-gray-300 p-2 rounded-lg bg-[#f2fcf9] print:bg-transparent print:border-gray-400">
                <p className="font-bold text-gray-900 mb-0.5">③ 서면 참여</p>
                <p className="text-gray-700 leading-snug">{overrides?.method3Desc || "일정 조율이 어려우신 경우, 의견서만 작성하여 제출해 주셔도 됩니다."}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="shrink-0">
          <h2 className="text-[11pt] font-bold mb-1.5 flex items-center text-gray-900">
            <span className="w-1.5 h-1.5 bg-gray-800 rounded-full mr-2 print:bg-black"></span>
            의견서 및 동의서 제출 방법
          </h2>
          <div className="pl-3.5">
            {handwrittenMode ? (
              <div className="border-2 border-dashed border-gray-400 rounded-xl p-4 bg-[#f2fcf9] print:bg-transparent">
                <p className="font-bold text-[10.5pt] text-gray-900 mb-2">자필 작성 및 직접 제출 안내</p>
                <p className="text-[9.5pt] text-gray-700 leading-relaxed mb-3">
                  이 안내장과 함께 배부된 <strong>의견서 및 개인정보 수집·이용 동의서</strong>를 자필로 작성하시어,
                  <strong> {formatDeadline(teacher.submissionDeadline)}까지</strong> 담임교사에게 직접 제출해 주세요.
                </p>
                <div className="grid grid-cols-2 gap-3 text-[9pt] border-t border-gray-300 pt-3">
                  <div>
                    <p className="text-gray-600 font-medium">담임 특수교사</p>
                    <p className="font-bold text-gray-900 mt-0.5">{teacher.teacherName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">연락처</p>
                    <p className="font-bold text-gray-900 mt-0.5">{teacher.teacherPhone}</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="mb-1 text-[9.5pt] text-gray-800">
                  아래의 QR코드를 카메라로 스캔하여 <strong className="text-gray-900 underline underline-offset-2">{formatDeadline(teacher.submissionDeadline)}까지</strong> 작성해 주세요.
                </p>
                <div className="flex gap-3 items-center p-2.5 border border-gray-300 rounded-xl bg-[#f2fcf9] print:bg-transparent print:border-gray-400">
                  <div className="w-[100px] h-[100px] bg-white rounded-lg flex items-center justify-center border border-gray-300 shrink-0 p-1">
                    {formUrl ? (
                      <QRCodeSVG value={formUrl} size={90} level="H" includeMargin={false} />
                    ) : (
                      <span className="text-xs text-gray-400 text-center">QR코드<br/>영역</span>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-[10pt] text-gray-900">간편 제출 안내</p>
                    <ul className="list-disc pl-3.5 text-gray-700 space-y-0.5 text-[9pt]">
                      <li><strong>스마트폰:</strong> 기본 카메라 앱으로 QR코드를 비춰 링크를 누르세요.</li>
                      <li><strong>PC:</strong> 담임교사에게 링크 전달을 요청하세요.</li>
                      <li className="text-[8.5pt] text-gray-500 mt-0.5 list-none -ml-3.5">※ 제출 내용은 암호화되어 담임교사에게만 전달됩니다.</li>
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      <div className="mt-4 pt-2 border-t border-gray-300 text-[8.5pt] text-gray-600 flex justify-between items-center shrink-0">
        <div>
          <p>이 문서는 「장애인 등에 대한 특수교육법」 제22조에 근거하여 발송됩니다.</p>
        </div>
        <div className="text-right bg-gray-50 print:bg-transparent px-3 py-1 rounded-lg">
          <p><strong>문의:</strong> 담임교사 {teacher.teacherName} (☎ {teacher.teacherPhone})</p>
        </div>
      </div>
    </div>
  );
}
