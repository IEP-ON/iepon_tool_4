import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { nanoid } from "nanoid";

export const runtime = "nodejs";

/** POST /api/iep — IEP 생성 (교사 제출) */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const teacherInput = body.teacherInput;

    if (!teacherInput || !teacherInput.schoolName || !teacherInput.teacherName) {
      return NextResponse.json(
        { error: "필수 항목이 누락되었습니다." },
        { status: 400 },
      );
    }

    const iepId = `iep_${nanoid(10)}`;

    // studentName 해시 생성 (서버 측 — crypto 모듈 사용)
    const { createHash } = await import("crypto");
    const studentNameHash = createHash("sha256")
      .update(teacherInput.studentName || "")
      .digest("hex");

    const { data, error } = await supabase
      .from("tool4_ieps")
      .insert({
        iep_id: iepId,
        status: "draft",
        school_name: teacherInput.schoolName,
        school_address: teacherInput.schoolAddress || "",
        principal_name: teacherInput.principalName || "",
        admin_teacher_name: teacherInput.adminTeacherName || "",
        school_year: teacherInput.year,
        semester: teacherInput.semester,
        grade: teacherInput.grade,
        class_num: teacherInput.classNum,
        teacher_name: teacherInput.teacherName,
        teacher_phone: teacherInput.teacherPhone,
        consult_time: teacherInput.consultTime || "",
        meeting_start_date: teacherInput.meetingStartDate || null,
        meeting_end_date: teacherInput.meetingEndDate || null,
        meeting_place: teacherInput.meetingPlace || "",
        submission_deadline: teacherInput.submissionDeadline || null,
        submission_day: teacherInput.submissionDay || "",
        student_name_hash: studentNameHash,
        teacher_data: teacherInput,
      })
      .select("id, iep_id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error.message);
      return NextResponse.json(
        { error: "IEP 생성에 실패했습니다." },
        { status: 500 },
      );
    }

    // 감사 로그
    await supabase.from("tool4_audit_logs").insert({
      iep_id: data.id,
      action: "create",
      actor: "teacher",
      ip_address: request.headers.get("x-forwarded-for") || "",
      user_agent: request.headers.get("user-agent") || "",
      details: { iep_id: iepId },
    });

    return NextResponse.json({ iepId: data.iep_id, id: data.id });
  } catch (err) {
    console.error("IEP create error:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
