export interface News {
  news_id: number;
  workspace_id: number;
  title: string;
  content: string;
  comments_count: string;
  like_count: string;
  is_liked_by_user: boolean;
  created_by: number;
  created_at: string;
  files?: NewsFile[];
}

export interface NewsFile {
  name: string;
  base64: string;
  mime_type: string;
}

export interface CreateNews {
  workspace_id: number;
  title: string;
  content: string;
  files?: File[];
}
