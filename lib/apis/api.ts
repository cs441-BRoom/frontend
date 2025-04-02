import { AuthResponse, LoginCredentials, RegisterData } from '@/types/auth';
import { CreateWorkspaceData, JoinWorkspace, Workspace } from '@/types/workspace';
import axiosInstance from '@/lib/apis/axios';
import { CreateNews, News } from '@/types/news';
import { Like } from '@/types/like';

// Auth API
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
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

export const fetchWorkspaceById = async (workspace_id: number): Promise<Workspace> => {
  const response = await axiosInstance.get(`/workspaces/${workspace_id}`);
  return response.data.workspace;
};

export const createWorkspace = async (data: CreateWorkspaceData): Promise<Workspace> => {
  try {
    const response = await axiosInstance.post('/workspaces', data);
    return response.data.workspace;
  } catch (error) {
    console.error('Error creating workspace:', error);
    throw error;
  }
};

export const joinWorkspace = async (data: JoinWorkspace): Promise<Workspace> => {
  try {
    const response = await axiosInstance.post('/workspaces/join', data);
    return response.data.workspace;
  } catch (error) {
    console.error('Error joining workspace:', error);
    throw error;
  }
};

export const getNewsByWorkspaceId = async (workspace_id: number): Promise<News[]> => {
  const response = await axiosInstance.get(`/workspaces/${workspace_id}/news`);
  return response.data.news;
};

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

export const createNews = async (news: CreateNews): Promise<News> => {
  try {
    const response = await axiosInstance.post('/news', news);
    return response.data.news;
  } catch (error) {
    console.error('Error creating news:', error);
    throw error; // ข้อผิดพลาดที่เกิดขึ้นจะถูกโยนออกไป
  }
};




