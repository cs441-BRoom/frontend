// app/workspace/[workspace_id]/page.tsx
'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function AssignmentsPage() {
  const router = useRouter();

  // useEffect(() => {
  //   if (!selectedWorkspace) {
  //     router.push("/workspace"); // ถ้าไม่ได้เลือก workspace ให้ไปที่หน้า workspace
  //   }
  // }, [selectedWorkspace, router]);
  //
  // if (!selectedWorkspace) {
  //   return (
  //     <div className="min-h-screen flex justify-center items-center bg-white">
  //       <div className="animate-spin rounded-full border-4 border-t-4 border-emerald-600 w-16 h-16"></div>
  //     </div>
  //   );
  // }

  return (
    <div>
      assignment
    </div>
  );
}
