// lib/models/Application.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export type ApplicationStatus =
  | "pending"
  | "shortlisted"
  | "accepted"
  | "rejected"
  | "withdrawn";

export interface IApplication extends Document {
  gigId: mongoose.Types.ObjectId;
  gigTitle: string; // denormalised for display

  seekerId: string; // Clerk user ID
  seekerName: string;
  seekerPhone: string;

  providerId: string; // Clerk user ID of gig poster
  providerName: string;

  message: string; // seeker's cover message
  status: ApplicationStatus;

  // Provider actions
  reviewedAt?: Date;
  reviewNote?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    gigId: {
      type: Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
      index: true,
    },
    gigTitle: { type: String, required: true, trim: true },

    seekerId: { type: String, required: true, index: true },
    seekerName: { type: String, required: true, trim: true },
    seekerPhone: { type: String, required: true },

    providerId: { type: String, required: true, index: true },
    providerName: { type: String, required: true, trim: true },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["pending", "shortlisted", "accepted", "rejected", "withdrawn"],
      default: "pending",
    },

    reviewedAt: { type: Date },
    reviewNote: { type: String, trim: true, maxlength: 200 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Prevent duplicate applications
ApplicationSchema.index({ gigId: 1, seekerId: 1 }, { unique: true });

// Compound for provider inbox
ApplicationSchema.index({ providerId: 1, status: 1, createdAt: -1 });

const Application: Model<IApplication> =
  mongoose.models.Application ??
  mongoose.model<IApplication>("Application", ApplicationSchema);

export default Application;
