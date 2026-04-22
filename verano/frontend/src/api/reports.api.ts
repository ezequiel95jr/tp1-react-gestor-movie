import { api } from "./api";
import type { Report } from "../types/report";

export async function fetchReports(): Promise<Report[]> {
  const response = await api.get<Report[]>("/reports");
  return response.data;
}

type CreateReportPayload = {
  summary: string;
  description: string;
  category?: string;
  priority?: string;
  lat: number;
  lng: number;
};

export async function createReport(data: CreateReportPayload) {
  const res = await api.post("/reports", data);
  return res.data;
}
export async function updateReport(id: string, data: Partial<Report>) {
  const res = await api.put(`/reports/${id}`, data);
  return res.data;
}
export async function getReportById(id: string): Promise<Report> {
  const res = await api.get(`/reports/${id}`);
  return res.data;
}
export async function deleteReport(id: string) {
  const res = await api.delete(`/reports/${id}`);
  return res.data;
}
export async function getReports(page = 1) {
  const res = await api.get(`/reports?page=${page}`);
  return res.data;
}
export async function getAllReports() {
  const res = await api.get("/reports-all");
  return res.data;
}
export async function toggleLike(reportId: string) {
  const res = await api.post(`/reports/${reportId}/like`);
  return res.data;
}


export async function createComment(
  reportId: string,
  content: string
) {
  const res = await api.post(`/reports/${reportId}/comments`, {
    content,
  });
  return res.data;
}
export async function getMe() {
  const res = await api.get("/me");
  return res.data;
}

export async function updateProfile(data: { name?: string; email?: string; password?: string; password_confirmation?: string }) {
  const res = await api.put("/me", data);
  return res.data;
}

export async function getMyReports() {
  const res = await api.get("/me/reports");
  return res.data;
}

export async function uploadReportImage(reportId: string, file: File): Promise<{ id: number; image_url: string }> {
  const form = new FormData();
  form.append("image", file);
  const res = await api.post(`/reports/${reportId}/images`, form, {
    headers: { "Content-Type": undefined },
  });
  return res.data;
}

export async function uploadAvatar(file: File): Promise<{ avatar_url: string }> {
  const form = new FormData();
  form.append("avatar", file);
  const res = await api.post("/me/avatar", form, {
    headers: { "Content-Type": undefined },
  });
  return res.data;
}




