import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

interface IUserDocument extends Document {
  email: string;
  password: string;
  name: string;
  role: "user" | "admin";
  refreshToken?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    refreshToken: { type: String },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

export default mongoose.model<IUserDocument>("User", UserSchema);
