"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  const isNepali = language === "np";

  return (
    <button
      onClick={toggleLanguage}
      className="group relative flex h-8 items-center rounded-full border border-zinc-200/60 bg-white/80 px-1 shadow-sm backdrop-blur-md transition-colors hover:border-zinc-300"
      aria-label={`Switch to ${isNepali ? "English" : "नेपाली"}`}
    >
      {/* Sliding pill */}
      <motion.div
        layout
        className="absolute h-6 w-12 rounded-full bg-[#267163]"
        animate={{ x: isNepali ? 2 : 50 }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
      />

      {/* Labels */}
      <span
        className={`relative z-10 w-12 text-center text-xs font-semibold transition-colors duration-200 ${
          isNepali ? "text-white" : "text-zinc-500 group-hover:text-zinc-700"
        }`}
      >
        नेपाली
      </span>
      <span
        className={`relative z-10 w-12 text-center text-xs font-semibold transition-colors duration-200 ${
          !isNepali ? "text-white" : "text-zinc-500 group-hover:text-zinc-700"
        }`}
      >
        EN
      </span>
    </button>
  );
}
