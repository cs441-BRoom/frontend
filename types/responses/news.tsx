export interface IndexResponse {
  message: string;

  news: [
    {
      news_id: number;

      workspace_id: number;

      title: string;

      content: string;

      comments_count: string;

      like_count: string;

      is_liked_by_user: string;

      created_by: number;

      created_at: string;
    },
  ];
}

export interface StoreResponse {
  message: string;

  news: {
    news_id: number;

    workspace_id: number;

    title: string;

    content: string;

    comments_count: string;

    like_count: string;

    is_liked_by_user: string;

    created_by: 0;

    created_at: string;
  };
}

export interface UpdateResponse {
  message: string;
}

export interface DeleteResponse {
  message: string;
}
