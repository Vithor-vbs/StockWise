import React, { useEffect, useRef } from "react";
import styled from "styled-components";

interface SliderItem {
  text: string;
  value: string;
}

interface SliderProps {
  items: SliderItem[];
}
const SliderContent = styled.div`
  display: inline-block;
  animation: scroll 50s linear infinite; /* Slowed down the animation */
  animation-play-state: running; /* Ensure animation is running by default */

  @keyframes scroll {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-100%);
    }
  }
`;

const SliderContainer = styled.div`
  overflow: hidden;
  padding: 10px 0; /* Decreased the size of the box */
  background: #13131a;
  white-space: nowrap;
  position: relative;

  &:before,
  &:after {
    position: absolute;
    top: 0;
    width: 80px; /* Decreased the width of the gradient */
    height: 100%;
    content: "";
    z-index: 2;
  }

  &:before {
    left: 0;
    background: linear-gradient(
      to left,
      rgba(19, 19, 26, 0),
      #13131a
    ); /* Adjusted gradient */
  }

  &:after {
    right: 0;
    background: linear-gradient(
      to right,
      rgba(19, 19, 26, 0),
      #13131a
    ); /* Adjusted gradient */
  }

  /* &:hover ${SliderContent} {
    animation-play-state: paused;
  } */
`;

const Slider: React.FC<SliderProps> = ({ items }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      const clone = slider.innerHTML;
      slider.innerHTML += clone;
    }
  }, []);

  return (
    <SliderContainer>
      <SliderContent ref={sliderRef}>
        {items.concat(items).map((item, index) => (
          <SliderItem key={index}>
            <strong>{item.text}</strong>{" "}
            <span style={{ color: "#1a73e8", fontWeight: "bold" }}>
              {" "}
              {item.value}
            </span>
          </SliderItem>
        ))}
      </SliderContent>
    </SliderContainer>
  );
};

const SliderItem = styled.div`
  display: inline-block;
  height: 40px; /* Decreased the height of the items */
  margin: 0 20px; /* Adjusted the margin */
  line-height: 40px; /* Adjusted the line height */
`;

export default Slider;
