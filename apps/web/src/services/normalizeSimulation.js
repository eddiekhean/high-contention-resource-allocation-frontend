export function normalizeSimulation(data) {
  const { simulation, ArrivalOrder } = data.events;

  const arrivals = ArrivalOrder.map((e) => ({
    id: e.client_id,
    type: e.class,
    tick: e.first_tick,
  })).sort((a, b) => a.tick - b.tick);

  return {
    simulation,
    arrivals,
  };
}
/**
 * @typedef {"free"|"paid"|"vip"} ClientClass
 */

/**
 * @typedef {Object} RawArrivalEvent
 * @property {number} client_id
 * @property {ClientClass} class
 * @property {number} first_tick
 */

/**
 * @typedef {Object} SimulationMeta
 * @property {string} id
 * @property {string} policy
 * @property {number} slots
 * @property {number} total_requests
 * @property {number} seed
 * @property {string} created_at
 */

/**
 * @typedef {Object} RawDecisionEvent
 * @property {number} Tick
 * @property {number} RequestID
 * @property {number} ClientID
 * @property {"allocated"|"rejected"} Action
 */

/**
 * @typedef {Object} SimulationResponse
 * @property {{
 *   simulation: SimulationMeta,
 *   ArrivalOrder: RawArrivalEvent[],
 *   events: RawDecisionEvent[]
 * }} events
 */

/**
 * Normalize backend simulation response into full client decisions
 * @param {SimulationResponse} data
 * @returns {ClientDecision[]}
 */
export function normalizeClientDecisions(data) {
  if (!data?.events?.ArrivalOrder || !data?.events?.events) {
    console.warn("normalizeClientDecisions: Invalid data structure", data);
    return [];
  }

  const arrivals = data.events.ArrivalOrder;
  const rawEvents = data.events.events;

  console.log("normalizeClientDecisions INPUT:", {
    arrivalsCount: arrivals.length,
    eventsCount: rawEvents.length
  });

  // Map explicit backend decisions
  const decisionMap = new Map();

  rawEvents
    .sort((a, b) => a.Tick - b.Tick)
    .forEach((e) => {
      // HANDLE CASING - Backend returns ClientID but we normalized to client_id in some places
      const id = e.clientId || e.ClientID || e.client_id;
      if (id === undefined) return;

      // Force string key for safe lookup
      const key = String(id);

      // chỉ set nếu client chưa có decision
      if (!decisionMap.has(key)) {
        decisionMap.set(key, e);
      }
    });

  console.log("normalizeClientDecisions MAP SIZE:", decisionMap.size);

  // Tick hết slot = allocation cuối
  const exhaustionTick = Math.max(
    ...rawEvents.filter((e) => e.Action === "allocated").map((e) => e.Tick),
    -Infinity
  );

  return arrivals.map((a) => {
    // Robust access to arrival ID
    const aId = a.client_id ?? a.ClientID ?? a.clientId;
    if (aId === undefined) {
      console.warn("normalizeClientDecisions: Missing ID in arrival", a);
      return null;
    }

    const key = String(aId);
    const explicit = decisionMap.get(key);

    if (explicit) {
      return {
        clientId: aId,
        class: a.class,
        arrivedAtTick: a.first_tick,
        action: explicit.Action,
        decidedAtTick: explicit.Tick,
      };
    }

    // FE suy ra reject vì hết slot
    return {
      clientId: aId,
      class: a.class,
      arrivedAtTick: a.first_tick,
      action: "rejected",
      decidedAtTick: Math.max(a.first_tick, exhaustionTick),
    };
  }).filter(Boolean);
}
