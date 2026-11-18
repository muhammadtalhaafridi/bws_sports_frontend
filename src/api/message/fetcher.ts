import { api } from "../../lib/api";

export async function sendMessage(input: { name: string; email: string; message: string }) {
  return (await api.post<{ message: string }>("/messages", input)).data;
}
