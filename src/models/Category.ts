import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  color: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    color: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

CategorySchema.pre<ICategory>("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");
  }
  next();
});

export default mongoose.model<ICategory>("Category", CategorySchema);
