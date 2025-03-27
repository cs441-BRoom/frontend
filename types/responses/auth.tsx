export interface RegisterResponse {
  message: string;

  user: {
    user_id: number;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    auth_type: string;
  };
}

export interface LoginResponse {
  message: string;
  user: {
    user_id: number;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    auth_type: string;
  };

  token: string;
}

export interface LogoutResponse {
  message: string;
}
