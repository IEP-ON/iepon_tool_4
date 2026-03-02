import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { nanoid } from "nanoid";

export const runtime = "nodejs";

/** POST /api/iep — IEP 생성 (교사 제출) */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const teacherInput = body.teacherInput;
    const teacherPinHash: string | undefined = body.teacherPinHash;

    if (!teacherInput || !teacherInput.schoolName || !teacherInput.teacherName || !teacherInput.studentCount) {
      return NextResponse.json(
        { error: "필수 항목이 누락되었습니다." },
        { status: 400 },
      );
    }

    const count = parseInt(teacherInput.studentCount, 10);
    if (isNaN(count) || count < 1 || count > 100) {
      return NextResponse.json(
        { error: "학생 수는 1에서 100 사이여야 합니다." },
        { status: 400 },
      );
    }

    const batchId = `batch_${nanoid(10)}`;
    const inserts = [];

    for (let i = 0; i < count; i++) {
      const iepId = `iep_${nanoid(10)}`;
      inserts.push({
        iep_id: iepId,
        status: "draft",
        school_name: teacherInput.schoolName,
        school_address: teacherInput.schoolAddress || "",
        principal_name: teacherInput.principalName || "",
        admin_teacher_name: teacherInput.adminTeacherName || "",
        school_year: teacherInput.year,
        semester: teacherInput.semester,
        grade: "", // 학부모가 입력
        class_num: "", // 학부모가 입력
        teacher_name: teacherInput.teacherName,
        teacher_phone: teacherInput.teacherPhone,
        consult_time: teacherInput.consultTime || "",
        meeting_start_date: teacherInput.meetingStartDate || null,
        meeting_end_date: teacherInput.meetingEndDate || null,
        meeting_place: teacherInput.meetingPlace || "",
        submission_deadline: teacherInput.submissionDeadline || null,
        submission_day: teacherInput.submissionDay || "",
        student_name_hash: "pending",
        teacher_pin_hash: teacherPinHash || null,
        teacher_data: { ...teacherInput, batchId },
      });
    }

    const { data, error } = await supabase
      .from("tool4_ieps")
      .insert(inserts)
      .select("id, iep_id");

    if (error) {
      console.error("Supabase insert error:", error.message);
      return NextResponse.json(
        { error: "IEP 생성에 실패했습니다." },
        { status: 500 },
      );
    }

    // 감사 로그 (배치 생성)
    const logInserts = data.map((d) => ({
      iep_id: d.id,
      action: "create",
      actor: "teacher",
      ip_address: request.headers.get("x-forwarded-for") || "",
      user_agent: request.headers.get("user-agent") || "",
      details: { iep_id: d.iep_id, batch_id: batchId },
    }));

    await supabase.from("tool4_audit_logs").insert(logInserts);

    return NextResponse.json({ batchId, count: data.length });
  } catch (err) {
    console.error("IEP create error:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
