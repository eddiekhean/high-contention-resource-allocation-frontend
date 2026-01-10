import React from "react";
import "./PullToRefresh.css";

export default function PullToRefresh({ pullDistance, threshold, isRefreshing }) {
    const progress = Math.min(pullDistance / threshold, 1);
    const opacity = Math.min(pullDistance / (threshold * 0.5), 1);
    const rotation = progress * 360;

    if (pullDistance <= 0 && !isRefreshing) return null;

    return (
        <div
            className={`pull-to-refresh ${isRefreshing ? "refreshing" : ""}`}
            style={{
                transform: `translateY(${Math.min(pullDistance, threshold + 20)}px)`,
                opacity: opacity
            }}
        >
            <div className="pull-to-refresh__content">
                <div
                    className="pull-to-refresh__icon"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm-6.04 5.2L4.5 7.74C3.46 9.03 3 10.43 3 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8z"
                        />
                    </svg>
                </div>
                <div className="pull-to-refresh__label">
                    {isRefreshing ? "Refreshing..." : progress >= 1 ? "Release to refresh" : "Pull to refresh"}
                </div>
            </div>
        </div>
    );
}
