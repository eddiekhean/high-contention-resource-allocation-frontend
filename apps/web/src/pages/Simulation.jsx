import SimulationContent from "../components/simulation/SimulationContent";
import OrbitalBackground from "../components/common/OrbitalBackground";
export default function Simulation() {
  return (
    <div className="simulation-page" style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <OrbitalBackground />
      <SimulationContent />
    </div>
  );
}
