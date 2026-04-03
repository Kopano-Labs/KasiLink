// lib/models/Review.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  gigId: mongoose.Types.ObjectId;
  providerId: string; // Clerk ID of the gig provider being reviewed
  seekerId: string; // Clerk ID of the user writing the review
  seekerName: string;
  rating: number; // 1 to 5
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    gigId: {
      type: Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
      index: true,
    },
    providerId: { type: String, required: true, index: true },
    seekerId: { type: String, required: true },
    seekerName: { type: String, required: true },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true },
);

// Prevent a seeker from reviewing the same gig provider multiple times for the exact same gig
ReviewSchema.index({ gigId: 1, seekerId: 1 }, { unique: true });

const Review: Model<IReview> =
  mongoose.models.Review ?? mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
