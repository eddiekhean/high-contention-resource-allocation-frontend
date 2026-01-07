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
  const arrivals = data.events.ArrivalOrder;
  const rawEvents = data.events.events;

  // Map explicit backend decisions
  const decisionMap = new Map();
  rawEvents.forEach((e) => {
    decisionMap.set(e.ClientID, e);
  });

  // Tick hết slot = allocation cuối
  const exhaustionTick = Math.max(
    ...rawEvents.filter((e) => e.Action === "allocated").map((e) => e.Tick),
    -Infinity
  );

  return arrivals.map((a) => {
    const explicit = decisionMap.get(a.client_id);

    if (explicit) {
      return {
        clientId: a.client_id,
        class: a.class,
        arrivedAtTick: a.first_tick,
        action: explicit.Action,
        decidedAtTick: explicit.Tick,
      };
    }

    // FE suy ra reject vì hết slot
    return {
      clientId: a.client_id,
      class: a.class,
      arrivedAtTick: a.first_tick,
      action: "rejected",
      decidedAtTick: Math.max(a.first_tick, exhaustionTick),
    };
  });
}
