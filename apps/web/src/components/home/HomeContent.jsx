import { useReveal } from "../../hooks/UseReveal";

export default function HomeContent() {
  const titleRef = useReveal();
  const p1Ref = useReveal();
  const p2Ref = useReveal();

  return (
    <section className="home-content">
      <div className="home-content__grid">
        <h2 ref={titleRef} className="home-content__title reveal">
          ABOUT
          <br />
          THIS SITE
        </h2>

        <div className="home-content__text">
          <p ref={p1Ref} className="reveal delay-1">
            This site documents my learning process across algorithms, system
            design, and full-stack development. I practice LeetCode daily to
            strengthen problem-solving and data structure fundamentals.
          </p>

          <p ref={p2Ref} className="reveal delay-2">
            Beyond algorithms, I build backend services, frontend interfaces,
            and CI/CD pipelines to understand how systems are designed,
            deployed, and evolved in practice.
          </p>
        </div>
      </div>
    </section>
  );
}
