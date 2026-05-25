"use client";

import { Leaf, Mountain, Trees, Waves } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const About = () => {
    const { t } = useLanguage();

    return (
        <div>

            {/* Nature Voices Section */}
            <section className="py-24 px-5 sm:px-10 lg:px-20 bg-[#eef2e6]/45 border-y border-[#95A472]/15">

                <div className="max-w-7xl mx-auto">

                    {/* Heading */}
                    <div className="text-center mb-24">
                        <p className="uppercase tracking-[0.25em] text-[#95A472] text-xs font-bold">
                            {t("voicesOfNature")}
                        </p>

                        <h2 className="text-3xl sm:text-5xl font-extrabold mt-4 text-[#1e2a03] leading-tight">
                            {t("natureSpeak")}
                        </h2>
                    </div>

                    {/* SECTION 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-28">

                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.9 }}
                        >

                            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/50 flex items-center justify-center">
                                <Mountain className="text-amber-700" size={28} />
                            </div>

                            <h3 className="text-4xl font-bold mt-8 text-[#1e2a03]">
                                {t("mountainsMelting")}
                            </h3>

                            <p className="text-[#41521F]/75 mt-7 leading-9 text-base font-medium">
                                {t("mountainsDesc")}
                            </p>

                            <p className="text-gray-500 mt-5 leading-8 text-sm">
                                {t("mountainsSub")}
                            </p>

                        </motion.div>

                        {/* Right Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                            className="relative h-[300px] sm:h-[420px] overflow-hidden rounded-[35px] shadow-2xl"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
                                alt="Mountains"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </motion.div>

                    </div>

                    {/* SECTION 2 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-28">

                        {/* Left Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                            className="relative h-[300px] sm:h-[420px] overflow-hidden rounded-[35px] shadow-2xl order-2 lg:order-1"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
                                alt="Forests"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </motion.div>

                        {/* Right Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.9 }}
                            className="order-1 lg:order-2"
                        >

                            <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-200/50 flex items-center justify-center">
                                <Trees className="text-green-700" size={28} />
                            </div>

                            <h3 className="text-4xl font-bold mt-8 text-[#1e2a03]">
                                {t("forestsFading")}
                            </h3>

                            <p className="text-[#41521F]/75 mt-7 leading-9 text-base font-medium">
                                {t("forestsDesc")}
                            </p>

                            <p className="text-gray-500 mt-5 leading-8 text-sm">
                                {t("forestsSub")}
                            </p>

                        </motion.div>

                    </div>

                    {/* SECTION 3 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-28">

                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.9 }}
                        >

                            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200/50 flex items-center justify-center">
                                <Waves className="text-blue-700" size={28} />
                            </div>

                            <h3 className="text-4xl font-bold mt-8 text-[#1e2a03]">
                                {t("oceansRising")}
                            </h3>

                            <p className="text-[#41521F]/75 mt-7 leading-9 text-base font-medium">
                                {t("oceansDesc")}
                            </p>

                            <p className="text-gray-500 mt-5 leading-8 text-sm">
                                {t("oceansSub")}
                            </p>

                        </motion.div>

                        {/* Right Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                            className="relative h-[300px] sm:h-[420px] overflow-hidden rounded-[35px] shadow-2xl"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                                alt="Ocean"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </motion.div>

                    </div>

                    {/* SECTION 4 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

                        {/* Left Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                            className="relative h-[300px] sm:h-[420px] overflow-hidden rounded-[35px] shadow-2xl order-2 lg:order-1"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e"
                                alt="Earth"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </motion.div>

                        {/* Right Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.9 }}
                            className="order-1 lg:order-2"
                        >

                            <div className="w-14 h-14 rounded-2xl bg-[#f5f7f2] border border-[#95A472]/20 flex items-center justify-center">
                                <Leaf className="text-[#41521F]" size={28} />
                            </div>

                            <h3 className="text-4xl font-bold mt-8 text-[#1e2a03]">
                                {t("earthBelieves")}
                            </h3>

                            <p className="text-[#41521F]/75 mt-7 leading-9 text-base font-medium">
                                {t("earthDesc")}
                            </p>

                            <p className="text-gray-500 mt-5 leading-8 text-sm">
                                {t("earthSub")}
                            </p>

                        </motion.div>

                    </div>

                </div>

            </section>

            {/* How we are calculating footprints */}

            <section className="px-5 sm:px-8 lg:px-24 py-24 bg-[#eef2e6]/40 border-y border-[#95A472]/10 overflow-hidden">

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* LEFT CONTENT */}
                    <div>

                        <p className="uppercase tracking-[0.25em] text-[#95A472] text-xs font-bold">
                            {t("carbonIntelligence")}
                        </p>

                        <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1e2a03] mt-5 leading-tight">
                            {t("howWeCalculate")}
                            <br />
                            {t("howWeCalculateSub")}
                        </h2>

                        <p className="text-[#41521F]/75 mt-8 leading-9 text-base max-w-2xl">
                            {t("calcDesc")}
                        </p>

                        {/* Feature Points */}
                        <div className="space-y-5 mt-10">

                            <div className="flex items-start gap-4">
                                <div className="w-3 h-3 rounded-full bg-[#41521F] mt-2"></div>

                                <p className="text-[#41521F]/80 leading-8">
                                    Transportation emissions based on distance travelled and fuel type.
                                </p>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-3 h-3 rounded-full bg-[#41521F] mt-2"></div>

                                <p className="text-[#41521F]/80 leading-8">
                                    Electricity consumption calculated using regional emission factors.
                                </p>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-3 h-3 rounded-full bg-[#41521F] mt-2"></div>

                                <p className="text-[#41521F]/80 leading-8">
                                    Food and lifestyle activities converted into CO₂ equivalents.
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* RIGHT FORMULA CARD */}
                    <div className="relative">

                        {/* Glow */}
                        <div className="absolute -inset-4 bg-[#95A472]/10 blur-3xl rounded-[40px]"></div>

                        <div className="relative bg-white border border-[#95A472]/15 rounded-[35px] shadow-2xl p-8 sm:p-10 overflow-hidden">

                            {/* Small Label */}
                            <div className="inline-flex items-center gap-2 bg-[#eef2e6] px-4 py-2 rounded-full">
                                <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>

                                <p className="text-[11px] font-semibold tracking-wider text-[#41521F] uppercase">
                                    {t("liveFormula")}
                                </p>
                            </div>

                            {/* Formula */}
                            <div className="mt-10">

                                <h3 className="text-2xl font-bold text-[#1e2a03]">
                                    {t("formulaTitle")}
                                </h3>

                                <div className="mt-8 bg-[#04110A] rounded-3xl p-6 sm:p-8 overflow-x-auto">

                                    <p className="text-[#DBD56E]  font-mono leading-relaxed whitespace-nowrap">
                                        Carbon Footprint =
                                    </p>

                                    <p className="text-white  font-mono mt-4 whitespace-nowrap">
                                        Activity Data × Emission Factor
                                    </p>

                                </div>

                                {/* Example */}
                                <div className="mt-8 space-y-4">

                                    <h4 className="text-lg font-bold text-[#1e2a03]">
                                        {t("exampleTitle")}
                                    </h4>

                                    <div className="bg-[#f5f7f2] rounded-2xl p-5 border border-[#95A472]/10">

                                        <p className="text-[#41521F]/80 leading-8">
                                            If a user drives a car for:
                                        </p>

                                        <div className="mt-4 text-[#1e2a03] font-semibold text-lg">
                                            20 km × 0.21 kg CO₂/km
                                        </div>

                                        <div className="mt-4 h-[1px] bg-[#95A472]/15"></div>

                                        <div className="mt-4 text-2xl font-extrabold text-[#1e2a03]">
                                            = 4.2 kg CO₂
                                        </div>

                                    </div>

                                </div>

                                {/* Bottom Text */}
                                <p className="text-gray-500 text-sm leading-7 mt-8">
                                    Emission factors are derived from internationally accepted
                                    environmental research datasets and sustainability standards.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>
        </div>
    );
};

export default About;