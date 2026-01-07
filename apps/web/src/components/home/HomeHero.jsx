import "./home.css";
export default function HomeHero() {
  return (
    <section className="home-hero">
      <div className="orbital-system">
        <div className="orbital-system">
          {/* System 1: Inner */}
          <div className="orbit-system system-1">
            <div className="orbit-ring">
              <div className="planet planet-1" />
              <div className="planet planet-2" />
              <div className="planet planet-3" />
            </div>
          </div>

          {/* System 2: Middle */}
          <div className="orbit-system system-2">
            <div className="orbit-ring">
              <div className="planet planet-1" />
              <div className="planet planet-2" />
              <div className="planet planet-3" />
            </div>
          </div>

          {/* System 3: Outer */}
          <div className="orbit-system system-3">
            <div className="orbit-ring">
              <div className="planet planet-1" />
              <div className="planet planet-2" />
              <div className="planet planet-3" />
            </div>
          </div>
        </div>
      </div>

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
