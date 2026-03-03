import type { TeacherInput } from "@/lib/types";

interface Props {
  teacher: TeacherInput;
}

export function ParentOpinionBlankForm({ teacher }: Props) {
  return (
    <div className="mx-auto w-[210mm] min-h-[297mm] p-[12mm] bg-white print:p-[10mm] print:m-0 print:w-full print:shadow-none text-[10pt] leading-tight break-after-page">
      <div className="text-center mb-4 border-b-2 border-black pb-2">
        <h1 className="text-[15pt] font-bold tracking-tight">
          개별화교육지원팀 협의회 학부모 의견서
        </h1>
        <div className="text-right text-gray-600 mt-1 text-[9pt]">
          <p>{teacher.schoolName}</p>
        </div>
      </div>

      <div className="space-y-6 text-[10pt]">
        {/* 기본 정보 */}
        <section>
          <h2 className="text-[11pt] font-bold mb-3 flex items-center text-gray-900 border-b pb-1">
            1. 기본 정보
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium min-w-[80px]">학생 성명:</span>
              <div className="flex-1 border-b border-gray-400 h-7"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium min-w-[80px]">생년월일:</span>
              <div className="flex-1 border-b border-gray-400 h-7"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium min-w-[80px]">학년/반:</span>
              <div className="flex-1 border-b border-gray-400 h-7"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium min-w-[80px]">보호자 성명:</span>
              <div className="flex-1 border-b border-gray-400 h-7"></div>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <span className="text-gray-700 font-medium min-w-[80px]">연락처:</span>
              <div className="flex-1 border-b border-gray-400 h-7"></div>
            </div>
          </div>
        </section>

        {/* 건강 및 의료 */}
        <section>
          <h2 className="text-[11pt] font-bold mb-3 flex items-center text-gray-900 border-b pb-1">
            2. 건강 및 의료 정보
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-gray-700 font-medium mb-1">복용 약물:</p>
              <div className="border border-gray-300 rounded p-2 min-h-[60px]"></div>
            </div>
            <div>
              <p className="text-gray-700 font-medium mb-1">알레르기:</p>
              <div className="border border-gray-300 rounded p-2 min-h-[40px]"></div>
            </div>
            <div>
              <p className="text-gray-700 font-medium mb-1">특이사항:</p>
              <div className="border border-gray-300 rounded p-2 min-h-[60px]"></div>
            </div>
          </div>
        </section>

        {/* 교육적 요구 */}
        <section>
          <h2 className="text-[11pt] font-bold mb-3 flex items-center text-gray-900 border-b pb-1">
            3. 교육적 요구 및 학부모 의견
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-gray-700 font-medium mb-1">학생의 강점:</p>
              <div className="border border-gray-300 rounded p-2 min-h-[80px]"></div>
            </div>
            <div>
              <p className="text-gray-700 font-medium mb-1">개선이 필요한 영역:</p>
              <div className="border border-gray-300 rounded p-2 min-h-[80px]"></div>
            </div>
            <div>
              <p className="text-gray-700 font-medium mb-1">협의회에서 논의하고 싶은 사항:</p>
              <div className="border border-gray-300 rounded p-2 min-h-[100px]"></div>
            </div>
            <div>
              <p className="text-gray-700 font-medium mb-1">학교에 바라는 지원:</p>
              <div className="border border-gray-300 rounded p-2 min-h-[80px]"></div>
            </div>
          </div>
        </section>

        {/* 협의회 참석 */}
        <section>
          <h2 className="text-[11pt] font-bold mb-3 flex items-center text-gray-900 border-b pb-1">
            4. 협의회 참석 방법
          </h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-gray-400 rounded"></span>
                <span>학교 방문 (대면)</span>
              </label>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-gray-400 rounded"></span>
                <span>전화 상담 (유선)</span>
              </label>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-gray-400 rounded"></span>
                <span>서면 참여 (의견서 제출)</span>
              </label>
            </div>
            <div className="mt-3">
              <p className="text-gray-700 font-medium mb-1">희망 일시 (방문 또는 전화 선택 시):</p>
              <div className="border-b border-gray-400 h-7 w-full"></div>
            </div>
          </div>
        </section>

        {/* 서명 */}
        <section className="mt-8 pt-4 border-t-2 border-gray-300">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[9pt] text-gray-600">작성일자:</p>
              <div className="border-b border-gray-400 w-[150px] h-7"></div>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[9pt] text-gray-600">보호자 서명:</p>
              <div className="border-b border-gray-400 w-[150px] h-7"></div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6 pt-3 border-t border-gray-300 text-[8.5pt] text-gray-600">
        <p>본 의견서는 「장애인 등에 대한 특수교육법」 제22조에 근거하여 작성되었습니다.</p>
        <p className="mt-1">문의: {teacher.teacherName} (☎ {teacher.teacherPhone})</p>
      </div>
    </div>
  );
}
