import mongoose, { Document, Model, Schema } from "mongoose";


interface IReaction {
  user: mongoose.Types.ObjectId;
  type?: "like" | "love" | "haha" | "wow" | "sad" | "angry";
}

// Comment document interface
export interface IComment extends Document {
  text: string;
  author: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  reactions: IReaction[];
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema: Schema<IComment> = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
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

const Comment: Model<IComment> = mongoose.model<IComment>("Comment", commentSchema);
export default Comment;
