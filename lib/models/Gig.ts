// lib/models/Gig.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export type GigStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";
export type GigCategory =
  | "car_wash"
  | "cleaning"
  | "tutoring"
  | "repairs"
  | "delivery"
  | "handyman"
  | "solar"
  | "retail"
  | "construction"
  | "healthcare"
  | "logistics"
  | "other";

export type PayType = "once_off" | "hourly" | "daily" | "negotiable";

export interface IGig extends Document {
  title: string;
  description: string;
  category: GigCategory;
  status: GigStatus;

  // Provider (poster)
  providerId: string; // Clerk user ID
  providerName: string;
  providerPhone: string;
  isProviderVerified: boolean;

  // Seeker assigned (after match)
  seekerId?: string;
  seekerName?: string;

  // Location — GeoJSON Point (CRITICAL: must be set at schema creation for 2dsphere index)
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
    address?: string;
    suburb: string;
    city: string;
  };

  // Pay
  payType: PayType;
  payAmount?: number; // ZAR
  payDisplay: string; // e.g. "R150/hr" or "Negotiable"

  // Timing
  startDate?: Date;
  endDate?: Date;
  isFlexible: boolean; // flexible start time

  // Requirements
  requirements: string[]; // e.g. ["own transport", "experience preferred"]
  slots: number; // how many workers needed

  // Engagement
  applicationCount: number;
  viewCount: number;

  // Load-shedding awareness
  loadshedding: {
    aware: boolean; // provider has noted LS schedule
    stage?: number; // expected stage during gig
  };

  // Flags
  isUrgent: boolean;
  expiresAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const GigSchema = new Schema<IGig>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "car_wash",
        "cleaning",
        "tutoring",
        "repairs",
        "delivery",
        "handyman",
        "solar",
        "retail",
        "construction",
        "healthcare",
        "logistics",
        "other",
      ],
    },
    status: {
      type: String,
      enum: ["open", "assigned", "in_progress", "completed", "cancelled"],
      default: "open",
    },

    // Provider
    providerId: { type: String, required: true, index: true },
    providerName: { type: String, required: true, trim: true },
    providerPhone: { type: String, required: true },
    isProviderVerified: { type: Boolean, default: false },

    // Seeker
    seekerId: { type: String },
    seekerName: { type: String },

    // Location — GeoJSON (2dsphere index applied below)
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
        // [longitude, latitude]
      },
      address: { type: String, trim: true },
      suburb: { type: String, required: true, trim: true },
      city: { type: String, default: "Johannesburg", trim: true },
    },

    // Pay
    payType: {
      type: String,
      enum: ["once_off", "hourly", "daily", "negotiable"],
      default: "negotiable",
    },
    payAmount: { type: Number, min: 0 },
    payDisplay: { type: String, required: true, trim: true },

    // Timing
    startDate: { type: Date },
    endDate: { type: Date },
    isFlexible: { type: Boolean, default: true },

    // Requirements
    requirements: { type: [String], default: [] },
    slots: { type: Number, default: 1, min: 1 },

    // Engagement
    applicationCount: { type: Number, default: 0, min: 0 },
    viewCount: { type: Number, default: 0, min: 0 },

    // Load-shedding
    loadshedding: {
      aware: { type: Boolean, default: false },
      stage: { type: Number, min: 0, max: 6 },
    },

    // Flags
    isUrgent: { type: Boolean, default: false },
    expiresAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ⚡ CRITICAL: Geospatial index for proximity search
GigSchema.index({ location: "2dsphere" });

// Compound indexes for common queries
GigSchema.index({ status: 1, category: 1, createdAt: -1 });
GigSchema.index({ providerId: 1, createdAt: -1 });
GigSchema.index({ status: 1, expiresAt: 1 });

// Full-text search
GigSchema.index({ title: "text", description: "text" });

const Gig: Model<IGig> =
  mongoose.models.Gig ?? mongoose.model<IGig>("Gig", GigSchema);

export default Gig;
// End of Gig Schema
