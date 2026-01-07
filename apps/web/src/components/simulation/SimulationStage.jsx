import "./css/stage.css";
import "./css/box.css";
import { useEffect, useRef, useState, useMemo } from "react";

export default function SimulationStage({
  simulationData,
  decisions,
  totalVouchers,
}) {
  // ==========================================
  // 1. INPUT DATA & DECISION MAP
  // ==========================================
  const arrivalList = useMemo(() => {
    if (simulationData?.arrivals) return simulationData.arrivals;

    // Fallback for raw data
    if (simulationData?.events?.ArrivalOrder) {
      return simulationData.events.ArrivalOrder.map(e => ({
        id: e.client_id,
        type: e.class,
        tick: e.first_tick,
      })).sort((a, b) => a.tick - b.tick);
    }

    return [];
  }, [simulationData]);

  const decisionByClientId = useMemo(() => {
    const map = new Map();
    decisions.forEach((d) => map.set(d.clientId, d));
    console.log("decisionByClientId entries:", Array.from(map.entries()));
    return map;
  }, [decisions]);

  // ==========================================
  // 2. SIMULATION STATE
  // ==========================================

  // Clients are EPHEMERAL UI nodes. They are removed when TTL expires.
  const [clients, setClients] = useState([]);

  // Responses are PERSISTENT events.
  // Key: clientId
  // Value: { action: "allocated" | "rejected", cx: number, cy: number }
  // This state persists even if the client is removed from the UI.
  const [responses, setResponses] = useState(() => new Map());

  // Layout positions
  const [gatewayCenter, setGatewayCenter] = useState(null);
  const [backendCenter, setBackendCenter] = useState(null);

  // ==========================================
  // 3. VOUCHER LOGIC (Derived Strictly from Responses)
  // ==========================================

  const usedVoucherCount = useMemo(() => {
    let count = 0;
    for (const res of responses.values()) {
      // ONLY allocated responses consume a voucher
      if (res.action === "allocated") {
        count++;
      }
    }
    return count;
  }, [responses]);

  const remainingVouchers = Math.max(0, totalVouchers - usedVoucherCount);

  const voucherSlots = useMemo(() => {
    return Array.from({ length: totalVouchers }, (_, i) => ({
      id: i,
      status: i < usedVoucherCount ? "used" : "available",
    }));
  }, [totalVouchers, usedVoucherCount]);

  // ==========================================
  // 4. REFS & CONSTANTS
  // ==========================================
  const cursorRef = useRef(0);
  const scheduledRef = useRef(new Set()); // Tracks clients we have already scheduled a response for

  const stageRef = useRef(null);
  const clientRef = useRef(null);
  const gatewayRef = useRef(null);
  const backendRef = useRef(null);

  const CLIENT_TTL = 1000;
  const SPAWN_INTERVAL = 2000;
  const CLEAN_INTERVAL = 500;
  const MIN_BATCH = 1;
  const MAX_BATCH = 5;
  const CLIENT_SIZE = 24;
  const PADDING = 16;
  const TITLE_HEIGHT = 32;
  const RESPONSE_DELAY = 600;

  // ==========================================
  // 5. SETUP & SPAWNING LOGIC
  // ==========================================

  // Determine layout centers
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

  // Recalculate gateway center if it moves (unlikely but safe)
  useEffect(() => {
    if (!stageRef.current || !gatewayRef.current) return;
    const stageRect = stageRef.current.getBoundingClientRect();
    const g = gatewayRef.current.getBoundingClientRect();
    setGatewayCenter({
      x: g.left - stageRect.left + g.width / 2,
      y: g.top - stageRect.top + g.height / 2,
    });
  }, [clients.length]);

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

  // Spawning Interval
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
      const batchSize = Math.floor(Math.random() * (MAX_BATCH - MIN_BATCH + 1)) + MIN_BATCH;
      const now = Date.now();
      const baseCursor = cursorRef.current;
      spawnBatch(arrivalList, spawnArea, baseCursor, batchSize, now);
      cursorRef.current = Math.min(baseCursor + batchSize, arrivalList.length);
    };

    spawnOnce();
    const timer = setInterval(spawnOnce, SPAWN_INTERVAL);
    return () => clearInterval(timer);
  }, [arrivalList]);

  // Client Cleanup (TTL)
  useEffect(() => {
    const cleaner = setInterval(() => {
      const now = Date.now();
      setClients((prev) => prev.filter((c) => c.expiresAt > now));
    }, CLEAN_INTERVAL);
    return () => clearInterval(cleaner);
  }, []);

  // Debug Data
  useEffect(() => {
    if (!simulationData) return;
    console.log("=== simulationData ===", simulationData);
  }, [simulationData]);

  // ==========================================
  // 6. RESPONSE SCHEDULER
  // ==========================================
  useEffect(() => {
    if (!clients.length) return;

    clients.forEach((c) => {
      // 1. Must have a decision
      const decision = decisionByClientId.get(c.id);
      if (!decision) return;

      // 2. Must not be already responded or scheduled
      if (responses.has(c.id) || scheduledRef.current.has(c.id)) return;

      // 3. Mark scheduled
      scheduledRef.current.add(c.id);

      // 4. Set Future Response
      setTimeout(() => {
        setResponses((prev) => {
          const next = new Map(prev);

          // ENFORCE STRICT BACKEND LOGIC:
          // Atomically check availability before confirming allocation.
          // This "corrects" the buggy backend data which might have oversold.

          let usedCount = 0;
          for (const r of next.values()) {
            if (r.action === "allocated") usedCount++;
          }

          let finalAction = decision.action;

          // If trying to allocate but sold out -> REJECT
          if (finalAction === "allocated" && usedCount >= totalVouchers) {
            finalAction = "rejected";
          }

          // Store the decision action and the client's position at the time of response
          next.set(c.id, {
            action: finalAction,
            cx: c.x,
            cy: c.y,
          });
          return next;
        });
      }, RESPONSE_DELAY);
    });
  }, [clients, decisionByClientId, responses, totalVouchers]);

  // ==========================================
  // 7. RENDERING HELPERS
  // ==========================================
  function buildCurvePath(x1, y1, x2, y2, offsetX = 0) {
    const mx = (x1 + x2) / 2 + offsetX;
    const my = (y1 + y2) / 2;
    return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  }

  // ==========================================
  // 8. RENDER
  // ==========================================
  return (
    <div ref={stageRef} className="simulation-stage">
      <svg className="links-layer">
        {/* ARROWS REMOVED FOR CLEANER FLOW */}

        {/* 1. Static Flows: Gateway <-> Backend */}
        {gatewayCenter && backendCenter && (
          <>
            <path
              d={buildCurvePath(gatewayCenter.x, gatewayCenter.y, backendCenter.x, backendCenter.y, -32)}
              className="flow-path flow-static"
              fill="none"
            />
            <path
              d={buildCurvePath(backendCenter.x, backendCenter.y, gatewayCenter.x, gatewayCenter.y, 32)}
              className="flow-path flow-static"
              fill="none"
            />
          </>
        )}

        {/* 2. Client Requests & Responses (Tied to Client Lifecycle) */}
        {gatewayCenter &&
          clients.map((c) => {
            const hasResponded = responses.has(c.id);
            const response = responses.get(c.id);
            const isAccepted = hasResponded && response.action === "allocated";

            return (
              <g key={`flows-${c.id}`}>
                {/* Request Arrow (always visible for active clients) */}
                <path
                  d={buildCurvePath(c.x, c.y, gatewayCenter.x, gatewayCenter.y, -20)}
                  className="flow-path flow-forward"
                  fill="none"
                />

                {/* Response Arrow (visible only if responded AND client is active) */}
                {hasResponded && (
                  <path
                    d={buildCurvePath(gatewayCenter.x, gatewayCenter.y, c.x, c.y, 20)}
                    className={`flow-path ${isAccepted ? "flow-accepted" : "flow-rejected"}`}
                    fill="none"
                  />
                )}
              </g>
            );
          })}

        {/* 4. Client Nodes (Tied to Client Lifecycle) */}
        {clients.map((c) => {
          const hasResponded = responses.has(c.id);
          const response = responses.get(c.id);
          const isAccepted = hasResponded && response.action === "allocated";

          return (
            <g
              key={c.id}
              transform={`translate(${c.x}, ${c.y})`}
              className={`client-node ${c.type} ${hasResponded ? (isAccepted ? "accepted" : "rejected") : ""
                } animation`}
            >
              <circle cx="0" cy="0" r="20" />
              <text y="4" textAnchor="middle">
                {c.id}
              </text>
            </g>
          );
        })}
      </svg>

      {/* HTML OVERLAY */}
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
        <div className="voucher-stats">
          <p>Total: {totalVouchers}</p>
          <p>Used: {usedVoucherCount}</p>
          <p>Remaining: {remainingVouchers}</p>
        </div>
        <div className="voucher-slots">
          {voucherSlots.map((v) => (
            <div key={v.id} className={`voucher-slot ${v.status}`} />
          ))}
        </div>
        <ul className="backend-roles">
          <li>Request scheduling</li>
          <li>Priority-based admission</li>
          <li>Limited resource allocation</li>
        </ul>
      </div>
    </div>
  );
}
