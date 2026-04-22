import { api } from "./api";

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar_url: string | null;
  reports_count: number;
  likes_count: number;
  created_at: string;
};

export async function adminGetUsers(): Promise<AdminUser[]> {
  const res = await api.get("/admin/users");
  return res.data;
}

export async function adminUpdateUser(
  id: number,
  data: Partial<Pick<AdminUser, "name" | "email" | "role">>
): Promise<AdminUser> {
  const res = await api.put(`/admin/users/${id}`, data);
  return res.data;
}

export async function adminDeleteUser(id: number): Promise<void> {
  await api.delete(`/admin/users/${id}`);
}
