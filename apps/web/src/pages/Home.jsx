import { useState, useEffect, useRef } from "react";
import HomeHero from "../components/home/HomeHero";
import HomeContent from "../components/home/HomeContent";
import PlanetBackground from "../components/home/PlanetBackground";
import PullToRefresh from "../components/common/PullToRefresh";

const DEBUG_SCROLL = true;

const debugLog = (group, details) => {
  if (!DEBUG_SCROLL) return;
  console.groupCollapsed(`[SCROLL-DEBUG] ${group} @ ${performance.now().toFixed(2)}ms`);
  console.log(details);
  console.groupEnd();
};

const DebugOverlay = ({ metrics }) => {
  if (!DEBUG_SCROLL || !metrics) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      background: 'rgba(0,0,0,0.8)',
      color: '#0f0',
      padding: '8px',
      fontSize: '10px',
      fontFamily: 'monospace',
      zIndex: 9999,
      pointerEvents: 'none',
      whiteSpace: 'pre'
    }}>
      <div>ScrollTop: {metrics.scrollTop?.toFixed(1)}</div>
      <div>ScrollH: {metrics.scrollHeight}</div>
      <div>ClientH: {metrics.clientHeight}</div>
      <div>AtTop: {String(metrics.isAtTop)}</div>
      <div>AtBottom: {String(metrics.isAtBottom)}</div>
      <div>Section: {metrics.sectionIndex}</div>
      <div>DeltaY: {metrics.deltaY?.toFixed(1)}</div>
    </div>
  );
};

export default function Home() {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isThrottling = useRef(false);
  const overscrollAccumulator = useRef(0);
  const touchStartBounds = useRef({ isAtTop: false, isAtBottom: false });
  const [debugMetrics, setDebugMetrics] = useState({});

  const TOTAL_SECTIONS = 7; // 1 Hero + 6 Content sections
  const THROTTLE_DELAY = 800;
  const REFRESH_THRESHOLD = 120;
  const OVERSCROLL_THRESHOLD = 15; // Require some extra wheel movement to switch

  useEffect(() => {
    const touchStartPos = { y: 0 };

    const getScrollBounds = () => {
      const metrics = {
        sectionIndex: activeSectionIndex,
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0,
        isAtTop: false,
        isAtBottom: false
      };

      if (activeSectionIndex === 0) {
        metrics.isAtTop = true;
        metrics.isAtBottom = true;
      } else {
        const content = document.querySelector(".home-content");
        if (!content) {
          metrics.isAtTop = true;
          metrics.isAtBottom = true;
        } else {
          const { scrollTop, scrollHeight, clientHeight } = content;
          metrics.scrollTop = scrollTop;
          metrics.scrollHeight = scrollHeight;
          metrics.clientHeight = clientHeight;

          // Precision tolerance for high-DPI displays and mobile quirks
          // Increased to 10px to handle mobile bouncing and float precision
          const TOLERANCE = 10;

          metrics.isAtTop = scrollTop <= TOLERANCE;
          // Handle overscroll (rubber banding) on iOS where scrollTop can exceed max
          metrics.isAtBottom = (scrollTop + clientHeight) >= (scrollHeight - TOLERANCE);

          if (DEBUG_SCROLL) {
            if (scrollTop < 0) console.log("!! OVERSCROLL_TOP !!");
            if (scrollTop + clientHeight > scrollHeight) console.log("!! OVERSCROLL_BOTTOM !!");
          }
        }
      }

      if (DEBUG_SCROLL) {
        setDebugMetrics(prev => ({ ...prev, ...metrics }));
      }

      return { isAtTop: metrics.isAtTop, isAtBottom: metrics.isAtBottom };
    };

    const checkScrollBoundary = (direction) => {
      const { isAtTop, isAtBottom } = getScrollBounds();
      const result = (direction > 0 && isAtBottom) || (direction < 0 && isAtTop);

      if (DEBUG_SCROLL && result) {
        debugLog("checkScrollBoundary: ALLOW_SWITCH", { direction, isAtTop, isAtBottom });
      }
      return result;
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
      const y = e.touches[0].clientY;
      touchStartPos.y = y;
      const bounds = getScrollBounds();
      touchStartBounds.current = bounds;

      debugLog("touchstart", { y, bounds });
    };

    const handleTouchMove = (e) => {
      if (isRefreshing || isThrottling.current) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - touchStartPos.y;

      if (DEBUG_SCROLL) {
        setDebugMetrics(prev => ({ ...prev, deltaY: diff }));
      }

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

        debugLog("touchend", { touchEndPos, diff, startBounds: touchStartBounds.current });

        if (Math.abs(diff) > touchEndScale) {
          const direction = diff > 0 ? 1 : -1;

          let validSwitch = false;
          if (direction > 0 && touchStartBounds.current.isAtBottom) validSwitch = true;
          if (direction < 0 && touchStartBounds.current.isAtTop) validSwitch = true;

          debugLog("Section Switch Decision", {
            direction: direction > 0 ? "NEXT" : "PREV",
            validSwitch,
            isAtTop: touchStartBounds.current.isAtTop,
            isAtBottom: touchStartBounds.current.isAtBottom
          });

          if (validSwitch && checkScrollBoundary(direction)) {
            debugLog("SWITCHING SECTION", { direction });
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
      <DebugOverlay metrics={debugMetrics} />
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
