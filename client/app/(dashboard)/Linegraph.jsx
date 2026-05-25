"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const Linegraph = () => {
  const { t } = useLanguage();
  const [data, setData] = useState([]);

  // Fetch Weekly Stats
  const fetchWeeklyStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://carbon-footprint-tracker-4dxj.onrender.com/activity/weekly-stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Backend Data
      setData(res.data.weeklyStats);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch On Load
  useEffect(() => {
    fetchWeeklyStats();
  }, []);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-[#95A472]/20 h-full flex flex-col print:bg-transparent print:border-0 print:shadow-none print:p-0">

      {/* Heading */}
      <div className="mb-4 print:hidden">
        <p className="uppercase tracking-[0.2em] text-[8.5px] text-[#95A472] font-bold">
          {t("weeklyAnalytics")}
        </p>

        <h1 className="text-base font-bold text-[#1e2a03] mt-0.5">
          {t("carbonEmissionTrend")}
        </h1>

        <p className="text-gray-500 text-[10px] mt-0.5">
          {t("weeklyTrendDesc")}
        </p>
      </div>

      {/* Graph */}
      <div className="flex-grow w-full min-h-[210px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            {/* Grid */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(149, 164, 114, 0.1)"
            />

            {/* X Axis */}
            <XAxis
              dataKey="day"
              stroke="#95A472"
              tickLine={false}
              axisLine={false}
              style={{
                fontSize: "10px",
                fontWeight: "500",
              }}
            />

            {/* Y Axis */}
            <YAxis
              stroke="#95A472"
              tickLine={false}
              axisLine={false}
              style={{
                fontSize: "10px",
                fontWeight: "500",
              }}
            />

            {/* Tooltip */}
            <Tooltip
              formatter={(value) => [`${value} kg CO₂`, t("totalEmissionCard")]}
              contentStyle={{
                borderRadius: "8px",
                border:
                  "1px solid rgba(149, 164, 114, 0.2)",
                backgroundColor: "#1e2a03",
                color: "#fff",
                fontSize: "11px",
              }}
              labelStyle={{
                color: "#DBD56E",
              }}
              itemStyle={{
                color: "#fff",
              }}
            />

            {/* Line */}
            <Line
              type="monotone"
              dataKey="emission"
              stroke="#1e2a03"
              strokeWidth={3.5}
              dot={{
                r: 4,
                fill: "#DBD56E",
                stroke: "#1e2a03",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "#1e2a03",
                stroke: "#DBD56E",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Linegraph;