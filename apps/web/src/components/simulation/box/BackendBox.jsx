import "../css/box.css";
import BaseBox from "./BaseBox";

export default function BackendBox({ used, total }) {
  return (
    <BaseBox title="Backend" className="backend">
      <div className="content">
        Slots: {used} / {total}
      </div>
    </BaseBox>
  );
}
