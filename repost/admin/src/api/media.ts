import { apiRequest } from "./client";

type UploadResponse = { url: string; filename: string };

export function uploadImage(file: File) {
  const form = new FormData();
  form.append("file", file);
  return apiRequest<UploadResponse>("/admin/media/upload", {
    method: "POST",
    body: form,
  });
}
