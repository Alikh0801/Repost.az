import { API_BASE } from "./config";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const data = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(data.message)) message = data.message.join(", ");
      else if (data.message) message = data.message;
    } catch {
      /* ignore */
    }
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

export function apiPost(path: string): void {
  void fetch(`${API_BASE}${path}`, { method: "POST" }).catch(() => {
    /* view count is best-effort */
  });
}
