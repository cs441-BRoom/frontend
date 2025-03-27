export interface UpdateResponse {
  user_id: number;

  username: string;

  firstname: string;

  lastname: string;

  email: string;

  auth_type: string;
}

export interface UploadResponse {
  message: string;
}

export interface DeleteResponse {
  message: string;
}
