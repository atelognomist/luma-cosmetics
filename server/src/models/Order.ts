import mongoose, { Schema, Document } from "mongoose";
import { ICustomer } from "./Customer.js";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string; // Snapshot
  shade?: string;
  variant?: string;
  qty: number;
  unitPrice: number; // Snapshot of priceAtPurchase
  image: string; // Snapshot
}

export interface ICallAttempt {
  at: Date;
  outcome: string;
  note?: string;
  adminUserId?: mongoose.Types.ObjectId;
}

export interface ITimelineEvent {
  at: Date;
  label: string;
  sub?: string;
}

export interface IOrder extends Document {
  num: number;
  status: string; // "new", "calling", "confirmed", etc.
  customerId: mongoose.Types.ObjectId | ICustomer;
  customerSnapshot: {
    name: string;
    phone: string;
    wilaya: string;
    commune: string;
    address: string;
    deliveryNotes?: string;
  };
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAgency?: string;
  trackingNumber?: string;
  calls: ICallAttempt[];
  timeline: ITimelineEvent[];
  idempotencyKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    shade: { type: String },
    variant: { type: String },
    qty: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const CallAttemptSchema = new Schema(
  {
    at: { type: Date, required: true },
    outcome: { type: String, required: true },
    note: { type: String },
    adminUserId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false }
);

const TimelineEventSchema = new Schema(
  {
    at: { type: Date, required: true },
    label: { type: String, required: true },
    sub: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    num: { type: Number, required: true, unique: true },
    status: { type: String, required: true, default: "new" },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    customerSnapshot: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      wilaya: { type: String, required: true },
      commune: { type: String, required: true },
      address: { type: String, required: true },
      deliveryNotes: { type: String },
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    deliveryAgency: { type: String },
    trackingNumber: { type: String },
    calls: [CallAttemptSchema],
    timeline: [TimelineEventSchema],
    idempotencyKey: { type: String, sparse: true, unique: true },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
