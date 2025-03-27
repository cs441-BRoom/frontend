'use client';

import { useState } from 'react';
import Navbar from '../component/navbar';
import SidebarCustom from '../component/side-bar';
import WorkspaceCard from '../component/workspace-card';
import { useRouter } from 'next/navigation';
import GradientButton from '../component/gradeint-button';
import Modal from '../component/modal';
import TextField from '../component/text-field';

export default function HomePage() {
  const router = useRouter();
  const [isModalJoinOpen, setIsModalJoinOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(
    null
  );
  const [inviteCode, setInviteCode] = useState('');

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleJoinWorkspace = async () => {
    console.log(inviteCode);
    closeModal();
  };
  const handleInviteCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInviteCode(event.target.value);
  };

  function closeModal() {
    setIsModalJoinOpen(false);
  }

  const currentDate = Date.now();

  const handleWorkspaceClick = (title: string) => {
    setSelectedWorkspace(title);
    router.push(`/workspace/${title}/news-feed`);
    console.log(selectedWorkspace);
  };

  const workspaceData = [
    {
      id: 'aaa',
      title: 'Workspace1',
      date: formatDate(currentDate),
      description:
        'A workspace is a digital area where you can organize projects, tasks, and collaborate with your team.',
      numberOfPeople: 10,
    },
    {
      id: 'bbb',
      title: 'Workspace 2',
      date: 'Jan 20, 2025',
      description: 'A workspace where ideas come to life with your team.',
      numberOfPeople: 5,
    },
    {
      id: 'ccc',
      title: 'Workspace 3',
      date: 'Feb 18, 2025',
      description:
        'Collaborate and manage your projects seamlessly in this workspace.',
      numberOfPeople: 8,
    },
    {
      id: 'ddd',
      title: 'Workspace 4',
      date: 'Mar 10, 2025',
      description:
        'A digital space for managing team projects and collaborating.',
      numberOfPeople: 12,
    },
    {
      id: 'ddd',
      title: 'Workspace 5',
      date: 'Apr 22, 2025',
      description:
        'A dedicated workspace to organize tasks and communicate with your team.',
      numberOfPeople: 15,
    },
    {
      id: 'eee',
      title: 'Workspace 5',
      date: 'Apr 22, 2025',
      description:
        'A dedicated workspace to organize tasks and communicate with your team.',
      numberOfPeople: 15,
    },
  ];
  return (
    <div className='flex h-screen'>
      <SidebarCustom />

      <div className='flex-1 bg-gray-50'>
        <Navbar />
        <div className='m-4 flex flex-row justify-end gap-4'>
          <GradientButton
            text='Join workspace'
            width='w-40'
            onClick={() => setIsModalJoinOpen(true)}
          />
        </div>
        <hr className='my-4' />
        <div className='p-6'>
          <div className='grid grid-cols-3 gap-6'>
            {workspaceData.map((workspace, index) => (
              <WorkspaceCard
                key={index}
                id={workspace.id}
                title={workspace.title}
                date={workspace.date}
                description={workspace.description}
                numberOfPeople={workspace.numberOfPeople}
                onClick={handleWorkspaceClick}
              />
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalJoinOpen} onClose={closeModal}>
        <div className='flex w-full items-center justify-between text-gray-800'>
          <h2 className='flex-grow text-center text-2xl text-gray-800'>
            Join workspace
          </h2>
        </div>
        <div className='flex h-full w-full flex-col gap-4'>
          <hr className='my-4' />
          <TextField
            placeholder='Invite code'
            onChange={handleInviteCode}
          ></TextField>

          <GradientButton
            text='Join'
            onClick={handleJoinWorkspace}
          ></GradientButton>
        </div>
      </Modal>
    </div>
  );
}
