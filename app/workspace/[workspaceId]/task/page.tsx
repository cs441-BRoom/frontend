'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '@/app/component/navbar';
import WorkspaceSideBar from '@/app/component/workspace-side-bar';

import { useRouter } from 'next/navigation';

import AssignmentCard from '@/app/component/assignment-card';

interface TaskPageProps {
  params: Promise<{ workspaceId: string }>;
}

export default function TaskPage({ params }: TaskPageProps) {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [tasktId, setTaskId] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await params;
      setWorkspaceId(resolvedParams.workspaceId);
      console.log('workspace ' + workspaceId);
    };

    fetchData();
  }, [params]);

  if (!workspaceId) {
    return <div>Loading...</div>;
  }

  const handleTaskClick = (tasktId: string) => {
    setTaskId(tasktId);
    router.push(`/workspace/${workspaceId}/task/${tasktId}`);
    console.log(tasktId);
  };

  const assignments = [
    {
      id: '1',
      title: 'Math Homework',
      dueDate: '2025-04-01T12:00:00Z',
      description: 'Complete exercises 1 to 10 from chapter 5.',
      owner: 'Mr. Smith',
      assignmentId: 'A001',
      workspaceId: 'W001',
      submissionDate: '2025-03-30T10:00:00Z',
      score: '90',
    },
    {
      id: '2',
      title: 'Science Project',
      dueDate: '2025-04-05T18:00:00Z',
      description: 'Build a model of the solar system.',
      owner: 'Mrs. Johnson',
      assignmentId: 'A002',
      workspaceId: 'W002',
      submissionDate: null,
      score: null,
    },
    {
      id: '3',
      title: 'English Essay',
      dueDate: '2025-04-03T15:00:00Z',
      description: 'Write a 1000-word essay on Shakespeare.',
      owner: 'Mr. Brown',
      assignmentId: 'A003',
      workspaceId: 'W003',
      submissionDate: '2025-04-02T20:00:00Z',
      score: '85',
    },
    {
      id: '4',
      title: 'History Presentation',
      dueDate: '2025-04-07T09:00:00Z',
      description: 'Prepare a slideshow about World War II.',
      owner: 'Ms. Wilson',
      assignmentId: 'A004',
      workspaceId: 'W004',
      submissionDate: null,
      score: null,
    },
  ];
  return (
    <div className='flex h-screen'>
      <WorkspaceSideBar id={workspaceId} />
      <div className='flex-1 bg-gray-50'>
        <Navbar />
        <div className='p-6'>
          <div className='flex flex-row justify-end'></div>
          <div className='flex w-full flex-col items-center justify-center'>
            <hr className='my-4' />
            <div className='flex w-full flex-col items-center justify-center gap-6'>
              {assignments.map((assignment, index) => (
                <AssignmentCard
                  key={index}
                  id={assignment.id}
                  title={assignment.title}
                  dueDate={assignment.dueDate}
                  description={assignment.description}
                  owner={assignment.owner}
                  workspaceId={assignment.workspaceId}
                  submissionDate={assignment.submissionDate}
                  onClick={handleTaskClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
