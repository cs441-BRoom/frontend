export interface Workspace {
    workspace_id: number;
    name: string;
    description: string;
    join_code: string;
    members_count: string;
    created_by: string;
    created_at: string;
    update_at: string;
}

export interface CreateWorkspaceData {
    name: string;
    description: string;
}

export interface JoinWorkspace{
    join_code:string;
}