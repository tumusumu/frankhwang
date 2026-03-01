import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { routing } from "@/i18n/routing";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextIntlClientProvider>
        <div className="flex min-h-screen flex-col">
          <Nav />
          <main className="mx-auto w-full max-w-[680px] flex-1 px-6 py-12">
            {children}
          </main>
          <Footer />
        </div>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
