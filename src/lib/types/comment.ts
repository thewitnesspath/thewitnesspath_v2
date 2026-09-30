export type CommentReply = {
  id: string;
  commentId: string;
  author: string;
  content: string;
  createdAt?: string | null;
};

export type TestimonyComment = {
  id: string;
  testimonyId: string;
  author: string;
  content: string;
  likes: number;
  createdAt?: string | null;
  replies: CommentReply[];
};