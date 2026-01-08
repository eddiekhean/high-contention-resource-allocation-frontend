import SimulationContent from "../components/simulation/SimulationContent";
import OrbitalBackground from "../components/common/OrbitalBackground";
export default function Simulation() {
  return (
    <div className="simulation-layout" style={{ position: "relative", minHeight: "100vh", overflow: "hidden", width: "100%" }}>
      <OrbitalBackground />
      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <SimulationContent />
      </div>
    </div>
  );
}
