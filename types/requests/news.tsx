export interface NewsStoreRequest {
  workspace_id: number;
  title: string;
  content: string;
}

export interface NewsUpdateRequest {
  title: string;
  content: string;
}
