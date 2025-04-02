'use client'

import {useSearchParams} from "next/navigation";
import {useState, useEffect} from "react";
import WorkspaceCard from "@/components/WorkspaceCard";
import {Workspace} from "@/types/workspace";
import {fetchJoinWorkspaces, fetchMyWorkspaces, createWorkspace, joinWorkspace} from "@/lib/apis/api"; // เพิ่มฟังก์ชัน joinWorkspace
import {useRouter} from "next/navigation";
import Modal from "@/components/modal";
import GradientButton from "@/components/gradeint-button";
import { useWorkspace } from '@/lib/context/WorkspaceContext';

export default function WorkspacePage() {
  const searchParams = useSearchParams();
  const showOwned = searchParams.get("owner") === "true"; // ถ้า true แสดง workspace ที่เราสร้าง

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State สำหรับเปิด Modal
  const [isModalJoinOpen, setIsModalJoinOpen] = useState(false); // State สำหรับเปิด Modal join
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [joinCode, setJoinCode] = useState(''); // State สำหรับเก็บ join_code
  const [joinError, setJoinError] = useState(''); // State สำหรับเก็บข้อความ error เมื่อ join ล้มเหลว
  const {setSelectedWorkspace} = useWorkspace(); // ดึงฟังก์ชันจาก context
  const router = useRouter();

  useEffect(() => {
    const loadWorkspaces = async () => {
      try {
        setLoading(true);
        let workspacesData: Workspace[] = [];

        if (showOwned) {
          workspacesData = await fetchMyWorkspaces(); // fetch workspaces ที่ผู้ใช้สร้าง
        } else {
          workspacesData = await fetchJoinWorkspaces(); // fetch workspaces ที่ผู้ใช้เข้าร่วม
        }

        setWorkspaces(workspacesData);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkspaces();
  }, [showOwned]);

  const handleCardClick = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    router.push(`/workspace/${workspace.workspace_id}/newsfeed`);
  };

  const handleCreateWorkspace = async () => {
    if (!title.trim() || !description.trim()) {
      alert('Both title and description are required');
      return;
    }

    try {
      const createdWorkspace = await createWorkspace({name: title, description});

      if (showOwned) {
        setWorkspaces(prevWorkspaces => [...prevWorkspaces, createdWorkspace]);
      } else {
        router.replace("/workspace?owner=true");
      }

      setTitle('');
      setDescription('');
      closeModal();
    } catch (error) {
      console.error("Error creating workspace:", error);
      alert('Failed to create workspace');
    }
  };

  const handleJoinWorkspace = async () => {
    if (!joinCode.trim()) {
      setJoinError('Please enter a valid join code');
      return;
    }

    try {
      const joinedWorkspace = await joinWorkspace({join_code: joinCode}); // เรียกฟังก์ชัน joinWorkspace

      if (!showOwned) {
        setWorkspaces(prevWorkspaces => [...prevWorkspaces, joinedWorkspace]); // เพิ่ม workspace ที่เข้าร่วม
      } else {
        router.replace("/workspace?owner=false");
      }
      setJoinCode(''); // รีเซ็ตค่า join code
      setJoinError(''); // รีเซ็ตข้อความ error
      closeJoinModal(); // ปิด Modal
    } catch (error) {
      setJoinError('Failed to join workspace. Please check your join code.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeJoinModal = () => {
    setIsModalJoinOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full border-4 border-t-4 border-emerald-600 w-16 h-16"></div>
      </div>
    );
  }

  return (
    <div className="bg-white h-screen w-full p-8 flex flex-col">
      <div className="flex gap-4 justify-end">
        <GradientButton
          text="Create Workspace"
          width="w-40"
          onClick={() => setIsModalOpen(true)} // เมื่อคลิกจะเปิด Modal
        />

        <GradientButton
          text="Join workspace"
          width="w-40"
          onClick={() => setIsModalJoinOpen(true)} // เมื่อคลิกจะเปิด Modal สำหรับ join
        />
      </div>

      <h1 className="text-2xl font-bold my-4 text-black">
        {showOwned ? "My Workspaces" : "Joined Workspaces"}
      </h1>

      <div className="grid grid-cols-3 gap-8 overflow-auto py-6">
        {workspaces.length > 0 ? (
          workspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace.workspace_id}
              workspace_id={workspace.workspace_id}
              name={workspace.name}
              description={workspace.description}
              members_count={workspace.members_count}
              created_by={workspace.created_by}
              onClick={() => handleCardClick(workspace)}
            />
          ))
        ) : (
          <p className="text-gray-500">No workspace at {showOwned ? "You created" : "You joined"} 😢</p>
        )}
      </div>

      {/* Modal สำหรับกรอกข้อมูลการสร้าง workspace */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex w-full items-center justify-between text-gray-800">
          <h2 className="flex-grow text-center text-2xl text-gray-800">Create Workspace</h2>
        </div>
        <div className="flex h-full w-full flex-col gap-4 text-black">
          <input
            type="text"
            className="p-2 border"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            className="p-2 border"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <GradientButton
            text="Create"
            onClick={handleCreateWorkspace}
          />
        </div>
      </Modal>

      {/* Modal สำหรับกรอกข้อมูลการเข้าร่วม workspace */}
      <Modal isOpen={isModalJoinOpen} onClose={closeJoinModal}>
        <div className="flex w-full items-center justify-between text-gray-800">
          <h2 className="flex-grow text-center text-2xl text-gray-800">Join Workspace</h2>
        </div>
        <div className="flex h-full w-full flex-col gap-4 text-black">
          <input
            type="text"
            className="p-2 border"
            placeholder="Enter Join Code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
          />
          {joinError && <p className="text-red-500 text-center">{joinError}</p>} {/* แสดงข้อความ error */}
          <GradientButton
            text="Join"
            onClick={handleJoinWorkspace}
          />
        </div>
      </Modal>
    </div>
  );
}
