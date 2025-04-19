import Post, { IPost } from '../models/post';
import User, { IUser } from '../models/user';
import Comment, { IComment } from '../models/comment';
import mongoose from 'mongoose';
import stripe from '../config/stripe';

export const createPost = async (
  title: string,
  description: string | undefined,
  authorId: string
): Promise<IPost> => {
  const newPost = new Post({ title, description, author: authorId });
  return await newPost.save();
};

export const createComment = async (
  postId: string,
  text: string,
  authorId: string
): Promise<IComment> => {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new Error('Invalid post ID');
  }

  const comment = new Comment({
    text,
    post: postId,
    author: authorId,
  });

  await comment.save();

  await Post.findByIdAndUpdate(postId, {
    $push: { comments: comment._id },
  });

  return comment;
};

export const getAllPosts = async (): Promise<IPost[]> => {
  return await Post.find()
    .populate('author', '-password')
    .populate({
      path: 'comments',
      populate: { path: 'author', select: '-password' }
    });
};

export const getPostById = async (id: string): Promise<IPost | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  return await Post.findById(id)
    .populate('author', '-password')
    .populate({
      path: 'comments',
      populate: { path: 'author', select: '-password' }
    });
};

export const tipAuthor = async (
  postId: string,
  amount: number,
  clientUser: { id: string; email: string }
): Promise<{ success: boolean; message: string , url?: string}> => {
  try {
    const post = await Post.findById(postId).populate('author');
    if (!post) throw new Error('Post not found');

    const author = post.author as unknown as IUser;

    if (!author || !author?.name) {
      throw new Error('Author information is missing or incomplete');
    }

    const user = await User.findById(clientUser.id);
    if (!user || !user.stripeCustomerId) {
      throw new Error('User does not have a Stripe customer account.');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer: user.stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Tip to ${author.name}`,
              description: `Support for post: "${post.title}"`,
            },
            unit_amount: amount * 100, // Convert amount to cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        postId,
        authorId: post.author['_id'].toString(),
        fromUserId: clientUser.id,
      },
    });

    if (!session.url) {
      throw new Error('Failed to generate Stripe Checkout URL.');
    }
    return {
      success: true,
      message: 'Payment session created successfully. Redirect to checkout.',
      url: session.url,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'An error occurred while processing the tip.',
    };
  }
};


const postService = {
  createPost,
  createComment,
  getAllPosts,
  getPostById,
  tipAuthor,
};

export default postService;
