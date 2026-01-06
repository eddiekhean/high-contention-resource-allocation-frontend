import { useRef, useState, useEffect } from "react";
import "./css/stage.css";
import ServerPanel from "./ServerPanel";

export default function SimulationStage() {
  const TOTAL_SLOTS = 8;

  const [spawnQueue, setSpawnQueue] = useState([]);
  const [usedSlots, setUsedSlots] = useState(0);
  const COLORS = {
    free: "#3b82f6",
    paid: "#22c55e",
    vip: "#f59e0b",
  };

  // ===== REFS =====
  const layoutRef = useRef(null); // hệ tọa độ chung
  const clientStageRef = useRef(null); // nơi append client
  const serverRef = useRef(null);
  const isProcessingRef = useRef(false);

  // ===== ARROW =====
  function shootArrow(client, onDone) {
    const layout = layoutRef.current;
    const clientStage = clientStageRef.current;
    const server = serverRef.current;
    if (!layout || !clientStage || !server) return;

    const svg = layout.querySelector(".arrow-layer");
    if (!svg) return;
    const layoutRect = layout.getBoundingClientRect();
    const cRect = client.getBoundingClientRect();
    const sRect = server.getBoundingClientRect();

    // START: client
    const x1 = cRect.right - layoutRect.left;
    const y1 = cRect.top - layoutRect.top + cRect.height / 2;

    // END: server
    const x2 = sRect.left - layoutRect.left + sRect.width / 2;
    const y2 = sRect.top - layoutRect.top + sRect.height / 2;

    // CURVE
    const cx1 = x1 + 80;
    const cy1 = y1;
    const cx2 = x2 - 80;
    const cy2 = y2;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    path.setAttribute(
      "d",
      `M ${x1},${y1} C ${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`
    );

    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#ff9f1a");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linecap", "round");

    svg.appendChild(path);

    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;

    path.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
      duration: 600,
      easing: "ease-out",
      fill: "forwards",
    });

    setTimeout(() => {
      path.remove();
      onDone?.();
    }, 600);
  }

  // ===== ENQUEUE =====
  const spawnTestClient = (type) => {
    setSpawnQueue((q) => [...q, { type }]);
  };

  // ===== PROCESS QUEUE =====
  useEffect(() => {
    if (spawnQueue.length === 0) return;
    if (isProcessingRef.current) return;
    if (usedSlots >= TOTAL_SLOTS) return;

    isProcessingRef.current = true;

    const { type } = spawnQueue[0];
    const stage = clientStageRef.current;
    if (!stage) return;

    const client = document.createElement("div");
    client.className = `client ${type}`;
    client.textContent = type.toUpperCase();

    const stageRect = stage.getBoundingClientRect();

    const x = Math.random() * (stageRect.width - 60);
    const y = Math.random() * (stageRect.height - 40);

    client.style.left = `${x}px`;
    client.style.top = `${y}px`;

    stage.appendChild(client);

    shootArrow(client, () => {
      setUsedSlots((v) => Math.min(v + 1, TOTAL_SLOTS));
      client.remove();
      setSpawnQueue((q) => q.slice(1));
      isProcessingRef.current = false;
    });
  }, [spawnQueue, usedSlots]);

  // ===== JSX =====
  return (
    <div className="m2 simulation-card simulation-stage">
      <div className="card-content simulation-layout" ref={layoutRef}>
        <svg className="arrow-layer" />

        <div className="sim-left">
          <h3 className="sim-title">Clients</h3>
          <div className="client-stage" ref={clientStageRef} />
          <div className="controls">
            <button onClick={() => spawnTestClient("free")}>Free</button>
            <button onClick={() => spawnTestClient("paid")}>Paid</button>
            <button onClick={() => spawnTestClient("vip")}>VIP</button>
          </div>
        </div>

        <div className="sim-right">
          <h3 className="sim-title">Server</h3>
          <ServerPanel
            ref={serverRef}
            totalSlots={TOTAL_SLOTS}
            usedSlots={usedSlots}
          />
        </div>
      </div>
    </div>
  );
}
