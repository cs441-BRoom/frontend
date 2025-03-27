export interface RegisterRequest {
  username: 'string';
  firstname: 'string';
  lastname: 'string';
  email: 'string';
  auth_type: 'string';
  password: 'string';
  password_confirmation: 'string';
}

export interface LoginRequest {
  username: 'string';
  password: 'string';
}
