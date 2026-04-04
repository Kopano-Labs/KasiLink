import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
  userId: string; // Clerk user ID
  type: "application" | "message" | "system" | "gig_update";
  title: string;
  message: string;
  link?: string; // Optional URL to navigate to when clicked
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true, index: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Notification: Model<INotification> =
  mongoose.models.Notification ??
  mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
