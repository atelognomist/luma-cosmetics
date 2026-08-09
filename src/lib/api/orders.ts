import { ApiClient } from "./client";
import type { Order, OrderStatus, CallAttempt } from "./types";

export type CreateOrderPayload = {
  customer: Order["customer"];
  items: { productId: string; qty: number; variant?: string; shade?: string }[];
  deliveryFee: number;
};

function normalizeOrder(o: any): Order {
  if (o._id && !o.id) o.id = o._id.toString();
  
  // Map items _id -> id
  if (o.items) {
    o.items = o.items.map((i: any) => ({
      ...i,
      id: i.id || (i._id ? i._id.toString() : i.productId)
    }));
  }
  
  // Map customerSnapshot back to standard customer interface format
  if (o.customerSnapshot && !o.customer) {
    o.customer = o.customerSnapshot;
  }
  return o as Order;
}

export async function getOrders(): Promise<Order[]> {
  const orders = await ApiClient.get<Order[]>("/orders");
  return orders.map(normalizeOrder);
}

export async function getOrder(id: string): Promise<Order | null> {
  try {
    const order = await ApiClient.get<Order>(`/orders/${id}`);
    return normalizeOrder(order);
  } catch (err) {
    return null;
  }
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const newOrder = await ApiClient.post<Order>("/orders", payload);
  return normalizeOrder(newOrder);
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const updatedOrder = await ApiClient.patch<Order>(`/orders/${id}/status`, { status });
  return normalizeOrder(updatedOrder);
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
  // Prototype has this, let's proxy it to status for now or keep a full patch endpoint
  // In the current backend, we only explicitly built a /status patch, but if the frontend calls updateOrder, we should handle it.
  // We'll wrap it conceptually for compatibility.
  if (updates.status) {
    return updateOrderStatus(id, updates.status as OrderStatus);
  }
  return getOrder(id) as unknown as Order;
}

export async function addOrderCall(id: string, call: CallAttempt): Promise<Order> {
  const updatedOrder = await ApiClient.post<Order>(`/orders/${id}/calls`, call);
  return normalizeOrder(updatedOrder);
}

export async function deleteOrder(id: string): Promise<void> {
  await ApiClient.delete(`/orders/${id}`);
}
