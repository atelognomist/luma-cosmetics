const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export class ApiClient {
  static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    const config: RequestInit = {
      ...options,
      headers,
      credentials: "include", // Essential for cookie-based session auth
    };

    // Auto-attach idempotency key for POST requests
    if (config.method === "POST" && !headers["Idempotency-Key"]) {
      headers["Idempotency-Key"] = crypto.randomUUID();
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Une erreur s'est produite");
      }

      return data.data as T;
    } catch (error: any) {
      // Graceful error handling for the frontend
      throw error;
    }
  }

  static get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "GET" });
  }

  static post<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, { method: "POST", body: JSON.stringify(body) });
  }

  static patch<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, { method: "PATCH", body: JSON.stringify(body) });
  }

  static delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}
