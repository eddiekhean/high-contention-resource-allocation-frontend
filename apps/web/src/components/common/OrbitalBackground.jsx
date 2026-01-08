import "./css/orbital-background.css";

export default function OrbitalBackground() {
    return (
        <div className="orbital-system">
            <div className="orbital-system"> {/* Nested wrapper as found in original implementation */}
                {/* System 1: Inner */}
                <div className="orbit-system system-1">
                    <div className="orbit-ring">
                        <div className="planet planet-1" />
                        <div className="planet planet-2" />
                        <div className="planet planet-3" />
                    </div>
                </div>

                {/* System 2: Middle */}
                <div className="orbit-system system-2">
                    <div className="orbit-ring">
                        <div className="planet planet-1" />
                        <div className="planet planet-2" />
                        <div className="planet planet-3" />
                    </div>
                </div>

                {/* System 3: Outer */}
                <div className="orbit-system system-3">
                    <div className="orbit-ring">
                        <div className="planet planet-1" />
                        <div className="planet planet-2" />
                        <div className="planet planet-3" />
                    </div>
                </div>
            </div>
        </div>
    );
}
