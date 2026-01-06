import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Home from "./pages/Home";
import Simulation from "./pages/Simulation";
import VoucherAllocationSimulation from "./components/simulation/VoucherAllocation";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route
              path="/simulations/voucher-allocation"
              element={<VoucherAllocationSimulation />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
