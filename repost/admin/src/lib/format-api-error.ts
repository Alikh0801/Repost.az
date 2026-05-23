export function formatApiError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("coverimageurl") && lower.includes("url")) {
    return "Üz şəkli URL-i düzgün deyil. Tam link yazın (https://...) və ya sahəni boş buraxın.";
  }

  if (lower.includes("summary") && lower.includes("10")) {
    return "Xülasə (lead) hər dil üçün ən azı 10 simvol olmalıdır.";
  }

  if (lower.includes("title") && lower.includes("3")) {
    return "Başlıq hər dil üçün ən azı 3 simvol olmalıdır.";
  }

  if (lower.includes("imagealt")) {
    return "Şəkil alt mətni hər dil üçün doldurulmalıdır.";
  }

  if (lower.includes("body")) {
    return "Mətn hissəsində ən azı bir abzas olmalıdır.";
  }

  if (lower.includes("internal server error")) {
    return "Server xətası. API terminalını yoxlayın və bir az sonra təkrar cəhd edin.";
  }

  return message;
}
