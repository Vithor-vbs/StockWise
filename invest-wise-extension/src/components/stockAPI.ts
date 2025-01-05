import axios from "axios";

// const BASE_URL = "http://localhost:5000";
const BASE_URL = "https://stockwise-2cgn.onrender.com";

// Define response types for the endpoints
export interface StockDataResponse {
  info: {
    ticker: string;
    p_e_ratio: number;
    profit_margin: number;
    dividend_yield: number;
    dividend_per_share: number;
    book_value: number;
    eps: number;
  };
  analysis: {
    graham_formula_value: number;
    peter_lynch_ratio: number;
    projected_ceiling_price: number;
    total_dividends_accumulated: number;
    dividend_payout_ratio: number;
    dividend_coverage_ratio: number;
    dividend_growth_rate: number;
    forward_pe: number;
    price_to_sales: number;
    price_to_book: number;
    return_on_equity: number;
    five_year_avg_dividend_yield: number;
    payout_ratio: number;
    return_on_assets: number;
    revenue_growth: number;
    target_high_price: number;
    target_low_price: number;
    target_mean_price: number;
    target_median_price: number;
  };
}

interface HistoricalEarningsResponse {
  [year: string]: {
    earnings: number;
  };
}

export interface RecentPricesResponse {
  [date: string]: {
    Open: number;
    High: number;
    Low: number;
    Close: number;
    "Adj Close": number;
    Volume: number;
  };
}

export interface DividendByYearResponse {
  [year: string]: number;
}

export const getStockData = async (
  ticker: string,
  desiredDividendYield: number,
  yearsToConsider: number
): Promise<StockDataResponse> => {
  try {
    const response = await axios.get<StockDataResponse>(
      `${BASE_URL}/get_stock_data`,
      {
        params: {
          ticker,
          desired_dividend_yield: desiredDividendYield,
          years_to_consider: yearsToConsider,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
};

export const getHistoricalEarnings = async (
  ticker: string
): Promise<HistoricalEarningsResponse> => {
  try {
    const response = await axios.get<HistoricalEarningsResponse>(
      `${BASE_URL}/get_historical_earnings`,
      { params: { ticker } }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching historical earnings:", error);
    throw error;
  }
};

export const getRecentPrices = async (
  ticker: string,
  days: number
): Promise<RecentPricesResponse> => {
  try {
    const response = await axios.get<RecentPricesResponse>(
      `${BASE_URL}/get_recent_prices`,
      {
        params: { ticker, days },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching recent prices:", error);
    throw error;
  }
};

export const getDividendByYear = async (
  ticker: string,
  years: number
): Promise<DividendByYearResponse> => {
  try {
    const response = await axios.get<DividendByYearResponse>(
      `${BASE_URL}/get_dividend_by_year`,
      {
        params: { ticker, years },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching dividend by year:", error);
    throw error;
  }
};
