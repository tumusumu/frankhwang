export function formatDate(date: string, locale: string = "en") {
  return new Date(date).toLocaleDateString(
    locale === "zh" ? "zh-CN" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
}
