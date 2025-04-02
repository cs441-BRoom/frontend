'use client';

import {useRouter} from 'next/navigation';
import {useWorkspace} from "@/lib/context/WorkspaceContext"; // ดึงข้อมูลจาก WorkspaceContext

export default function WorkspaceSidebar() {
  const router = useRouter();
  const {selectedWorkspace} = useWorkspace(); // ใช้ selectedWorkspace จาก context

  const handleGoBack = () => {
    router.push('/workspace');
  };

  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <div className="w-64 border-r bg-white px-4 py-6">

        {selectedWorkspace && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Workspace: {selectedWorkspace.name}
            </h3>
            <p className="text-lg ont-semibold text-gray-800">Code: {selectedWorkspace.join_code}</p>
          </div>
        )}
        <h2 className="mb-6 text-xl font-semibold text-gray-800">Menu</h2>
        <nav>
          <button
            onClick={handleGoBack}
            className="mb-2 flex w-full items-center gap-3 rounded-lg p-3 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
          >
            Back
          </button>
          <ul>
            <li>
              <a
                href="#"
                className="mb-2 block text-gray-600 hover:bg-gray-100 p-3 rounded-lg transition-colors duration-200"
              >
                ข้อมูลสมาชิก
              </a>
            </li>
            <li>
              <a
                href="#"
                className="mb-2 block text-gray-600 hover:bg-gray-100 p-3 rounded-lg transition-colors duration-200"
              >
                การตั้งค่า
              </a>
            </li>
            <li>
              <a
                href="#"
                className="mb-2 block text-gray-600 hover:bg-gray-100 p-3 rounded-lg transition-colors duration-200"
              >
                อื่นๆ
              </a>
            </li>
          </ul>
        </nav>


      </div>

      <div className="flex-1">{/* Content here */}</div>
    </div>
  );
}
