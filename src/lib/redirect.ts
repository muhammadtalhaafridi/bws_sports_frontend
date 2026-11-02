/** Only allow redirects inside this site. */
export function safeRedirect(value: string | null): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}
