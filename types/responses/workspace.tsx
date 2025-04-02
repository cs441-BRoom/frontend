export interface GetMyWorkspacesResponse {
  message: string;

  workspaces: [
    {
      workspace_id: number;

      name: string;

      description: string;

      join_code: string;

      members_count: string;

      created_by: number;

      created_at: string;

      updated_at: string;
    },
  ];
}

export interface GetJoinedWorkspacesResponse {
  message: string;

  workspaces: [
    {
      workspace_id: number;

      name: string;

      description: string;

      join_code: string;

      members_count: string;

      created_by: string;

      created_at: string;

      updated_at: string;
    },
  ];
}

export interface LeaveWorkspacesResponse {
  message: string;
}

export interface StoreRespond {
  message: string;

  workspace: {
    workspace_id: number;

    name: string;

    description: string;

    join_code: string;

    members_count: string;

    created_by: number;

    created_at: string;

    updated_at: string;
  };
}

export interface JoinResponse {
  message: string;

  workspace: {
    workspace_id: number;

    name: string;

    description: string;

    join_code: string;

    members_count: string;

    created_by: number;

    created_at: string;

    updated_at: string;
  };
}
