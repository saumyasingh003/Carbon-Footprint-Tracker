"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";

const Register = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:5000/auth/register",
        formData,
      );

      toast.success(data.message || t("registrationSuccess"));

      setFormData({
        username: "",
        email: "",
        password: "",
      });

      router.push("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || t("somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden flex pt-20">
      {/* Left Image Section */}
      <div className="hidden md:flex w-2/3 relative">
        <img
          src="https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L2EwMTYtamVyZW15Yi01MC5qcGc.jpg"
          alt="nature"
          className="w-full h-screen object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40">
          {/* Bottom Left Quote */}
          <div className="absolute bottom-10 left-10">
            <p
              className="text-white text-6xl italic leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {t("registerQuote")}
            </p>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/3 flex items-center justify-center bg-white px-10">
        <form
          onSubmit={handleRegister}
          className="w-full max-w-md space-y-5 -mt-6"
        >
          {/* Heading */}
          <div>
            <h1 className="text-4xl font-bold text-[#1e2a03]">
              {t("register")}
            </h1>

            <p className="text-gray-500 mt-2">
              {t("createYourAccount")}
            </p>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label className="text-[#1e2a03] font-medium">
              {t("usernameLabel")}
            </label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder={t("usernamePlaceholder")}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#95A472] focus:ring-2 focus:ring-[#95A472]/30 transition"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[#1e2a03] font-medium">
              {t("emailLabel")}
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("emailPlaceholder")}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#95A472] focus:ring-2 focus:ring-[#95A472]/30 transition"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-[#1e2a03] font-medium">
              {t("passwordLabel")}
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t("passwordPlaceholder")}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#95A472] focus:ring-2 focus:ring-[#95A472]/30 transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1e2a03] hover:bg-[#88AB75] text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-md"
          >
            {loading ? t("registering") : t("register")}
          </button>

          {/* Login Link */}
          <p className="text-center text-gray-600">
            {t("alreadyHaveAccount")}{" "}
            <Link
              href="/login"
              className="text-[#1e2a03] font-semibold hover:underline"
            >
              {t("login")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
