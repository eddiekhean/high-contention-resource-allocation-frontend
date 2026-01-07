type RawArrivalEvent = {
  client_id: number;
  class: "free" | "paid" | "vip";
  first_tick: number;
};

type SimulationMeta = {
  id: string;
  policy: string;
  slots: number;
  total_requests: number;
  seed: number;
  created_at: string;
};

type SimulationResponse = {
  events: {
    simulation: SimulationMeta;
    ArrivalOrder: RawArrivalEvent[];
  };
};
