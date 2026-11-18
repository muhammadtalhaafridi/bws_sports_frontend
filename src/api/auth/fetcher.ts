import { api } from "../../lib/api";
import type { AuthResponse, User } from "../../lib/types";

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
  image?: File | null;
}

export interface ProfileInput {
  name: string;
  phone: string;
  address?: string;
  image?: File | null;
}

export async function loginUser(input: { email: string; password: string }) {
  return (await api.post<AuthResponse>("/auth/login", input)).data;
}

export async function registerUser({ image, ...fields }: RegisterInput) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value) form.append(key, value);
  }
  if (image) form.append("image", image);
  return (await api.post<AuthResponse>("/auth/register", form)).data;
}

export async function getMe() {
  return (await api.get<{ user: User }>("/auth/me")).data.user;
}

export async function updateProfile({ name, phone, address, image }: ProfileInput) {
  const form = new FormData();
  form.append("name", name);
  form.append("phone", phone);
  form.append("address", address ?? "");
  if (image) form.append("image", image);
  return (await api.put<{ user: User }>("/auth/me", form)).data.user;
}

export async function updatePassword(input: { currentPassword: string; newPassword: string }) {
  return (await api.put<{ message: string }>("/auth/me/password", input)).data;
}

export async function requestResetCode(input: { email: string }) {
  return (await api.post<{ message: string; devResetCode?: string }>("/auth/forgot-password", input)).data;
}

export async function verifyResetCode(input: { email: string; code: string }) {
  return (await api.post<{ message: string }>("/auth/verify-reset-code", input)).data;
}

export async function resetPassword(input: { email: string; code: string; password: string }) {
  return (await api.post<{ message: string }>("/auth/reset-password", input)).data;
}
