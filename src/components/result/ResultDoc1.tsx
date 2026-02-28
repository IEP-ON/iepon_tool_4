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
    <div className="px-10 py-6 print:px-0 print:py-0 text-[11px] print:text-[9pt] leading-snug">
      <div className="text-center mb-3">
        <h1 className="text-base print:text-[12pt] font-bold">
          {teacher.year}학년도 {teacher.semester}학기 개별화교육지원팀 협의회
          개최 안내
        </h1>
      </div>

      <div className="mb-3 text-[10px] print:text-[8pt]">
        <p>
          <strong>수신:</strong> {teacher.studentName} 학생 보호자님
        </p>
        <p>
          <strong>발신:</strong> {teacher.schoolName} 특수학급 담임교사{" "}
          {teacher.teacherName}
        </p>
      </div>

      <div className="mb-2">
        <p>
          안녕하세요. {teacher.schoolName} 특수학급 담임교사{" "}
          {teacher.teacherName}입니다. 새 학기가 시작되었습니다. 아이와 함께하는
          하루하루가 성장으로 가득 차길 바라는 마음으로 이 안내장을 드립니다.
        </p>
      </div>

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

      <div className="mb-2">
        <h2 className="font-bold text-[11px] print:text-[9pt] mb-0.5">
          [협의회 구성원]
        </h2>
        <p className="mb-0.5">
          보호자님은 팀의 <strong>정식 구성원</strong>입니다.
        </p>
        <table className="w-full border-collapse text-[10px] print:text-[8pt]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-0.5 text-left w-1/3">구성원</th>
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
              <td className="border px-2 py-0.5">IEP 수립·실행 총괄</td>
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
                {formatDate(teacher.meetingDate)} ({teacher.meetingDay}요일){" "}
                {teacher.meetingAmPm} {teacher.meetingHour}시{" "}
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
            <strong>① 대면 참석</strong> — 지정 일시에 학교로 직접 오십니다.
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
        </p>
      </div>

      <div className="mb-2">
        <h2 className="font-bold text-[11px] print:text-[9pt] mb-0.5">
          [제출 안내]
        </h2>
        <p className="mb-1">
          아래 서류를{" "}
          <strong>
            {formatDeadline(teacher.submissionDeadline, teacher.submissionDay)}
            까지
          </strong>{" "}
          제출해 주세요.
        </p>
        <table className="w-full border-collapse text-[10px] print:text-[8pt]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-0.5 text-left">문서</th>
              <th className="border px-2 py-0.5 text-left">내용</th>
              <th className="border px-2 py-0.5 text-center w-16">필수</th>
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
              <td className="border px-2 py-0.5">개인정보·교육활동 동의서</td>
              <td className="border px-2 py-0.5 text-center">★</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 items-start">
        <div className="flex-1">
          <div className="mb-2">
            <h2 className="font-bold text-[11px] print:text-[9pt] mb-0.5">
              [학기 말 결과 통보]
            </h2>
            <p className="text-[10px] print:text-[8pt]">
              「특수교육법 시행규칙」 제4조제4항에 따라 학기 말에 IEP에 따른
              학업성취도 평가 결과를 서면으로 안내드립니다.
            </p>
          </div>
          <div>
            <h2 className="font-bold text-[11px] print:text-[9pt] mb-0.5">
              [문의]
            </h2>
            <p className="text-[10px] print:text-[8pt]">
              특수학급 담임 {teacher.teacherName} | ☎ {teacher.teacherPhone} |
              상담 가능 시간: {teacher.consultTime}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
