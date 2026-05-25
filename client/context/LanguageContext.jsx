"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n"; // Import i18n config

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { t, i18n } = useTranslation();

  // Load language preference on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("appLanguage");
    if (savedLang && (savedLang === "en" || savedLang === "hi")) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const setLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("appLanguage", lang);
    window.dispatchEvent(new Event("language-change"));
  };

  return (
    <LanguageContext.Provider value={{ language: i18n.language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
