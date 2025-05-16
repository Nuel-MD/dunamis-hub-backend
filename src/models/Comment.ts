import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  resourceId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    resourceId: {
      type: Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IComment>("Comment", CommentSchema);
