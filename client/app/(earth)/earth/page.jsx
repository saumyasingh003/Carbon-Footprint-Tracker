"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Wind,
  MapPin,
  TrendingUp,
  Activity,
  Globe,
  AlertTriangle,
  FileText,
  ExternalLink,
  Flame,
  Info,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

const localTranslations = {
  en: {
    envMonitoring: "Environmental Monitoring",
    emissionsTelemetry: "Emissions & Climate Telemetry",
    heroDesc: "Real-time tracking of greenhouse diagnostics and particulate indexes. Click on any city node below to pull live atmospheric trends.",
    knowMore: "Know more",
    globalAnnualCo2: "Global Annual CO₂",
    billionTonnes: "37.2 Billion Tonnes",
    reportedVia: "Reported via Climate TRACE",
    reductionGoal: "Reduction Goal",
    reductionTarget: "-45% by 2030",
    ipccTarget: "IPCC Climate Target",
    tempIncrease: "Global Temp Increase",
    tempValue: "+1.25 °C",
    tempDesc: "Current vs Pre-industrial levels",
    citiesTelemetry: "Cities Live Telemetry",
    reloadNodes: "Reload Nodes",
    syncNodes: "Synchronizing live city nodes...",
    liveAtmosphericData: "Live Atmospheric Data",
    detailsTrends: "Details & Trends",
    monitoringStation: "MONITORING STATION",
    node: "Node",
    coords: "Coords",
    annualCo2Total: "Annual CO₂ Total:",
    perCapitaRate: "Per Capita Rate:",
    topEmissionDriver: "Top Emission Driver:",
    atmosphericStatus: "Atmospheric Status:",
    stationReference: "Station Reference:",
    trendTitle: "24-Hour Historical Trend",
    selectCity: "Select a city card to analyze emissions",
    good: "GOOD",
    moderate: "MODERATE",
    poorSensitive: "POOR FOR SENSITIVE",
    unhealthy: "UNHEALTHY",
    veryUnhealthy: "VERY UNHEALTHY",
    hazardous: "HAZARDOUS",
    unknown: "UNKNOWN"
  },
  hi: {
    envMonitoring: "पर्यावरण निगरानी",
    emissionsTelemetry: "उत्सर्जन और जलवायु टेलीमेट्री",
    heroDesc: "ग्रीनहाउस डायग्नोस्टिक्स और पार्टिकुलेट इंडेक्स की वास्तविक समय में ट्रैकिंग। लाइव वायुमंडलीय रुझानों को देखने के लिए नीचे किसी भी शहर के नोड पर क्लिक करें।",
    knowMore: "अधिक जानें",
    globalAnnualCo2: "वैश्विक वार्षिक CO₂",
    billionTonnes: "37.2 बिलियन टन",
    reportedVia: "क्लाइमेट ट्रेस (Climate TRACE) द्वारा रिपोर्ट किया गया",
    reductionGoal: "कमी का लक्ष्य",
    reductionTarget: "2030 तक -45%",
    ipccTarget: "IPCC जलवायु लक्ष्य",
    tempIncrease: "वैश्विक तापमान में वृद्धि",
    tempValue: "+1.25 °C",
    tempDesc: "वर्तमान बनाम पूर्व-औद्योगिक स्तर",
    citiesTelemetry: "शहरों की लाइव टेलीमेट्री",
    reloadNodes: "नोड्स पुनः लोड करें",
    syncNodes: "लाइव शहर नोड्स को सिंक्रनाइज़ किया जा रहा है...",
    liveAtmosphericData: "लाइव वायुमंडलीय डेटा",
    detailsTrends: "विवरण और रुझान",
    monitoringStation: "निगरानी स्टेशन",
    node: "नोड",
    coords: "निर्देशांक",
    annualCo2Total: "वार्षिक CO₂ कुल:",
    perCapitaRate: "प्रति व्यक्ति दर:",
    topEmissionDriver: "शीर्ष उत्सर्जन स्रोत:",
    atmosphericStatus: "वायुमंडलीय स्थिति:",
    stationReference: "स्टेशन संदर्भ:",
    trendTitle: "24 घंटे का ऐतिहासिक रुझान",
    selectCity: "उत्सर्जन का विश्लेषण करने के लिए एक शहर का चयन करें",
    good: "अच्छा",
    moderate: "मध्यम",
    poorSensitive: "संवेदनशील के लिए खराब",
    unhealthy: "अस्वस्थ",
    veryUnhealthy: "अत्यधिक अस्वस्थ",
    hazardous: "खतरनाक",
    unknown: "अज्ञात"
  }
};

const getCityName = (id, lang) => {
  const cityTranslations = {
    en: {
      delhi: "Delhi",
      mumbai: "Mumbai",
      bangalore: "Bangalore",
      chennai: "Chennai",
      hyderabad: "Hyderabad",
      patna: "Patna"
    },
    hi: {
      delhi: "दिल्ली",
      mumbai: "मुंबई",
      bangalore: "बेंगलुरु",
      chennai: "चेन्नई",
      hyderabad: "हैदराबाद",
      patna: "पटना"
    }
  };
  return cityTranslations[lang]?.[id] || id;
};

const getRegionName = (region, lang) => {
  const regionTranslations = {
    en: {
      "National Capital Region": "National Capital Region",
      "Maharashtra": "Maharashtra",
      "Karnataka": "Karnataka",
      "Tamil Nadu": "Tamil Nadu",
      "Telangana": "Telangana",
      "Bihar": "Bihar"
    },
    hi: {
      "National Capital Region": "राष्ट्रीय राजधानी क्षेत्र",
      "Maharashtra": "महाराष्ट्र",
      "Karnataka": "कर्नाटक",
      "Tamil Nadu": "तमिलनाडु",
      "Telangana": "तेलंगाना",
      "Bihar": "बिहार"
    }
  };
  return regionTranslations[lang]?.[region] || region;
};

const getDriverText = (topSource, lang) => {
  const driverTranslations = {
    en: {
      "Vehicular Combustion & Road Dust": "Vehicular Combustion & Road Dust",
      "Thermal Power & Marine Freight": "Thermal Power & Marine Freight",
      "Commercial Hub Energy & Grid Use": "Commercial Hub Energy & Grid Use",
      "Petrochemicals & Auto Manufacture": "Petrochemicals & Auto Manufacture",
      "Tech Corridor Energy & Construction": "Tech Corridor Energy & Construction",
      "Agricultural Biomass & Brick Kilns": "Agricultural Biomass & Brick Kilns"
    },
    hi: {
      "Vehicular Combustion & Road Dust": "वाहनों का दहन और सड़क की धूल",
      "Thermal Power & Marine Freight": "थर्मल पावर और समुद्री माल ढुलाई",
      "Commercial Hub Energy & Grid Use": "व्यावसायिक हब ऊर्जा और ग्रिड उपयोग",
      "Petrochemicals & Auto Manufacture": "पेट्रोकेमिकल्स और ऑटो निर्माण",
      "Tech Corridor Energy & Construction": "टेक कॉरिडोर ऊर्जा और निर्माण कार्य",
      "Agricultural Biomass & Brick Kilns": "कृषि बायोमास और ईंट के भट्टे"
    }
  };
  return driverTranslations[lang]?.[topSource] || topSource;
};

const tLocal = (key, lang) => {
  return localTranslations[lang]?.[key] || localTranslations["en"]?.[key] || key;
};

const getLocalizedAqiText = (text, lang) => {
  if (lang === "hi") {
    switch (text) {
      case "GOOD": return "अच्छा";
      case "MODERATE": return "मध्यम";
      case "POOR FOR SENSITIVE": return "संवेदनशील के लिए खराब";
      case "UNHEALTHY": return "अस्वस्थ";
      case "VERY UNHEALTHY": return "अत्यधिक अस्वस्थ";
      case "HAZARDOUS": return "खतरनाक";
      default: return "अज्ञात";
    }
  }
  return text;
};

export default function EarthPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const currentLang = language === "hi" ? "hi" : "en";

  const [isMounted, setIsMounted] = useState(false);
  const [citiesData, setCitiesData] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pm25"); // pm25, pm10, co

  const citiesList = [
    {
      id: "delhi",
      name: "Delhi",
      lat: 28.61,
      lon: 77.2,
      region: "National Capital Region",
      co2Annual: "38.4M t",
      co2PerCapita: "1.85",
      topSource: "Vehicular Combustion & Road Dust",
    },
    {
      id: "mumbai",
      name: "Mumbai",
      lat: 19.07,
      lon: 72.87,
      region: "Maharashtra",
      co2Annual: "22.8M t",
      co2PerCapita: "1.42",
      topSource: "Thermal Power & Marine Freight",
    },
    {
      id: "bangalore",
      name: "Bangalore",
      lat: 12.97,
      lon: 77.59,
      region: "Karnataka",
      co2Annual: "15.2M t",
      co2PerCapita: "1.28",
      topSource: "Commercial Hub Energy & Grid Use",
    },
    {
      id: "chennai",
      name: "Chennai",
      lat: 13.08,
      lon: 80.27,
      region: "Tamil Nadu",
      co2Annual: "12.6M t",
      co2PerCapita: "1.18",
      topSource: "Petrochemicals & Auto Manufacture",
    },
    {
      id: "hyderabad",
      name: "Hyderabad",
      lat: 17.38,
      lon: 78.48,
      region: "Telangana",
      co2Annual: "11.4M t",
      co2PerCapita: "1.12",
      topSource: "Tech Corridor Energy & Construction",
    },
    {
      id: "patna",
      name: "Patna",
      lat: 25.59,
      lon: 85.13,
      region: "Bihar",
      co2Annual: "5.1M t",
      co2PerCapita: "0.85",
      topSource: "Agricultural Biomass & Brick Kilns",
    },
  ];

  // Helper for CO2 hourly diurnal footprint curve (peaks during rush hour and daytime)
  const getCO2Factor = (hourStr) => {
    const hour = parseInt(hourStr.split(":")[0]) || 0;
    if (hour >= 8 && hour <= 10) return 1.35; // Morning peak
    if (hour >= 17 && hour <= 20) return 1.45; // Evening peak
    if (hour >= 23 || hour <= 5) return 0.65; // Night low
    return 1.0; // Normal daytime
  };

  // Convert Open-Meteo hourly response to current time data
  const findCurrentHourData = (data) => {
    if (!data || !data.hourly || !data.hourly.time) return null;
    const now = new Date();
    const utcYear = now.getUTCFullYear();
    const utcMonth = String(now.getUTCMonth() + 1).padStart(2, "0");
    const utcDate = String(now.getUTCDate()).padStart(2, "0");
    const utcHour = String(now.getUTCHours()).padStart(2, "0");
    const currentUtcHourStr = `${utcYear}-${utcMonth}-${utcDate}T${utcHour}:00`;

    let index = data.hourly.time.indexOf(currentUtcHourStr);

    if (index === -1) {
      const localHourStr = now.toISOString().substring(0, 13) + ":00";
      index = data.hourly.time.indexOf(localHourStr);
    }

    if (index === -1) {
      index = data.hourly.pm2_5.findIndex((val) => val !== null);
      if (index === -1) index = 0;
    }

    return {
      time: data.hourly.time[index],
      pm2_5:
        data.hourly.pm2_5[index] !== null
          ? Math.round(data.hourly.pm2_5[index])
          : 0,
      pm10:
        data.hourly.pm10[index] !== null
          ? Math.round(data.hourly.pm10[index])
          : 0,
      co:
        data.hourly.carbon_monoxide[index] !== null
          ? Math.round(data.hourly.carbon_monoxide[index])
          : 0,
      index: index,
    };
  };

  // Convert Open-Meteo hourly data array to chart-friendly format
  const getFormattedChartData = (apiData, currentIndex, co2PerCapita) => {
    if (!apiData || !apiData.hourly) return [];
    const times = apiData.hourly.time;
    const pm25s = apiData.hourly.pm2_5;
    const pm10s = apiData.hourly.pm10;
    const cos = apiData.hourly.carbon_monoxide;

    const start = Math.max(0, currentIndex - 12);
    const end = Math.min(times.length, currentIndex + 12);

    const result = [];
    for (let i = start; i < end; i++) {
      const timeStr = times[i];
      const hour = timeStr.split("T")[1] || timeStr;
      const co2Factor = getCO2Factor(hour);
      result.push({
        time: hour,
        pm25: pm25s[i] !== null ? Math.round(pm25s[i]) : 0,
        pm10: pm10s[i] !== null ? Math.round(pm10s[i]) : 0,
        co: cos[i] !== null ? Math.round(cos[i]) : 0,
        co2: Math.round(parseFloat(co2PerCapita) * co2Factor * 100) / 100,
      });
    }
    return result;
  };

  const fetchCitiesEmissions = async () => {
    try {
      setLoading(true);
      setError(null);

      const results = await Promise.all(
        citiesList.map(async (city) => {
          const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}&hourly=pm10,pm2_5,carbon_monoxide`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`API failed for ${city.name}`);
          const data = await res.json();

          const current = findCurrentHourData(data);
          const chart = current
            ? getFormattedChartData(data, current.index, city.co2PerCapita)
            : [];

          return {
            ...city,
            current,
            chartData: chart,
          };
        }),
      );

      setCitiesData(results);
      // Default selection to Delhi
      setSelectedCity(results.find((c) => c.id === "delhi") || results[0]);
      setLoading(false);
    } catch (err) {
      console.error("Fetch cities error:", err);
      setError(
        "Unable to connect to live emissions databases. Rendering default indicators.",
      );
      setLoading(false);

      // Fallback Seed Data
      const dummyResults = citiesList.map((city, idx) => {
        const basePm25 = [142, 68, 48, 56, 72, 195][idx];
        const basePm10 = [640, 210, 140, 160, 220, 780][idx];
        const baseCo = [320, 210, 180, 220, 250, 480][idx];

        return {
          ...city,
          current: { pm2_5: basePm25, pm10: basePm10, co: baseCo, time: "UTC" },
          chartData: Array.from({ length: 24 }, (_, i) => {
            const hour = `${String(i).padStart(2, "0")}:00`;
            return {
              time: hour,
              pm25: Math.round(basePm25 * (0.8 + Math.random() * 0.4)),
              pm10: Math.round(basePm10 * (0.8 + Math.random() * 0.4)),
              co: Math.round(baseCo * (0.8 + Math.random() * 0.4)),
              co2:
                Math.round(
                  parseFloat(city.co2PerCapita) * getCO2Factor(hour) * 100,
                ) / 100,
            };
          }),
        };
      });
      setCitiesData(dummyResults);
      setSelectedCity(dummyResults[0]);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchCitiesEmissions();
  }, []);

  const getAQIStatus = (pm25) => {
    if (!pm25)
      return {
        text: "UNKNOWN",
        color: "text-slate-500 border-slate-300 bg-slate-100",
        chartColor: "#95A472",
      };
    if (pm25 <= 12)
      return {
        text: "GOOD",
        color: "text-emerald-700 border-emerald-200 bg-emerald-50",
        chartColor: "#88AB75",
      };
    if (pm25 <= 35.4)
      return {
        text: "MODERATE",
        color: "text-amber-700 border-amber-200 bg-amber-50/70",
        chartColor: "#DBD56E",
      };
    if (pm25 <= 55.4)
      return {
        text: "POOR FOR SENSITIVE",
        color: "text-orange-700 border-orange-200 bg-orange-50",
        chartColor: "#f97316",
      };
    if (pm25 <= 150.4)
      return {
        text: "UNHEALTHY",
        color: "text-purple-700 border-purple-200 bg-purple-50",
        chartColor: "#a855f7",
      };
    if (pm25 <= 250.4)
      return {
        text: "VERY UNHEALTHY",
        color: "text-red-700 border-red-200 bg-red-50",
        chartColor: " #ef4444",
      };
    return {
      text: "HAZARDOUS",
      color: "text-rose-700 border-rose-200 bg-rose-50",
      chartColor: "#f43f5e",
    };
  };

  const getParamInfoLocal = (tab, lang) => {
    if (lang === "hi") {
      switch (tab) {
        case "pm25":
          return {
            label: "PM2.5 (महीन धूल कण)",
            desc: "महीन सांस लेने योग्य कण (2.5 माइक्रोमीटर या उससे छोटे) जो औद्योगिक उत्सर्जन और दहन से उत्पन्न होते हैं।",
          };
        case "pm10":
          return {
            label: "PM10 (मोटे धूल कण)",
            desc: "सांस लेने योग्य मोटे धूल के कण (10 माइक्रोमीटर या उससे छोटे) जो यांत्रिक उत्सर्जन और हवा में तैरते कणों का प्रतिनिधित्व करते हैं।",
          };
        case "co":
          return {
            label: "कार्बन मोनोऑक्साइड (CO)",
            desc: "जीवाश्म ईंधन के अधूरे दहन से उत्पन्न होने वाली एक प्रमुख ट्रेस ग्रीनहाउस गैस और शहरी कार्बन पदचिह्न संकेतक।",
          };
        default:
          return { label: "", desc: "" };
      }
    }
    // Default English
    switch (tab) {
      case "pm25":
        return {
          label: "PM2.5 (Fine Particulates)",
          desc: "Fine inhalable particles (2.5 micrometers or smaller) originating from industrial emissions and combustion.",
        };
      case "pm10":
        return {
          label: "PM10 (Coarse Particulates)",
          desc: "Inhalable coarse dust particles (10 micrometers or smaller) representing mechanical emissions and suspension.",
        };
      case "co":
        return {
          label: "Carbon Monoxide (CO)",
          desc: "A key trace greenhouse gas and urban carbon footprint marker produced by incomplete combustion of fossil fuels.",
        };
      default:
        return { label: "", desc: "" };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#41521F] p-6 md:p-10 lg:p-16 relative overflow-hidden mt-10">
      {/* Background Glow Circles from Theme */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#DBD56E]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#95A472]/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* HEADER SECTION */}
      <header className="border-b border-[#95A472]/15 pb-6 mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-[1px] bg-[#95A472]"></div>
            <p className="uppercase tracking-[0.25em] text-[11px] text-[#6e674f] font-medium">
              {tLocal("envMonitoring", currentLang)}
            </p>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-[#1e2a03] leading-tight">
            {tLocal("emissionsTelemetry", currentLang)}
          </h1>
          <p className="text-[#4b4b4b] text-base font-light mt-3 max-w-2xl leading-relaxed">
            {tLocal("heroDesc", currentLang)}
          </p>
        </div>

        {/* Know in detail */}
        <Button
          onClick={() => router.push("/earth/learn")}
          className="group cursor-pointer bg-[#1e2a03] hover:bg-[#2b3811] text-white px-8 py-4 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
        >
          {tLocal("knowMore", currentLang)}
        </Button>
      </header>

      {/* GLOBAL CARBON DIAGNOSTICS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10">
        <div className="bg-white border border-[#95A472]/15 p-5 md:p-6 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3.5 bg-red-50 text-red-600 rounded-2xl border border-red-100">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-[#6e674f] font-mono uppercase tracking-wider block font-semibold">
              {tLocal("globalAnnualCo2", currentLang)}
            </span>
            <span className="text-xl font-bold text-[#1e2a03] mt-0.5 block">
              {tLocal("billionTonnes", currentLang)}
            </span>
            <span className="text-[10px] text-[#776D5A] block mt-0.5">
              {tLocal("reportedVia", currentLang)}
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#95A472]/15 p-5 md:p-6 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3.5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-[#6e674f] font-mono uppercase tracking-wider block font-semibold">
              {tLocal("reductionGoal", currentLang)}
            </span>
            <span className="text-xl font-bold text-[#1e2a03] mt-0.5 block">
              {tLocal("reductionTarget", currentLang)}
            </span>
            <span className="text-[10px] text-[#776D5A] block mt-0.5">
              {tLocal("ipccTarget", currentLang)}
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#95A472]/15 p-5 md:p-6 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3.5 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-[#6e674f] font-mono uppercase tracking-wider block font-semibold">
              {tLocal("tempIncrease", currentLang)}
            </span>
            <span className="text-xl font-bold text-[#1e2a03] mt-0.5 block">
              {tLocal("tempValue", currentLang)}
            </span>
            <span className="text-[10px] text-[#776D5A] block mt-0.5">
              {tLocal("tempDesc", currentLang)}
            </span>
          </div>
        </div>
      </section>

      {/* CORE CONTENT LAYOUT */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 items-stretch">
        {/* CITIES TELEMETRY GRID */}
        <section className="lg:col-span-2 space-y-4 h-full flex flex-col">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#1e2a03] tracking-tight flex items-center gap-2">
              <Activity className="w-5.5 h-5.5 text-[#88AB75]" /> {tLocal("citiesTelemetry", currentLang)}
            </h2>
            <button
              onClick={fetchCitiesEmissions}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#41521F] border border-[#95A472]/20 hover:border-[#95A472] bg-white hover:bg-[#f5f7f2] px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#88AB75]" /> {tLocal("reloadNodes", currentLang)}
            </button>
          </div>

          {loading ? (
            <div className="h-64 bg-white border border-[#95A472]/15 rounded-3xl flex flex-col items-center justify-center gap-3 shadow-sm">
              <RefreshCw className="w-8 h-8 text-[#88AB75] animate-spin" />
              <span className="text-xs text-[#776D5A] font-mono">
                {tLocal("syncNodes", currentLang)}
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 mt-10 sm:grid-cols-2 gap-5 items-stretch auto-rows-fr">
              {citiesData.map((city) => {
                const aqi = getAQIStatus(city.current?.pm2_5);
                const isSelected = selectedCity?.id === city.id;

                return (
                  <div
                    key={city.id}
                    onClick={() => setSelectedCity(city)}
                    className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 min-h-[250px] h-full flex flex-col justify-between ${
                      isSelected
                        ? "bg-white border-[#1e2a03] shadow-md ring-1 ring-[#1e2a03]"
                        : "bg-white/60 border-[#95A472]/15 hover:border-[#95A472]/30 hover:bg-white shadow-sm"
                    }`}
                  >
                    {/* TOP */}
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-base text-[#1e2a03]">
                            {getCityName(city.id, currentLang)}
                          </h3>
                          <span className="text-[10px] text-[#776D5A] font-mono block uppercase mt-0.5">
                            {getRegionName(city.region, currentLang)}
                          </span>
                        </div>
                        <span
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-lg border ${aqi.color}`}
                        >
                          {getLocalizedAqiText(aqi.text, currentLang)}
                        </span>
                      </div>

                      {/* DATA GRID */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#95A472]/10 pt-4 mt-2">
                        <div>
                          <span className="text-[9px] text-[#776D5A] font-mono block uppercase">
                            PM2.5
                          </span>
                          <span className="text-xs font-bold text-[#1e2a03] font-mono mt-1 block">
                            {city.current?.pm2_5 || "--"}
                            <span className="text-[9px] font-normal text-slate-400 ml-1">
                              μg
                            </span>
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-[#776D5A] font-mono block uppercase">
                            PM10
                          </span>
                          <span className="text-xs font-bold text-[#1e2a03] font-mono mt-1 block">
                            {city.current?.pm10 || "--"}
                            <span className="text-[9px] font-normal text-slate-400 ml-1">
                              μg
                            </span>
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-[#776D5A] font-mono block uppercase">
                            CO
                          </span>
                          <span className="text-xs font-bold text-[#1e2a03] font-mono mt-1 block">
                            {city.current?.co || "--"}
                            <span className="text-[9px] font-normal text-slate-400 ml-1">
                              μg
                            </span>
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-[#776D5A] font-mono block uppercase">
                            CO₂ Footprint
                          </span>
                          <span className="text-xs font-bold text-emerald-800 font-mono mt-1 block">
                            {city.co2PerCapita}
                            <span className="text-[9px] font-normal text-slate-400 ml-1">
                              t/yr
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* BOTTOM */}
                    <div className="mt-5 pt-3 border-t border-[#95A472]/10 flex items-center justify-between">
                      <span className="text-[10px] text-[#776D5A] font-mono uppercase">
                        {tLocal("liveAtmosphericData", currentLang)}
                      </span>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* RIGHT DETAILS SECTION */}
        <section className="space-y-4 h-full flex flex-col min-w-0">
          <h2 className="text-lg font-bold text-[#1e2a03] tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#88AB75]" /> {tLocal("detailsTrends", currentLang)}
          </h2>

          {selectedCity ? (
            <div className="bg-white border border-[#95A472]/15 p-5 rounded-2xl shadow-sm flex flex-col gap-5 h-full">
              {/* City Title */}
              <div className="border-b border-[#95A472]/10 pb-3">
                <div className="flex items-center gap-2 text-[#88AB75] mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider">
                    {tLocal("monitoringStation", currentLang)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1e2a03]">
                  {getCityName(selectedCity.id, currentLang)} {tLocal("node", currentLang)}
                </h3>
                <span className="text-xs text-[#776D5A] font-mono block mt-0.5">
                  {tLocal("coords", currentLang)}: {selectedCity.lat.toFixed(2)}° N, {selectedCity.lon.toFixed(2)}° E
                </span>

                {/* Carbon footprint detail card */}
                <div className="mt-3 flex flex-col justify-between text-[10px] bg-[#F8F7F2] p-4 rounded-2xl border border-[#95A472]/15 font-mono h-[135px]">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[#776D5A] block uppercase text-[8px]">
                        {tLocal("annualCo2Total", currentLang)}
                      </span>
                      <span className="font-bold text-[#1e2a03]">
                        {selectedCity.co2Annual}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#776D5A] block uppercase text-[8px]">
                        {tLocal("perCapitaRate", currentLang)}
                      </span>
                      <span className="font-bold text-[#1e2a03]">
                        {selectedCity.co2PerCapita} t/yr
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-[#95A472]/10 pt-2.5">
                    <span className="text-[#776D5A] block uppercase text-[8px]">
                      {tLocal("topEmissionDriver", currentLang)}
                    </span>
                    <span className="font-bold text-[#1e2a03] block leading-tight">
                      {getDriverText(selectedCity.topSource, currentLang)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2 bg-[#fdfdfc] p-3 rounded-xl border border-[#95A472]/10">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#776D5A]">{tLocal("atmosphericStatus", currentLang)}</span>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded-lg border ${
                      getAQIStatus(selectedCity.current?.pm2_5).color
                    }`}
                  >
                    {getLocalizedAqiText(
                      getAQIStatus(selectedCity.current?.pm2_5).text,
                      currentLang
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#776D5A]">{tLocal("stationReference", currentLang)}</span>
                  <span className="font-mono text-[#1e2a03] font-semibold">
                    GADM-IN-L0
                  </span>
                </div>
              </div>

              {/* Param Toggles */}
              <div className="border-t border-[#95A472]/10 pt-3">
                <div className="flex gap-1.5 bg-[#F8F7F2] p-1 rounded-2xl border border-[#95A472]/15">
                  {["pm25", "pm10", "co"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                        activeTab === tab
                          ? "bg-[#1e2a03] text-white shadow-sm"
                          : "text-[#41521F] hover:text-[#1e2a03] hover:bg-white/50"
                      }`}
                    >
                      {tab === "pm25" ? "PM2.5" : tab === "pm10" ? "PM10" : "CO"}
                    </button>
                  ))}
                </div>

                {/* Tab Info Box */}
                <div className="bg-[#eef6e8] p-3.5 rounded-2xl mt-4 flex gap-2.5 items-start border border-[#95A472]/10">
                  <Info className="w-4 h-4 text-[#88AB75] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1e2a03]">
                      {getParamInfoLocal(activeTab, currentLang).label}
                    </h4>
                    <p className="text-[10px] text-[#6e674f] leading-relaxed mt-0.5 font-light">
                      {getParamInfoLocal(activeTab, currentLang).desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recharts Area Chart */}
              {isMounted && selectedCity.chartData.length > 0 && (
                <div className="border-t border-[#95A472]/10 pt-3">
                  <span className="text-[10px] text-[#776D5A] font-mono tracking-widest uppercase mb-2 block flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#88AB75]" /> {tLocal("trendTitle", currentLang)}
                  </span>

                  <div className="h-56 w-full mt-2 select-none min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <AreaChart
                        data={selectedCity.chartData}
                        margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="themeColorAqi"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={
                                getAQIStatus(selectedCity.current?.pm2_5).chartColor
                              }
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor={
                                getAQIStatus(selectedCity.current?.pm2_5).chartColor
                              }
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="time"
                          tick={{ fill: "#776D5A", fontSize: 8 }}
                          stroke="rgba(149,164,114,0.15)"
                        />
                        <YAxis
                          domain={[0, "auto"]}
                          tick={{ fill: "#776D5A", fontSize: 8 }}
                          stroke="rgba(149,164,114,0.15)"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            borderColor: "rgba(149,164,114,0.2)",
                            borderRadius: "16px",
                            padding: "8px 12px",
                            fontSize: "11px",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                          }}
                          labelStyle={{
                            color: "#6e674f",
                            fontSize: 9,
                            fontFamily: "monospace",
                            fontWeight: "bold",
                          }}
                          itemStyle={{
                            color: "#1e2a03",
                            fontSize: 10,
                            fontWeight: "bold",
                          }}
                          formatter={(value) => [
                            `${value} μg/m³`,
                            activeTab.toUpperCase(),
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey={
                            activeTab === "pm25"
                              ? "pm25"
                              : activeTab === "pm10"
                                ? "pm10"
                                : "co"
                          }
                          stroke={
                            getAQIStatus(selectedCity.current?.pm2_5).chartColor
                          }
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#themeColorAqi)"
                          name={
                            activeTab === "pm25"
                              ? "PM2.5"
                              : activeTab === "pm10"
                                ? "PM10"
                                : "Carbon Monoxide (CO)"
                          }
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[400px] border border-dashed border-[#95A472]/20 rounded-3xl flex items-center justify-center text-[#776D5A] text-xs bg-white/40">
              {tLocal("selectCity", currentLang)}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
