import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConversation extends Document {
  gigId: mongoose.Types.ObjectId;
  gigTitle: string;
  participants: string[];
  lastMessageAt: Date;
  lastMessageText: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    gigId: {
      type: Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
      index: true,
    },
    gigTitle: { type: String, required: true, trim: true, maxlength: 120 },
    participants: { type: [String], required: true, index: true },
    lastMessageAt: { type: Date, default: Date.now, index: true },
    lastMessageText: { type: String, default: "", trim: true, maxlength: 100 },
  },
  { timestamps: true },
);

ConversationSchema.index({ gigId: 1, participants: 1 }, { unique: true });
ConversationSchema.index({ participants: 1, lastMessageAt: -1 });

const Conversation: Model<IConversation> =
  mongoose.models.Conversation ??
  mongoose.model<IConversation>("Conversation", ConversationSchema);

export default Conversation;
