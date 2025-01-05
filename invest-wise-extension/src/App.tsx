import React, { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "./components/Header/Header";
import { Card } from "./components/Card/Card";
import {
  DividendByYearResponse,
  getDividendByYear,
  getRecentPrices,
  getStockData,
  RecentPricesResponse,
  StockDataResponse,
} from "./components/stockAPI";
import "./App.css";

import { Loader } from "./components/utils/Loader";
import Chart from "./components/utils/Chart";
import BarChart from "./components/utils/BarChart";
import { Dropdown } from "./components/utils/Dropdown";
import Slider from "./components/Slider/Slider";
import { PercentageCircle } from "./components/PercentageCircle/PercentageCircle";

const App: React.FC = () => {
  const [ticker, setTicker] = useState("");
  const [desiredDividendYield, setDesiredDividendYield] = useState("6");
  const [years, setYears] = useState("5");
  const [period, setPeriod] = useState(180); // State for selected period

  const [recentPrices, setRecentPrices] = useState<RecentPricesResponse | null>(
    null
  );
  const [currencySymbol, setCurrencySymbol] = useState<string>("");
  const [dividendByYear, setDividendByYear] =
    useState<DividendByYearResponse | null>(null);
  const [stockData, setStockData] = useState<StockDataResponse | null>(null);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAllStockData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch stock data
      const data = await getStockData(
        ticker.toUpperCase(),
        parseFloat(desiredDividendYield) / 100,
        parseInt(years)
      );
      setStockData(data);

      // Fetch recent prices
      const recent_prices = await getRecentPrices(ticker, period);
      setRecentPrices(recent_prices);

      // Fetch dividend by year
      const dividend_by_year = await getDividendByYear(ticker, parseInt(years));
      setDividendByYear(dividend_by_year);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || err.message;
        setError(`Failed to fetch stock data - ${errorMessage}`);
      } else {
        setError(`Failed to fetch stock data - ${(err as Error).message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRecentPrices = async () => {
      const recent_prices = await getRecentPrices(ticker, period);
      setRecentPrices(recent_prices);
    };

    if (ticker && stockData) {
      fetchRecentPrices();
    }
  }, [period]);

  const chartData = recentPrices
    ? Object.values(recentPrices).map((price) => price.Close)
    : [];
  const chartLabels = recentPrices
    ? Object.keys(recentPrices).map((date) => date.split(" ")[0])
    : [];

  const barChartData = dividendByYear ? Object.values(dividendByYear) : [];
  const barChartLabels = dividendByYear ? Object.keys(dividendByYear) : [];
  const dividendTotalSum = barChartData.reduce((a, b) => a + b, 0);
  const dividendMean = dividendTotalSum / barChartData.length;
  const dividendCoverageRatio = stockData?.analysis.dividend_coverage_ratio;
  const dividendPayoutRatio =
    (stockData?.analysis.dividend_payout_ratio ?? 0) * 100;
  const dividendGrowthRate =
    (stockData?.analysis.dividend_growth_rate ?? 0) * 100;

  const calculatePercentageChange = (
    currentValue: number,
    lastValue: number
  ) => {
    if (!currentValue || !lastValue) return null;
    return ((currentValue - lastValue) / lastValue) * 100;
  };

  const recentPricesKeys = recentPrices ? Object.keys(recentPrices) : [];

  const penultimatePrice =
    recentPrices && recentPricesKeys.length > 1
      ? parseFloat(
          recentPrices[
            recentPricesKeys[recentPricesKeys.length - 2]
          ].Close.toFixed(2)
        )
      : null;

  const bookValue = stockData ? stockData.info.book_value : null;
  const percentageChange = calculatePercentageChange(
    bookValue as number,
    penultimatePrice as number
  );

  const sliderDividendInfo = [
    {
      text: "Dividend total sum in period:",
      value: `${currencySymbol}${parseFloat(
        dividendTotalSum.toString()
      ).toFixed(2)}`,
    },
    {
      text: "Mean of dividends in period:",
      value: `${currencySymbol}${parseFloat(dividendMean.toString()).toFixed(
        2
      )}`,
    },
    {
      text: "Dividend Coverage Ratio:",
      value: parseFloat(dividendCoverageRatio?.toString() || "0").toFixed(2),
    },
    {
      text: "Dividend Payout Ratio:",
      value: `${parseFloat(dividendPayoutRatio?.toString() || "0").toFixed(
        2
      )}%`,
    },
    {
      text: "Dividend Growth Rate:",
      value: `${parseFloat(dividendGrowthRate?.toString() || "0").toFixed(2)}%`,
    },
  ];

  const SliderPricesInfo = [
    {
      text: "Target High Price:",
      value:
        stockData?.analysis.target_high_price !== undefined
          ? `${currencySymbol}${parseFloat(
              stockData.analysis.target_high_price.toString()
            ).toFixed(2)}`
          : "N/A",
    },
    {
      text: "Target Low Price:",
      value:
        stockData?.analysis.target_low_price !== undefined
          ? `${currencySymbol}${parseFloat(
              stockData.analysis.target_low_price.toString()
            ).toFixed(2)}`
          : "N/A",
    },
    {
      text: "Target Mean Price:",
      value:
        stockData?.analysis.target_mean_price !== undefined
          ? `${currencySymbol}${parseFloat(
              stockData.analysis.target_mean_price.toString()
            ).toFixed(2)}`
          : "N/A",
    },
    {
      text: "Target Median Price:",
      value:
        stockData?.analysis.target_median_price !== undefined
          ? `${currencySymbol}${parseFloat(
              stockData.analysis.target_median_price.toString()
            ).toFixed(2)}`
          : "N/A",
    },
  ];

  return (
    <section className="main-container">
      <Header
        ticker={ticker}
        setTicker={setTicker}
        dividendYield={desiredDividendYield}
        setDividendYield={setDesiredDividendYield}
        years={years}
        setYears={setYears}
        fetchStockData={fetchAllStockData}
        setLoading={setLoading}
        error={error}
        setCurrencySymbol={setCurrencySymbol}
      />

      {loading && <Loader />}

      {stockData && !loading && !error && (
        <>
          <div className="cards-container-grid">
            <Card
              title="Book Value"
              variation={
                percentageChange !== null
                  ? parseFloat(percentageChange.toFixed(2))
                  : undefined
              }
              info={
                stockData.info.book_value !== null
                  ? `${currencySymbol} ${stockData.info.book_value.toFixed(2)}`
                  : "-"
              }
              additionalInfo={`Compared to ${currencySymbol}${penultimatePrice}  (previous day's closing price)`}
            />
            <Card
              title="Dividend per Share"
              info={
                stockData.info.dividend_per_share !== null
                  ? `${currencySymbol} ${stockData.info.dividend_per_share.toFixed(
                      2
                    )}`
                  : "-"
              }
              variation={"help-icon"}
              additionalInfo="The total amount of dividends paid out over a year divided by the total number of shares outstanding."
            />
            <Card
              title="Dividend Yield"
              info={
                stockData.info.dividend_yield !== null
                  ? `${(stockData.info.dividend_yield * 100).toFixed(2)}%`
                  : "-"
              }
              variation={"help-icon"}
              additionalInfo="A financial ratio that shows how much a company pays out in dividends each year relative to its stock price."
            />
          </div>
          <div className="cards-container-grid">
            <Card
              title="Earnings per Share"
              info={
                stockData.info.eps !== null
                  ? `${currencySymbol} ${stockData.info.eps.toFixed(2)}`
                  : "-"
              }
              variation={"help-icon"}
              additionalInfo={
                "A company's profit divided by the number of common shares it has outstanding."
              }
            />
            <Card
              title="P/E Ratio"
              variation={"help-icon"}
              additionalInfo="Price-to-Earnings Ratio: A valuation metric that compares a company's current share price to its per-share earnings."
              info={
                stockData.info.p_e_ratio !== null
                  ? stockData.info.p_e_ratio.toFixed(2)
                  : "-"
              }
            />
            <Card
              title="Profit Margin"
              info={
                stockData.info.profit_margin !== null
                  ? stockData.info.profit_margin.toFixed(2)
                  : "-"
              }
              variation={"help-icon"}
              additionalInfo="A measure of a company's profitability. It is calculated by dividing the company's net income by its revenue."
            />
          </div>
        </>
      )}
      {recentPrices && stockData && !loading && !error && (
        <>
          <div className="dropdown-container">
            <Dropdown setPeriod={setPeriod} />
          </div>
          <Chart data={chartData} labels={chartLabels} />
          <Slider items={SliderPricesInfo} />

          <div className="cards-container-grid">
            <Card
              title="Forward P/E"
              info={
                stockData?.analysis.forward_pe !== null
                  ? stockData.analysis.forward_pe.toFixed(2)
                  : "-"
              }
              variation={"help-icon"}
              additionalInfo="A company's current stock price divided by the company's estimated earnings per share."
            />
            <Card
              title="Price to Sales"
              info={
                stockData?.analysis.price_to_sales !== null
                  ? stockData.analysis.price_to_sales.toFixed(2)
                  : "-"
              }
              variation={"help-icon"}
              additionalInfo="A valuation ratio that compares a company's stock price to its revenues."
            />
            <Card
              title="Return on Equity"
              info={
                stockData?.analysis.return_on_equity !== null
                  ? (stockData.analysis.return_on_equity * 100).toFixed(2)
                  : "-"
              }
              variation={"help-icon"}
              additionalInfo="ROE: A measure of a company's profitability that takes a company's net income and divides it by the shareholders' equity."
            />
          </div>
          <div className="cards-container-grid">
            <Card
              title="Return on Assets"
              info={
                stockData?.analysis.return_on_assets !== null
                  ? (stockData.analysis.return_on_assets * 100).toFixed(2)
                  : "-"
              }
              variation={"help-icon"}
              additionalInfo="ROA: An indicator of how profitable a company is relative to its total assets."
            />
            <Card
              title="Price to Book"
              info={
                stockData?.analysis.price_to_book !== null
                  ? stockData.analysis.price_to_book.toFixed(2)
                  : "-"
              }
              variation={"help-icon"}
              additionalInfo="A valuation metric that compares a company's current share price to its book value."
            />
            <Card
              title="Revenue Growth"
              info={
                stockData?.analysis.revenue_growth !== null
                  ? (stockData.analysis.revenue_growth * 100).toFixed(2)
                  : "-"
              }
              variation={"help-icon"}
              additionalInfo="A measure of the growth of a company's sales from one period to another."
            />
          </div>
        </>
      )}

      {dividendByYear &&
        stockData &&
        stockData.info.dividend_yield &&
        !loading &&
        !error && (
          <>
            <div className="circle-container">
              <p className="circle-container-title">Payout Ratio: </p>
              <PercentageCircle
                percentage={stockData?.analysis.payout_ratio * 100}
                color="rgba(75, 192, 192, 1)"
              />
              <p className="circle-container-title">
                5-Year Average Dividend Yield:
              </p>
              <PercentageCircle
                percentage={stockData?.analysis.five_year_avg_dividend_yield}
                color="#1a73e8"
              />
            </div>
            <BarChart data={barChartData} labels={barChartLabels} />
            <Slider items={sliderDividendInfo} />

            <div className="cards-container-grid">
              <Card
                title="Graham Formula Value"
                variation={"help-icon"}
                colorCondition={
                  stockData?.analysis.graham_formula_value >
                  stockData.info.book_value
                    ? "#3ed99b"
                    : "#da5152"
                }
                additionalInfo="Measure of the intrinsic value of a stock. It is calculated as the square root of (22.5 * EPS * Book Value)."
                info={
                  stockData?.analysis.graham_formula_value !== null
                    ? `${currencySymbol} ${stockData?.analysis.graham_formula_value.toFixed(
                        2
                      )}`
                    : "-"
                }
              />
              <Card
                title="Peter Lynch Ratio"
                variation={"help-icon"}
                colorCondition={
                  stockData?.analysis.peter_lynch_ratio < 1
                    ? "#3ed99b"
                    : "#da5152"
                }
                additionalInfo="Also known as the PEG ratio, is a valuation metric that compares a company's price-to-earnings (P/E) ratio to its earnings growth rate. A PEG ratio of 1 suggests that the stock is fairly valued, while a ratio below 1 indicates undervaluation, and above 1 indicates overvaluation."
                info={
                  stockData?.analysis.peter_lynch_ratio !== null
                    ? stockData?.analysis.peter_lynch_ratio.toFixed(2)
                    : "-"
                }
              />
              <Card
                title="Projected Ceiling Price"
                variation={"help-icon"}
                colorCondition={
                  stockData?.analysis.projected_ceiling_price >
                  stockData.info.book_value
                    ? "#3ed99b"
                    : "#da5152"
                }
                additionalInfo="This is the projected fair price of the stock based on the desired dividend yield, taking into account the historical dividends over a specified period."
                info={
                  stockData?.analysis.projected_ceiling_price !== null
                    ? `${currencySymbol} ${stockData?.analysis.projected_ceiling_price.toFixed(
                        2
                      )}`
                    : "-"
                }
              />
            </div>
          </>
        )}
    </section>
  );
};

export default App;
