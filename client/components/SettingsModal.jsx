import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

const SettingsModal = ({ isOpen, onClose }) => {
  const { language, setLanguage, t } = useLanguage();
  const [tempLang, setTempLang] = useState(language);
  const [tempNotif, setTempNotif] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setTempLang(language);
      setTempNotif(localStorage.getItem("notificationsEnabled") !== "false");
    }
  }, [isOpen, language]);

  if (!isOpen) return null;

  const handleSave = () => {
    setLanguage(tempLang);
    localStorage.setItem("notificationsEnabled", tempNotif ? "true" : "false");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      {/* Modal */}
      <div className="w-full max-w-lg rounded-[30px] bg-white shadow-2xl border border-[#95A472]/10 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Top */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#95A472]/10">
          <div>
            <h2 className="text-2xl font-bold text-[#1e2a03]">
              {t("settings")}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {t("settingsDesc")}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-[#f5f7f2] flex items-center justify-center transition-all cursor-pointer text-[#1e2a03] font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Notifications */}
          <div className="flex items-center justify-between bg-[#f5f7f2] rounded-2xl px-5 py-4">
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
          <div className="bg-[#f5f7f2] rounded-2xl px-5 py-4">
            <h3 className="font-semibold text-[#1e2a03]">
              {t("language")}
            </h3>
            <select 
              value={tempLang}
              onChange={(e) => setTempLang(e.target.value)}
              className="w-full mt-3 bg-white border border-[#95A472]/10 rounded-xl px-4 py-3 outline-none text-sm cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">Hindi (हिंदी)</option>
            </select>
          </div>
        </div>

        {/* Bottom */}
        <div className="px-6 py-5 border-t border-[#95A472]/10 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#95A472]/10 text-[#41521F] hover:bg-[#f5f7f2] transition-all cursor-pointer text-sm font-semibold"
          >
            {t("cancel")}
          </button>
          <button 
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-[#41521F] text-white hover:bg-[#1e2a03] transition-all shadow-md cursor-pointer text-sm font-semibold"
          >
            {t("saveChanges")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
