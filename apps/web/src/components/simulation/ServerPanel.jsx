import { forwardRef } from "react";

const ServerPanel = forwardRef(({ totalSlots, usedSlots }, ref) => {
  return (
    <div
      className={`server-box ${usedSlots >= totalSlots ? "full" : ""}`}
      ref={ref}
    >
      <div className="server-core">
        SERVER
        <span className="slot-count">
          {usedSlots}/{totalSlots}
        </span>
      </div>

      <div className="server-slots">
        {Array.from({ length: totalSlots }).map((_, i) => (
          <div key={i} className={`slot ${i < usedSlots ? "used" : ""}`} />
        ))}
      </div>
    </div>
  );
});

export default ServerPanel;
