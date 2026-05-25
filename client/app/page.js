"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const heroImages = [
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1200&auto=format&fit=crop",
  "https://images.squarespace-cdn.com/content/v1/67f5cab6225dcf7a8c5efa83/debb6833-0020-4e24-890e-45448d486760/Blue-Pools-Wanaka-Bridge.jpg",
  "https://img.magnific.com/free-photo/snowy-summit-landscape_198169-181.jpg?semt=ais_hybrid&w=740&q=80",
  "https://media.istockphoto.com/id/1360554439/photo/maldives-tropical-island.jpg?s=612x612&w=0&k=20&c=1UUnuM-RyTYVkt1_YIMIzNe3JXdEeUTWngiEswms6MQ=",
  "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop",
];





const LandingPage = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.clientWidth / 2; // scroll half viewport width
      const scrollTo = direction === "left"
        ? scrollRef.current.scrollLeft - cardWidth
        : scrollRef.current.scrollLeft + cardWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#41521F] overflow-hidden ">

      {/* HERO SECTION */}
      <section className="relative px-8 lg:px-24 py-20  mt-10">

        {/* Background Blur */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#DBD56E]/20 rounded-full blur-3xl"></div>

        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#95A472]/20 rounded-full blur-3xl"></div>

        <div className="relative grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <div className="max-w-2xl">

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1e2a03] leading-[1.05] mt-8">
              {t("heroTitle1")}
              <br />
              <span className="text-[#88AB75]">
                {t("heroTitle2")}
              </span>
            </h1>

            {/* Modern Paragraph */}
            <div className="mt-10 max-w-xl">

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-[1px] bg-[#95A472]"></div>
                <p className="uppercase tracking-[0.28em] text-[11px] text-[#6e674f] font-medium">
                  {t("heroSubtitle")}
                </p>
              </div>

              <p className="text-[1.1rem] leading-[2.1rem] text-[#4b4b4b] font-light">
                {t("heroDesc")}
              </p>

            </div>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-5 mt-12">

              {/* Primary Button */}
              <button
                onClick={() => router.push("/tracker")}
                className="group cursor-pointer bg-[#1e2a03] hover:bg-[#2b3811] text-white px-8 py-4 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
              >
                {t("startTracking")}
                <span className="group-hover:translate-x-1 transition-all duration-300">
                  →
                </span>
              </button>

              {/* Secondary */}
              <button
                onClick={() => setOpen(true)}
                className="border border-[#95A472]/20 bg-white hover:bg-[#f5f7f2] hover:border-[#95A472] text-[#41521F] px-8 py-4 rounded-2xl transition-all duration-300 shadow-sm"
              >
                {t("learnMore")}
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative w-full flex justify-center mt-10">

            {/* Background Layer */}
            <div className="absolute inset-0 bg-[#dfe9d4] rounded-[40px] rotate-6 scale-98"></div>

            {/* Main Image */}
            <div className="relative bg-white rounded-[40px] p-4 shadow-2xl border border-[#95A472]/10">

              {/* Carousel Image Container */}
              <div
                className="relative overflow-hidden cursor-pointer w-full sm:w-[90%] lg:w-[750px] h-[250px] sm:h-[350px] lg:h-[450px] rounded-[28px] select-none group"
                onClick={nextImage}
              >
                {heroImages.map((img, idx) => (
                  <img
                    key={img}
                    src={img}
                    alt={`Nature slide ${idx + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${idx === currentImageIndex
                      ? "opacity-100 z-10 scale-100 animate-fade-in"
                      : "opacity-0 z-0 scale-105"
                      }`}
                  />
                ))}

                {/* Left/Right Navigation Buttons on Hover */}
                <div className="absolute ml-20 inset-x-4 top-1/2 -translate-y-1/2 flex justify-between z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <button
                    className="w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 pointer-events-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    aria-label="Previous slide"
                  >
                    <span className="text-[#1e2a03] font-bold text-lg">←</span>
                  </button>
                  <button
                    className="w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 pointer-events-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    aria-label="Next slide"
                  >
                    <span className="text-[#1e2a03] font-bold text-lg">→</span>
                  </button>
                </div>

                {/* Dot Indicators */}
                <div className="absolute bottom-6 right-8 flex gap-2 z-20">
                  {heroImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(idx);
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentImageIndex
                        ? "bg-[#1e2a03] w-6"
                        : "bg-white/60 hover:bg-white"
                        }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-8 left-16 bg-white shadow-xl border border-[#95A472]/10 rounded-3xl px-6 py-5 z-20">
                <p className="uppercase tracking-[0.2em] text-[9px] text-[#95A472] font-semibold">
                  {t("environmentalScore")}
                </p>

                <div className="flex items-end gap-3 mt-2">
                  <h1 className="text-4xl font-bold text-[#1e2a03]">
                    92%
                  </h1>

                  <p className="text-sm text-green-600 font-medium mb-1">
                    {t("excellentStatus")}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
        {/* POPUP MODAL */}
        {open && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-5">

            {/* MODAL BOX */}
            <div className="relative bg-[#F8F7F2] max-w-3xl w-full rounded-[35px] p-8 lg:p-12 shadow-2xl border border-[#DBD56E]/40 overflow-y-auto max-h-[90vh]">

              {/* CLOSE BUTTON */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#95A472]/20 hover:bg-[#95A472]/40 text-[#41521F] text-2xl flex items-center justify-center transition"
              >
                ×
              </button>

              {/* HEADING */}
              <div className="mb-8">
                <p className="uppercase tracking-[5px] text-[#808a66] mb-3">
                  {t("learnMore")}
                </p>

                <h2 className="text-4xl font-bold text-[#41521F]">
                  {t("carbonFootprintQuestion")}
                  <span className="text-[#88AB75]"> {t("carbonFootprintAccent")}</span>
                </h2>
              </div>

              {/* CONTENT */}
              <div className="space-y-6 text-[#776D5A] leading-8">
                <p>
                  {t("aboutFootprintDesc1")}
                </p>

                <p>
                  {t("aboutFootprintDesc2")}
                </p>

                {/* POINTS */}
                <div>
                  <h3 className="text-2xl font-semibold text-[#41521F] mb-4">
                    {t("majorCausesTitle")}
                  </h3>

                  <ul className="space-y-3 list-disc pl-6">
                    <li>{t("majorCauses1")}</li>
                    <li>{t("majorCauses2")}</li>
                    <li>{t("majorCauses3")}</li>
                    <li>{t("majorCauses4")}</li>
                    <li>{t("majorCauses5")}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-[#41521F] mb-4">
                    {t("whyReducingMattersTitle")}
                  </h3>

                  <p>
                    {t("whyReducingMattersDesc")}
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-[#41521F] mb-4">
                    {t("simpleWaysTitle")}
                  </h3>

                  <ul className="space-y-3 list-disc pl-6">
                    <li>{t("simpleWays1")}</li>
                    <li>{t("simpleWays2")}</li>
                    <li>{t("simpleWays3")}</li>
                    <li>{t("simpleWays4")}</li>
                    <li>{t("simpleWays5")}</li>
                  </ul>
                </div>

                {/* END QUOTE */}
                <div className="mt-8 border-l-4 border-[#95A472] pl-5 italic">
                  <p className="text-[#41521F] text-xl">
                    {t("smallSustainableActions")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* WHY CHOOSE US */}
      <section className="px-8 lg:px-24 py-24">

        <div className="text-center mb-16">
          <p className="uppercase tracking-[5px] text-[#95A472] mb-3">
            {t("learnMore")}
          </p>

          <h2 className="text-4xl lg:text-5xl font-bold text-[#41521F]">
            {t("whyChooseUsTitle")}
            <span className="text-[#88AB75]"> {t("whyChooseUsAccent")}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10">

          {/* CARD */}
          <div className="group bg-white hover:bg-[#95A472] p-10 pt-16 rounded-[30px] shadow-lg hover:-translate-y-2 transition duration-300 border border-[#DBD56E]/40 relative">

            {/* ICON */}
            <div className="absolute -top-7 left-8 w-20 h-20 rounded-2xl border-4 border-[#F8F7F2] bg-white shadow-md flex items-center justify-center overflow-hidden group-hover:scale-105 transition">
              <img
                src="https://img.freepik.com/free-vector/houseplant-classic-pot-nature-icon_18591-82630.jpg?semt=ais_hybrid&w=740&q=80"
                alt="plant"
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-2xl font-semibold mb-4 text-[#41521F] group-hover:text-white transition">
              {t("realTimeTracking")}
            </h3>

            <p className="text-[#776D5A] group-hover:text-white/90 leading-8 transition">
              {t("realTimeTrackingDesc")}
            </p>
          </div>

          {/* CARD */}
          <div className="group bg-white hover:bg-[#95A472] p-10 pt-16 rounded-[30px] shadow-lg hover:-translate-y-2 transition duration-300 border border-[#DBD56E]/40 relative">

            {/* ICON */}
            <div className="absolute -top-7 left-8 w-20 h-20 rounded-2xl border-4 border-[#F8F7F2] bg-white shadow-md flex items-center justify-center overflow-hidden group-hover:scale-105 transition">
              <img
                src="https://img.freepik.com/free-vector/houseplant-classic-pot-nature-icon_18591-82630.jpg?semt=ais_hybrid&w=740&q=80"
                alt="plant"
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-2xl font-semibold mb-4 text-[#41521F] group-hover:text-white transition">
              {t("communitySupport")}
            </h3>

            <p className="text-[#776D5A] group-hover:text-white/90 leading-8 transition">
              {t("communitySupportDesc")}
            </p>
          </div>

          {/* CARD */}
          <div className="group bg-white hover:bg-[#95A472] p-10 pt-16 rounded-[30px] shadow-lg hover:-translate-y-2 transition duration-300 border border-[#DBD56E]/40 relative">

            {/* ICON */}
            <div className="absolute -top-7 left-8 w-20 h-20 rounded-2xl border-4 border-[#F8F7F2] bg-white shadow-md flex items-center justify-center overflow-hidden group-hover:scale-105 transition">
              <img
                src="https://img.freepik.com/free-vector/houseplant-classic-pot-nature-icon_18591-82630.jpg?semt=ais_hybrid&w=740&q=80"
                alt="plant"
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-2xl font-semibold mb-4 text-[#41521F] group-hover:text-white transition">
              {t("smartReports")}
            </h3>

            <p className="text-[#776D5A] group-hover:text-white/90 leading-8 transition">
              {t("smartReportsDesc")}
            </p>
          </div>
        </div>
      </section>

      {/* Small Change, Big Impact */}
      <div className="mt-20 overflow-hidden">

        {/* Heading */}
        <div className="text-center mb-12">

          <h1 className="text-3xl md:text-5xl font-black text-[#1e2a03] leading-tight">
            {t("smallChangesTitle")}
            <span className="text-[#88AB75]">
              {" "}
              {t("smallChangesAccent")}
            </span>
          </h1>

          <p className="text-[#41521F]/70 text-sm md:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            {t("smallChangesDesc")}
          </p>

        </div>

        {/* Carousel */}
        <div className="relative mx-4 sm:mx-8 lg:mx-16">

          {/* Gradient Left */}
          <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-[#F8F7F2] to-transparent z-10 pointer-events-none"></div>

          {/* Gradient Right */}
          <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-[#F8F7F2] to-transparent z-10 pointer-events-none"></div>

          {/* Scroll Container */}
          <div className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-6 px-1">

            {/* CARD */}
            {[
              {
                icon: "🌳",
                title: t("carouselTitle1"),
                desc: t("carouselDesc1"),
                bgColor: "bg-[#eef6e8]",
              },
              {
                icon: "🚲",
                title: t("carouselTitle2"),
                desc: t("carouselDesc2"),
                bgColor: "bg-[#eef6e8]",
              },
              {
                icon: "💡",
                title: t("carouselTitle3"),
                desc: t("carouselDesc3"),
                bgColor: "bg-[#eef6e8]",
              },
              {
                icon: "🚌",
                title: t("carouselTitle4"),
                desc: t("carouselDesc4"),
                bgColor: "bg-[#eef6e8]",
              },
              {
                icon: "♻️",
                title: t("carouselTitle5"),
                desc: t("carouselDesc5"),
                bgColor: "bg-[#eef6e8]",
              },
              {
                icon: "💧",
                title: t("carouselTitle6"),
                desc: t("carouselDesc6"),
                bgColor: "bg-[#eef6e8]",
              },
            ].map((item, index) => (

              <div
                key={index}
                className="group w-[85%] sm:w-[290px] md:w-[calc((100%-20px)/2)] lg:w-[calc((100%-40px)/3)] h-[135px] shrink-0 snap-center bg-white rounded-3xl border border-[#95A472]/10 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-start gap-4"
              >

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${item.bgColor} flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm`}>
                  {item.icon}
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between h-full min-w-0">
                  <div>
                    <h2 className="text-base font-extrabold text-[#1e2a03] truncate">
                      {item.title}
                    </h2>

                    <p className="text-[#41521F]/70 text-xs mt-1 leading-relaxed line-clamp-3">
                      {item.desc}
                    </p>
                  </div>
                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* TESTIMONIALS */}
      <section className="px-5 lg:px-16 py-20 bg-[#F1F0E8] overflow-hidden">

        {/* Heading */}
        <div className="text-center">

          <p className="uppercase tracking-[3px] text-[#88AB75] text-[11px] font-bold">
            {t("testimonialsTitle")}
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1e2a03] mt-3 leading-tight">
            {t("testimonialsSubtitle")}
            <span className="text-[#88AB75]">
              {" "}
              {t("testimonialsAccent")}
            </span>
          </h2>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-14">

          {/* CARD 1 */}
          <div className="group relative bg-white rounded-[32px] border border-[#DBD56E]/20 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">

            <div className="p-6">

              {/* User */}
              <div className="flex items-center gap-4">

                <div className="relative">
                  <div className="absolute inset-0 bg-[#DBD56E]/30 blur-xl rounded-full"></div>
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="user"
                    className="relative w-16 h-16 rounded-full object-cover border-[3px] border-white shadow-md"
                  />
                </div>

                <div>
                  <h4 className="font-bold text-lg text-[#1e2a03]">
                    {t("testimonial1Name")}
                  </h4>

                  <p className="text-[#88AB75] text-xs font-medium mt-0.5">
                    {t("testimonial1Job")}
                  </p>
                </div>

              </div>

              {/* Quote */}
              <div className="mt-6">

                <div className="text-5xl text-[#DBD56E] leading-none font-serif">
                  “
                </div>

                <p className="text-[#776D5A] leading-7 text-[14px] -mt-3">
                  {t("testimonial1Text")}
                </p>

              </div>

              {/* Bottom */}
              <div className="mt-6 flex items-center justify-between">

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-[#DBD56E]"
                    />
                  ))}
                </div>

                <span className="text-[11px] text-[#95A472] font-semibold uppercase tracking-[2px]">
                  {t("verified")}
                </span>

              </div>

            </div>

          </div>

          {/* CARD 2 */}
          <div className="group relative bg-[#41521F] rounded-[32px] overflow-hidden shadow-lg hover:-translate-y-2 transition-all duration-500">

            {/* Glow */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#DBD56E]/20 blur-3xl rounded-full"></div>

            <div className="relative p-6">

              {/* User */}
              <div className="flex items-center gap-4">

                <div className="relative">
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="user"
                    className="w-16 h-16 rounded-full object-cover border-[3px] border-white/20 shadow-md"
                  />
                </div>

                <div>
                  <h4 className="font-bold text-lg text-white">
                    {t("testimonial2Name")}
                  </h4>

                  <p className="text-[#DBD56E] text-xs font-medium mt-0.5">
                    {t("testimonial2Job")}
                  </p>
                </div>

              </div>

              {/* Quote */}
              <div className="mt-6">

                <div className="text-5xl text-[#DBD56E] leading-none font-serif">
                  “
                </div>

                <p className="text-white/80 leading-7 text-[14px] -mt-3">
                  {t("testimonial2Text")}
                </p>

              </div>

              {/* Bottom */}
              <div className="mt-6 flex items-center justify-between">

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-[#DBD56E]"
                    />
                  ))}
                </div>

                <span className="text-[11px] text-[#DBD56E] font-semibold uppercase tracking-[2px]">
                  {t("topUser")}
                </span>

              </div>

            </div>

          </div>

          {/* CARD 3 */}
          <div className="group relative bg-white rounded-[32px] border border-[#DBD56E]/20 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">

            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#95A472]/10 blur-3xl rounded-full"></div>

            <div className="relative p-6">

              {/* User */}
              <div className="flex items-center gap-4">

                <div className="relative">
                  <img
                    src="https://randomuser.me/api/portraits/men/65.jpg"
                    alt="user"
                    className="w-16 h-16 rounded-full object-cover border-[3px] border-white shadow-md"
                  />
                </div>

                <div>
                  <h4 className="font-bold text-lg text-[#1e2a03]">
                    {t("testimonial3Name")}
                  </h4>

                  <p className="text-[#88AB75] text-xs font-medium mt-0.5">
                    {t("testimonial3Job")}
                  </p>
                </div>

              </div>

              {/* Quote */}
              <div className="mt-6">

                <div className="text-5xl text-[#DBD56E] leading-none font-serif">
                  “
                </div>

                <p className="text-[#776D5A] leading-7 text-[14px] -mt-3">
                  {t("testimonial3Text")}
                </p>

              </div>

              {/* Bottom */}
              <div className="mt-6 flex items-center justify-between">

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-[#DBD56E]"
                    />
                  ))}
                </div>

                <span className="text-[11px] text-[#95A472] font-semibold uppercase tracking-[2px]">
                  {t("ecoMember")}
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Minimal CTA Section */}
      <div className="mt-24 mb-10 px-4">

        <div
          className="relative overflow-hidden rounded-[40px] py-24 px-6 md:px-16 text-center shadow-2xl"
          style={{
            backgroundImage:
              "url('https://www.thetimes.com/imageserver/image/methode%2Ftimes%2Fprod%2Fweb%2Fbin%2Fd87a2016-971b-492f-96c4-41cb57b1d08d.jpg?strip=all&format=webp&crop=1564px%2C880px%2C317px%2C0px&resize=1328')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/55"></div>

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto">

            {/* Small Tag */}
            <p className="uppercase tracking-[0.3em] text-[11px] text-[#DBD56E] font-semibold">
              {t("sustainableFuture")}
            </p>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-6 leading-tight">
              {t("startBuildingHeading")}
              <br />
              <span className="text-[#b7d49d]">
                {t("startBuildingAccent")}
              </span>
            </h1>

            {/* Description */}
            <p className="text-gray-200 text-sm md:text-lg leading-relaxed mt-6 max-w-2xl mx-auto">
              {t("startBuildingDesc")}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">

              {/* secondary */}
              <Link href="/about">
                <button className="bg-white hover:bg-[#f5f7f2] text-[#1e2a03] px-8 py-4 rounded-2xl text-sm md:text-base font-medium transition-all duration-300 hover:scale-105 shadow-xl">
                  {t("aboutUs")}
                </button>
              </Link>

              {/* Primary */}
              <Link href="/tracker">
                <button className="bg-white hover:bg-[#f5f7f2] text-[#1e2a03] px-8 py-4 rounded-2xl text-sm md:text-base font-medium transition-all duration-300 hover:scale-105 shadow-xl">
                  {t("startTracking")} →
                </button>
              </Link>

              {/* Secondary */}
              <Link href="/dashboard">
                <button className="bg-white hover:bg-[#f5f7f2] text-[#1e2a03] px-8 py-4 rounded-2xl text-sm md:text-base font-medium transition-all duration-300 hover:scale-105 shadow-xl">
                  {t("viewDashboard")}
                </button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;