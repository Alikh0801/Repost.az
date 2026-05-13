import type { AppMessages } from "./schema";
import type { AppMessagePath } from "./paths";

function getStringAtPath(root: AppMessages, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = root;
  for (const part of parts) {
    if (current === null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : undefined;
}

export function createTranslator(messages: AppMessages) {
  return function t(path: AppMessagePath): string {
    return getStringAtPath(messages, path) ?? path;
  };
}
