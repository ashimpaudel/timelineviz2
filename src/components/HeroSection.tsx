"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0d2e27] text-white">
      {/* Background gradient — Setopati green to dark */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#267163] via-[#1a4f44] to-[#0d2e27]" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-3xl px-6 text-center"
      >
        {/* Kicker */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-red-400"
        >
          जाँचबुझ आयोग प्रतिवेदन · Investigation Commission Report
        </motion.p>

        {/* Headline Nepali */}
        <h1
          className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl"
          lang="ne"
        >
          भदौ २३ को समयरेखा
        </h1>

        {/* Headline English */}
        <p className="mt-4 font-serif text-xl text-zinc-400 sm:text-2xl md:text-3xl">
          Timeline of Bhadra 23
        </p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-zinc-400"
        >
          जेनजी आन्दोलनका क्रममा भदौ २३ गते संसद भवनअगाडि प्रहरीको गोली लागि
          १९ जनाभन्दा बढीको मृत्यु भएको थियो। यो समयरेखा त्यस दिनको
          घटनाक्रमलाई मिनेटमिनेट विश्लेषण गर्दछ।
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mx-auto mt-3 max-w-xl text-sm italic leading-relaxed text-zinc-500"
        >
          During the Gen Z protests on Bhadra 23, police gunfire near
          Parliament killed more than 19 people. This timeline reconstructs the
          day minute by minute.
        </motion.p>

        {/* Date stamp */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mt-10 inline-flex items-center gap-3 rounded-full border border-[#267163]/40 px-5 py-2 text-sm text-zinc-300"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
          भदौ २३, २०८२ · September 8, 2025
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-16 flex flex-col items-center gap-2 text-zinc-600"
        >
          <span className="text-xs uppercase tracking-widest">
            Scroll to begin
          </span>
          <motion.svg
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </motion.svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
