import { ApiClient } from "./client";

export async function login(email: string, password: string):Promise<any> {
  try {
    const data = await ApiClient.post<{ id: string, role: string }>("/auth/login", { email, password });
    return data;
  } catch (error) {
    return null;
  }
}

export async function logout():Promise<void> {
  try {
    await ApiClient.post("/auth/logout", {});
  } catch (error) {
    console.error("Logout failed", error);
  }
}

export async function isAuthenticated():Promise<boolean> {
  try {
    await ApiClient.get("/auth/me");
    return true;
  } catch (error) {
    return false;
  }
}
