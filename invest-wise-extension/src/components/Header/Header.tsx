import { useState, useEffect } from "react";
import "./Header.css";
import logo from "../../assets/stockwise logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
// import { InfoCard } from "../InfoCard/InfoCard";

interface HeaderProps {
  ticker: string;
  setTicker: React.Dispatch<React.SetStateAction<string>>;
  dividendYield: string;
  setDividendYield: React.Dispatch<React.SetStateAction<string>>;
  years: string;
  setYears: React.Dispatch<React.SetStateAction<string>>;
  fetchStockData: () => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean | null>>;
  error: string | null;
  setCurrencySymbol: React.Dispatch<React.SetStateAction<string>>;
}

export const Header: React.FC<HeaderProps> = ({
  ticker,
  setTicker,
  dividendYield,
  setDividendYield,
  years,
  setYears,
  fetchStockData,
  setLoading,
  error,
  setCurrencySymbol,
}) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isIconVisible, setIsIconVisible] = useState(true);

  // State to hold local ticker history
  const [recentTickers, setRecentTickers] = useState<string[]>([]);

  // Load recent tickers from localStorage
  useEffect(() => {
    const storedTickers = localStorage.getItem("recentTickers");
    if (storedTickers) setRecentTickers(JSON.parse(storedTickers));
  }, []);

  useEffect(() => {
    if (ticker && dividendYield && years) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [ticker, dividendYield, years]);

  const handleClick = () => {
    fetchStockData();
    setCurrencySymbol(ticker.toUpperCase().endsWith(".SA") ? "R$" : "$");
    setLoading(true);

    // Save the typed ticker if not already in the list
    if (ticker.trim() && !recentTickers.includes(ticker.trim())) {
      const updated = [ticker.trim(), ...recentTickers].slice(0, 5);
      setRecentTickers(updated);
      localStorage.setItem("recentTickers", JSON.stringify(updated));
    }
  };

  // const handleInfoClick = () => {
  //   setInfoVisible(true);
  // };

  // const handleCloseInfo = () => {
  //   setInfoVisible(false);
  // };

  const handleInfoClick = () => {
    if (chrome && chrome.tabs) {
      chrome.tabs.create({ url: chrome.runtime.getURL("index.html") }, () => {
        setIsIconVisible(false);
      });
    }
  };

  return (
    <div className="header-container">
      <div className="header-logo-box">
        <img src={logo} alt="Stock Wise Logo" className="header-logo" />
        {isIconVisible && (
          <FontAwesomeIcon
            onClick={handleInfoClick}
            className="header-logo-icon"
            icon={faUpRightFromSquare}
          />
        )}
      </div>
      {/* {infoVisible && <InfoCard onClose={handleCloseInfo} />} */}
      <section className="input-container">
        <div className="input-group">
          <input
            required
            type="text"
            name="ticker"
            autoComplete="off"
            className="input"
            placeholder="AAPL"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            list="recent-tickers"
          />
          <label className="user-label">Ticker</label>
          {/* Datalist for dropdown suggestions */}
          <datalist id="recent-tickers">
            {recentTickers.map((tck, idx) => (
              <option key={idx} value={tck} />
            ))}
          </datalist>
        </div>
        <div className="input-group">
          <input
            required
            type="number"
            name="dividendYield"
            autoComplete="off"
            className="input"
            placeholder="6"
            value={dividendYield}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value) && value >= 1 && value <= 100) {
                setDividendYield(e.target.value);
              } else if (e.target.value === "") {
                setDividendYield("");
              }
            }}
            min="1"
            max="100"
          />
          <label className="user-label">Desired dividend yield</label>
          <span className="percentage-symbol">%</span>
        </div>
        <div className="input-group tooltip-inside">
          <input
            required
            type="number"
            name="years"
            autoComplete="off"
            className="input"
            placeholder="5"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
          <label className="user-label">Years to consider</label>
          <div className="variation-container tooltip-inside">
            <p className="entity-variation entity-variation-icon">
              <FontAwesomeIcon icon={faCircleQuestion} />
            </p>
            <div className="tooltip">
              Specify the number of years to analyze historical data. A higher
              number of years provides a more comprehensive view, which is
              particularly useful for assessing projection trends in dividend
              performance.
            </div>
          </div>
        </div>
      </section>
      <p className="error-message">{error}</p>
      <button
        className={`animated-button ${
          isButtonDisabled ? "disabled-button" : ""
        }`}
        onClick={handleClick}
        disabled={isButtonDisabled}
      >
        Get results
      </button>
    </div>
  );
};

export default Header;
