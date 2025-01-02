import React from "react";
import "./InfoCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface InfoCardProps {
  onClose: () => void;
}

export const InfoCard: React.FC<InfoCardProps> = ({ onClose }) => {
  return (
    <div className="info-card-overlay">
      <div className="info-card">
        <span
          style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        >
          <button onClick={onClose} className="info-card-close-button">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </span>
        <div className="content">
          <div className="title">Information</div>
          <div className="description">
            This is some information content.
            <data value="ds"></data>
          </div>
        </div>
      </div>
    </div>
  );
};
