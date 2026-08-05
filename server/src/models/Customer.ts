import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true }, // Index for fast lookup by phone
  },
  { timestamps: true }
);

export const Customer = mongoose.model<ICustomer>("Customer", CustomerSchema);
