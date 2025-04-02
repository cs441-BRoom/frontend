import {AuthResponse, LoginCredentials, RegisterData} from '@/types/auth';
import {CreateWorkspaceData, JoinWorkspace, Workspace} from '@/types/workspace';
import axiosInstance from "@/lib/apis/axios";

// Auth API
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  console.log(userData);
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

export const createWorkspace = async (data: CreateWorkspaceData): Promise<Workspace> => {
  try {
    const response = await axiosInstance.post('/workspaces', data);
    return response.data.workspace;
  } catch (error) {
    console.error("Error creating workspace:", error);
    throw error;
  }
};

export const joinWorkspace = async (data: JoinWorkspace): Promise<Workspace> => {
  try {
    const response = await axiosInstance.post('/workspaces/join', data);
    return response.data.workspace;
  } catch (error) {
    console.error("Error joining workspace:", error);
    throw error;
  }
};





