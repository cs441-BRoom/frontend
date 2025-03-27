'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '@/app/component/navbar';
import GradientButton from '@/app/component/gradeint-button';

import { useRouter } from 'next/navigation';

import MyAssignmentCard from '@/app/component/my-assignment-card';
import OwnerWorkspaceSideBar from '@/app/component/owner-workspace-side-bar';
import { Image, XIcon } from 'lucide-react';
import Modal from '@/app/component/modal';

interface MyTaskPageProps {
  params: Promise<{ workspaceId: string }>;
}

export default function MyTaskPage({ params }: MyTaskPageProps) {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [tasktId, setTaskId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);

      if (selectedFiles.length + images.length > 3) {
        alert('You can only upload up to 3 images.');
        return;
      }

      const newPreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );

      setImages((prev) => [...prev, ...selectedFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  function closeModal() {
    setIsModalOpen(false);
  }

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);

      if (selectedFiles.length + files.length > 3) {
        alert('You can only upload up to 3 files.');
        return;
      }

      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const handleTaskClick = (tasktId: string) => {
    setTaskId(tasktId);
    router.push(`/my-workspace/${workspaceId}/my-task/${tasktId}`);
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
      <OwnerWorkspaceSideBar workspaceId={workspaceId} invite_code='abc123' />
      <div className='flex-1 bg-gray-50'>
        <Navbar />
        <div className='p-6'>
          <div className='flex flex-row justify-end'>
            <GradientButton
              text='New task'
              width='w-40'
              onClick={() => setIsModalOpen(true)}
            />
          </div>
          <div className='flex flex-row justify-end'></div>
          <div className='flex w-full flex-col items-center justify-center'>
            <hr className='my-4' />
            <div className='flex w-full flex-col items-center justify-center gap-6'>
              {assignments.map((assignment, index) => (
                <MyAssignmentCard
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

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className='flex w-full items-center justify-between text-gray-800'>
          <h2 className='flex-grow text-center text-2xl text-gray-800'>
            Create workspace
          </h2>
        </div>

        <div className='flex h-full w-full flex-col gap-4'>
          <hr className='my-4' />
          <div className='mb-3 flex items-center'>
            <div className='mr-3 h-10 w-10 rounded-full bg-gray-300'></div>
            <div className='flex-grow'>
              <div className='text-lg font-medium text-gray-800'>Username</div>
              <div className='text-1xl text-gray-500'>Mar 27, 2025</div>
            </div>
          </div>
          <hr />
          <textarea
            placeholder='Title'
            className='mb-4 h-14 w-full resize-none p-2 text-gray-800'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder='Description ...'
            className='mb-4 h-32 w-full resize-none p-2 text-gray-800'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className='mt-4 grid grid-cols-3 gap-2'>
            {previews.map((preview, index) => (
              <div key={index} className='relative h-24 w-24'>
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className='h-full w-full rounded-lg object-cover'
                />
                <button
                  onClick={() => removeImage(index)}
                  className='absolute top-1 right-1 rounded-full p-1 text-xs text-white'
                >
                  <XIcon />
                </button>
              </div>
            ))}
          </div>

          <div className='flex cursor-pointer flex-row gap-2 text-gray-600'>
            <Image />
            <label htmlFor='file-upload' className='cursor-pointer'>
              Upload your image
            </label>
            <input
              id='file-upload'
              type='file'
              className='hidden'
              onChange={handleFileChange}
            />

            <p className='text-gray-800'>{images.length}/3</p>
          </div>
          <GradientButton text='Done' onClick={handleUpload} />
        </div>
      </Modal>
    </div>
  );
}
