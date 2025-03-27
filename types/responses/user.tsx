export interface UserUpdateResponse {
  user_id: number;

  username: string;

  firstname: string;

  lastname: string;

  email: string;

  auth_type: string;
}

export interface UserUploadResponse {
  message: string;
}

export interface UserDeleteResponse {
  message: string;
}
