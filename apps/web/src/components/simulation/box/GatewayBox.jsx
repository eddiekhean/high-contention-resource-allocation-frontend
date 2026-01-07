import BaseBox from "./BaseBox";
import "../../css/box.css";
export default function GatewayBox() {
  return (
    <BaseBox title="Gateway" className="gateway">
      <div className="content">Rate limit • Queue • Priority</div>
    </BaseBox>
  );
}
