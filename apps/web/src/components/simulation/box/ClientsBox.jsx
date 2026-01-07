import { forwardRef } from "react";
import "../css/box.css";
import BaseBox from "./BaseBox.jsx";

const ClientsBox = forwardRef(function ClientsBox(_, ref) {
  return (
    <BaseBox ref={ref} title="Clients" className="clients">
      <div className="content">Burst traffic • 3–5 req / tick</div>
      <div className="spawn-layer" />
    </BaseBox>
  );
});

export default ClientsBox;
