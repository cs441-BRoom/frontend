// app/workspace/[workspace_id]/page.tsx
'use client';

import AssignmentCard from '@/components/assignment-card';
import GradientButton from '@/components/gradeint-button';
import Modal from '@/components/modal';
import {
  createAssignment,
  getAllAssignmentByWorkspaceId,
} from '@/lib/apis/api';
import { useAssignment } from '@/lib/context/AssignmentContext';
import { useAuth } from '@/lib/context/AuthContext';
import { useWorkspace } from '@/lib/context/WorkspaceContext';
import { Assignment } from '@/types/assignment';
import { Image, XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';

interface AssignmentPageProps {
  params: Promise<{ workspace_id: string }>;
}

export default function AssignmentsPage({ params }: AssignmentPageProps) {
  const unwrappedParams = use(params);
  const workspaceId = Number(unwrappedParams.workspace_id);
  const router = useRouter();
  const { selectedWorkspace } = useWorkspace();
  const { setSelectedAssignment } = useAssignment();
  const { user } = useAuth();
  const [showOwned, setShowOwned] = useState<boolean>(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // useEffect(() => {
  //   if (!selectedWorkspace) {
  //     router.push("/workspace"); // ถ้าไม่ได้เลือก workspace ให้ไปที่หน้า workspace
  //   }
  // }, [selectedWorkspace, router]);
  //
  // if (!selectedWorkspace) {
  //   return (
  //     <div className="min-h-screen flex justify-center items-center bg-white">
  //       <div className="animate-spin rounded-full border-4 border-t-4 border-emerald-600 w-16 h-16"></div>
  //     </div>
  //   );
  // }

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const data = await getAllAssignmentByWorkspaceId(workspaceId);
        setAssignments(data);
      } catch (error) {
        console.error('Error fetching assignment:', error);
      }
    };

    loadAssignments();
  }, [workspaceId]);

  const handleTaskClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    router.push(`/workspace/${workspaceId}/task/${assignment.assignment_id}`);
    console.log(assignment);
  };

  useEffect(() => {
    if (selectedWorkspace?.created_by === user?.user_id) {
      setShowOwned(true);
    }
  }, [selectedWorkspace, user]);

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

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('click');
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);

      if (selectedFiles.length + files.length > 3) {
        alert('You can only upload up to 3 files.');
        return;
      }

      setFiles((prev) => [...prev, ...selectedFiles]);
    }

    const newAssignment = {
      workspace_id: workspaceId,
      title: title,
      description: description,
      due_date: selectedDate,
      files: images,
    };

    console.log('images' + images);

    try {
      const createNewAssignment = await createAssignment(newAssignment);

      setAssignments((prevAssignment) => [
        ...prevAssignment,
        createNewAssignment,
      ]);
    } catch (error) {
      console.log('sa,dld');
    }
  };

  return (
    <div className='flex h-screen'>
      <div className='flex-1 bg-gray-50'>
        <div className='p-6'>
          {showOwned && (
            <div className='mb-4 flex justify-end'>
              <GradientButton
                text='New task'
                width='w-40'
                onClick={() => setIsModalOpen(true)}
              />
            </div>
          )}

          <div className='flex flex-row justify-end'></div>
          <div className='flex w-full flex-col items-center justify-center'>
            <hr className='my-4' />
            <div className='flex w-full flex-col items-center justify-center gap-6'>
              {assignments.map((assignment, index) => (
                <AssignmentCard
                  key={index}
                  id={assignment.assignment_id}
                  title={assignment.title}
                  dueDate={assignment.due_date}
                  description={assignment.description}
                  owner={assignment.created_by}
                  assignmentId={assignment.assignment_id}
                  workspaceId={assignment.workspace_id}
                  submissionDate={assignment.submission_date}
                  members={assignment.members}
                  score={assignment.score}
                  submitted_number={assignment.submitted_number}
                  isOwned={showOwned}
                  onClick={() => handleTaskClick(assignment)}
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
          <input
            type='date'
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className='rounded border p-2'
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
