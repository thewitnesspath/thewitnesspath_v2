export type BlogCommentReply = {
  id: string;
  commentId: string;
  author: string;
  content: string;
  createdAt?: string | null;
};

export type BlogComment = {
  id: string;
  postId: string;
  author: string;
  content: string;
  likes: number;
  createdAt?: string | null;
  replies: BlogCommentReply[];
};