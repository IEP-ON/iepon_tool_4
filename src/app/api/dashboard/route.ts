import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

/** GET /api/dashboard?phone=xxx&pinHash=xxx — 교사 전화번호+PIN 인증 후 IEP 목록 조회 */
export async function GET(request: NextRequest) {
  try {
    const phone = request.nextUrl.searchParams.get("phone");
    const pinHash = request.nextUrl.searchParams.get("pinHash");

    if (!phone || phone.length < 8) {
      return NextResponse.json(
        { error: "올바른 전화번호를 입력해 주세요." },
        { status: 400 },
      );
    }

    if (!pinHash || pinHash.length < 10) {
      return NextResponse.json(
        { error: "비밀번호를 입력해 주세요." },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("tool4_ieps")
      .select("id, iep_id, status, school_name, grade, class_num, teacher_name, teacher_data, encryption_key, created_at")
      .eq("teacher_phone", phone)
      .eq("teacher_pin_hash", pinHash)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Dashboard query error:", error.message);
      return NextResponse.json(
        { error: "조회에 실패했습니다." },
        { status: 500 },
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "해당 연락처로 생성된 문서가 없습니다." },
        { status: 404 },
      );
    }

    // 제출된 IEP들의 opinion 데이터 가져오기
    const ids = data.map((d) => d.id);
    const { data: opinions } = await supabase
      .from("tool4_parent_opinions")
      .select("iep_id, opinion_data_encrypted, encryption_iv")
      .in("iep_id", ids);

    const opinionMap = new Map();
    if (opinions) {
      opinions.forEach((op) => {
        opinionMap.set(op.iep_id, op);
      });
    }

    const ieps = (data || []).map((row) => {
      // row.id is the int8 id
      const op = opinionMap.get(row.id);
      
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

      const td = row.teacher_data as Record<string, string> | null;
      return {
        iepId: row.iep_id,
        status: row.status,
        schoolName: row.school_name,
        grade: row.grade,
        classNum: row.class_num,
        teacherName: row.teacher_name,
        maskedStudentName: maskedName,
        batchId: td?.batchId || "",
        createdAt: row.created_at,
        encryptionKey: (row as Record<string, unknown>).encryption_key || null,
        encryptedOpinion: op ? op.opinion_data_encrypted : null,
        encryptionIv: op ? op.encryption_iv : null,
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
