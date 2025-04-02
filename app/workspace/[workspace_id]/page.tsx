// app/workspace/[workspace_id]/page.tsx
'use client'

import { useWorkspace } from "@/lib/context/WorkspaceContext"; // ใช้ context
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WorkspaceDetailPage() {
  const { selectedWorkspace } = useWorkspace(); // ดึง workspace ที่เลือกจาก context
  const router = useRouter();

  useEffect(() => {
    if (!selectedWorkspace) {
      router.push("/workspace"); // ถ้าไม่ได้เลือก workspace ให้ไปที่หน้า workspace
    }
  }, [selectedWorkspace, router]);

  if (!selectedWorkspace) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <div className="animate-spin rounded-full border-4 border-t-4 border-emerald-600 w-16 h-16"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 text-black h-screen w-full">
      <h1 className="text-3xl font-bold">{selectedWorkspace.name}</h1>
      <p className="text-lg mt-4">{selectedWorkspace.description}</p>

      <h2 className="text-xl mt-6">สมาชิกใน Workspace</h2>


      <h2 className="text-xl mt-6">ข้อมูลเพิ่มเติม</h2>
      <p className="mt-4">รหัสเข้าร่วม: {selectedWorkspace.join_code}</p>
      <p className="mt-2">สร้างโดย: {selectedWorkspace.created_by}</p>
    </div>
  );
}
