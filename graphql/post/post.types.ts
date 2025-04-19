export interface CreatePostInput {
  title: string;
  description?: string;
  userId: string
}

export interface CreateCommentInput {
  postId: string;
  text: string;
}

export interface ClientUserInput {
  id: string;
  email: string
}