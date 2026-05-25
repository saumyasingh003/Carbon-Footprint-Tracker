"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

const SettingsPage = () => {
  const { language, setLanguage, t } = useLanguage();
  const [tempLang, setTempLang] = useState(language);
  const [tempNotif, setTempNotif] = useState(true);

  useEffect(() => {
    setTempLang(language);
    setTempNotif(localStorage.getItem("notificationsEnabled") !== "false");
  }, [language]);

  const handleSave = () => {
    setLanguage(tempLang);
    localStorage.setItem("notificationsEnabled", tempNotif ? "true" : "false");
    alert(language === "hi" ? "परिवर्तन सफलतापूर्वक सहेजे गए!" : "Changes saved successfully!");
  };

  return (
    <div className="min-h-screen bg-[#f5f7f2] px-4 sm:px-8 lg:px-16 pt-24 pb-16">
      <div className="max-w-xl mx-auto bg-white border border-[#95A472]/20 rounded-[30px] shadow-lg p-8 sm:p-10 mt-8">
        <div>
          <h1 className="text-3xl font-black text-[#1e2a03]">
            {t("settings")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t("settingsDesc")}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6 mt-8">
          {/* Notifications */}
          <div className="flex items-center justify-between bg-[#f5f7f2]/50 border border-[#95A472]/10 rounded-2xl px-5 py-4">
            <div>
              <h3 className="font-semibold text-[#1e2a03]">
                {t("notifications")}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {t("notificationsDesc")}
              </p>
            </div>
            <input 
              type="checkbox" 
              checked={tempNotif}
              onChange={(e) => setTempNotif(e.target.checked)}
              className="w-5 h-5 accent-[#41521F] cursor-pointer" 
            />
          </div>

          {/* Language */}
          <div className="bg-[#f5f7f2]/50 border border-[#95A472]/10 rounded-2xl px-5 py-4">
            <h3 className="font-semibold text-[#1e2a03]">
              {t("language")}
            </h3>
            <select 
              value={tempLang}
              onChange={(e) => setTempLang(e.target.value)}
              className="w-full mt-3 bg-white border border-[#95A472]/20 rounded-xl px-4 py-3 outline-none text-sm cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">Hindi (हिंदी)</option>
            </select>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-[#95A472]/10 flex justify-end gap-3">
          <button 
            onClick={handleSave}
            className="w-full py-3.5 rounded-xl bg-[#41521F] text-white hover:bg-[#1e2a03] transition-all shadow-md cursor-pointer text-sm font-bold"
          >
            {t("saveChanges")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
