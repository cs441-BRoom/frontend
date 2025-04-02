import { AuthResponse, LoginCredentials, RegisterData } from '@/types/auth';
import {
  CreateWorkspaceData,
  JoinWorkspace,
  Workspace,
} from '@/types/workspace';
import axiosInstance from '@/lib/apis/axios';
import { CreateNews, News } from '@/types/news';
import { Comment } from '@/types/comment';
import { Like } from '@/types/like';
import { Assignment, CreateAssignment } from '@/types/assignment';
import axios from 'axios';
import { Submission } from '@/types/submission';

// Auth API
export const login = async (
  credentials: LoginCredentials,
): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

export const register = async (
  userData: RegisterData,
): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post('/auth/logout');
};

// Workspace API
export const fetchJoinWorkspaces = async (): Promise<Workspace[]> => {
  const response = await axiosInstance.get('/workspaces/joined');
  return response.data.workspaces; // ดึงข้อมูลที่อยู่ใน `workspaces`
};

export const fetchMyWorkspaces = async (): Promise<Workspace[]> => {
  const response = await axiosInstance.get('/workspaces/my');
  return response.data.workspaces; // ดึงข้อมูลที่อยู่ใน `workspaces`
};

export const fetchWorkspaceById = async (
  workspace_id: number,
): Promise<Workspace> => {
  const response = await axiosInstance.get(`/workspaces/${workspace_id}`);
  return response.data.workspace;
};

export const createWorkspace = async (
  data: CreateWorkspaceData,
): Promise<Workspace> => {
  try {
    const response = await axiosInstance.post('/workspaces', data);
    return response.data.workspace;
  } catch (error) {
    console.error('Error creating workspace:', error);
    throw error;
  }
};

export const joinWorkspace = async (
  data: JoinWorkspace,
): Promise<Workspace> => {
  try {
    const response = await axiosInstance.post('/workspaces/join', data);
    return response.data.workspace;
  } catch (error) {
    console.error('Error joining workspace:', error);
    throw error;
  }
};

export const getNewsByWorkspaceId = async (
  workspace_id: number,
): Promise<News[]> => {
  const response = await axiosInstance.get(`/workspaces/${workspace_id}/news`);
  return response.data.news;
};

export const getNewsById = async (news_id:number,workspace_id:number): Promise<News> => {
  const response = await axiosInstance.get(`/workspaces/${workspace_id}/news/${news_id}`);
  return response.data.news;
}

export const likeNews = async (news_id: number): Promise<Like> => {
  try {
    const response = await axiosInstance.post('/like', { news_id });
    return response.data.like; // คืนค่าข้อมูล like ที่ได้รับจาก API
  } catch (error) {
    console.error('Error liking news:', error);
    throw error; // ข้อผิดพลาดที่เกิดขึ้นจะถูกโยนออกไป
  }
};

export const unlikeNews = async (news_id: number): Promise<boolean> => {
  try {
    const response = await axiosInstance.delete(`/like/${news_id}`);
    return response.status === 200; // ตรวจสอบว่า response ตอบกลับสถานะ 200 แสดงว่าการลบสำเร็จ
  } catch (error) {
    console.error('Error unliking news:', error);
    return false; // คืนค่าผลลัพธ์ false ถ้าการลบไม่สำเร็จ
  }
};

export const createNewsWithFiles = async (formData: FormData): Promise<News> => {
  try {
    const response = await axiosInstance.post('/news', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.news;
  } catch (error) {
    console.error('Error creating news with files:', error);
    throw error;
  }
};


export const getAllAssignmentByWorkspaceId = async (
  workspaceId: number,
): Promise<Assignment[]> => {
  try {
    const response = await axiosInstance.get(
      `workspaces/${workspaceId}/assignments`,
    );
    return response.data.assignments;
  } catch (error) {
    console.error('Error get assignments:', error);
    throw error;
  }
};

export const createAssignment = async (
  assignment: CreateAssignment,
): Promise<Assignment> => {
  try {
    const formData = new FormData();
    formData.append('workspace_id', assignment.workspace_id.toString());
    formData.append('title', assignment.title);
    formData.append('description', assignment.description);
    formData.append('due_date', assignment.due_date);

    assignment.files.forEach((file) => {
      formData.append('files[]', file);
    });

    const response = await axiosInstance.post('/assignments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.assignments;
  } catch (error) {
    console.error('Error creating assignment:', error);
    throw error; // ข้อผิดพลาดที่เกิดขึ้นจะถูกโยนออกไป
  }
};
export const getAssignmentById = async (
  assignment_id: number,
): Promise<Assignment> => {
  try {
    const response = await axiosInstance.get(`assignments/${assignment_id}`);
    return response.data.assignment;
  } catch (error) {
    console.error('Error get assignments:', error);
    throw error;
  }
};

export const getAllSubmissionsByAssignmentId = async (
  assignment_id: number,
): Promise<Submission[]> => {
  try {
    const response = await axiosInstance.get(
      `/assignments/${assignment_id}/submissions`,
    );
    return response.data.submissions;
  } catch (error) {
    console.error('Error get submissions:', error);
    throw error;
  }
};

export const getCommentsByNewsId = async (newsId: number): Promise<Comment[]> => {
  const response = await axiosInstance.get(`/news/${newsId}/comments`);
  return response.data.comments;
};

export const createComment = async (newsId: number, content: string): Promise<Comment> => {
  const response = await axiosInstance.post('/comments', {
    news_id: newsId,
    content
  });
  return response.data.comment;
};
