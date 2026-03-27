"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import ScrollCards from "@/components/ScrollCards";
import TimelineScrubber from "@/components/TimelineScrubber";

const MapContainer = dynamic(() => import("@/components/MapContainer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-zinc-100">
      <div className="text-sm text-zinc-400">Loading map…</div>
    </div>
  ),
});

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrubberVisible, setScrubberVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const handleActiveChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Show scrubber only when the scrollytelling section is in view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrubberVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <TimelineScrubber activeIndex={activeIndex} visible={scrubberVisible} />
      <HeroSection />

      {/* Scrollytelling section */}
      <section ref={sectionRef} className="relative">
        <div className="flex flex-col md:flex-row">
          {/* Map — sticky on desktop, sticky on mobile too */}
          <div className="sticky top-0 z-10 h-[50vh] w-full md:h-screen md:w-[60%]">
            <MapContainer activeIndex={activeIndex} />
          </div>

          {/* Scrollable cards */}
          <div className="relative z-20 w-full md:w-[40%]">
            <ScrollCards
              activeIndex={activeIndex}
              onActiveChange={handleActiveChange}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 px-6 py-16 text-center text-zinc-500">
        <p className="font-serif text-lg text-zinc-300" lang="ne">
          भदौ २३ र २४ गतेको घटनासम्बन्धी जाँचबुझ आयोगको प्रतिवेदनमा आधारित
        </p>
        <p className="mt-2 text-sm italic">
          Based on the Investigation Commission Report on the events of Bhadra
          23 and 24
        </p>
        <div className="mt-8 h-px w-24 mx-auto bg-zinc-800" />
        <p className="mt-6 text-xs text-zinc-600">
          यो परियोजना पत्रकारिता प्रयोजनका लागि बनाइएको हो।
          <br />
          This project was built for journalistic purposes.
        </p>
      </footer>
    </main>
  );
}
