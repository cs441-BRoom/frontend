export interface CommentStoreResponse {
  message: string;

  comment: {
    comment_id: number;
    news_id: number;
    created_by: number;
    content: string;
    created_at: string;
    updated_at: string;
  };
}

export interface CommentUpdateResponse {
  message: string;

  comment: {
    comment_id: number;
    news_id: number;
    created_by: number;
    content: string;
    created_at: string;
    updated_at: string;
  };
}

export interface CommentDestroyReponse {
  message: string;
}
