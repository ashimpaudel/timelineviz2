"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Phase } from "@/lib/constants";

interface AmbientSoundProps {
  phase: Phase;
  activeIndex: number;
  totalEvents: number;
}

// Phase intensity: how loud the ambient sound gets (0–1)
const PHASE_INTENSITY: Record<Phase, number> = {
  gathering: 0.15,
  escalation: 0.35,
  curfew: 0.6,
  aftermath: 0.2,
};

export default function AmbientSound({ phase, activeIndex, totalEvents }: AmbientSoundProps) {
  const [muted, setMuted] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const isInitRef = useRef(false);

  const initAudio = useCallback(() => {
    if (isInitRef.current) return;
    isInitRef.current = true;

    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    // Create brown noise buffer (crowd-like ambient)
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brown noise: integrate white noise with leak
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.5;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Low-pass filter to make it sound like muffled crowd
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;
    filter.Q.value = 1;
    filterRef.current = filter;

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gainRef.current = gain;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    noiseNodeRef.current = source;
  }, []);

  // Toggle mute
  const handleToggle = useCallback(() => {
    if (muted) {
      initAudio();
      if (audioCtxRef.current?.state === "suspended") {
        audioCtxRef.current.resume();
      }
    }
    setMuted((m) => !m);
  }, [muted, initAudio]);

  // Update intensity based on phase and position
  useEffect(() => {
    if (!gainRef.current || !filterRef.current || muted) return;

    const intensity = PHASE_INTENSITY[phase];
    // Progress through timeline adds subtle crescendo
    const progress = activeIndex / Math.max(totalEvents - 1, 1);
    const volumeBoost = phase === "curfew" ? 0.15 : 0;
    const targetGain = Math.min(intensity + volumeBoost, 0.7);

    // Smoothly ramp gain
    gainRef.current.gain.cancelScheduledValues(audioCtxRef.current!.currentTime);
    gainRef.current.gain.setTargetAtTime(
      targetGain,
      audioCtxRef.current!.currentTime,
      0.8 // time constant — smooth 800ms transition
    );

    // Raise filter freq during curfew (more "urgent" sound)
    const baseFreq = phase === "curfew" ? 600 : phase === "escalation" ? 500 : 400;
    filterRef.current.frequency.setTargetAtTime(
      baseFreq + progress * 100,
      audioCtxRef.current!.currentTime,
      0.5
    );
  }, [phase, activeIndex, totalEvents, muted]);

  // Mute/unmute
  useEffect(() => {
    if (!gainRef.current || !audioCtxRef.current) return;
    if (muted) {
      gainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.3);
    }
  }, [muted]);

  // Cleanup
  useEffect(() => {
    return () => {
      noiseNodeRef.current?.stop();
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
      <button
        onClick={handleToggle}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110"
        aria-label={muted ? "Enable ambient sound" : "Mute ambient sound"}
        title={muted ? "Enable ambient sound" : "Mute ambient sound"}
      >
        <AnimatePresence mode="wait">
          {muted ? (
            <motion.svg
              key="muted"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </motion.svg>
          ) : (
            <motion.svg
              key="unmuted"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </button>
      {/* Subtle label on first view */}
      <AnimatePresence>
        {muted && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1 text-center text-[9px] text-white/40"
          >
            🔊 Sound
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
