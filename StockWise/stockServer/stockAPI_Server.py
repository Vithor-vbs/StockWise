import os
from flask import Flask, request, jsonify
import yfinance as yf
import pandas as pd
from flask_cors import CORS
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)


def fetch_stock_info(ticker):
    stock = yf.Ticker(ticker)
    info = stock.info
    return info


def fetch_historical_earnings(ticker):
    stock = yf.Ticker(ticker)
    earnings = stock.dividends
    return earnings


def fetch_prices(ticker, start_date, end_date):
    stock_data = yf.download(ticker, start=start_date, end=end_date)
    return stock_data


def calculate_dividend_by_year(earnings, num_years=5):
    df = pd.DataFrame({'Date': earnings.index, 'Dividends': earnings.values})
    df['Date'] = pd.to_datetime(df['Date'])
    df['Year'] = df['Date'].dt.year
    yearly_averages = df.groupby('Year')['Dividends'].sum()

    # Check if num_years is greater than the available years
    if num_years > len(yearly_averages):
        return yearly_averages

    # Select only the last num_years
    last_years = yearly_averages[-num_years:]
    return last_years


def calculate_average_dividend(earnings, num_years=5):
    df = pd.DataFrame({'Date': earnings.index, 'Dividends': earnings.values})
    df['Date'] = pd.to_datetime(df['Date'])
    df['Year'] = df['Date'].dt.year
    yearly_averages = df.groupby('Year')['Dividends'].sum()
    yearly_dividend_avg = sum([dividend for dividend in yearly_averages[-num_years:]]
                              ) / num_years if len(yearly_averages) >= num_years else None
    return yearly_dividend_avg


@app.route('/get_stock_data', methods=['GET'])
def get_stock_data():
    ticker = request.args.get('ticker')
    desired_dividend_yield = float(request.args.get('desired_dividend_yield'))
    years_to_consider = int(request.args.get('years_to_consider'))

    info = fetch_stock_info(ticker)
    earnings = fetch_historical_earnings(ticker)

    average_eps = calculate_average_dividend(earnings, years_to_consider)
    projected_ceiling_price = average_eps / \
        desired_dividend_yield if average_eps else None

    p_e_ratio = info.get('trailingPE')
    profit_margin = info.get('profitMargins')
    dividend_yield = info.get('dividendYield')
    dividend_per_share = info.get('dividendRate')
    book_value = info.get('currentPrice')
    eps = info.get('trailingEps')

    # New metrics
    forward_pe = info.get('forwardPE')
    price_to_sales = info.get('priceToSalesTrailing12Months')
    price_to_book = info.get('priceToBook')
    five_year_avg_dividend_yield = info.get('fiveYearAvgDividendYield') or 0

    target_high_price = info.get('targetHighPrice')
    target_low_price = info.get('targetLowPrice')
    target_mean_price = info.get('targetMeanPrice')
    target_median_price = info.get('targetMedianPrice')

    return_on_equity = info.get('returnOnEquity')
    payout_ratio = (info.get('payoutRatio') or 0)
    revenue_growth = (info.get('revenueGrowth') or 0)
    return_on_assets = (info.get('returnOnAssets') or 0)

    graham_formula_value = (
        22.5 * eps * book_value) ** 0.5 if eps and book_value else None
    peter_lynch_ratio = p_e_ratio / (0.10 * 100) if p_e_ratio else None
    total_dividends_accumulated = sum(earnings) if len(earnings) > 0 else None
    dividend_payout_ratio = (dividend_per_share / eps) if eps else None
    dividend_coverage_ratio = eps / dividend_per_share if dividend_per_share else None

    def calculate_dividend_growth_rate(earnings, years):
        earnings_by_year = calculate_dividend_by_year(earnings, years)
        first_dividend = earnings_by_year.iloc[0]
        last_dividend = earnings_by_year.iloc[-1]
        return ((last_dividend / first_dividend) ** (1 / years)) - 1

    result = {
        "info": {
            "ticker": ticker,
            "p_e_ratio": p_e_ratio,
            "profit_margin": profit_margin,
            "dividend_yield": dividend_yield,
            "dividend_per_share": dividend_per_share,
            "book_value": book_value,
            "eps": eps
        },
        "analysis": {
            "graham_formula_value": graham_formula_value,
            "peter_lynch_ratio": peter_lynch_ratio,
            "projected_ceiling_price": projected_ceiling_price,
            "total_dividends_accumulated": total_dividends_accumulated,
            "dividend_payout_ratio": dividend_payout_ratio,
            "dividend_coverage_ratio": dividend_coverage_ratio,
            "dividend_growth_rate": calculate_dividend_growth_rate(earnings, years_to_consider),

            "forward_pe": forward_pe,
            "price_to_sales": price_to_sales,
            "price_to_book": price_to_book,
            "return_on_equity": return_on_equity,
            "payout_ratio": payout_ratio,
            "five_year_avg_dividend_yield": five_year_avg_dividend_yield,
            "target_high_price": target_high_price,
            "target_low_price": target_low_price,
            "target_mean_price": target_mean_price,
            "target_median_price": target_median_price,
            "revenue_growth": revenue_growth,
            "return_on_assets": return_on_assets
        },
    }

    return jsonify(result)


@app.route('/get_historical_earnings', methods=['GET'])
def get_historical_earnings():
    ticker = request.args.get('ticker')
    if not ticker:
        return jsonify({'error': 'ticker parameter is required'}), 400

    earnings = fetch_historical_earnings(ticker)
    earnings_dict = {str(key): value for key,
                     value in earnings.to_dict().items()}
    return jsonify(earnings_dict)


@app.route('/get_recent_prices', methods=['GET'])
def get_recent_prices():
    ticker = request.args.get('ticker')
    days = request.args.get('days')

    if not ticker or not days:
        return jsonify({'error': 'ticker and days parameters are required'}), 400

    try:
        days = int(days)
    except ValueError:
        return jsonify({'error': 'days parameter must be an integer'}), 400

    start_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
    end_date = datetime.now().strftime('%Y-%m-%d')

    prices = fetch_prices(ticker, start_date, end_date)
    prices_dict = prices.to_dict(orient='index')

    # Convert Timestamp keys to strings
    prices_dict = {str(key): value for key, value in prices_dict.items()}

    return jsonify(prices_dict)


@app.route('/get_dividend_by_year', methods=['GET'])
def get_dividend_by_year():
    ticker = request.args.get('ticker')
    years = request.args.get('years')

    if not ticker or not years:
        return jsonify({'error': 'ticker and years parameters are required'}), 400

    try:
        years = int(years)
    except ValueError:
        return jsonify({'error': 'years parameter must be an integer'}), 400

    earnings = fetch_historical_earnings(ticker)
    dividends = calculate_dividend_by_year(earnings, years)
    dividends_dict = dividends.to_dict()

    return jsonify(dividends_dict)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
