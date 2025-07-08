"use client";

import { useState, useEffect, useRef } from "react";
const NUM_BARS = 17;
const WAVE_SPEED = 0.04;
const WAVE_AMPLITUDE = 20;
const WAVE_FREQUENCY = 0.4;

function MovingWave() {
  const [time, setTime] = useState(0);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      setTime((prevTime) => prevTime + WAVE_SPEED);
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div style={{ backgroundColor: "#000", overflow: "hidden", height: "20%" }}>
      {Array.from({ length: NUM_BARS }).map((_, index) => {
        const translateY =
          Math.sin(index * WAVE_FREQUENCY + time) * WAVE_AMPLITUDE;

        return (
          <div
            key={index}
            className="wave-bar"
            style={{
              width: "100%",
              height: `${index * 1.5 + 2}px`,
              backgroundColor: "white",
              marginBottom: "6px",
              transform: `translateY(${translateY}px)`,
            }}
          ></div>
        );
      })}
    </div>
  );
}

export default MovingWave;
