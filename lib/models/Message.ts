import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  senderId: string;
  senderName: string;
  text: string;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    senderId: { type: String, required: true, index: true },
    senderName: { type: String, required: true, trim: true, maxlength: 60 },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    readAt: { type: Date, default: null },
  },
  { timestamps: true },
);

MessageSchema.index({ conversationId: 1, createdAt: 1 });

const Message: Model<IMessage> =
  mongoose.models.Message ?? mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
