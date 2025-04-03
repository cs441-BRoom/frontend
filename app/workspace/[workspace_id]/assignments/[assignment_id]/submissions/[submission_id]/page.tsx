'use client';
import React, { use, useEffect, useState } from 'react';
import { FileText, X } from 'lucide-react';
import { isAfter, parseISO, sub } from 'date-fns';
import { useAuth } from '@/lib/context/AuthContext';
import {
  getAssignmentById,
  getSubmissionById,
  updateScore,
} from '@/lib/apis/api';
import { Assignment } from '@/types/assignment';
import { Submission } from '@/types/submission';
import { useRouter } from 'next/navigation';

interface ImageFile {
  file: File;
  preview: string;
}

interface AssignmentImage {
  name: string;
  base64: string;
  mime_type: string;
}

interface AssignmentsubmissionDetailPageProps {
  params: Promise<{
    workspace_id: number;
    assignment_id: number;
    submission_id: number;
  }>;
}

export default function AssignmentsubmissionDetailPage({
  params,
}: AssignmentsubmissionDetailPageProps) {
  const unwrappedParams = use(params);
  const { user } = useAuth();
  const workspaceId = Number(unwrappedParams.workspace_id);
  const assignmentId = Number(unwrappedParams.assignment_id);
  const submission_id = Number(unwrappedParams.submission_id);
  const [submittedImages, setSubmittedImages] = useState<ImageFile[]>([]);
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [assignmentImages, setAssignmentImages] = useState<AssignmentImage[]>(
    []
  );

  const [score, setScore] = useState<number>();
  const [assignment, setAssignment] = useState<Assignment>();
  const [submission, setSubmissions] = useState<Submission>();

  const router = useRouter();

  const handleScore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setScore(Number(event.target.value));

    await updateScore({
      submission_id: submission_id,
      score: score || 0,
    });

    router.push(`/workspace/${workspaceId}/assignments/${assignmentId}`);
  };

  const scoreHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScore(Number(e.target.value));
  };

  const [selectedAssignment, setSelectedAssignment] =
    useState<AssignmentImage | null>(null);

  const openAssignmentImage = (assignment: AssignmentImage) => {
    setSelectedAssignment(assignment);
  };

  const closeAssignmentView = () => {
    setSelectedAssignment(null);
  };

  useEffect(() => {
    const loadAssignment = async () => {
      try {
        const assignment = await getAssignmentById(assignmentId);
        setAssignment(assignment);
        setAssignmentImages(assignment.files);

        const submission = await getSubmissionById(submission_id);
        setSubmissions(submission);

        console.log(assignment);
      } catch (error) {
        console.error('Error fetching assignment:', error);
      }
    };

    loadAssignment();
  }, [assignmentId]);

  if (!workspaceId) {
    return <div>Loading...</div>;
  }

  const determineStatus = () => {
    const now = new Date();
    const parsedDueDate = assignment?.due_date
      ? parseISO(assignment.due_date)
      : null;
    const parsedSubmissionDate = submission?.submit_at
      ? parseISO(submission.submit_at)
      : null;

    if (parsedDueDate === null) {
      return { text: 'No Due Date', color: 'text-gray-600' }; // กรณีที่ไม่มี due_date
    }

    if (parsedSubmissionDate) {
      if (!isAfter(parsedSubmissionDate, parsedDueDate)) {
        return { text: 'Submitted', color: 'text-green-600' };
      }
    }

    if (isAfter(now, parsedDueDate)) {
      return { text: 'Past Due', color: 'text-red-600' };
    }

    return { text: 'Pending', color: 'text-blue-600' };
  };

  const status = determineStatus();

  return (
    <div className='flex h-screen'>
      <div className='flex-1 bg-gray-50'>
        <div className='p-6'>
          <div className='p-4'>
            <div className='flex flex-row justify-between'>
              <div className='flex w-full flex-row justify-between'>
                <div className='flex flex-row'>
                  <div className='mr-3 h-13 w-13 rounded-full bg-gray-300'></div>
                  <div className='flex flex-col'>
                    <div className='text-lg font-medium text-gray-800'>
                      {submission?.user_full_name}
                    </div>
                    <div className='text-sm font-medium text-gray-800'>
                      {assignment?.title}
                    </div>
                  </div>
                </div>
                <div className='flex flex-row gap-3'>
                  <div className='flex flex-col justify-items-end'>
                    <p className='justify-end text-xl text-green-600'>
                      {status.text}
                    </p>
                    <p className='text-lg text-gray-600'>
                      Due: {assignment?.due_date}
                    </p>
                  </div>
                  <button
                    className={`h-12 w-32 rounded-md p-3 text-lg text-white ${
                      assignment?.score === 0 && status.text === 'Submitted'
                        ? 'cursor-pointer bg-green-500'
                        : 'cursor-not-allowed bg-gray-300'
                    }`}
                    disabled={assignment?.score !== 0}
                    onClick={submission?.score === 0 ? handleScore : undefined} // ใช้ handleScore ถ้า score เป็น null
                  >
                    {assignment?.score === 0 ? 'Submit' : 'Done'}{' '}
                    {/* ถ้า score เป็น null แสดง "Submit", ถ้ามีคะแนนแสดง "Done" */}
                  </button>
                </div>
              </div>
            </div>
            <hr className='my-4' />
            <div className='flex flex-row'>
              <div className='w-full'>
                <p className='text-gray-800'>{assignment?.description}</p>
              </div>
              <div>
                <div className='text-jg w-40 text-gray-700'>
                  <div>
                    {submission?.score === 0 && status.text === 'Submitted' ? (
                      <div>
                        <input
                          type='text'
                          value={score}
                          onChange={scoreHandle}
                          className='mt-2 w-full rounded-md border p-2'
                          placeholder='Score'
                        />
                      </div>
                    ) : (
                      <span></span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-row gap-2'>
              {assignmentImages.map((assignment, index) => (
                <div
                  key={assignment.name}
                  onClick={() => openAssignmentImage(assignment)}
                  className='cursor-pointer overflow-hidden rounded-lg border transition-shadow hover:shadow-lg'
                >
                  <div className='relative'>
                    <img
                      src={`data:${assignment.mime_type};base64,${assignment.base64}`}
                      alt={`Image ${index + 1}`}
                      className='h-32 w-48 object-cover'
                    />
                    <div className='bg-opacity-50 absolute right-0 bottom-0 left-0 flex items-center bg-black p-2 text-white'>
                      <FileText className='mr-2' size={16} />
                      {assignment.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <hr className='my-4' />
          </div>
        </div>

        {/* Show submit image */}
        {status.text === 'Submitted' && (
          <div className='mt-4 grid grid-cols-3 gap-4'>
            {submission?.files && submission?.files.length > 0 && (
              <div>
                {submission.files.map((file, index) => (
                  <div key={index} className='group relative'>
                    <img
                      src={`data:${file.mime_type};base64,${file.base64}`}
                      alt={`Image ${index + 1}`}
                      className='h-100 w-full rounded-lg object-cover'
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* If status is Past-due, show nothing */}
        {status.text === 'Past-due' && (
          <div className='text-center text-gray-500'>No file available.</div>
        )}
      </div>

      {selectedAssignment && (
        <div className='bg-opacity-80 fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
          <div className='relative max-h-full max-w-4xl'>
            <button
              onClick={closeAssignmentView}
              className='absolute -top-10 right-0 rounded-full p-2 text-white hover:bg-red-500'
            >
              <X size={24} />
            </button>
            <img
              src={`data:${selectedAssignment.mime_type};base64,${selectedAssignment.base64}`}
              alt={`Image ${selectedAssignment.name + 1}`}
              className='max-h-screen max-w-full object-contain'
            />
          </div>
        </div>
      )}
    </div>
  );
}
