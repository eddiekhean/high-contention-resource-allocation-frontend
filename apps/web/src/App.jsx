import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Home from "./pages/Home";
import Simulation from "./pages/Simulation";
import VoucherAllocationSimulation from "./components/simulation/VoucherAllocation";

import LeetCode from "./pages/LeetCode";
import Labyrinth from "./components/leetcode/Labyrinth";
import SystemDesign from "./pages/SystemDesign";
import Auth from "./pages/Auth";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/leetcode" element={<LeetCode />} />
            <Route path="/leetcode/labyrinth" element={<Labyrinth />} />
            <Route path="/system-design" element={<SystemDesign />} />
            <Route path="/auth" element={<Auth />} />
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
