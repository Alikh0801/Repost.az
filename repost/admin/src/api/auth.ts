import { apiRequest, setToken } from "./client";

type LoginResponse = {
  accessToken: string;
  user: { id: string; email: string; role: string };
};

export async function login(email: string, password: string) {
  const data = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    auth: false,
    body: { email, password },
  });
  setToken(data.accessToken);
  return data.user;
}
