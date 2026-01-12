import { useState, useEffect, useRef } from "react";
import HomeHero from "../components/home/HomeHero";
import HomeContent from "../components/home/HomeContent";
import PlanetBackground from "../components/home/PlanetBackground";
import PullToRefresh from "../components/common/PullToRefresh";

export default function Home() {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isThrottling = useRef(false);
  const overscrollAccumulator = useRef(0);

  const TOTAL_SECTIONS = 7; // 1 Hero + 6 Content sections
  const THROTTLE_DELAY = 800;
  const REFRESH_THRESHOLD = 120;
  const OVERSCROLL_THRESHOLD = 15; // Require some extra wheel movement to switch

  useEffect(() => {
    const touchStartPos = { y: 0 };

    const checkScrollBoundary = (direction) => {
      // If we're on the hero, we can always change section
      if (activeSectionIndex === 0) return true;

      // Find the currently active scrollable content section
      const content = document.querySelector(".home-content");
      if (!content) return true;

      const { scrollTop, scrollHeight, clientHeight } = content;

      // Precision tolerance for high-DPI displays
      const isAtTop = scrollTop <= 1;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) <= 1;

      if (direction > 0 && isAtBottom) return true; // Scrolling down at bottom
      if (direction < 0 && isAtTop) return true;    // Scrolling up at top

      return false; // Stay inside if we can scroll internally
    };

    const handleWheel = (e) => {
      if (isThrottling.current) return;
      const direction = e.deltaY > 0 ? 1 : -1;

      if (checkScrollBoundary(direction)) {
        // We are at the boundary, accumulate overscroll intention
        overscrollAccumulator.current += e.deltaY;

        // If we've accumulated enough scroll "force" past the boundary
        if (Math.abs(overscrollAccumulator.current) > OVERSCROLL_THRESHOLD) {
          // Verify direction matches accumulation to avoid jitter
          if ((overscrollAccumulator.current > 0 && direction > 0) ||
            (overscrollAccumulator.current < 0 && direction < 0)) {

            e.preventDefault();
            changeSection(direction);
            overscrollAccumulator.current = 0; // Reset after switch
          }
        }
      } else {
        // Not at boundary, reset accumulator so we don't accidentally switch later
        overscrollAccumulator.current = 0;
      }
    };

    const handleTouchStart = (e) => {
      touchStartPos.y = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (isRefreshing || isThrottling.current) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - touchStartPos.y;

      // Pull to refresh logic: only on Hero section at the top
      if (activeSectionIndex === 0 && diff > 0) {
        // Damping effect
        const dampenedDiff = Math.pow(diff, 0.85);
        setPullDistance(dampenedDiff);

        // Prevent default scroll behavior when pulling
        if (dampenedDiff > 10) {
          if (e.cancelable) e.preventDefault();
        }
      }
    };

    const handleTouchEnd = (e) => {
      if (isRefreshing || isThrottling.current) return;

      if (pullDistance >= REFRESH_THRESHOLD) {
        setIsRefreshing(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setPullDistance(0);

        // Handle normal section navigation
        const touchEndScale = 50; // threshold for swipe
        const touchEndPos = e.changedTouches[0].clientY;
        const diff = touchStartPos.y - touchEndPos;

        if (Math.abs(diff) > touchEndScale) {
          const direction = diff > 0 ? 1 : -1;
          if (checkScrollBoundary(direction)) {
            changeSection(direction);
          }
        }
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
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [activeSectionIndex, pullDistance, isRefreshing]);

  return (
    <div className="home-fullpage-wrapper">
      <PullToRefresh
        pullDistance={pullDistance}
        threshold={REFRESH_THRESHOLD}
        isRefreshing={isRefreshing}
      />

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
