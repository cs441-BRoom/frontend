export interface StoreRequest {
  workspace_id: number;
  title: string;
  content: string;
}

export interface UpdateRequest {
  title: string;
  content: string;
}
