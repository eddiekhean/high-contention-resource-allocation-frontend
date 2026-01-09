import { useState, useEffect, useRef } from "react";
import HomeHero from "../components/home/HomeHero";
import HomeContent from "../components/home/HomeContent";
import PlanetBackground from "../components/home/PlanetBackground";

export default function Home() {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const isThrottling = useRef(false);

  const TOTAL_SECTIONS = 7; // 1 Hero + 6 Content sections
  const THROTTLE_DELAY = 800;

  useEffect(() => {
    const touchStartPos = { y: 0 };

    const handleWheel = (e) => {
      if (isThrottling.current) return;
      e.preventDefault();
      const direction = e.deltaY > 0 ? 1 : -1;
      changeSection(direction);
    };

    const handleTouchStart = (e) => {
      touchStartPos.y = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (isThrottling.current) return;
      const touchEndScale = 50; // threshold for swipe
      const touchEndPos = e.changedTouches[0].clientY;
      const diff = touchStartPos.y - touchEndPos;

      if (Math.abs(diff) > touchEndScale) {
        const direction = diff > 0 ? 1 : -1;
        changeSection(direction);
      }
    };

    const changeSection = (direction) => {
      setActiveSectionIndex((prevIndex) => {
        const newIndex = prevIndex + direction;
        return Math.max(0, Math.min(TOTAL_SECTIONS - 1, newIndex));
      });

      isThrottling.current = true;
      setTimeout(() => {
        isThrottling.current = false;
      }, THROTTLE_DELAY);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div className="home-fullpage-wrapper">
      {/* Background Layer (Persistent) */}
      <PlanetBackground
        activeSectionIndex={activeSectionIndex}
        totalSections={TOTAL_SECTIONS}
      />

      {activeSectionIndex === 0 && <HomeHero />}

      {/* Content Layer */}
      {activeSectionIndex > 0 && (
        <HomeContent
          sectionIndex={activeSectionIndex - 1}
          totalSections={TOTAL_SECTIONS - 1}
        />
      )}
    </div>
  );
}
