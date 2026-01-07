import "./css/stage.css";
import "./css/box.css";
import { useEffect, useRef, useState } from "react";

export default function SimulationStage({ simulationData }) {
  const arrivalList = simulationData?.arrivals ?? [];
  const [clients, setClients] = useState([]);
  const [gatewayCenter, setGatewayCenter] = useState(null);
  const [backendCenter, setBackendCenter] = useState(null);
  const TOTAL_VOUCHERS = simulationData?.totalVouchers ?? 10;
  const [voucherSlots, setVoucherSlots] = useState(
  Array.from({ length: TOTAL_VOUCHERS }, (_, i) => ({
    id: i,
    status: "available", // available | reserved | used
  }))
);
  const cursorRef = useRef(0);
  const stageRef = useRef(null);
  const clientRef = useRef(null);
  const gatewayRef = useRef(null);
  const backendRef = useRef(null);
  const CLIENT_TTL = 1000;
  const SPAWN_INTERVAL = 2000; // thời gian giữa các batch
  const CLEAN_INTERVAL = 500; // dọn client hết hạn
  const MIN_BATCH = 1;
  const MAX_BATCH = 5;
  const CLIENT_SIZE = 24;
  const PADDING = 16;
  const TITLE_HEIGHT = 32;
function consumeVoucher() {
  setVoucherSlots((prev) => {
    const idx = prev.findIndex((v) => v.status === "available");
    if (idx === -1) return prev; // hết voucher → reject

    const next = [...prev];
    next[idx] = { ...next[idx], status: "used", pulse: true };
    return next;
  });
}

  function spawnBatch(arrivalList, spawnArea, baseCursor, batchSize, now) {
    setClients((prev) => {
      const nextClients = [];

      for (let i = 0; i < batchSize; i++) {
        const idx = baseCursor + i;
        if (idx >= arrivalList.length) break;

        const c = arrivalList[idx];

        nextClients.push({
          id: c.id,
          type: c.type,
          firstTick: c.tick,
          order: idx,
          spawnAt: now,
          expiresAt: now + CLIENT_TTL,
          x: spawnArea.x + Math.random() * (spawnArea.w - CLIENT_SIZE),
          y: spawnArea.y + Math.random() * (spawnArea.h - CLIENT_SIZE),
        });
      }

      return [...prev, ...nextClients];
    });
  }

  useEffect(() => {
    if (!stageRef.current || arrivalList.length === 0) return;

    const stageRect = stageRef.current.getBoundingClientRect();

    const getBox = (ref) => {
      if (!ref.current) return null;
      const r = ref.current.getBoundingClientRect();
      return {
        x: r.left - stageRect.left,
        y: r.top - stageRect.top,
        w: r.width,
        h: r.height,
      };
    };

    const clientsBox = getBox(clientRef);
    if (!clientsBox) return;

    const spawnArea = {
      x: clientsBox.x + PADDING,
      y: clientsBox.y + TITLE_HEIGHT + PADDING,
      w: clientsBox.w - PADDING * 2,
      h: clientsBox.h - TITLE_HEIGHT - PADDING * 2,
    };

    const spawnOnce = () => {
      if (cursorRef.current >= arrivalList.length) return;

      const batchSize =
        Math.floor(Math.random() * (MAX_BATCH - MIN_BATCH + 1)) + MIN_BATCH;

      const now = Date.now();
      const baseCursor = cursorRef.current;

      spawnBatch(arrivalList, spawnArea, baseCursor, batchSize, now);

      cursorRef.current = Math.min(baseCursor + batchSize, arrivalList.length);
    };
    spawnOnce();

    const timer = setInterval(spawnOnce, SPAWN_INTERVAL);

    return () => clearInterval(timer);
  }, [arrivalList]);
  useEffect(() => {
  if (!simulationData) return;

  console.log("=== simulationData ===");
  console.log(simulationData);
  console.log("arrivals:", simulationData?.arrivals);
}, [simulationData]);

  useEffect(() => {
    const cleaner = setInterval(() => {
      const now = Date.now();
      setClients((prev) => prev.filter((c) => c.expiresAt > now));
    }, CLEAN_INTERVAL);

    return () => clearInterval(cleaner);
  }, []);

  useEffect(() => {
    if (!stageRef.current || !gatewayRef.current) return;

    const stageRect = stageRef.current.getBoundingClientRect();
    const g = gatewayRef.current.getBoundingClientRect();

    setGatewayCenter({
      x: g.left - stageRect.left + g.width / 2,
      y: g.top - stageRect.top + g.height / 2,
    });
  }, [clients.length]);
  function buildCurvePath(x1, y1, x2, y2, offsetX = 0) {
  const mx = (x1 + x2) / 2 + offsetX;
  const my = (y1 + y2) / 2;

  return `M ${x1} ${y1}
          Q ${mx} ${my}
            ${x2} ${y2}`;
}


  useEffect(() => {
  if (!stageRef.current || !gatewayRef.current || !backendRef.current) return;

  const stageRect = stageRef.current.getBoundingClientRect();

  const centerOf = (ref) => {
    const r = ref.current.getBoundingClientRect();
    return {
      x: r.left - stageRect.left + r.width / 2,
      y: r.top - stageRect.top + r.height / 2,
    };
  };

  setGatewayCenter(centerOf(gatewayRef));
  setBackendCenter(centerOf(backendRef));
}, []);

  return (
    <div ref={stageRef} className="simulation-stage">
      <svg className="links-layer">
  <defs>
    <marker
      id="arrow"
      markerWidth="8"
      markerHeight="8"
      refX="7"
      refY="4"
      orient="auto"
    >
      <path d="M0,0 L8,4 L0,8 Z" fill="rgba(200,200,220,0.6)" />
    </marker>
  </defs>

  {/* ===== GATEWAY ↔ BACKEND FLOWS (STATIC) ===== */}
  {gatewayCenter && backendCenter && (
  <>
    {/* Gateway → Backend (request) */}
    <path
      d={buildCurvePath(
        gatewayCenter.x,
        gatewayCenter.y,
        backendCenter.x,
        backendCenter.y,
        -32 // lệch trái
      )}
      className="flow-path flow-forward"
    />

    {/* Backend → Gateway (response) */}
    <path
      d={buildCurvePath(
        backendCenter.x,
        backendCenter.y,
        gatewayCenter.x,
        gatewayCenter.y,
        32 // lệch phải
      )}
      className="flow-path flow-backward"
    />
  </>
)}

  {/* ===== CLIENT → GATEWAY FLOWS ===== */}
  {/* ===== CLIENT ↔ GATEWAY FLOWS ===== */}
{gatewayCenter &&
  clients.map((c) => {
    const cx = c.x;
    const cy = c.y;
    const gx = gatewayCenter.x;
    const gy = gatewayCenter.y;

    // Request: Client → Gateway (lệch trái)
    const requestPath = buildCurvePath(cx, cy, gx, gy, -20);

    // Response: Gateway → Client (lệch phải)
    const responsePath = buildCurvePath(gx, gy, cx, cy, 20);

    return (
      <g key={c.id}>
        {/* Request */}
        <path
          d={requestPath}
          className="flow-path flow-forward"
          markerEnd="url(#arrow)"
        />

        {/* Response */}
        <path
          d={responsePath}
          className="flow-path flow-backward"
          markerEnd="url(#arrow)"
        />

        {/* Client node */}
        <g
          transform={`translate(${cx}, ${cy})`}
          className={`client-node ${c.type} animation`}
        >
          <circle cx="0" cy="0" r="20" />
          <text y="4" textAnchor="middle">
            {c.id}
          </text>
        </g>
      </g>
    );
  })}
</svg>

      <div ref={clientRef} className="box clients">
        <div className="title">Clients</div>
      </div>
      <div ref={gatewayRef} className="box gateway">
        <div className="title">API Gateway</div>
        <p>Ingress</p>
        <p>Rate Limiting</p>
      </div>
      <div ref={backendRef} className="box backend">
  <div className="title">Backend</div>

  <ul className="backend-roles">
    <li>Request scheduling</li>
    <li>Priority-based admission</li>
    <li>Limited resource allocation</li>
  </ul>
</div>


    </div>
  );
}
