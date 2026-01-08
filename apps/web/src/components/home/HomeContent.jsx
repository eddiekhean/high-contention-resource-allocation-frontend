import useReveal from "../../hooks/useReveal";

export default function HomeContent() {
  const title1Ref = useReveal();
  const p1Ref = useReveal();
  const p2Ref = useReveal();
  const p3Ref = useReveal();

  const title2Ref = useReveal();
  const p4Ref = useReveal();
  const p5Ref = useReveal();
  const p6Ref = useReveal();

  const title3Ref = useReveal();
  const p7Ref = useReveal();
  const p8Ref = useReveal();
  const p9Ref = useReveal();

  const title4Ref = useReveal();
  const p10Ref = useReveal();
  const p11Ref = useReveal();
  const p12Ref = useReveal();

  const title5Ref = useReveal();
  const p13Ref = useReveal();
  const p14Ref = useReveal();
  const p15Ref = useReveal();

  const title6Ref = useReveal();
  const p16Ref = useReveal();
  const p17Ref = useReveal();
  const p18Ref = useReveal();

  return (
    <>
      <section className="home-content">
        <div className="home-content__grid">
          <h2 ref={title1Ref} className="home-content__title reveal">
            WHO
            <br />
            I AM
          </h2>

          <div className="home-content__text">
            <p ref={p1Ref} className="reveal delay-1">
              I'm <strong>Duy Khang Le</strong>, a software engineering graduate from Saigon University, currently working as a Backend Developer at IG3 Lab (HCMUS) in Ho Chi Minh City, Vietnam. My focus is on building reliable backend systems that integrate seamlessly with larger distributed architectures.
            </p>

            <p ref={p2Ref} className="reveal delay-2">
              My journey into software engineering started with a fascination for how systems communicate, authenticate, and process data at scale. I've spent the past year developing backend services that support blockchain-based registration, batch data processing, and cross-module integration with external systems like IPFS and smart contracts.
            </p>

            <p ref={p3Ref} className="reveal delay-3">
              I'm actively seeking <strong>Software Engineer Intern</strong> opportunities where I can contribute to building reliable systems, collaborate with experienced engineers, and continue growing my technical skills in backend development and distributed systems.
            </p>
          </div>
        </div>
      </section>

      <section className="home-content">
        <div className="home-content__grid">
          <h2 ref={title2Ref} className="home-content__title reveal">
            WHAT
            <br />
            I BUILD
          </h2>

          <div className="home-content__text">
            <p ref={p4Ref} className="reveal delay-1">
              At IG3 Lab, I work on <strong>Module 3: API Gateway & Backend Services</strong>, where I develop and maintain backend services that support multiple modules within a larger distributed system. The work involves designing RESTful APIs, implementing authentication workflows, and ensuring data flows correctly across system boundaries.
            </p>

            <p ref={p5Ref} className="reveal delay-2">
              One of my key contributions has been implementing <strong>authentication workflows for blockchain-based registration features</strong>. This involved integrating JWT and OAuth2 for secure session management, handling user verification across distributed components, and ensuring the authentication layer could scale with the platform's growth.
            </p>

            <p ref={p6Ref} className="reveal delay-3">
              I've also built <strong>batch data processing pipelines</strong> that handle file uploads with validation and asynchronous processing. The challenge was designing a system that could process large datasets efficiently while maintaining data integrity, providing meaningful error feedback, and supporting retry mechanisms for failed operations.
            </p>
          </div>
        </div>
      </section>

      <section className="home-content">
        <div className="home-content__grid">
          <h2 ref={title3Ref} className="home-content__title reveal">
            HOW
            <br />
            I THINK
          </h2>

          <div className="home-content__text">
            <p ref={p7Ref} className="reveal delay-1">
              I approach software development with a <strong>systems thinking</strong> mindset. Every component exists within a larger architecture, and understanding those relationships is crucial. When I design an API or implement a feature, I think about how it fits into the broader system—what assumptions it makes, what contracts it exposes, and how it will behave when other components change.
            </p>

            <p ref={p8Ref} className="reveal delay-2">
              I prioritize <strong>reliability over speed</strong>. A feature that works correctly under various conditions—network failures, invalid input, concurrent requests—is more valuable than one that works quickly only in ideal scenarios. This means investing time in proper error handling, validation, logging, and testing before considering a feature complete.
            </p>

            <p ref={p9Ref} className="reveal delay-3">
              Every technical decision involves <strong>trade-offs</strong>. I believe in making informed choices based on the specific context: understanding when to optimize for performance versus maintainability, when to accept technical debt with a clear plan to address it, and when to invest in abstraction versus solving the immediate problem. The best solution depends on the constraints and goals of the project.
            </p>
          </div>
        </div>
      </section>

      <section className="home-content">
        <div className="home-content__grid">
          <h2 ref={title4Ref} className="home-content__title reveal">
            TECHNICAL
            <br />
            STACK
          </h2>

          <div className="home-content__text">
            <p ref={p10Ref} className="reveal delay-1">
              I work primarily with <strong>Go and Java</strong> for backend development, using frameworks like <strong>Gin and Spring Boot</strong> to build RESTful services. My database experience spans both SQL (PostgreSQL, MySQL) and NoSQL (MongoDB, Redis) systems, and I've worked with <strong>Kafka</strong> for asynchronous messaging and event-driven architectures.
            </p>

            <p ref={p11Ref} className="reveal delay-2">
              For authentication and security, I've implemented solutions using <strong>JWT and OAuth2</strong>, handling session management, token refresh flows, and secure credential storage. On the DevOps side, I use <strong>Docker</strong> for containerization, <strong>Git</strong> for version control, and <strong>GitHub Actions</strong> for CI/CD pipelines.
            </p>

            <p ref={p12Ref} className="reveal delay-3">
              Beyond specific tools, I focus on understanding <strong>engineering concepts</strong>: RESTful API design principles, session management strategies, asynchronous processing patterns, and how to structure backend services for maintainability and scalability. Tools change, but these foundational concepts remain valuable across different technology stacks.
            </p>
          </div>
        </div>
      </section>

      <section className="home-content">
        <div className="home-content__grid">
          <h2 ref={title5Ref} className="home-content__title reveal">
            LEARNING
            <br />
            JOURNEY
          </h2>

          <div className="home-content__text">
            <p ref={p13Ref} className="reveal delay-1">
              This site documents my learning process across <strong>algorithms, system design, and full-stack development</strong>. I practice LeetCode daily to strengthen problem-solving skills and deepen my understanding of data structures and algorithmic complexity. Each problem is an opportunity to think about trade-offs between time and space complexity.
            </p>

            <p ref={p14Ref} className="reveal delay-2">
              Beyond algorithms, I build <strong>personal projects</strong> to understand how systems work in practice. My current project, Scratchpad, is a lightweight code execution platform that lets developers run and share code snippets instantly. Building it taught me about secure code execution, containerization, WebSocket communication, and designing clean user interfaces.
            </p>

            <p ref={p15Ref} className="reveal delay-3">
              I learn best by <strong>implementing real solutions to real problems</strong>. Whether it's integrating with blockchain clients, designing asynchronous processing pipelines, or building RESTful APIs, each challenge deepens my understanding of how to build systems that are reliable, maintainable, and scalable.
            </p>
          </div>
        </div>
      </section>

      <section className="home-content">
        <div className="home-content__grid">
          <h2 ref={title6Ref} className="home-content__title reveal">
            GET IN
            <br />
            TOUCH
          </h2>

          <div className="home-content__text">
            <p ref={p16Ref} className="reveal delay-1">
              I'm looking for opportunities to work with teams that value <strong>technical excellence, collaboration, and continuous learning</strong>. If you're building reliable systems and need someone who thinks deeply about architecture, cares about code quality, and approaches problems systematically, I'd love to connect.
            </p>

            <p ref={p17Ref} className="reveal delay-2">
              You can reach me at <strong>ldkhang0410@gmail.com</strong> or connect with me on <strong>LinkedIn</strong> at linkedin.com/in/ldkhang0410. I'm based in Ho Chi Minh City, Vietnam, and open to both local and remote opportunities.
            </p>

            <p ref={p18Ref} className="reveal delay-3">
              Feel free to explore the projects and simulations on this site to see how I approach problem-solving, system design, and technical implementation. Every piece of code here represents a learning journey and a commitment to building software that works reliably.
            </p>
          </div>
        </div>
      </section >
    </>
  );
}
