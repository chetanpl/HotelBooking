"use client";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const switchLanguage = (targetLocale:string) => {
    const currentLocalePattern = new RegExp(`^/${locale}`);
    const newPath = pathname.replace(currentLocalePattern, `/${targetLocale}`);
    router.push(newPath);
  };

  return (
    <div>
      <button onClick={() => switchLanguage("en")}>🇬🇧 English</button>
      <button onClick={() => switchLanguage("de")}>🇩🇪 Deutsch</button>
    </div>
  );
}
