import { api } from "@/lib/axios";
import { User } from "@/types";

export type AuthResponse = {
  accessToken: string;
  user: User;
};

export const authService = {
  async login(data: any): Promise<AuthResponse> {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  async register(data: any): Promise<AuthResponse> {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await api.get("/auth/me");
    return res.data;
  },
};
