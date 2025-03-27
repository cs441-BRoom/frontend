import React from 'react';
import { format, parseISO, isAfter } from 'date-fns';

interface AssignmentSubmissionCardProps {
  id: string;
  username: string;
  dueDate: string;
  assignmentId: string;
  workspaceId: string;
  submissionDate?: string;
  onClick: (title: string) => void;
}

export default function AssignmentSubmissionCard({
  id,
  dueDate,
  username,
  workspaceId,
  submissionDate,
  assignmentId,
  onClick,
}: AssignmentSubmissionCardProps) {
  const determineStatus = () => {
    const now = new Date();
    const parsedDueDate = parseISO(dueDate);

    if (submissionDate) {
      if (!isAfter(parseISO(submissionDate), parsedDueDate)) {
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
    <div
      className='w-[60%] rounded-lg border bg-white p-4 shadow-md'
      onClick={() => onClick(id)}
    >
      <div className='mb-3 flex items-center justify-between'>
        <div className='flex items-center'>
          <div className='mr-3 h-10 w-10 rounded-full bg-gray-300'></div>
          <div className='flex flex-col'>
            <div className='text-lg font-medium text-gray-800'>{username}</div>
            <div className='text-sm text-gray-500'></div>
          </div>
        </div>
        <div className='h-full items-end justify-end'>
          <div className={`mt-2 text-xl font-medium ${status.color}`}>
            {status.text}
          </div>
          <p className='text-gray-800'>
            Due: {format(parseISO(dueDate), 'MMM dd, yyyy HH:mm')}
          </p>
        </div>
      </div>
    </div>
  );
}
