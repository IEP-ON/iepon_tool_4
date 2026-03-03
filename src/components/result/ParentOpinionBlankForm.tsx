import type { TeacherInput } from "@/lib/types";

interface Props {
  teacher: TeacherInput;
}

export function ParentOpinionBlankForm({ teacher }: Props) {
  return (
    <>
    <div className="mx-auto w-[210mm] min-h-[297mm] p-[12mm] bg-white print:p-[10mm] print:m-0 print:w-full print:shadow-none text-[10pt] leading-tight flex flex-col print:break-after-page">
      <div className="text-center mb-4 border-b-2 border-black pb-2">
        <h1 className="text-[15pt] font-bold tracking-tight">
          개별화교육지원팀 협의회 학부모 의견서
        </h1>
        <div className="text-right text-gray-600 mt-1 text-[9pt]">
          <p>{teacher.schoolName}</p>
        </div>
      </div>

      {/* --- 1페이지 --- */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-8 text-[10pt]">
          {/* 기본 정보 */}
          <section className="print:break-inside-avoid">
            <h2 className="text-[12pt] font-bold mb-4 flex items-center text-gray-900 border-b-2 border-gray-800 pb-2">
              1. 기본 정보
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-6">
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-medium min-w-[90px]">학생 성명:</span>
                <div className="flex-1 border-b border-gray-400 h-8"></div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-medium min-w-[90px]">생년월일:</span>
                <div className="flex-1 border-b border-gray-400 h-8"></div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-medium min-w-[90px]">학년/반:</span>
                <div className="flex-1 border-b border-gray-400 h-8"></div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-medium min-w-[90px]">보호자 성명:</span>
                <div className="flex-1 border-b border-gray-400 h-8"></div>
              </div>
              <div className="flex items-center gap-3 col-span-2">
                <span className="text-gray-700 font-medium min-w-[90px]">연락처:</span>
                <div className="flex-1 border-b border-gray-400 h-8"></div>
              </div>
            </div>
          </section>

          {/* 건강 및 의료 */}
          <section className="print:break-inside-avoid">
            <h2 className="text-[12pt] font-bold mb-4 flex items-center text-gray-900 border-b-2 border-gray-800 pb-2">
              2. 건강 및 의료 정보
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-gray-700 font-medium mb-2">복용 약물:</p>
                <div className="border border-gray-300 rounded-lg p-3 min-h-[120px]"></div>
              </div>
              <div>
                <p className="text-gray-700 font-medium mb-2">알레르기:</p>
                <div className="border border-gray-300 rounded-lg p-3 min-h-[100px]"></div>
              </div>
              <div>
                <p className="text-gray-700 font-medium mb-2">특이사항 (기타 건강 관련):</p>
                <div className="border border-gray-300 rounded-lg p-3 min-h-[150px]"></div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 pt-3 border-t border-gray-300 text-[8.5pt] text-gray-600 text-center">
          <p>- 1 / 2 -</p>
        </div>
      </div>
    </div>

    {/* --- 2페이지 --- */}
    <div className="mx-auto w-[210mm] min-h-[297mm] p-[12mm] bg-white print:p-[10mm] print:m-0 print:w-full print:shadow-none text-[10pt] leading-tight flex flex-col print:break-after-page">
      <div className="text-center mb-6 border-b-2 border-black pb-3 hidden print:block">
        <h1 className="text-[15pt] font-bold tracking-tight">
          개별화교육지원팀 협의회 학부모 의견서
        </h1>
        <div className="text-right text-gray-600 mt-1 text-[9pt]">
          <p>{teacher.schoolName}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-8 text-[10pt]">
          {/* 교육적 요구 */}
          <section className="print:break-inside-avoid">
            <h2 className="text-[12pt] font-bold mb-4 flex items-center text-gray-900 border-b-2 border-gray-800 pb-2">
              3. 교육적 요구 및 학부모 의견
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-gray-700 font-medium mb-2">학생의 강점 (좋아하고 잘하는 것):</p>
                <div className="border border-gray-300 rounded-lg p-3 min-h-[140px]"></div>
              </div>
              <div>
                <p className="text-gray-700 font-medium mb-2">개선이 필요한 영역 (도움이 필요한 부분):</p>
                <div className="border border-gray-300 rounded-lg p-3 min-h-[140px]"></div>
              </div>
              <div>
                <p className="text-gray-700 font-medium mb-2">협의회에서 논의하고 싶은 사항:</p>
                <div className="border border-gray-300 rounded-lg p-3 min-h-[160px]"></div>
              </div>
              <div>
                <p className="text-gray-700 font-medium mb-2">학교에 바라는 지원 (보조공학기기, 행동지원 등):</p>
                <div className="border border-gray-300 rounded-lg p-3 min-h-[140px]"></div>
              </div>
            </div>
          </section>

          {/* 협의회 참석 */}
          <section className="print:break-inside-avoid mt-8">
            <h2 className="text-[12pt] font-bold mb-4 flex items-center text-gray-900 border-b-2 border-gray-800 pb-2">
              4. 협의회 참석 방법 (택 1)
            </h2>
            <div className="space-y-4 ml-2">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <span className="w-6 h-6 border-2 border-gray-400 rounded flex-shrink-0"></span>
                  <span className="text-[11pt] text-gray-900 font-medium">① 학교 방문 (대면)</span>
                </label>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <span className="w-6 h-6 border-2 border-gray-400 rounded flex-shrink-0"></span>
                  <span className="text-[11pt] text-gray-900 font-medium">② 전화 상담 (유선)</span>
                </label>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <span className="w-6 h-6 border-2 border-gray-400 rounded flex-shrink-0"></span>
                  <span className="text-[11pt] text-gray-900 font-medium">③ 서면 참여 (본 의견서 제출로 갈음)</span>
                </label>
              </div>
              <div className="mt-6 ml-1 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-800 font-medium mb-2">※ 방문 또는 전화 상담 희망 일시 (①, ② 선택 시)</p>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">일시:</span>
                  <div className="border-b border-gray-400 h-7 flex-1"></div>
                </div>
              </div>
            </div>
          </section>

          {/* 서명 */}
          <section className="mt-12 pt-6 border-t-2 border-gray-800 print:break-inside-avoid">
            <div className="flex justify-between items-end mb-4">
              <div className="space-y-1">
                <p className="text-[10pt] text-gray-600 font-medium">작성일자:</p>
                <div className="border-b-2 border-gray-400 w-[180px] h-8"></div>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10pt] text-gray-600 font-medium">보호자 서명:</p>
                <div className="border-b-2 border-gray-400 w-[180px] h-8 flex items-end justify-end pb-1 pr-2 text-gray-400">
                  (서명/인)
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-300 text-[8.5pt] text-gray-600 flex justify-between items-center">
          <p>본 의견서는 「장애인 등에 대한 특수교육법」 제22조에 근거하여 작성되었습니다.</p>
          <p className="font-medium">문의: {teacher.teacherName} (☎ {teacher.teacherPhone})</p>
        </div>
      </div>
    </div>
    </>
  );
}
