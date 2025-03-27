'use client';

import { useState, useEffect } from 'react';
import Navbar from '../component/navbar';
import SidebarCustom from '../component/side-bar';
import WorkspaceCard from '../component/workspace-card';
import { useRouter } from 'next/navigation';
import GradientButton from '../component/gradeint-button';
import Modal from '../component/modal';
import TextField from '../component/text-field';
import { GetMyWorkspacesResponse, StoreRespond } from '@/types/responses/workspace';
import axiosInstance from '@/apis/axios';
import { StoreRequest } from '@/types/requests/workspace'; // เพิ่ม import type ของ GetMyWorkspacesResponse

export default function MyWorkspacePage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<GetMyWorkspacesResponse['workspaces'] | undefined>(undefined); // ใช้ type ของ response
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');


  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // ฟังก์ชันเพื่อดึงข้อมูล workspaces
  const fetchMyWorkspaces = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await axiosInstance.get<GetMyWorkspacesResponse>('/workspaces/my', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWorkspaces(response.data.workspaces); // เก็บข้อมูล workspaces
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    } finally {
      setLoading(false); // เมื่อโหลดเสร็จแล้ว
    }
  };

  // ฟังก์ชันที่จะถูกเรียกเมื่อ component ถูก mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchMyWorkspaces(); // เรียกใช้งานฟังก์ชันดึงข้อมูล
  }, [router]);

  const handleCreateWorkspace = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    if (!title.trim()) {
      alert('Workspace name is required');
      return;
    }

    const requestData: StoreRequest = {
      name: title,
      description: description,
    };

    try {
      const response = await axiosInstance.post<StoreRespond>('/workspaces', requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { workspace } = response.data;

      // อัปเดตรายการ workspaces ด้วย workspace ใหม่
      setWorkspaces(prevWorkspaces => {
        if (!prevWorkspaces) return [workspace];
        return [...prevWorkspaces, workspace];
      });

      // รีเซ็ตฟอร์มและปิด Modal
      setTitle('');
      setDescription('');
      closeModal();

    } catch (error) {
      console.error('Error creating workspace:', error);
      alert('Failed to create workspace');
    }
  };

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  function closeModal() {
    setIsModalOpen(false);
  }

  const handleWorkspaceClick = (workspaceId: number) => {
    router.push(`/my-workspace/${workspaceId}/news-feed`);
  };

  return (
    <div className="flex h-screen">
      <SidebarCustom />

      <div className="flex-1 bg-gray-50">
        <Navbar />
        <div className="m-4 flex flex-row justify-end gap-4">
          <GradientButton
            text="New workspace"
            width="w-40"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
        <hr className="my-4" />
        <div className="p-6">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {workspaces?.map((workspace, index) => (
                <WorkspaceCard
                  key={index}
                  id={workspace.workspace_id.toString()}
                  title={workspace.name}
                  date={formatDate(workspace.created_at)}
                  description={workspace.description}
                  numberOfPeople={parseInt(workspace.members_count, 10)} // เนื่องจาก members_count เป็น string ให้แปลงเป็น number
                  onClick={() => handleWorkspaceClick(workspace.workspace_id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex w-full items-center justify-between text-gray-800">
          <h2 className="flex-grow text-center text-2xl text-gray-800">
            Create workspace
          </h2>
        </div>
        <div className="flex h-full w-full flex-col gap-4">
          <hr className="my-4" />
          <TextField placeholder="Title" onChange={handleTitle}></TextField>
          <TextField
            placeholder="Description"
            onChange={handleDescription}
          ></TextField>
          <GradientButton
            text="Done"
            onClick={handleCreateWorkspace}
          ></GradientButton>
        </div>
      </Modal>
    </div>
  );
}