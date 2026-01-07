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
