'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../component/navbar';
import SidebarCustom from '../component/side-bar';
import WorkspaceCard from '../component/workspace-card';
import GradientButton from '../component/gradeint-button';
import Modal from '../component/modal';
import TextField from '../component/text-field';
import { GetJoinedWorkspacesResponse } from '@/types/responses/workspace';
import axiosInstance from '@/apis/axios';

export default function JoinedWorkspace() {
  const router = useRouter();
  const [isModalJoinOpen, setIsModalJoinOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<number | null>(null);
  const [inviteCode, setInviteCode] = useState('');
  const [workspaces, setWorkspaces] = useState<GetJoinedWorkspacesResponse['workspaces'] | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleJoinWorkspace = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login'); // ถ้าไม่มี token ให้ไปหน้า login
      return;
    }

    try {
      // ใช้ axiosInstance แทนการใช้ axios
      const response = await axiosInstance.post(
        '/workspaces/join', // ส่งคำขอไปยัง API
        { join_code: inviteCode },
      );

      // ถ้าคำขอสำเร็จ
      if (response.status === 200) {
        // ปิด modal
        closeModal();

        // อัพเดต workspaces โดยการ fetch ใหม่
        fetchWorkspaces();
      } else {
        // ถ้ามีข้อผิดพลาด
        alert('Failed to join workspace');
      }
    } catch (error) {
      console.error('Error joining workspace:', error);
      alert('Error joining workspace');
    }
  };

  const handleInviteCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInviteCode(event.target.value);
  };

  const closeModal = () => {
    setIsModalJoinOpen(false);
  };

  const handleWorkspaceClick = (id: number) => {
    setSelectedWorkspace(id);
    router.push(`/workspace/${id}/news-feed`);
  };

  const fetchWorkspaces = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await axiosInstance.get<GetJoinedWorkspacesResponse>('/workspaces/joined', {
        headers: {
          Authorization: `Bearer ${token}`, // ใช้ token ที่เก็บไว้
        },
      });
      setWorkspaces(response.data.workspaces);
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch joined workspaces on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchWorkspaces();
  }, [router]);

  return (
    <div className="flex h-screen">
      <SidebarCustom />

      <div className="flex-1 bg-gray-50">
        <Navbar />
        <div className="m-4 flex flex-row justify-end gap-4">
          <GradientButton
            text="Join workspace"
            width="w-40"
            onClick={() => setIsModalJoinOpen(true)}
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
                  numberOfPeople={workspace.members_count}
                  onClick={handleWorkspaceClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalJoinOpen} onClose={closeModal}>
        <div className="flex w-full items-center justify-between text-gray-800">
          <h2 className="flex-grow text-center text-2xl text-gray-800">
            Join workspace
          </h2>
        </div>
        <div className="flex h-full w-full flex-col gap-4">
          <hr className="my-4" />
          <TextField
            placeholder="Invite code"
            value={inviteCode}
            onChange={handleInviteCode}
          />

          <GradientButton
            text="Join"
            onClick={handleJoinWorkspace}
          />
        </div>
      </Modal>
    </div>
  );
}
