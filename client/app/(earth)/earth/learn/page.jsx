"use client";

import React from "react";
import {
  Wind,
  CloudFog,
  Factory,
  Leaf,
  ShieldAlert,
  Activity,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const localTranslations = {
  en: {
    heroBadge: "Air Quality Awareness",
    heroTitle1: "Understand The",
    heroTitle2: " Air You Breathe",
    heroDesc: "Air pollution affects millions of people every day. Learn what PM2.5, PM10, CO, and CO₂ mean, how they impact your body, and what levels are considered safe for a healthier life.",
    effectsBody: "Effects on the Body",
    safeLevel: "Safe Level",
    dangerLevel: "Danger Level",
    whyMattersTitle: "Why Clean Air Matters",
    whyMattersDesc: "Cleaner air improves health, increases life expectancy, reduces respiratory diseases, and protects future generations from climate change. Even small reductions in pollution levels can create a huge positive impact on human life and the environment.",
    lungTag: "Healthier Lungs",
    climateTag: "Better Climate",
    futureTag: "Cleaner Future"
  },
  hi: {
    heroBadge: "वायु गुणवत्ता जागरूकता",
    heroTitle1: "उस हवा को",
    heroTitle2: " समझें जिसमें आप सांस लेते हैं",
    heroDesc: "वायु प्रदूषण हर दिन लाखों लोगों को प्रभावित करता है। जानें कि PM2.5, PM10, CO और CO₂ का क्या अर्थ है, वे आपके शरीर को कैसे प्रभावित करते हैं, और स्वस्थ जीवन के लिए कौन से स्तर सुरक्षित माने जाते हैं।",
    effectsBody: "शरीर पर प्रभाव",
    safeLevel: "सुरक्षित स्तर",
    dangerLevel: "खतरनाक स्तर",
    whyMattersTitle: "स्वच्छ हवा क्यों मायने रखती है",
    whyMattersDesc: "स्वच्छ हवा स्वास्थ्य में सुधार करती है, जीवन प्रत्याशा बढ़ाती है, श्वसन रोगों को कम करती है और भावी पीढ़ियों को जलवायु परिवर्तन से बचाती है। प्रदूषण के स्तर में थोड़ी सी कमी भी मानव जीवन और पर्यावरण पर बहुत बड़ा सकारात्मक प्रभाव डाल सकती है।",
    lungTag: "स्वस्थ फेफड़े",
    climateTag: "बेहतर जलवायु",
    futureTag: "स्वच्छ भविष्य"
  }
};

const getPollutionData = (lang) => {
  const isHi = lang === "hi";
  return [
    {
      title: isHi ? "PM2.5" : "PM2.5",
      icon: <CloudFog className="w-8 h-8 text-[#1e2a03]" />,
      color: "from-[#88AB75]/15 to-emerald-50/30",
      about: isHi
        ? "PM2.5 अत्यंत सूक्ष्म वायु कण होते हैं जो 2.5 माइक्रोमीटर से छोटे होते हैं। ये कण फेफड़ों में गहराई तक और यहाँ तक कि रक्तप्रवाह में भी प्रवेश कर सकते हैं।"
        : "PM2.5 are extremely tiny air particles smaller than 2.5 micrometers. These particles can enter deep into the lungs and even the bloodstream.",
      effects: isHi
        ? [
            "सांस लेने में समस्या",
            "दमा (अस्थमा) के दौरे",
            "हृदय रोग",
            "फेफड़ों की कार्यक्षमता में कमी",
          ]
        : [
            "Breathing problems",
            "Asthma attacks",
            "Heart diseases",
            "Reduced lung function",
          ],
      safe: isHi ? "आदर्श: 15 µg/m³ से नीचे" : "Ideal: Below 15 µg/m³",
      danger: isHi ? "35 µg/m³ से ऊपर खतरनाक" : "Dangerous above 35 µg/m³",
      tip: isHi
        ? "स्वास्थ्य के लिए PM2.5 का स्तर जितना कम हो, उतना ही बेहतर है।"
        : "Lower PM2.5 levels are always better for health.",
    },
    {
      title: isHi ? "PM10" : "PM10",
      icon: <Wind className="w-8 h-8 text-[#1e2a03]" />,
      color: "from-[#DBD56E]/15 to-lime-50/30",
      about: isHi
        ? "PM10 कण धूल और प्रदूषण के बड़े कण होते हैं जो धुएं, सड़क की धूल और औद्योगिक उत्सर्जन में पाए जाते हैं।"
        : "PM10 particles are larger dust and pollution particles found in smoke, road dust, and industrial emissions.",
      effects: isHi
        ? [
            "खांसी",
            "गले में खराश",
            "फेफड़ों में जलन",
            "सांस लेने में तकलीफ",
          ]
        : [
            "Coughing",
            "Throat irritation",
            "Lung irritation",
            "Breathing discomfort",
          ],
      safe: isHi ? "आदर्श: 45 µg/m³ से नीचे" : "Ideal: Below 45 µg/m³",
      danger: isHi ? "100 µg/m³ से ऊपर खतरनाक" : "Dangerous above 100 µg/m³",
      tip: isHi
        ? "कम PM10 वाली स्वच्छ हवा स्वास्थ्य के लिए बेहतर होती है।"
        : "Cleaner air with lower PM10 is healthier.",
    },
    {
      title: isHi ? "CO (कार्बन मोनोऑक्साइड)" : "CO (Carbon Monoxide)",
      icon: <Factory className="w-8 h-8 text-[#1e2a03]" />,
      color: "from-amber-100/20 to-orange-50/10",
      about: isHi
        ? "कार्बन मोनोऑक्साइड वाहनों, ईंधन जलने और औद्योगिक गतिविधियों से उत्पन्न होने वाली एक जहरीली गैस है।"
        : "Carbon Monoxide is a poisonous gas produced from vehicles, fuel burning, and industrial activities.",
      effects: isHi
        ? [
            "सिरदर्द",
            "चक्कर आना",
            "थकान",
            "उच्च स्तर पर यह जानलेवा हो सकता है",
          ]
        : [
            "Headaches",
            "Dizziness",
            "Fatigue",
            "Can become life-threatening at high levels",
          ],
      safe: isHi ? "आदर्श: 4 ppm से नीचे" : "Ideal: Below 4 ppm",
      danger: isHi ? "9 ppm से ऊपर खतरनाक" : "Dangerous above 9 ppm",
      tip: isHi
        ? "CO का स्तर हमेशा बहुत कम रहना चाहिए।"
        : "CO should always remain very low.",
    },
    {
      title: isHi ? "CO₂ (कार्बन डाइऑक्साइड)" : "CO₂ (Carbon Dioxide)",
      icon: <Leaf className="w-8 h-8 text-[#1e2a03]" />,
      color: "from-[#88AB75]/20 to-green-50/20",
      about: isHi
        ? "हवा में CO₂ प्राकृतिक रूप से मौजूद होती है, लेकिन उद्योगों और वाहनों से होने वाले अत्यधिक उत्सर्जन से जलवायु परिवर्तन में वृद्धि होती है।"
        : "CO₂ is naturally present in air, but excessive emissions from industries and vehicles contribute to climate change.",
      effects: isHi
        ? [
            "कमरों के भीतर हवा की खराब गुणवत्ता",
            "थकान",
            "एकाग्रता में कमी",
            "ग्लोबल वार्मिंग पर प्रभाव",
          ]
        : [
            "Poor air quality indoors",
            "Fatigue",
            "Reduced concentration",
            "Global warming impact",
          ],
      safe: isHi ? "कमरे के भीतर आदर्श स्तर: 800 ppm से नीचे" : "Ideal indoor level: Below 800 ppm",
      danger: isHi ? "1200 ppm से ऊपर खराब हवा" : "Poor air above 1200 ppm",
      tip: isHi
        ? "सामान्य स्तर ठीक है, लेकिन अत्यधिक CO₂ हानिकारक है।"
        : "Moderate levels are normal, but excess CO₂ is harmful.",
    },
  ];
};

const Learn = () => {
  const { language } = useLanguage();
  const currentLang = language === "hi" ? "hi" : "en";
  const pollutionData = getPollutionData(currentLang);
  const tLocal = (key) => localTranslations[currentLang]?.[key] || localTranslations["en"]?.[key] || key;

  return (
    <div className="min-h-screen bg-[#f5f7f2] text-[#41521F] pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#95A472]/30 bg-[#95A472]/10 text-[#1e2a03] text-xs font-semibold mb-4 shadow-sm">
          <ShieldAlert className="w-3.5 h-3.5 text-[#88AB75]" />
          {tLocal("heroBadge")}
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-[#1e2a03] leading-tight">
          {tLocal("heroTitle1")}
          <span className="text-[#88AB75]">{tLocal("heroTitle2")}</span>
        </h1>

        <p className="text-[#41521F]/80 mt-4 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          {tLocal("heroDesc")}
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mt-10">
        {pollutionData.map((item, index) => (
          <div
            key={index}
            className={`rounded-2xl border border-[#95A472]/20 bg-gradient-to-br ${item.color} shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 p-6 flex flex-col justify-between`}
          >
            <div>
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-white border border-[#95A472]/20 flex items-center justify-center mb-4 shadow-sm">
                {item.icon}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-[#1e2a03] mb-2">{item.title}</h2>

              {/* About */}
              <p className="text-[#41521F]/90 text-sm leading-relaxed mb-4">
                {item.about}
              </p>

              {/* Effects */}
              <div className="mb-5">
                <h3 className="text-base font-semibold text-[#1e2a03] mb-2">
                  {tLocal("effectsBody")}
                </h3>

                <div className="space-y-1.5">
                  {item.effects.map((effect, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-[#41521F]/90 text-sm"
                    >
                      <Activity className="w-3.5 h-3.5 text-[#88AB75]" />
                      {effect}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              {/* Safe Levels */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50/50 border border-green-200/60 rounded-xl p-3">
                  <p className="text-[11px] uppercase tracking-wider text-green-700/80 font-medium">
                    {tLocal("safeLevel")}
                  </p>
                  <p className="text-green-800 font-semibold text-sm mt-0.5">{item.safe}</p>
                </div>

                <div className="bg-red-50/50 border border-red-200/60 rounded-xl p-3">
                  <p className="text-[11px] uppercase tracking-wider text-red-700/80 font-medium">
                    {tLocal("dangerLevel")}
                  </p>
                  <p className="text-red-800 font-semibold text-sm mt-0.5">{item.danger}</p>
                </div>
              </div>

              {/* Tip */}
              <div className="mt-4 rounded-xl bg-[#95A472]/10 border border-[#95A472]/20 p-3">
                <p className="text-xs text-[#1e2a03] font-medium flex items-start gap-1.5">
                  <span className="text-[#88AB75] shrink-0">💡</span>
                  {item.tip}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="max-w-4xl mx-auto mt-14">
        <div className="rounded-3xl border border-[#95A472]/20 bg-gradient-to-br from-white to-[#f5f7f2] p-8 text-center shadow-lg">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1e2a03] mb-4">
            {tLocal("whyMattersTitle")}
          </h2>

          <p className="text-[#41521F]/90 leading-relaxed text-sm md:text-base max-w-2xl mx-auto">
            {tLocal("whyMattersDesc")}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <div className="px-4 py-2 rounded-full bg-[#95A472]/10 border border-[#95A472]/25 text-[#1e2a03] text-xs font-semibold shadow-sm">
              {tLocal("lungTag")}
            </div>

            <div className="px-4 py-2 rounded-full bg-[#95A472]/10 border border-[#95A472]/25 text-[#1e2a03] text-xs font-semibold shadow-sm">
              {tLocal("climateTag")}
            </div>

            <div className="px-4 py-2 rounded-full bg-[#95A472]/10 border border-[#95A472]/25 text-[#1e2a03] text-xs font-semibold shadow-sm">
              {tLocal("futureTag")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;