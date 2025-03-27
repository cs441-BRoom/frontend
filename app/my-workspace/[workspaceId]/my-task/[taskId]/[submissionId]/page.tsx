'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '@/app/component/navbar';
import WorkspaceSideBar from '@/app/component/workspace-side-bar';
import GradientButton from '@/app/component/gradeint-button';
import PostComponent from '@/app/component/post';
import { FileText, Heart, Image, X } from 'lucide-react';
import CommentCard from '@/app/component/comment-card';
import TextField from '@/app/component/text-field';
import { isAfter, parseISO } from 'date-fns';
import { format } from 'date-fns/fp';
import OwnerWorkspaceSideBar from '@/app/component/owner-workspace-side-bar';

interface ImageFile {
  file: File;
  preview: string;
}

interface AssignmentImage {
  id: number;
  name: string;
  preview: string;
}

interface AssignmentsubmissionDetailPageProps {
  params: Promise<{ workspaceId: string; taskId: string }>;
}

export default function AssignmentsubmissionDetailPage({
  params,
}: AssignmentsubmissionDetailPageProps) {
  const [taskId, setTask] = useState<string | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [assignmentImages, setAssignmentImages] = useState<AssignmentImage[]>([
    { id: 1, name: 'Assignment-1', preview: '/api/placeholder/300/200' },
    { id: 2, name: 'Assignment-2', preview: '/api/placeholder/300/200' },
  ]);

  const [score, setScore] = useState('');

  const handleScore = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScore(event.target.value);
  };

  const [selectedAssignment, setSelectedAssignment] =
    useState<AssignmentImage | null>(null);

  const removeImage = (indexToRemove: number) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const openAssignmentImage = (assignment: AssignmentImage) => {
    setSelectedAssignment(assignment);
  };

  const closeAssignmentView = () => {
    setSelectedAssignment(null);
  };

  const handleSubmit = () => {
    if (selectedImages.length === 0) {
      alert('Please select images to submit');
      return;
    }

    assignment.submissionDate = Date.now.toString();

    // Add new images to submitted images
    setSubmittedImages((prev) => [...prev, ...selectedImages]);

    // Optional: You might want to send these files to a server
    selectedImages.forEach((imageFile) => {
      // Example of how you might upload each file
      const formData = new FormData();
      formData.append('file', imageFile.file);

      // Simulated upload (replace with actual upload logic)
      console.log('Submitting file:', imageFile.file.name);

      // If you had an actual upload endpoint:
      // fetch('/upload', {
      //   method: 'POST',
      //   body: formData
      // });
    });

    // Clear selected images after submission
    setSelectedImages([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await params;
      setTask(resolvedParams.taskId);
      setWorkspaceId(resolvedParams.workspaceId);

      console.log('workspaceId ' + workspaceId);
      console.log('workspaceId ' + taskId);
    };

    fetchData();
  }, [params]);

  if (!taskId) {
    return <div>Loading...</div>;
  }

  if (!workspaceId) {
    return <div>Loading...</div>;
  }

  const post = {
    postId: '1',
    username: 'JohnDoe',
    date: 'Mar 27, 2025',
    content: 'This is a post about workspace collaboration.',
    likes: 123,
    commentsCount: 12,
    images: [
      'https://via.placeholder.com/300',
      'https://via.placeholder.com/350',
      'https://via.placeholder.com/400',
    ],
  };

  const assignment = {
    id: '1',
    title: 'Math Homework',
    dueDate: '2025-04-01T12:00:00Z',
    description: 'Complete exercises 1 to 10 from chapter 5.',
    owner: 'Mr. Smith',
    assignmentId: 'A001',
    workspaceId: 'W001',
    submissionDate: '2025-03-30T10:00:00Z',
    score: '90',
    images: [
      'https://via.placeholder.com/300',
      'https://via.placeholder.com/350',
      'https://via.placeholder.com/400',
    ],
  };

  const determineStatus = () => {
    const now = new Date();
    const parsedDueDate = parseISO(assignment.dueDate);

    if (assignment.submissionDate) {
      if (!isAfter(parseISO(assignment.submissionDate), parsedDueDate)) {
        return 'submitted';
      }
    }

    if (isAfter(now, parsedDueDate)) {
      return 'past_due';
    }

    return 'pending';
  };

  const status = determineStatus();

  if (status === 'submitted') {
    return (
      <div className='flex h-screen'>
        <OwnerWorkspaceSideBar workspaceId={workspaceId} invite_code='123' />
        <div className='flex-1 bg-gray-50'>
          <Navbar username='John Doe' />
          <div className='p-6'>
            <div className='p-4'>
              <div className='flex flex-row justify-between'>
                <div className='flex w-full flex-row justify-between'>
                  <div className='flex flex-row'>
                    <div className='mr-3 h-13 w-13 rounded-full bg-gray-300'></div>
                    <div className='flex flex-col'>
                      <div className='text-lg font-medium text-gray-800'>
                        {assignment.owner}
                      </div>
                      <div className='text-sm font-medium text-gray-800'>
                        {assignment.title}
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-row gap-3'>
                    <div className='flex flex-col justify-items-end'>
                      <p className='justify-end text-xl text-green-600'>
                        {status}
                      </p>
                      <p className='text-lg text-gray-600'>
                        Due: {assignment.dueDate}
                      </p>
                    </div>
                    {!assignment.score && (
                      <GradientButton text='Submit Score' width='w-40' />
                    )}
                    {assignment.score && (
                      <button className='h-12 w-32 rounded-md bg-gray-600 p-3 text-lg text-white'>
                        Submit score
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <hr className='my-4' />
              <div className='flex flex-row'>
                <div className='w-full'>
                  <p className='text-gray-800'>{assignment.description}</p>
                </div>
                <div>
                  {!assignment.score && (
                    <TextField placeholder='score' onChange={handleScore} />
                  )}
                </div>
              </div>
              <div className='flex flex-row gap-2'>
                {assignmentImages.map((assignment) => (
                  <div
                    key={assignment.id}
                    onClick={() => openAssignmentImage(assignment)}
                    className='cursor-pointer overflow-hidden rounded-lg border transition-shadow hover:shadow-lg'
                  >
                    <div className='relative'>
                      <img
                        src={assignment.preview}
                        alt={assignment.name}
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
              {assignment.images && assignment.images.length > 0 && (
                <div className='mt-4'>
                  <div
                    className={`grid ${assignment.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}
                  >
                    {assignment.images.map((imageUrl, index) => (
                      <div
                        key={index}
                        className='overflow-hidden rounded-lg bg-white shadow-md'
                      >
                        <div className='relative'>
                          <img
                            src={imageUrl}
                            alt={`Assignment image ${index + 1}`}
                            className='h-32 w-[50%] object-cover'
                          />
                          <div className='bg-opacity-50 absolute right-0 bottom-0 left-0 flex items-center justify-between bg-black p-2 text-white'>
                            <div className='flex items-center'>
                              <FileText className='mr-2' size={16} />
                              <span>Assignment Image {index + 1}</span>
                            </div>
                            <div className='flex items-center'></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedImages.length > 0 && (
                <div className='mt-4 grid grid-cols-3 gap-4'>
                  {selectedImages.map((image, index) => (
                    <div key={index} className='group relative'>
                      <img
                        src={image.preview}
                        alt={`Selected ${index}`}
                        className='h-50 w-full rounded-lg object-cover'
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className='absolute top-2 right-2 rounded-full p-1 text-white opacity-0 transition-opacity group-hover:opacity-100'
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
                src={selectedAssignment.preview}
                alt={selectedAssignment.name}
                className='max-h-screen max-w-full object-contain'
              />
            </div>
          </div>
        )}
      </div>
    );
  } else if (status === 'past_due') {
    return (
      <div className='flex h-screen'>
        <WorkspaceSideBar workspaceId={workspaceId} />
        <div className='flex-1 bg-gray-50'>
          <Navbar username='John Doe' />
          <div className='p-6'>
            <div className='p-4'>
              <div className='flex flex-row justify-between'>
                <div className='flex w-full flex-row justify-between'>
                  <div className='flex flex-row'>
                    <div className='mr-3 h-13 w-13 rounded-full bg-gray-300'></div>
                    <div className='flex flex-col'>
                      <div className='text-lg font-medium text-gray-800'>
                        {assignment.owner}
                      </div>
                      <div className='text-sm font-medium text-gray-800'>
                        {assignment.title}
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-row gap-3'>
                    <div className='flex flex-col justify-items-end'>
                      <p className='justify-end text-xl text-red-400'>
                        Past due
                      </p>
                      <p className='text-lg text-gray-600'>
                        Due: {assignment.dueDate}
                      </p>
                    </div>
                    <button className='h-12 w-32 rounded-md bg-gray-500 p-3 text-lg text-white'>
                      Submit Score
                    </button>
                  </div>
                </div>
              </div>
              <hr className='my-4' />
              <div className='flex flex-row'>
                <div className='w-full'>
                  <p className='text-gray-800'>{assignment.description}</p>
                </div>
                <div></div>
              </div>
              <div className='flex flex-row gap-2'>
                {assignmentImages.map((assignment) => (
                  <div
                    key={assignment.id}
                    onClick={() => openAssignmentImage(assignment)}
                    className='cursor-pointer overflow-hidden rounded-lg border transition-shadow hover:shadow-lg'
                  >
                    <div className='relative'>
                      <img
                        src={assignment.preview}
                        alt={assignment.name}
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
              <div className='text-gray-700'>No file for this assignment.</div>
              {selectedImages.length > 0 && (
                <div className='mt-4 grid grid-cols-3 gap-4'>
                  {selectedImages.map((image, index) => (
                    <div key={index} className='group relative'>
                      <img
                        src={image.preview}
                        alt={`Selected ${index}`}
                        className='h-50 w-full rounded-lg object-cover'
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className='absolute top-2 right-2 rounded-full p-1 text-white opacity-0 transition-opacity group-hover:opacity-100'
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
                src={selectedAssignment.preview}
                alt={selectedAssignment.name}
                className='max-h-screen max-w-full object-contain'
              />
            </div>
          </div>
        )}
      </div>
    );
  } else if (status === 'pending') {
    return (
      <div className='flex h-screen'>
        <WorkspaceSideBar workspaceId={workspaceId} />
        <div className='flex-1 bg-gray-50'>
          <Navbar username='John Doe' />
          <div className='p-6'>
            <div className='p-4'>
              <div className='flex flex-row justify-between'>
                <div className='flex w-full flex-row justify-between'>
                  <div className='flex flex-row'>
                    <div className='mr-3 h-13 w-13 rounded-full bg-gray-300'></div>
                    <div className='flex flex-col'>
                      <div className='text-lg font-medium text-gray-800'>
                        {assignment.owner}
                      </div>
                      <div className='text-sm font-medium text-gray-800'>
                        {assignment.title}
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-row gap-3'>
                    <div className='flex flex-col justify-items-end'>
                      <p className='justify-end text-xl text-blue-600'>
                        Pending
                      </p>
                      <p className='text-lg text-gray-600'>
                        Due: {assignment.dueDate}
                      </p>
                    </div>
                    <button className='h-12 w-40 rounded-md bg-gray-600 p-3 text-lg text-white'>
                      Submit Score
                    </button>
                  </div>
                </div>
              </div>
              <hr className='my-4' />
              <div className='flex flex-row'>
                <div className='w-full'>
                  <p className='text-gray-800'>{assignment.description}</p>
                </div>
              </div>
              <div className='flex flex-row gap-2'>
                {assignmentImages.map((assignment) => (
                  <div
                    key={assignment.id}
                    onClick={() => openAssignmentImage(assignment)}
                    className='cursor-pointer overflow-hidden rounded-lg border transition-shadow hover:shadow-lg'
                  >
                    <div className='relative'>
                      <img
                        src={assignment.preview}
                        alt={assignment.name}
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

              {selectedImages.length > 0 && (
                <div className='mt-4 grid grid-cols-3 gap-4'>
                  {selectedImages.map((image, index) => (
                    <div key={index} className='group relative'>
                      <img
                        src={image.preview}
                        alt={`Selected ${index}`}
                        className='h-50 w-full rounded-lg object-cover'
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className='absolute top-2 right-2 rounded-full p-1 text-white opacity-0 transition-opacity group-hover:opacity-100'
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
                src={selectedAssignment.preview}
                alt={selectedAssignment.name}
                className='max-h-screen max-w-full object-contain'
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
