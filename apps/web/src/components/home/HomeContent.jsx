import React, { memo } from "react";
import { Link } from "react-router-dom";
import useReveal from "../../hooks/useReveal";

// --- Data ---
const SECTIONS_DATA = [
  {
    id: "who-i-am",
    title: (
      <>
        WHO
        <br />
        I AM
      </>
    ),
    paragraphs: [
      <span key="p1">
        I'm <strong>Duy Khang Le</strong>, a software engineering graduate from
        Saigon University, currently working as a Backend Developer at IG3 Lab
        (HCMUS) in Ho Chi Minh City, Vietnam. My focus is on building reliable
        backend systems that integrate seamlessly with larger distributed
        architectures.
      </span>,
      <span key="p2">
        My journey into software engineering started with a fascination for how
        systems communicate, authenticate, and process data at scale. I've spent
        the past year developing backend services that support blockchain-based
        registration, batch data processing, and cross-module integration with
        external systems like IPFS and smart contracts.
      </span>,
      <span key="p3">
        I'm actively seeking <strong>Software Engineer Intern</strong>{" "}
        opportunities where I can contribute to building reliable systems,
        collaborate with experienced engineers, and continue growing my
        technical skills in backend development and distributed systems.
      </span>,
    ],
  },
  {
    id: "what-i-build",
    title: (
      <>
        WHAT
        <br />
        I BUILD
      </>
    ),
    paragraphs: [
      <span key="p1">
        At IG3 Lab, I work on{" "}
        <strong>Module 3: API Gateway &amp; Backend Services</strong>, where I
        develop and maintain backend services that support multiple modules
        within a larger distributed system. The work involves designing RESTful
        APIs, implementing authentication workflows, and ensuring data flows
        correctly across system boundaries.
      </span>,
      <span key="p2">
        One of my key contributions has been implementing{" "}
        <strong>
          authentication workflows for blockchain-based registration features
        </strong>
        . This involved integrating JWT and OAuth2 for secure session
        management, handling user verification across distributed components,
        and ensuring the authentication layer could scale with the platform's
        growth.
      </span>,
      <span key="p3">
        I've also built <strong>batch data processing pipelines</strong> that
        handle file uploads with validation and asynchronous processing. The
        challenge was designing a system that could process large datasets
        efficiently while maintaining data integrity, providing meaningful error
        feedback, and supporting retry mechanisms for failed operations.
      </span>,
    ],
  },
  {
    id: "how-i-think",
    title: (
      <>
        HOW
        <br />
        I THINK
      </>
    ),
    paragraphs: [
      <span key="p1">
        I approach software development with a <strong>systems thinking</strong>{" "}
        mindset. Every component exists within a larger architecture, and
        understanding those relationships is crucial. When I design an API or
        implement a feature, I think about how it fits into the broader
        system—what assumptions it makes, what contracts it exposes, and how it
        will behave when other components change.
      </span>,
      <span key="p2">
        I prioritize <strong>reliability over speed</strong>. A feature that
        works correctly under various conditions—network failures, invalid
        input, concurrent requests—is more valuable than one that works quickly
        only in ideal scenarios. This means investing time in proper error
        handling, validation, logging, and testing before considering a feature
        complete.
      </span>,
      <span key="p3">
        Every technical decision involves <strong>trade-offs</strong>. I believe
        in making informed choices based on the specific context: understanding
        when to optimize for performance versus maintainability, when to accept
        technical debt with a clear plan to address it, and when to invest in
        abstraction versus solving the immediate problem. The best solution
        depends on the constraints and goals of the project.
      </span>,
    ],
  },
  {
    id: "technical-stack",
    title: (
      <>
        TECHNICAL
        <br />
        STACK
      </>
    ),
    paragraphs: [
      <span key="p1">
        I work primarily with <strong>Go and Java</strong> for backend
        development, using frameworks like <strong>Gin and Spring Boot</strong>{" "}
        to build RESTful services. My database experience spans both SQL
        (PostgreSQL, MySQL) and NoSQL (MongoDB, Redis) systems, and I've
        worked with <strong>Kafka</strong> for asynchronous messaging and
        event-driven architectures.
      </span>,
      <span key="p2">
        For authentication and security, I've implemented solutions using{" "}
        <strong>JWT and OAuth2</strong>, handling session management, token
        refresh flows, and secure credential storage. On the DevOps side, I use{" "}
        <strong>Docker</strong> for containerization, <strong>Git</strong> for
        version control, and <strong>GitHub Actions</strong> for CI/CD
        pipelines.
      </span>,
      <span key="p3">
        Beyond specific tools, I focus on understanding{" "}
        <strong>engineering concepts</strong>: RESTful API design principles,
        session management strategies, asynchronous processing patterns, and how
        to structure backend services for maintainability and scalability. Tools
        change, but these foundational concepts remain valuable across different
        technology stacks.
      </span>,
    ],
  },
  {
    id: "learning-journey",
    title: (
      <>
        LEARNING
        <br />
        JOURNEY
      </>
    ),
    paragraphs: [
      <span key="p1">
        This site documents my learning process across{" "}
        <strong>algorithms, system design, and full-stack development</strong>.
        I practice LeetCode daily to strengthen problem-solving skills and
        deepen my understanding of data structures and algorithmic complexity.
        Each problem is an opportunity to think about trade-offs between time
        and space complexity.
      </span>,
      <span key="p2">
        Beyond algorithms, I build <strong>personal projects</strong> to
        understand how systems work in practice. My current project, Scratchpad,
        is a lightweight code execution platform that lets developers run and
        share code snippets instantly. Building it taught me about secure code
        execution, containerization, WebSocket communication, and designing
        clean user interfaces.
      </span>,
      <span key="p3">
        I learn best by{" "}
        <strong>implementing real solutions to real problems</strong>. Whether
        it's integrating with blockchain clients, designing asynchronous
        processing pipelines, or building RESTful APIs, each challenge deepens
        my understanding of how to build systems that are reliable,
        maintainable, and scalable.
      </span>,
    ],
  },
  {
    id: "get-in-touch",
    title: (
      <>
        GET IN
        <br />
        TOUCH
      </>
    ),
    paragraphs: [
      <span key="p1">
        I'm looking for opportunities to work with teams that value{" "}
        <strong>technical excellence, collaboration, and continuous learning</strong>
        . If you're building reliable systems and need someone who thinks deeply
        about architecture, cares about code quality, and approaches problems
        systematically, I'd love to connect.
      </span>,
      <span key="p2">
        You can reach me at <strong>ldkhang0410@gmail.com</strong> or connect
        with me on <strong>LinkedIn</strong> at linkedin.com/in/ldkhang0410. I'm
        based in Ho Chi Minh City, Vietnam, and open to both local and remote
        opportunities.
      </span>,
      <span key="p3">
        Feel free to explore the projects and simulations on this site to see
        how I approach problem-solving, system design, and technical
        implementation. Every piece of code here represents a learning journey
        and a commitment to building software that works reliably.
      </span>,
    ],
    cta: (
      <Link to="/leetcode/labyrinth" className="home-hero__cta">
        View the first project →
      </Link>
    ),

  },
];

// --- Helper Components ---

const RevealItem = ({ children, delayClass, isActive, className = "" }) => {
  const ref = useReveal(isActive);
  return (
    <div ref={ref} className={`reveal ${delayClass || ""} ${className}`}>
      {children}
    </div>
  );
};

const RevealTitle = ({ children, isActive }) => {
  // Title usually doesn't need a delay, or can use default
  const ref = useReveal(isActive);
  return (
    <h2 ref={ref} className="home-content__title reveal">
      {children}
    </h2>
  );
};

// Memoized Section Component to prevent unnecessary re-renders
const SectionRenderer = memo(({ data, isActive }) => {
  return (
    <section className="home-content">
      <div className="home-content__grid">
        <RevealTitle isActive={isActive}>{data.title}</RevealTitle>

        <div className="home-content__text">
          {data.paragraphs.map((content, index) => (
            <RevealItem
              key={index}
              isActive={isActive}
              delayClass={`delay-${index + 1}`}
            >
              <p>{content}</p>
            </RevealItem>
          ))}
          {data.cta && (
            <RevealItem
              isActive={isActive}
              delayClass={`delay-${data.paragraphs.length + 1}`}
            >
              {data.cta}
            </RevealItem>
          )}
        </div>
      </div>
    </section>
  );
});

// --- Main Component ---

export default function HomeContent({ sectionIndex }) {
  // Safe access to section data
  const currentSection = SECTIONS_DATA[sectionIndex];

  if (!currentSection) return null;

  return (
    <div className="home-content-wrapper">
      <SectionRenderer
        key={currentSection.id}
        data={currentSection}
        isActive={true}
      />
    </div>
  );
}
