import "./home.css";
import OrbitalBackground from "../common/OrbitalBackground";
export default function HomeHero() {
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

        <button className="home-hero__cta">View the first project →</button>
      </div>
    </section>
  );
}
