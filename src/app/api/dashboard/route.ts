import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

/** GET /api/dashboard?phone=xxx — 교사 전화번호로 IEP 목록 조회 */
export async function GET(request: NextRequest) {
  try {
    const phone = request.nextUrl.searchParams.get("phone");

    if (!phone || phone.length < 8) {
      return NextResponse.json(
        { error: "올바른 전화번호를 입력해 주세요." },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("tool4_ieps")
      .select("iep_id, status, school_name, grade, class_num, teacher_name, teacher_data, created_at")
      .eq("teacher_phone", phone)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Dashboard query error:", error.message);
      return NextResponse.json(
        { error: "조회에 실패했습니다." },
        { status: 500 },
      );
    }

    const ieps = (data || []).map((row) => {
      const studentName = (row.teacher_data as Record<string, string>)?.studentName || "";
      let maskedName = "";
      if (studentName.length === 0) {
        maskedName = "(이름 없음)";
      } else if (studentName.length === 1) {
        maskedName = studentName + "*";
      } else if (studentName.length === 2) {
        maskedName = studentName[0] + "*";
      } else {
        maskedName = studentName[0] + "*".repeat(studentName.length - 2) + studentName[studentName.length - 1];
      }

      return {
        iepId: row.iep_id,
        status: row.status,
        schoolName: row.school_name,
        grade: row.grade,
        classNum: row.class_num,
        teacherName: row.teacher_name,
        maskedStudentName: maskedName,
        createdAt: row.created_at,
      };
    });

    return NextResponse.json({ ieps });
  } catch (err) {
    console.error("Dashboard error:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
