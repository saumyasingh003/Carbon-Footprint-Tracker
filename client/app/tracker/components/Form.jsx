"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

const emissionFactors = {
  transport: {
    car: 0.21,
    suv: 0.26,
    ev: 0.05,
    bike: 0.10,
    motorbike: 0.10,
    bus: 0.05,
    train: 0.04,
    metro: 0.03,
    cycle: 0.01,
    walk: 0,
    flight: 0.15,
    airplane: 0.15,
    scooter: 0.08,
    auto: 0.09,
    taxi: 0.18,
  },
  electricity: {
    electricity: 0.85,
    gas: 2.0,
    solar: 0.02,
    generator: 2.5,
  },
  food: {
    veg: 1.5,
    nonveg: 3.5,
    vegan: 0.5,
    dairy: 2.1,
    chicken: 2.9,
    beef: 6.0,
    pork: 4.0,
    fish: 2.5,
    egg: 1.2,
    fastfood: 3.0,
  },
  waste: {
    recycle: -0.2,
    plastic: 0.5,
    landfill: 0.7,
    compost: -0.1,
    burn: 1.0,
    ewaste: 1.5,
  },
  water: {
    shower: 0.03,
    laundry: 0.2,
    dishwasher: 0.15,
  },
  shopping: {
    clothes: 5.0,
    electronics: 20.0,
    furniture: 15.0,
    groceries: 2.0,
  },
};

const Form = ({ onActivityAdded }) => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    type: "",
    value: "",
    unit: "",
  });

  const getLocalizedTypeLabel = (typeKey) => {
    if (!typeKey) return "";
    const dictionary = {
      en: {
        car: "Car",
        suv: "SUV",
        ev: "EV",
        bike: "Bike",
        motorbike: "Motorbike",
        bus: "Bus",
        train: "Train",
        metro: "Metro",
        cycle: "Cycle",
        walk: "Walk",
        flight: "Flight",
        airplane: "Airplane",
        scooter: "Scooter",
        auto: "Auto",
        taxi: "Taxi",
        electricity: "Electricity",
        gas: "Gas",
        solar: "Solar",
        generator: "Generator",
        veg: "Vegetarian",
        nonveg: "Non-Vegetarian",
        vegan: "Vegan",
        dairy: "Dairy",
        chicken: "Chicken",
        beef: "Beef",
        pork: "Pork",
        fish: "Fish",
        egg: "Egg",
        fastfood: "Fast Food",
        recycle: "Recycle",
        plastic: "Plastic",
        landfill: "Landfill",
        compost: "Compost",
        burn: "Burn",
        ewaste: "E-waste",
        shower: "Shower",
        laundry: "Laundry",
        dishwasher: "Dishwasher",
        clothes: "Clothes",
        electronics: "Electronics",
        furniture: "Furniture",
        groceries: "Groceries",
      },
      hi: {
        car: "कार",
        suv: "एसयूवी",
        ev: "इलेक्ट्रिक वाहन",
        bike: "बाइक",
        motorbike: "मोटरसाइकिल",
        bus: "बस",
        train: "ट्रेन",
        metro: "मेट्रो",
        cycle: "साइकिल",
        walk: "पैदल चलना",
        flight: "उड़ान",
        airplane: "हवाई जहाज",
        scooter: "स्कूटर",
        auto: "ऑटो",
        taxi: "टैक्सी",
        electricity: "बिजली",
        gas: "गैस",
        solar: "सौर ऊर्जा",
        generator: "जेनरेटर",
        veg: "शाकाहारी",
        nonveg: "मांसाहारी",
        vegan: "विगन",
        dairy: "डेयरी",
        chicken: "चिकन",
        beef: "बीफ",
        pork: "पोर्क",
        fish: "मछली",
        egg: "अंडा",
        fastfood: "फास्ट फूड",
        recycle: "रीसायकल",
        plastic: "प्लास्टिक",
        landfill: "लैंडफिल",
        compost: "खाद बनाना",
        burn: "जलाना",
        ewaste: "ई-कचरा",
        shower: "स्नान/शॉवर",
        laundry: "कपड़े धोना",
        dishwasher: "डिशवॉशर",
        clothes: "कपड़े",
        electronics: "इलेक्ट्रॉनिक्स",
        furniture: "फर्नीचर",
        groceries: "किराने का सामान",
      }
    };
    
    const lang = language === "hi" ? "hi" : "en";
    return dictionary[lang][typeKey.toLowerCase()] || typeKey;
  };

  // Helper to get authorization headers
  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Handle Input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Category
  const handleCategoryChange = (e) => {
    const category = e.target.value;

    let unit = "";

    if (category === "transport") unit = "km";
    else if (category === "electricity") unit = "kwh";
    else if (category === "food") unit = "meal";
    else if (category === "waste") unit = "kg";
    else if (category === "water") unit = "litres";
    else if (category === "shopping") unit = "items";

    setFormData({
      ...formData,
      category,
      type: "",
      unit,
    });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/activity/add",
        formData,
        getAuthHeaders()
      );

      toast.success(t("activityAddedSuccess"));

      // Dispatch event to update unread count in Navbar
      window.dispatchEvent(new Event("auth-change"));

      // Reset Form
      setFormData({
        category: "",
        type: "",
        value: "",
        unit: "",
      });

      if (onActivityAdded) {
        onActivityAdded();
      }

    } catch (error) {
      toast.error(error.response?.data?.message || t("failedToAddActivity"));
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-[#95A472]/20 p-8">
      <h2 className="text-3xl font-bold text-[#1e2a03] mb-2">
        {t("addActivityHeading")}
      </h2>

      <p className="text-gray-500 mb-8">
        {t("logDailyActivities")}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category */}
        <div>
          <label className="block mb-2 font-medium text-[#41521F]">
            {t("categoryLabel")}
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#95A472]"
            required
            disabled={loading}
          >
            <option value="">{t("selectCategory")}</option>
            <option value="transport">{t("categoryTransport")}</option>
            <option value="electricity">{t("categoryElectricity")}</option>
            <option value="food">{t("categoryFood")}</option>
            <option value="waste">{t("categoryRecycling")}</option>
            <option value="water">{t("categoryWater")}</option>
            <option value="shopping">{t("shopping", "Shopping")}</option>
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block mb-2 font-medium text-[#41521F]">
            {t("typeLabel")}
          </label>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#95A472] capitalize"
            required
            disabled={loading}
          >
            <option value="">{t("selectType")}</option>
            {formData.category && emissionFactors[formData.category] && (
              Object.entries(emissionFactors[formData.category]).map(([key, factor]) => {
                const label = getLocalizedTypeLabel(key);
                const unit = formData.unit;
                const offsetText = language === "hi" ? "कमी" : "offset";
                return (
                  <option key={key} value={key}>
                    {label} ({factor >= 0 ? `${factor.toFixed(2)} kg/${unit}` : `${factor.toFixed(2)} kg/${unit} ${offsetText}`})
                  </option>
                );
              })
            )}
          </select>
        </div>

        {/* Value */}
        <div>
          <label className="block mb-2 font-medium text-[#41521F]">
            {t("valueLabel")}
          </label>

          <input
            type="number"
            name="value"
            value={formData.value}
            onChange={handleChange}
            placeholder={t("enterValuePlaceholder")}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#95A472]"
            required
            disabled={loading}
          />
        </div>

        {/* Unit */}
        <div>
          <label className="block mb-2 font-medium text-[#41521F]">
            {t("unitLabel")}
          </label>

          <input
            type="text"
            name="unit"
            value={formData.unit}
            readOnly
            className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 outline-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1e2a03] hover:bg-[#41521F] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{t("addingActivity")}</span>
            </>
          ) : (
            t("submitActivity")
          )}
        </button>
      </form>
    </div>
  );
};

export default Form;