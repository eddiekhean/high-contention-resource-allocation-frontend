import "./planet.css"
const PLANET_NAME = "earth";

function getPhaseByIndex(index) {
    // index is absolute (0 = Hero, 1-6 = Content)
    if (index === 0) return "hidden";
    if (index === 1) return "enter";
    if (index === 2) return "left";
    if (index === 3) return "center";
    if (index === 4) return "right";
    if (index === 5) return "hold";
    if (index === 6) return "exit";
    return "exit";
}

export default function PlanetBackground({
    activeSectionIndex,
}) {
    const phase = getPhaseByIndex(activeSectionIndex);

    return (
        <div className="planet-layer">
            <img
                src={`/planets/${PLANET_NAME}.png`}
                className={`main-planet ${PLANET_NAME} ${phase}`}
                alt=""
            />
        </div>
    );
}
