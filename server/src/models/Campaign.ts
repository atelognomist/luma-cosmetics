import mongoose, { Schema, Document } from "mongoose";

export interface ICampaign extends Document {
  name: string;
  description: string;
  image?: string;
  video?: string;
  startDate: Date;
  endDate?: Date;
  active: boolean;
  productIds: mongoose.Types.ObjectId[];
  type: "collection" | "offer" | "seasonal" | "trending";
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    video: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    active: { type: Boolean, default: false },
    productIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    type: { type: String, enum: ["collection", "offer", "seasonal", "trending"], required: true },
  },
  { timestamps: true }
);

export const Campaign = mongoose.model<ICampaign>("Campaign", CampaignSchema);
