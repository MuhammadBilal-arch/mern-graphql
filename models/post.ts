import mongoose, { Schema, Document, Model } from "mongoose";

interface IReaction {
  user: mongoose.Types.ObjectId;
  type?: "like" | "love" | "haha" | "wow" | "sad" | "angry";
}

export interface IPost extends Document {
  title: string;
  description?: string;
  author: mongoose.Types.ObjectId;
  comments: mongoose.Types.ObjectId[];
  reactions: IReaction[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema: Schema<IPost> = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    reactions: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        type: {
          type: String,
          enum: ["like", "love", "haha", "wow", "sad", "angry"],
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Post: Model<IPost> = mongoose.model<IPost>("Post", postSchema);
export default Post;
