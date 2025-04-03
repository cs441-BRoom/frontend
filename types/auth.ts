export interface User {
    user_id: number;
    username: string;
    firstname:string;
    lastname:string;
    auth_type:string;
    email: string;
    createdAt: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    firstname:string;
    lastname:string;
    auth_type:string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}