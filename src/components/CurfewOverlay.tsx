"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CurfewOverlayProps {
  active: boolean;
}

export default function CurfewOverlay({ active }: CurfewOverlayProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(139, 0, 0, 0.25) 100%)",
          }}
        >
          {/* Vignette corners */}
          <div
            className="absolute inset-0"
            style={{
              boxShadow: "inset 0 0 120px 40px rgba(0, 0, 0, 0.3)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
