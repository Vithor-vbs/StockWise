import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import "./Card.css";

interface CardProps {
  title: string;
  info: string;
  variation?: number | string;
  additionalInfo?: string;
  colorCondition?: string;
}

export const Card: React.FC<CardProps> = (props) => {
  const getVariationStyle = (variation: number | null) => {
    if (variation === null) return { display: "none" };
    if (variation > 0) return { color: "#3ed99b" };
    if (variation < 0) return { color: "#da5152" };
    return {};
  };

  return (
    <section className="card-container">
      <div className="card-group">
        <p className="card-title">{props.title}</p>
        <div className="card-entity-group">
          <p
            className="card-entity-edit"
            style={{ color: props.colorCondition }}
          >
            {props.info}
          </p>
          {props.variation !== undefined &&
            typeof props.variation === "number" && (
              <div className="variation-container">
                <p
                  className="entity-variation"
                  style={getVariationStyle(props.variation)}
                >
                  {` ${props.variation}%`}{" "}
                  {props.variation > 0 ? (
                    <FontAwesomeIcon icon={faArrowUp} />
                  ) : (
                    <FontAwesomeIcon icon={faArrowDown} />
                  )}
                </p>
                <div className="tooltip">{props.additionalInfo}</div>
              </div>
            )}
          {typeof props.variation === "string" && (
            <div className="variation-container">
              <p className="entity-variation entity-variation-icon">
                <FontAwesomeIcon icon={faCircleQuestion} />
              </p>
              <div className="tooltip">{props.additionalInfo}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
