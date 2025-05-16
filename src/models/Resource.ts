import mongoose, { Schema, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface IResource extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  imageUrl: string;
  externalLink: string;
  category: "sermon" | "worship" | "book" | "movie";
  createdAt: Date;
  updatedAt: Date;
  featured: boolean;
  authorId: mongoose.Types.ObjectId;
  viewCount: number;
}

const ResourceSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    externalLink: { type: String, required: true },
    category: {
      type: String,
      enum: ["sermon", "worship", "book", "movie"],
      required: true,
    },
    featured: { type: Boolean, default: false },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ResourceSchema.plugin(mongoosePaginate);

export default mongoose.model<IResource, PaginateModel<IResource>>(
  "Resource",
  ResourceSchema
);
