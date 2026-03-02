"use client";

import type { TeacherInput } from "@/lib/types";
import { QRCodeSVG } from "qrcode.react";

interface Props {
  teacher: TeacherInput;
  formUrl?: string;
}

export function ResultDoc1({ teacher, formUrl }: Props) {
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
    <div className="mx-auto w-[210mm] min-h-[297mm] p-12 bg-white print:p-0 print:shadow-none text-[12pt] leading-relaxed">
      <div className="text-center mb-10 border-b-2 border-black pb-4">
        <h1 className="text-2xl font-bold tracking-tight">
          {teacher.year}학년도 {teacher.semester}학기 개별화교육지원팀 협의회 안내
        </h1>
      </div>

      <div className="flex justify-between items-end mb-8 text-[11pt]">
        <div>
          <p className="mb-1"><span className="font-bold mr-2">받는 분:</span>{teacher.studentName} 학생 보호자님</p>
          <p><span className="font-bold mr-2">보내는 분:</span>{teacher.schoolName} 특수학급 담임교사 {teacher.teacherName}</p>
        </div>
        <div className="text-right text-gray-600">
          <p>{teacher.year}년 {new Date().getMonth() + 1}월 {new Date().getDate()}일</p>
        </div>
      </div>

      <div className="mb-8 bg-blue-50/50 print:bg-transparent p-6 rounded-xl">
        <p className="text-justify leading-loose">
          안녕하세요. {teacher.schoolName} 특수학급 담임교사 {teacher.teacherName}입니다.
          <br /><br />
          새 학기가 시작되었습니다. 우리 아이의 즐거운 학교생활과 의미 있는 성장을 위해,
          가정과 학교가 함께 이번 학기 교육 계획(IEP)을 의논하는 자리를 마련하고자 합니다.
          <br /><br />
          보호자님의 소중한 의견이 교육 계획에 잘 반영될 수 있도록 많은 관심과 참여 부탁드립니다.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-[13pt] font-bold mb-4 flex items-center">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 print:bg-black"></span>
            협의회 일정 및 장소
          </h2>
          <div className="pl-5">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <th className="border border-gray-300 px-4 py-3 text-left bg-gray-50 w-[25%]">운영 기간</th>
                  <td className="border border-gray-300 px-4 py-3 font-bold text-blue-900 print:text-black">
                    {formatDate(teacher.meetingStartDate)} ~ {formatDate(teacher.meetingEndDate)}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-300 px-4 py-3 text-left bg-gray-50">장소</th>
                  <td className="border border-gray-300 px-4 py-3">{teacher.schoolName} {teacher.meetingPlace}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 px-4 py-3 text-left bg-gray-50">예상 소요시간</th>
                  <td className="border border-gray-300 px-4 py-3">약 30~40분</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-[13pt] font-bold mb-4 flex items-center">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 print:bg-black"></span>
            참석 방법 (택 1)
          </h2>
          <div className="pl-5">
            <p className="mb-3 text-gray-700">편하신 방법으로 협의회에 참여하실 수 있습니다.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11pt]">
              <div className="border border-gray-200 p-4 rounded-lg bg-gray-50/50 print:bg-transparent print:border-gray-300">
                <p className="font-bold text-blue-800 print:text-black mb-2">① 학교 방문 (대면)</p>
                <p className="text-gray-600">안내된 기간 중 희망하시는 일시에 학교로 방문해 주시면 됩니다.</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg bg-gray-50/50 print:bg-transparent print:border-gray-300">
                <p className="font-bold text-blue-800 print:text-black mb-2">② 전화 상담 (유선)</p>
                <p className="text-gray-600">희망하시는 시간에 담임교사가 전화를 드립니다.</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg bg-gray-50/50 print:bg-transparent print:border-gray-300">
                <p className="font-bold text-blue-800 print:text-black mb-2">③ 서면 참여</p>
                <p className="text-gray-600">일정 조율이 어려우신 경우, 의견서만 작성하여 제출해 주셔도 됩니다.</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-[13pt] font-bold mb-4 flex items-center">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 print:bg-black"></span>
            의견서 및 동의서 제출 방법
          </h2>
          <div className="pl-5">
            <p className="mb-3">
              아래의 QR코드를 스마트폰 카메라로 스캔하여 <strong className="text-red-600 print:text-black underline underline-offset-4">{formatDeadline(teacher.submissionDeadline)}까지</strong> 작성해 주세요.
            </p>
            <div className="flex gap-6 items-center p-6 border-2 border-gray-300 rounded-xl bg-gray-50 print:bg-transparent">
              <div className="w-28 h-28 bg-white rounded-lg flex items-center justify-center border border-gray-300 shrink-0 p-1.5">
                {formUrl ? (
                  <QRCodeSVG value={formUrl} size={100} level="H" includeMargin={false} />
                ) : (
                  <span className="text-xs text-gray-400 text-center">QR코드<br/>영역</span>
                )}
              </div>
              <div className="space-y-2">
                <p className="font-bold text-[13pt]">스마트폰 간편 제출 안내</p>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  <li>스마트폰 기본 카메라 앱을 켜고 왼쪽 QR코드를 비춰주세요.</li>
                  <li>화면에 나타나는 링크를 누르시면 작성 화면으로 이동합니다.</li>
                  <li className="text-[10pt] text-gray-500 mt-2 list-none -ml-5">※ 제출하신 내용은 안전하게 암호화되어 담임교사에게만 전달됩니다.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-16 pt-6 border-t border-gray-300 text-[11pt] text-gray-600 flex justify-between items-center">
        <div>
          <p>이 문서는 「장애인 등에 대한 특수교육법」 제22조에 근거하여 발송됩니다.</p>
        </div>
        <div className="text-right bg-gray-50 print:bg-transparent px-4 py-2 rounded-lg">
          <p><strong>문의:</strong> 담임교사 {teacher.teacherName} (☎ {teacher.teacherPhone})</p>
        </div>
      </div>
    </div>
  );
}
