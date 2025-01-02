import styled from "styled-components";

interface SliderProps {
  items: { text: string; value: string }[];
}

const Slider: React.FC<SliderProps> = ({ items }) => {
  return (
    <StyledWrapper>
      <div className="slider">
        <div className="text">
          {items.map((item, index) => (
            <span key={index}>
              {item.text}
              <span
                className="item-value"
                style={{
                  color: parseFloat(item.value) < 0 ? "#ef5757" : "#1a73e8",
                }}
              >
                {item.value}
              </span>
            </span>
          ))}
          {items.map((item, index) => (
            <span key={index + items.length}>
              {item.text}
              <span
                className="item-value"
                style={{
                  color: parseFloat(item.value) < 0 ? "#ef5757" : "#1a73e8",
                }}
              >
                {item.value}
              </span>
            </span>
          ))}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .slider {
    width: 100%;
    height: 40px;
    white-space: nowrap;
    overflow: hidden;
    border-radius: 10px;
    position: relative;
    display: flex;
    align-items: center;
  }

  .text {
    display: flex;
    align-items: center;
    animation: sliding 30s linear infinite;
  }

  .text span {
    margin: 0 15px;
    display: inline-block;
  }

  .item-value {
    font-weight: 600;
    font-size: 0.9rem;
  }

  .slider:hover .text {
    animation-play-state: paused;
  }

  @keyframes sliding {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
`;

export default Slider;
