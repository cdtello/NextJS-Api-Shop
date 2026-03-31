export class ApiError extends Error {
  public status: number;
  public data: { statusCode: number; message: string | string[]; error: string };

  constructor(
    status: number,
    data: { statusCode: number; message: string | string[]; error: string }
  ) {
    const msg = Array.isArray(data.message)
      ? data.message.join(", ")
      : data.message;
    super(msg);
    this.status = status;
    this.data = data;
  }
}

export const apiClient = {
  async get<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new ApiError(res.status, await res.json());
    return res.json();
  },

  async post<T>(url: string, data: unknown): Promise<T> {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new ApiError(res.status, await res.json());
    return res.json();
  },

  async patch<T>(url: string, data: unknown): Promise<T> {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new ApiError(res.status, await res.json());
    return res.json();
  },

  async delete<T>(url: string): Promise<T> {
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) throw new ApiError(res.status, await res.json());
    return res.json().catch(() => undefined) as Promise<T>;
  },
};
