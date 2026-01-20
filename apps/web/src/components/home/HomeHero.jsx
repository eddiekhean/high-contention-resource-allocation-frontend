import { Link } from "react-router-dom";
import "./home.css";
import OrbitalBackground from "../common/OrbitalBackground";
export default function HomeHero({ onNext }) {
  return (
    <section className="home-hero">
      <OrbitalBackground />

      <div className="home-hero__inner">
        <h1 className="home-hero__title">
          BETWEEN JOBS
          <br />
          STILL BUILDING
        </h1>

        <p className="home-hero__subtitle">
          Learning backend systems by building and simulating real problems.
        </p>
      </div>

      <button className="home-hero__scroll-indicator" onClick={onNext}>
        Scroll down to see more
      </button>
    </section>
  );
}
