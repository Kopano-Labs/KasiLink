// lib/models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "seeker" | "provider" | "both";

export interface IUser extends Document {
  clerkId: string; // Clerk user ID (primary FK)
  phone: string; // E.164 format: +27821234567
  displayName: string;
  bio?: string;
  role: UserRole;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
    suburb?: string; // e.g. "Soweto"
    city?: string; // e.g. "Johannesburg"
    province?: string; // e.g. "Gauteng"
  };
  skills: string[]; // e.g. ["car wash", "painting", "tutoring"]
  categories: string[]; // gig categories they offer/seek
  avatarUrl?: string;
  isVerified: boolean; // verified provider badge
  verifiedAt?: Date;
  rating: {
    average: number; // 0–5
    count: number;
  };
  completedGigs: number;
  isActive: boolean;
  lastSeen: Date;
  pushSubscription?: string; // JSON-serialized browser PushSubscription — set by H8
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    role: {
      type: String,
      enum: ["seeker", "provider", "both"],
      default: "seeker",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat] — GeoJSON order
        default: [28.0473, -26.2041], // Johannesburg center
      },
      suburb: { type: String, trim: true },
      city: { type: String, trim: true, default: "Johannesburg" },
      province: { type: String, trim: true, default: "Gauteng" },
    },
    skills: {
      type: [String],
      default: [],
    },
    categories: {
      type: [String],
      default: [],
    },
    avatarUrl: { type: String },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },
    completedGigs: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    lastSeen: { type: Date, default: Date.now },
    pushSubscription: { type: String, default: null }, // H8 — browser push
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Geospatial index — REQUIRED for proximity search (H6)
UserSchema.index({ location: "2dsphere" });

// Text search
UserSchema.index({ displayName: "text", bio: "text", skills: "text" });

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default User;
// End of User Schema
