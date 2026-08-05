import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
  adminUserId: mongoose.Types.ObjectId;
  action: string;
  targetType: "Product" | "Order" | "Campaign" | "Category" | "User" | "Settings";
  targetId?: mongoose.Types.ObjectId | string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const ActivityLogSchema = new Schema(
  {
    adminUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    targetType: { 
      type: String, 
      enum: ["Product", "Order", "Campaign", "Category", "User", "Settings"], 
      required: true 
    },
    targetId: { type: Schema.Types.Mixed }, // Could be ObjectId or legacy string ID during migration
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const ActivityLog = mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
