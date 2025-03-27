'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '@/app/component/navbar';
import WorkspaceSideBar from '@/app/component/workspace-side-bar';
import { FileText, Image } from 'lucide-react';
import { isAfter, parseISO } from 'date-fns';
import OwnerWorkspaceSideBar from '@/app/component/owner-workspace-side-bar';
import GradientButton from '@/app/component/gradeint-button';
import AssignmentSubmissionCard from '@/app/component/assignment-submission-card';
import { useRouter } from 'next/navigation';

interface MyTaskDetailPageProps {
  params: Promise<{ workspaceId: string; taskId: string }>;
}

export default function MyTaskDetailPage({ params }: MyTaskDetailPageProps) {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [submissionId, setsubmissionId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await params;
      setTaskId(resolvedParams.taskId);
      setWorkspaceId(resolvedParams.workspaceId);
    };

    fetchData();
  }, [params]);

  const handleTaskClick = (submissionId: string) => {
    setsubmissionId(submissionId);
    router.push(
      `/my-workspace/${workspaceId}/my-task/${taskId}/${submissionId}`
    );
    console.log(taskId);
  };

  const assignments = [
    {
      id: '1',
      dueDate: '2025-04-01T12:00:00Z',
      username: 'JohnDoe',
      workspaceId: 'W001',
      submissionDate: '2025-03-30T10:00:00Z',
      assignmentId: 'A001',
    },
    {
      id: '2',
      dueDate: '2025-04-05T18:00:00Z',
      username: 'JaneSmith',
      workspaceId: 'W002',
      submissionDate: null, // ยังไม่ได้ส่ง
      assignmentId: 'A002',
    },
    {
      id: '3',
      dueDate: '2025-04-03T15:00:00Z',
      username: 'AliceBrown',
      workspaceId: 'W003',
      submissionDate: '2025-04-02T20:00:00Z',
      assignmentId: 'A003',
    },
    {
      id: '4',
      dueDate: '2025-04-07T09:00:00Z',
      username: 'BobWilson',
      workspaceId: 'W004',
      submissionDate: null, // ยังไม่ได้ส่ง
      assignmentId: 'A004',
    },
  ];

  return (
    <div className='flex h-screen'>
      <OwnerWorkspaceSideBar workspaceId={workspaceId} invite_code='abc123' />
      <div className='flex-1 bg-gray-50'>
        <Navbar />
        <div className='p-6'>
          <div className='flex flex-row justify-end'></div>
          <div className='flex w-full flex-col items-center justify-center'>
            <hr className='my-4' />
            <div className='flex w-full flex-col items-center justify-center gap-6'>
              {assignments.map((assignment, index) => (
                <AssignmentSubmissionCard
                  key={index}
                  id={assignment.id}
                  username={assignment.username}
                  dueDate={assignment.dueDate}
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
