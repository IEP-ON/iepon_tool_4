"use client";

import type { TeacherInput } from "@/lib/types";

interface Props {
  teacher: TeacherInput;
}

export function ResultDoc1({ teacher }: Props) {
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

  return (
    <div className="mx-auto w-[210mm] min-h-[297mm] p-12 bg-white print:p-0 print:shadow-none text-[12pt] leading-relaxed">
      <div className="text-center mb-10 border-b-2 border-black pb-4">
        <h1 className="text-2xl font-bold tracking-tight">
          {teacher.year}학년도 {teacher.semester}학기 개별화교육지원팀 협의회 개최 안내
        </h1>
      </div>

      <div className="flex justify-between items-end mb-8 text-[11pt]">
        <div>
          <p className="mb-1"><span className="font-bold mr-2">수신:</span>{teacher.studentName} 학생 보호자님</p>
          <p><span className="font-bold mr-2">발신:</span>{teacher.schoolName} 특수학급 담임교사 {teacher.teacherName}</p>
        </div>
        <div className="text-right text-gray-600">
          <p>{teacher.year}년 {new Date().getMonth() + 1}월 {new Date().getDate()}일</p>
        </div>
      </div>

      <div className="mb-8">
        <p className="indent-4 text-justify">
          안녕하세요. {teacher.schoolName} 특수학급 담임교사 {teacher.teacherName}입니다. 새 학기가 시작되었습니다. 아이와 함께하는 하루하루가 성장으로 가득 차길 바라는 마음으로 이 안내장을 드립니다.
        </p>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-[13pt] font-bold mb-2 flex items-center">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 print:bg-black"></span>
            개최 목적 및 법적 근거
          </h2>
          <p className="pl-4 text-justify">
            이 협의회는 「장애인 등에 대한 특수교육법」 제22조제1항 및 동법 시행규칙 제4조에 따라, 매 학기 시작일로부터 30일 이내에 개별화교육계획(IEP)을 수립하기 위해 개최합니다. <strong>{teacher.studentName} 학생의 교육 주체인 보호자님의 의견이 교육계획에 실질적으로 반영</strong>되도록 하기 위함입니다.
          </p>
        </section>

        <section>
          <h2 className="text-[13pt] font-bold mb-2 flex items-center">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 print:bg-black"></span>
            협의회 구성원
          </h2>
          <div className="pl-4">
            <p className="mb-2">보호자님은 팀의 <strong>정식 구성원</strong>입니다.</p>
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100 print:bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left w-[30%]">구성원</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">역할</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">보호자</td>
                  <td className="border border-gray-300 px-4 py-2">가정에서 바라본 아이의 현재 수준·요구사항 공유</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">특수학급 담임교사</td>
                  <td className="border border-gray-300 px-4 py-2">IEP 수립·실행 총괄</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">통합학급 담임교사</td>
                  <td className="border border-gray-300 px-4 py-2">통합교육 현황 및 협력 방안 공유</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-[13pt] font-bold mb-2 flex items-center">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 print:bg-black"></span>
            협의회 개최 일정
          </h2>
          <div className="pl-4">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left bg-gray-50 w-[20%]">일시</th>
                  <td className="border border-gray-300 px-4 py-2 font-bold text-blue-900 print:text-black">
                    {formatDate(teacher.meetingDate)} ({teacher.meetingDay}요일) {teacher.meetingAmPm} {teacher.meetingHour}시 {teacher.meetingMinute || "00"}분
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left bg-gray-50">장소</th>
                  <td className="border border-gray-300 px-4 py-2">{teacher.schoolName} {teacher.meetingPlace}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left bg-gray-50">소요시간</th>
                  <td className="border border-gray-300 px-4 py-2">약 30~40분 예정</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-[13pt] font-bold mb-2 flex items-center">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 print:bg-black"></span>
            보호자님의 권리 및 참석 방법
          </h2>
          <div className="pl-4 space-y-2">
            <p>「특수교육법」 제16조제4항에 따라 보호자님께는 <strong>의견을 충분히 진술할 권리</strong>가 있습니다.</p>
            <ul className="list-none space-y-1 ml-2 bg-blue-50/50 print:bg-transparent p-3 rounded-lg border border-blue-100 print:border-none">
              <li><strong>① 대면 참석</strong> — 지정 일시에 학교로 직접 오십니다.</li>
              <li><strong>② 유선 참석</strong> — 지정 시간에 담임교사가 전화로 협의합니다.</li>
              <li><strong>③ 의견서 제출로 갈음</strong> — 동봉된 의견서(문서2)를 작성하여 제출해 주세요.</li>
            </ul>
            <p className="text-[11pt] font-bold text-red-600 print:text-black mt-2">※ 참석이 어려우시더라도 의견서만큼은 꼭 작성해 주세요.</p>
          </div>
        </section>

        <section>
          <h2 className="text-[13pt] font-bold mb-2 flex items-center">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 print:bg-black"></span>
            제출 안내
          </h2>
          <div className="pl-4">
            <p className="mb-2">아래 서류를 <strong className="text-red-600 print:text-black">{formatDeadline(teacher.submissionDeadline, teacher.submissionDay)}까지</strong> 제출해 주세요.</p>
            <div className="flex gap-4 items-center p-4 border-2 border-gray-800 rounded-xl">
              <div className="flex-1 space-y-2">
                <p><strong>[제출 방법]</strong> QR코드를 스캔하여 스마트폰으로 바로 제출</p>
                <p className="text-[11pt] text-gray-600">온라인 제출 시 동의 버튼 클릭은 전자서명과 동일한 효력을 가집니다. (「전자서명법」 제3조)</p>
              </div>
              <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center border border-gray-400">
                <span className="text-sm text-gray-500">QR코드 영역</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-300 text-[11pt] text-gray-600 flex justify-between">
        <div>
          <p><strong>[학기 말 결과 통보]</strong> 학기 말에 IEP 학업성취도 평가 결과를 서면으로 안내드립니다.</p>
        </div>
        <div className="text-right">
          <p><strong>문의:</strong> 특수학급 담임 {teacher.teacherName} (☎ {teacher.teacherPhone})</p>
        </div>
      </div>
    </div>
  );
}
