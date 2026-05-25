"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";

import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Piechart = () => {
  const { t } = useLanguage();
  const [pieData, setPieData] = useState([]);

  // Harmony Palette Colors matching the project's green/warm natural theme
  const COLORS = [
    "#FF4D4D", // Red
    "#3A86FF", // Blue
    "#FFD60A", // Yellow
    "#06D6A0", // Green
    "#FF006E", // Pink
    "#8338EC", // Purple
    "#FB5607", // Orange
    "#00B4D8", // Cyan
  ];

  // Helper to get authorization headers
  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Fetch Category Stats
  const fetchCategoryStats = async () => {
    try {
      const res = await axios.get(
        "https://carbon-footprint-tracker-4dxj.onrender.com/activity/category-stats",
        getAuthHeaders()
      );
      setPieData(res.data.categoryStats);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategoryStats();
  }, []);

  // Map pieData to absolute values for chart slice sizes
  const chartData = pieData.map((item) => ({
    ...item,
    valueForChart: Math.abs(item.percentage),
  }));

  const getLocalizedCategoryName = (cat) => {
    if (!cat) return "";
    const keyMap = {
      transport: "categoryTransport",
      electricity: "categoryElectricity",
      food: "categoryFood",
      waste: "categoryRecycling",
      water: "categoryWater",
      shopping: "tracker", // fallback for shopping
    };
    const key = keyMap[cat.toLowerCase()];
    return key ? t(key) : cat;
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-[#95A472]/20 h-full flex flex-col justify-between print:bg-transparent print:border-0 print:shadow-none print:p-0">

      {/* Heading */}
      <div className="mb-4 print:hidden">
        <p className="uppercase tracking-[0.2em] text-[8.5px] text-[#95A472] font-bold">
          {t("emissionAnalytics")}
        </p>

        <h1 className="text-base font-bold text-[#1e2a03] mt-0.5">
          {t("categoryContribution")}
        </h1>

        <p className="text-gray-500 text-[10px] mt-0.5">
          {t("categoryDesc")}
        </p>
      </div>

      {/* Pie Chart */}
      <div className="h-[210px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RePieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              dataKey="valueForChart"
              nameKey="category"
              label={({ index }) => {
                const item = chartData[index];
                return item ? `${getLocalizedCategoryName(item.category)} (${item.percentage}%)` : "";
              }}
              style={{ fontSize: "9px", fontWeight: "500", fill: "#1e2a03" }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            {/* Tooltip */}
            <Tooltip
              formatter={(value, name, props) => {
                const item = props.payload;
                const displayVal = item
                  ? `${item.percentage}% (${item.emission} kg CO₂)`
                  : `${value}%`;
                return [displayVal, t("contribution")];
              }}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid rgba(149, 164, 114, 0.2)",
                backgroundColor: "#1e2a03",
                color: "#fff",
                fontSize: "11px",
              }}
              itemStyle={{
                color: "#fff",
              }}
            />

            {/* Legend */}
            <Legend formatter={(value) => getLocalizedCategoryName(value)} wrapperStyle={{ fontSize: "10px" }} />
          </RePieChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Stats Grid */}
      {pieData.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 print:hidden">
          {pieData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-[#f5f7f2] border border-[#95A472]/10 rounded-lg p-2"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                ></div>

                <p className="capitalize text-[10px] font-medium text-[#1e2a03] truncate">
                  {getLocalizedCategoryName(item.category)}
                </p>
              </div>

              <p className="text-[10px] font-bold text-[#1e2a03] pl-1 shrink-0">
                {item.percentage}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Piechart;