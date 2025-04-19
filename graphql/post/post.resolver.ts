import * as postService from '../../services/postService';
import { CreatePostInput, CreateCommentInput } from './post.types';

export const postResolvers = {
  Query: {
    getAllPosts: () => postService.getAllPosts(),
    getPostById: (_: any, { id }: { id: string }) => postService.getPostById(id),
  },

  Mutation: {
    createPost: async(
      _: any,
      { input }: { input: CreatePostInput },
      context: any
    ) => {
      const { userId } = input;  

      if (!userId) {
        throw new Error("User ID is required to create a post.");
      }

      const post = await postService.createPost(input.title, input.description, userId);
      await post.populate('author', 'id name');

      return post;
    },

    createComment: (
      _: any,
      { input }: { input: CreateCommentInput },
      context: any
    ) => {
      const userId = context.user.id;
      return postService.createComment(input.postId, input.text, userId);
    },

    tipAuthor: (
      _: any,
      { postId, amount, clientUser }: { postId: string; amount: number; clientUser: { id: string; email: string } },
      context: any
    ) => {
      // const user = context.user;
      const { id, email } = clientUser;
      if (!id || !email) {
        throw new Error("User ID and email are required to process the tip.");
      }
      return postService.tipAuthor(postId, amount, clientUser);
    },
  },
};
