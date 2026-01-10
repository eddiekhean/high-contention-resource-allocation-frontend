import { useState, useEffect, useRef } from "react";
import "./Header.css";
import logoImg from "../../assets/logo.png";
import { Link } from "react-router-dom";

export default function Header() {
  const [isIslandExpanded, setIsIslandExpanded] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const islandRef = useRef(null);

  // Toggle expand/collapse
  const toggleIsland = (e) => {
    if (window.innerWidth <= 768) {
      if (!isIslandExpanded) {
        setIsIslandExpanded(true);
      }
    }
  };

  const toggleControlCenter = (e) => {
    e.stopPropagation(); // Prevent island toggle
    setIsControlCenterOpen(!isControlCenterOpen);
  };

  const closeIsland = () => {
    setIsIslandExpanded(false);
    setIsControlCenterOpen(false);
  };

  // Click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (islandRef.current && !islandRef.current.contains(event.target)) {
        closeIsland();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <header className="header-container">
      <div
        ref={islandRef}
        className={`header-island ${isIslandExpanded ? "is-expanded" : ""} ${isControlCenterOpen ? "is-cc-open" : ""}`}
        onClick={toggleIsland}
      >
        <div className="island-content">
          <div className="island-left">
            <div onClick={isIslandExpanded ? toggleControlCenter : null} className="logo-link">
              <img src={logoImg} alt="Logo" className="logo-image" />
              <span className="logo-text">Scratchpad</span>
            </div>
          </div>

          <nav className="island-nav">
            <Link to="/" onClick={closeIsland}>Home</Link>
            <Link to="/simulation" onClick={closeIsland}>Simulation</Link>
            <Link to="/leetcode" onClick={closeIsland}>LeetCode</Link>
            <Link to="/system-design" onClick={closeIsland}>System Design</Link>
          </nav>

          <div className="island-right">
            <Link to="/auth" onClick={closeIsland} className="login-btn">
              Login
            </Link>
            <a
              className="github-btn"
              href="https://github.com/eddiekhean/high-contention-resource-allocation"
              target="_blank"
              rel="noreferrer"
            >
              <span className="github-text">GitHub</span>
              <svg className="github-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>

        {/* CONTROL CENTER PANEL */}
        <div className="control-center-panel">
          {/* Main Navigation Grid */}
          <div className="cc-nav-grid">
            <Link to="/" onClick={closeIsland} className="cc-nav-card cc-home">
              <span className="emoji">🏠</span>
              <span>Home</span>
            </Link>
            <Link to="/simulation" onClick={closeIsland} className="cc-nav-card cc-simulation">
              <span className="emoji">🚀</span>
              <span>Simulation</span>
            </Link>
            <Link to="/leetcode" onClick={closeIsland} className="cc-nav-card cc-leetcode">
              <span className="emoji">🧩</span>
              <span>LeetCode</span>
            </Link>
            <Link to="/system-design" onClick={closeIsland} className="cc-nav-card cc-sysdesign">
              <span className="emoji">🏗️</span>
              <span>System Design</span>
            </Link>
            <Link to="/auth" onClick={closeIsland} className="cc-nav-card cc-login">
              <span className="emoji">🔑</span>
              <span>Login / Register</span>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
