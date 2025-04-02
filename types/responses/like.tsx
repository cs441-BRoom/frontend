export interface LikeResponse {
  message: string;

  like: {
    like_id: number;

    news_id: number;

    user_id: number;

    created_at: string;
  };
}

export interface UnlikeResponse {
  message: string;
}
