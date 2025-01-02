import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./Dropdown.css";

interface DropdownProps {
  setPeriod: React.Dispatch<React.SetStateAction<number>>;
  // period: number;
}

export function Dropdown(props: DropdownProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleOptionClick = (period: number) => {
    props.setPeriod(period);
    setIsChecked(false);
  };

  return (
    <nav>
      <label htmlFor="touch">
        <span className="dropdown-span">
          Price period
          <span>
            <FontAwesomeIcon icon={faBars} />{" "}
          </span>
        </span>
      </label>
      <input
        type="checkbox"
        id="touch"
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
      />
      <ul className="slide">
        <li>
          <a onClick={() => handleOptionClick(7)}>7 days</a>
        </li>
        <li>
          <a onClick={() => handleOptionClick(30)}>1 month</a>
        </li>
        <li>
          <a onClick={() => handleOptionClick(180)}>6 months</a>
        </li>
        <li>
          <a onClick={() => handleOptionClick(365)}>1 year</a>
        </li>
      </ul>
    </nav>
  );
}
