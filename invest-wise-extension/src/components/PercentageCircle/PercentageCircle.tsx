import React, { useEffect, useRef } from "react";
import "./PercentageCircle.css";

interface PercentageCircleProps {
  percentage: number;
  color: string;
}

export const PercentageCircle: React.FC<PercentageCircleProps> = ({
  percentage,
  color,
}) => {
  const circleBorderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const degrees = percentage * 3.6;
    const filledColor = "#13131a";
    const unfilledColor = "#13131a";

    if (circleBorderRef.current) {
      if (degrees <= 180) {
        circleBorderRef.current.style.backgroundImage = `linear-gradient(${
          90 + degrees
        }deg, transparent 50%, ${unfilledColor} 50%), linear-gradient(90deg, ${filledColor} 50%, transparent 50%)`;
      } else {
        circleBorderRef.current.style.backgroundImage = `linear-gradient(${
          degrees - 90
        }deg, ${filledColor} 50%, ${unfilledColor} 50%), linear-gradient(90deg, ${filledColor} 50%, transparent 50%)`;
      }
    }
  }, [percentage]);

  return (
    <div className="box-container">
      <div className="box-wrapper">
        <div className="box-circle">
          <div
            className="circle-border"
            ref={circleBorderRef}
            style={{ backgroundColor: color }}
          >
            <div className="circle-percentage">
              <span className="percentage">{percentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
