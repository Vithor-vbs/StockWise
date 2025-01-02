# StockWise Project Documentation

System that obtains stock market information and performs calculations of various financial indices, so that the investor knows if it is a good time to buy/sell the stock.
The code also provides a price history chart given a time length.

### Understanding the abbreviations:

- P/E: Price to Earnings ratio.
- Dividend Yield: Dividend Yield.
- Margin of Safety: Difference between the intrinsic value of a stock and its current market price.
- Profit Margin: Net profit divided by total revenue.
- Book Value: Company's value divided by the number of shares.
- Peter Lynch Ratio: Indicator that compares the earnings growth rate with the P/E ratio.
- Graham Intrinsic Value: Method of calculating the intrinsic value of a stock based on Benjamin Graham's principles.
- Projected Ceiling Price: Maximum price an investor should pay for the stock based on growth and dividend projections.

# Stock API Server

This is a Flask-based API server that provides various endpoints to fetch stock data, historical earnings, recent prices, and dividends by year using the `yfinance` library.

## Endpoints

### 1. Get Stock Data

**URL:** `/get_stock_data`

**Method:** `GET`

**Query Parameters:**

- `ticker` (string): The stock ticker symbol.
- `desired_dividend_yield` (float): The desired dividend yield.
- `years_to_consider` (int): The number of years to consider for average EPS calculation.

**Response:**

```json
{
  "info": {
    "ticker": "string",
    "p_e_ratio": "float",
    "profit_margin": "float",
    "dividend_yield": "float",
    "dividend_per_share": "float",
    "book_value": "float",
    "eps": "float"
  },
  "analysis": {
    "graham_formula_value": "float",
    "peter_lynch_ratio": "float",
    "projected_ceiling_price": "float",
    "total_dividends_accumulated": "float"
  }
}
```

### 2. Get Historical Earnings

**URL:** `/get_historical_earnings`

**Method:** `GET`

**Query Parameters:**

- `ticker` (string): The stock ticker symbol.

### 3. Get Recent Prices

**URL:** `/get_recent_prices`
**Method:** `GET`

**Query Parameters:**

- `ticker` (string): The stock ticker symbol.
- `months` (int): The number of months to fetch recent prices for.

**Response**

```json
{
  "date": {
    "Open": "float",
    "High": "float",
    "Low": "float",
    "Close": "float",
    "Adj Close": "float",
    "Volume": "int"
  },
  ...
}
```

## Endpoint requests

Get stock data:

- curl "http://localhost:5000/get_stock_data?ticker=VALE3.SA&desired_dividend_yield=0.05&years_to_consider=5"

Get Historical Earnings:

- curl "http://localhost:5000/get_historical_earnings?ticker=VALE3.SA"

Get Recent prices:

- curl "http://localhost:5000/get_recent_prices?ticker=VALE3.SA&months=6"

Get dividend by year:

- curl "http://localhost:5000/get_dividend_by_year?ticker=VALE3.SA&years=5"
