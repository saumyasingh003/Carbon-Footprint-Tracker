"use client";

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const Footer = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

  if (pathname === "/community") {
    return null;
  }

  return (
    <>
      {/* FOOTER */}
      <footer className="bg-[#41521F] text-white px-8 lg:px-24 py-16 print:hidden">

        <div className="grid md:grid-cols-3 gap-12">

          {/* LOGO */}
          <div>
            <h2 className="text-4xl font-bold text-[#DBD56E] mb-4">
              Vashudha
            </h2>

            <p className="text-gray-200 leading-8">
              {t("footerDesc")}
            </p>
          </div>

          {/* LINKS */}
          <div>
            <h3 className="text-2xl font-semibold mb-5">
              {t("quickLinks")}
            </h3>

            <ul className="space-y-3 text-gray-200">
              <li className="hover:text-[#DBD56E] cursor-pointer">
                {t("homeLink")}
              </li>

              <li className="hover:text-[#DBD56E] cursor-pointer">
                {t("featuresLink")}
              </li>

              <li className="hover:text-[#DBD56E] cursor-pointer">
                {t("testimonialsLink")}
              </li>

              <Link href="/about">
                <li className="hover:text-[#DBD56E] cursor-pointer">
                  {t("aboutLink")}
                </li>
              </Link>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="text-2xl font-semibold mb-5">
              {t("stayUpdated")}
            </h3>

            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder={t("enterEmailPlaceholder")}
                className="px-5 py-4 rounded-2xl text-center bg-white text-black outline-none"
              />

              <button className="bg-[#DBD56E] text-[#41521F] font-semibold py-4 rounded-2xl hover:opacity-90 transition">
                {t("subscribeBtn")}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-14 pt-8 text-center text-gray-300">
          {t("allRightsReserved")}
        </div>
      </footer>
    </>
  )
}

export default Footer