import "./Header.css";
import logoImg from "../../assets/logo.png";

import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <div className="left">
        <img src={logoImg} alt="Scratchpad" className="logo-image" />
        <span className="logo">Scratchpad</span>
      </div>
      <nav className="notch">
        <Link to="">Home</Link>
        <Link to="/simulation">Simulation</Link>
        <Link to="/leetcode">LeetCode</Link>
        <Link to="/system-design">System Design</Link>
      </nav>
      <div className="right">
        <a
          className="github"
          href="https://github.com/eddiekhean/high-contention-resource-allocation"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}
