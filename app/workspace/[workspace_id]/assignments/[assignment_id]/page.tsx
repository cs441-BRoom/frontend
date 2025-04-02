'use client';
import React, { use,useEffect, useState } from 'react';
import { FileText, Image, X } from 'lucide-react';
import { isAfter, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import AssignmentSubmissionCard from '@/components/assignment-submission-card';
import { useWorkspace } from '@/lib/context/WorkspaceContext';
import { getAssignmentById } from '@/lib/apis/api';
import { Assignment } from '@/types/assignment';

interface AssignmentDetailPageProps {
  params: Promise<{ workspace_id: string; assignment_id: number }>;
}

interface ImageFile {
    file: File;
    preview: string;
  }
  
  interface AssignmentImage {
    id: number;
    name: string;
    preview: string;
  }
  

export default function AssignmentDetailPage({ params }: AssignmentDetailPageProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [submissionId, setsubmissionId] = useState<string | null>(null);
  const unwrappedParams = use(params);
  const {user} = useAuth()
  const workspaceId = Number(unwrappedParams.workspace_id);
  const assignmentId = Number(unwrappedParams.assignment_id);
  const { selectedWorkspace } = useWorkspace();
  const [showOwned, setShowOwned] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [submittedImages, setSubmittedImages] = useState<ImageFile[]>([]);
  const [assignmentImages, setAssignmentImages] = useState<AssignmentImage[]>([]);
  const [selectedAssignment, setSelectedAssignment] =useState<AssignmentImage | null>(null);
  const [assignment, setAssignment] = useState<Assignment>();

  const router = useRouter();

  useEffect(() => {
      const loadAssignment = async () => {
        try {
           
          const data = await getAssignmentById(assignmentId);
          setAssignment(data);
        } catch (error) {
          console.error('Error fetching assignment:', error);
        }
      };
  
      loadAssignment();
    }, [assignmentId]);


  const handleTaskClick = (submissionId: string) => {
    setsubmissionId(submissionId);
    router.push(
      `/workspace/${workspaceId}/assignments/${assignmentId}/${submissionId}`
    );
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: ImageFile[] = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
  };

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


    setSubmittedImages((prev) => [...prev, ...selectedImages]);

    selectedImages.forEach((imageFile) => {
      const formData = new FormData();
      formData.append('file', imageFile.file);

      console.log('Submitting file:', imageFile.file.name);

   
    });

    setSelectedImages([]);
  


  useEffect(() => {
    if (selectedWorkspace?.created_by === user?.user_id) {
      setShowOwned(true);
    }
  }, [selectedWorkspace, user]);

  if(showOwned){

  return (
    <div className='flex h-screen'>
        <div className='p-6'>
          <div className='flex flex-row justify-end'></div>
          <div className='flex w-full flex-col items-center justify-center'>
            <hr className='my-4' />
            <div className='flex w-full flex-col items-center justify-center gap-6'>
              {submissions.map((submission, index) => (
                <AssignmentSubmissionCard
                  key={index}
                  id={submission.id}
                  username={submission.username}
                  dueDate={submission.dueDate}
                  workspaceId={submission.workspaceId}
                  submissionDate={submission.submissionDate}
                  onClick={handleTaskClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    
  );
  }else{
    if (status === 'submitted') {
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
                            {assignment?.created_by}
                          </div>
                          <div className='text-sm font-medium text-gray-800'>
                            {assignment?.title}
                          </div>
                        </div>
                      </div>
                      <div className='flex flex-row gap-3'>
                        <div className='flex flex-col justify-items-end'>
                          <p className='justify-end text-xl text-green-600'>
                            {status}
                          </p>
                          <p className='text-lg text-gray-600'>
                            Due: {assignment?.due_date}
                          </p>
                        </div>
                        <button className='h-12 w-32 rounded-md bg-gray-500 p-3 text-lg text-white'>
                          Submitted
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
                      <p className='w-40 text-2xl text-gray-700'>
                        {assignment?.score ? `${assignment.score} Points` : ''}
                      </p>
                    </div>
                  </div>
                  <div className='flex flex-row gap-2'>
                    c
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
                  {assignment?.files && assignment.files.length > 0 && (
                    <div className='mt-4'>
                      <div
                        className={`grid ${assignment.files.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}
                      >
                        {assignment.files.map((imageUrl, index) => (
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
            <div className='flex-1 bg-gray-50'>
              <div className='p-6'>
                <div className='p-4'>
                  <div className='flex flex-row justify-between'>
                    <div className='flex w-full flex-row justify-between'>
                      <div className='flex flex-row'>
                        <div className='mr-3 h-13 w-13 rounded-full bg-gray-300'></div>
                        <div className='flex flex-col'>
                          <div className='text-lg font-medium text-gray-800'>
                            {assignment?.created_by}
                          </div>
                          <div className='text-sm font-medium text-gray-800'>
                            {assignment?.title}
                          </div>
                        </div>
                      </div>
                      <div className='flex flex-row gap-3'>
                        <div className='flex flex-col justify-items-end'>
                          <p className='justify-end text-xl text-red-400'>
                            Past due
                          </p>
                          <p className='text-lg text-gray-600'>
                            Due: {assignment?.due_date}
                          </p>
                        </div>
                        <button className='h-12 w-32 rounded-md bg-gray-500 p-3 text-lg text-white'>
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                  <hr className='my-4' />
                  <div className='flex flex-row'>
                    <div className='w-full'>
                      <p className='text-gray-800'>{assignment?.description}</p>
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
                  <div className='text-gray-700'>You cannot send this task.</div>
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
            <div className='flex-1 bg-gray-50'>
              <div className='p-6'>
                <div className='p-4'>
                  <div className='flex flex-row justify-between'>
                    <div className='flex w-full flex-row justify-between'>
                      <div className='flex flex-row'>
                        <div className='mr-3 h-13 w-13 rounded-full bg-gray-300'></div>
                        <div className='flex flex-col'>
                          <div className='text-lg font-medium text-gray-800'>
                            {assignment?.created_by}
                          </div>
                          <div className='text-sm font-medium text-gray-800'>
                            {assignment?.title}
                          </div>
                        </div>
                      </div>
                      <div className='flex flex-row gap-3'>
                        <div className='flex flex-col justify-items-end'>
                          <p className='justify-end text-xl text-blue-600'>
                            Pending
                          </p>
                          <p className='text-lg text-gray-600'>
                            Due: {assignment?.due_date}
                          </p>
                        </div>
                        <button
                          className='h-12 w-32 rounded-md bg-green-600 p-3 text-lg text-white'
                          onClick={handleSubmit}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                  <hr className='my-4' />
                  <div className='flex flex-row'>
                    <div className='w-full'>
                      <p className='text-gray-800'>{assignment?.description}</p>
                    </div>
                  </div>
                  <div className='flex flex-row gap-2'>
                    c
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
                  <div className='rounded-lg border-2 border-dashed border-gray-300 p-4'>
                    <input
                      type='file'
                      accept='image/*'
                      multiple
                      className='hidden'
                      id='image-upload'
                      onChange={handleImageSelect}
                    />
                    <label
                      htmlFor='image-upload'
                      className='flex cursor-pointer items-center justify-center text-gray-600'
                    >
                      <Image className='mr-2' /> Add your Images
                    </label>
                  </div>
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
}