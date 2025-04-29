const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "sv", name: "Svenska", flag: "🇸🇪" },
  { code: "uk", name: "Українська", flag: "🇺🇦" },
  { code: "el", name: "Ελληνικά", flag: "🇬🇷" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "fa", name: "فارسی", flag: "🇮🇷" }
  // Liste uzatılabilir (toplam 178'e tamamlayacağım)
];

function initLanguageDropdown() {
  const select = document.getElementById("languageDropdown");
  const savedLang = localStorage.getItem("selectedLanguage");
  const browserLang = navigator.language.slice(0, 2);

  languages.forEach(lang => {
    const option = document.createElement("option");
    option.value = lang.code;
    option.textContent = `${lang.flag} ${lang.name}`;
    if (savedLang === lang.code || (!savedLang && lang.code === browserLang)) {
      option.selected = true;
    }
    select.appendChild(option);
  });

  if (!savedLang) {
    const defaultLang = browserLang || "en";
    localStorage.setItem("selectedLanguage", defaultLang);
  }

  select.addEventListener("change", () => {
    const newLang = select.value;
    localStorage.setItem("selectedLanguage", newLang);
    location.reload(); // dil değişince sayfa yenilenebilir
  });
}

document.addEventListener("DOMContentLoaded", initLanguageDropdown);
