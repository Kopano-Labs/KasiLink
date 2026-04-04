import mongoose, { Schema, Document, Model } from "mongoose";

export interface IForumPost extends Document {
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  category: "general" | "safety" | "load-shedding" | "success_stories";
  upvotes: number;
  flags: number;
  createdAt: Date;
  updatedAt: Date;
}

const ForumPostSchema = new Schema<IForumPost>(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    content: { type: String, required: true, trim: true, maxlength: 2000 },
    authorId: { type: String, required: true, index: true },
    authorName: { type: String, required: true },
    category: {
      type: String,
      enum: ["general", "safety", "load-shedding", "success_stories"],
      default: "general",
    },
    upvotes: { type: Number, default: 0 },
    flags: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const ForumPost: Model<IForumPost> =
  mongoose.models.ForumPost ??
  mongoose.model<IForumPost>("ForumPost", ForumPostSchema);

export default ForumPost;
