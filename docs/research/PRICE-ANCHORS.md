# Price anchors, dividends and data sources

> Phase 2.5 (Sept. 24, 2026). Ruling B: First Leaf uses real stock and crypto names. **Crypto prices are real** (CoinGecko). **Stock prices are modeled**: a seeded random path forced exactly through each stock's real close on three dates. This file records those closes and every dividend fact, each with the public page it came from. The data generator and the validator read the `json` blocks below; nothing else is copied from any price source.

## Why stocks are anchored, not real

Free stock-data services (Tiingo, Alpha Vantage, Yahoo) forbid showing their data publicly, so no daily stock series is copied from anyone. A single day's closing price is a public fact, reported on exchange pages and in the news. Each stock's modeled path passes through its real close on **Sept. 19, 2025**, **March 2, 2026** (the day Rosa opened her account) and **Sept. 18, 2026** (the last close in the app). Between anchors, the path is a Brownian bridge in log price with that stock's typical daily volatility. Rule P1 checks the data hits every anchor exactly.

## Stock anchor closes (regular-session close, USD, as traded)

Source for every value: Nasdaq.com historical prices, `https://www.nasdaq.com/market-activity/stocks/<ticker>/historical`, read from the data feed behind that page, `https://api.nasdaq.com/api/quote/<TICKER>/historical?assetclass=stocks&fromdate=2025-09-01&limit=500&todate=2026-09-24` (fetched Sept. 24, 2026). Nasdaq's "Close/Last" is the consolidated close; it is not adjusted for dividends. None of the seven stocks split between Sept. 2025 and Sept. 2026.

| Ticker | Sept. 19, 2025 | March 2, 2026 | Sept. 18, 2026 | Second source for Sept. 18, 2026 |
|---|---|---|---|---|
| AAPL | $245.50 | $264.72 | $336.13 | "Apple stock closed at USD 336.13 on the Nasdaq on September 18, 2026" ([ad-hoc-news.de](https://www.ad-hoc-news.de/boerse/news/corporate-news/apple-stock-heads-into-the-open-after-a-0-26-percent-dip/70141675)) |
| MSFT | $517.93 | $398.55 | $493.78 | — |
| NVDA | $176.67 | $182.48 | $222.27 | The same article's "Nvidia up 1.34%" matches Nasdaq's Sept. 17 to 18 change |
| COST | $951.16 | $1,002.77 | $895.31 | — |
| NKE | $70.89 | $61.01 | $35.51 | "Nike stock closed at USD 35.51 on the NYSE on September 18, 2026, down 2.34 percent" ([ad-hoc-news.de](https://www.ad-hoc-news.de/boerse/news/corporate-news/nike-stock-slips-2-34-percent-ahead-of-the-open/70151378)) |
| AMZN | $231.48 | $208.39 | $253.71 | The Apple article's "Amazon up 1.00%" matches Nasdaq's day change |
| TSLA | $426.07 | $403.32 | $364.27 | — |

```json price-anchors
{
  "AAPL": { "2025-09-19": 245.50, "2026-03-02": 264.72, "2026-09-18": 336.13 },
  "MSFT": { "2025-09-19": 517.93, "2026-03-02": 398.55, "2026-09-18": 493.78 },
  "NVDA": { "2025-09-19": 176.67, "2026-03-02": 182.48, "2026-09-18": 222.27 },
  "COST": { "2025-09-19": 951.16, "2026-03-02": 1002.77, "2026-09-18": 895.31 },
  "NKE":  { "2025-09-19": 70.89,  "2026-03-02": 61.01,  "2026-09-18": 35.51 },
  "AMZN": { "2025-09-19": 231.48, "2026-03-02": 208.39, "2026-09-18": 253.71 },
  "TSLA": { "2025-09-19": 426.07, "2026-03-02": 403.32, "2026-09-18": 364.27 }
}
```

## Typical daily volatility (model parameter)

The standard deviation of daily log returns over the same year, computed once from the Nasdaq daily closes above (267 trading days per stock). Only this one number per stock is used; the daily closes themselves are not copied into the app. Times √252 gives the yearly figure used for "Ups and downs".

| Ticker | Daily | Yearly |
|---|---|---|
| AAPL | 1.58% | 25.1% |
| MSFT | 1.99% | 31.6% |
| NVDA | 2.36% | 37.5% |
| COST | 1.24% | 19.7% |
| NKE | 2.28% | 36.2% |
| AMZN | 2.12% | 33.6% |
| TSLA | 2.95% | 46.8% |

```json stock-volatility
{ "AAPL": 0.0158, "MSFT": 0.0199, "NVDA": 0.0236, "COST": 0.0124, "NKE": 0.0228, "AMZN": 0.0212, "TSLA": 0.0295 }
```

## Dividends (regular cash dividends with an ex-dividend date from Sept. 19, 2025 to Sept. 18, 2026)

Amounts, record dates and pay dates come from each company's announcement (or its SEC filing). Microsoft states its ex-dividend dates. For Apple, Costco, Nike and NVIDIA, the ex-dividend date equals the record date, as it does for regular dividends under T+1 settlement (since May 28, 2024); each was cross-checked on stockanalysis.com's dividend table (a third-party aggregator). Amazon, Tesla and the crypto pay no dividends. No special dividends fall in the window.

| Ticker | Per share | Declared | Ex-dividend | Paid | Source |
|---|---|---|---|---|---|
| AAPL | $0.26 | Oct. 30, 2025 | Nov. 10, 2025 | Nov. 13, 2025 | [Apple dividend history](https://investor.apple.com/dividend-history/default.aspx) |
| AAPL | $0.26 | Jan. 29, 2026 | Feb. 9, 2026 | Feb. 12, 2026 | same |
| AAPL | $0.27 | April 30, 2026 | May 11, 2026 | May 14, 2026 | same |
| AAPL | $0.27 | July 30, 2026 | Aug. 10, 2026 | Aug. 13, 2026 | same |
| MSFT | $0.91 | Sept. 15, 2025 | Nov. 20, 2025 | Dec. 11, 2025 | [Microsoft, Sept. 15, 2025](https://news.microsoft.com/source/2025/09/15/microsoft-announces-quarterly-dividend-increase-6/) |
| MSFT | $0.91 | Dec. 2, 2025 | Feb. 19, 2026 | March 12, 2026 | [Microsoft, Dec. 2, 2025](https://news.microsoft.com/source/2025/12/02/microsoft-announces-quarterly-dividend-27/) |
| MSFT | $0.91 | March 10, 2026 | May 21, 2026 | June 11, 2026 | [Microsoft, March 10, 2026](https://news.microsoft.com/source/2026/03/10/microsoft-announces-quarterly-dividend-28/) |
| MSFT | $0.91 | June 10, 2026 | Aug. 20, 2026 | Sept. 10, 2026 | [Microsoft, June 10, 2026](https://news.microsoft.com/source/2026/06/10/microsoft-announces-quarterly-dividend-29/) |
| COST | $1.30 | Oct. 15, 2025 | Oct. 31, 2025 | Nov. 14, 2025 | [SEC 8-K, Oct. 15, 2025](https://www.sec.gov/Archives/edgar/data/909832/000090983225000105/costex9918-k101525.htm) |
| COST | $1.30 | Jan. 15, 2026 | Jan. 30, 2026 | Feb. 13, 2026 | [SEC 8-K, Jan. 15, 2026](https://www.sec.gov/Archives/edgar/data/909832/000090983226000016/costex9918-k11526.htm) |
| COST | $1.47 | April 15, 2026 | May 1, 2026 | May 15, 2026 | [SEC 8-K, April 15, 2026](https://www.sec.gov/Archives/edgar/data/909832/000090983226000041/costex9918-k41526.htm) |
| COST | $1.47 | July 8, 2026 | July 24, 2026 | Aug. 7, 2026 | [SEC 8-K, June sales release](https://www.sec.gov/Archives/edgar/data/909832/000090983226000060/costex9918-k7726.htm) |
| NKE | $0.41 | Nov. 20, 2025 | Dec. 1, 2025 | Jan. 2, 2026 | [Nike release (Yahoo Finance copy)](https://finance.yahoo.com/news/nike-inc-declares-0-41-211500325.html) |
| NKE | $0.41 | Feb. 13, 2026 | March 2, 2026 | April 1, 2026 | [Nike release (Yahoo Finance copy)](https://sg.finance.yahoo.com/news/nike-inc-declares-0-41-220000623.html) |
| NKE | $0.41 | May 4, 2026 | June 1, 2026 | July 1, 2026 | [Nike release (Yahoo Finance copy)](https://finance.yahoo.com/markets/stocks/articles/nike-inc-declares-0-41-210000583.html) |
| NKE | $0.41 | Aug. 6, 2026 | Sept. 1, 2026 | Oct. 1, 2026 | [Nike release (Nasdaq copy)](https://www.nasdaq.com/press-release/nike-inc-declares-041-quarterly-dividend-2026-08-06) |
| NVDA | $0.01 | Nov. 19, 2025 | Dec. 4, 2025 | Dec. 26, 2025 | [NVIDIA Q3 FY2026 results](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2026) |
| NVDA | $0.01 | Feb. 25, 2026 | March 11, 2026 | April 1, 2026 | [NVIDIA Q4 FY2026 results](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026) |
| NVDA | $0.25 | May 20, 2026 | June 4, 2026 | June 26, 2026 | [NVIDIA Q1 FY2027 results](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2027) |
| NVDA | $0.25 | Aug. 26, 2026 | Sept. 10, 2026 | Oct. 1, 2026 | [NVIDIA Q2 FY2027 results](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027) |

Rosa is paid on a dividend only if she held shares at the close of the trading day **before** the ex-dividend date, and the payment lands in her cash on the pay date. Payments after Sept. 18, 2026 (Nike's and NVIDIA's Oct. 1 payments) have not happened yet in the app.

```json dividends
[
  { "ticker": "AAPL", "perShare": 0.26, "exDate": "2025-11-10", "payDate": "2025-11-13" },
  { "ticker": "AAPL", "perShare": 0.26, "exDate": "2026-02-09", "payDate": "2026-02-12" },
  { "ticker": "AAPL", "perShare": 0.27, "exDate": "2026-05-11", "payDate": "2026-05-14" },
  { "ticker": "AAPL", "perShare": 0.27, "exDate": "2026-08-10", "payDate": "2026-08-13" },
  { "ticker": "MSFT", "perShare": 0.91, "exDate": "2025-11-20", "payDate": "2025-12-11" },
  { "ticker": "MSFT", "perShare": 0.91, "exDate": "2026-02-19", "payDate": "2026-03-12" },
  { "ticker": "MSFT", "perShare": 0.91, "exDate": "2026-05-21", "payDate": "2026-06-11" },
  { "ticker": "MSFT", "perShare": 0.91, "exDate": "2026-08-20", "payDate": "2026-09-10" },
  { "ticker": "COST", "perShare": 1.30, "exDate": "2025-10-31", "payDate": "2025-11-14" },
  { "ticker": "COST", "perShare": 1.30, "exDate": "2026-01-30", "payDate": "2026-02-13" },
  { "ticker": "COST", "perShare": 1.47, "exDate": "2026-05-01", "payDate": "2026-05-15" },
  { "ticker": "COST", "perShare": 1.47, "exDate": "2026-07-24", "payDate": "2026-08-07" },
  { "ticker": "NKE", "perShare": 0.41, "exDate": "2025-12-01", "payDate": "2026-01-02" },
  { "ticker": "NKE", "perShare": 0.41, "exDate": "2026-03-02", "payDate": "2026-04-01" },
  { "ticker": "NKE", "perShare": 0.41, "exDate": "2026-06-01", "payDate": "2026-07-01" },
  { "ticker": "NKE", "perShare": 0.41, "exDate": "2026-09-01", "payDate": "2026-10-01" },
  { "ticker": "NVDA", "perShare": 0.01, "exDate": "2025-12-04", "payDate": "2025-12-26" },
  { "ticker": "NVDA", "perShare": 0.01, "exDate": "2026-03-11", "payDate": "2026-04-01" },
  { "ticker": "NVDA", "perShare": 0.25, "exDate": "2026-06-04", "payDate": "2026-06-26" },
  { "ticker": "NVDA", "perShare": 0.25, "exDate": "2026-09-10", "payDate": "2026-10-01" }
]
```

## Crypto prices (real)

`scripts/fetch-crypto.mjs` saved CoinGecko's daily prices for Bitcoin, Ethereum and Solana into `src/shared/data/raw/coingecko-<coin>.json` on Sept. 24, 2026, using the Demo API (key in `.env.local` only; it is in no file here). Each date's close is CoinGecko's 00:00 UTC price on the next day, rounded to cents. **The Demo plan only answers for the past 365 days**, so the earliest close available on Sept. 24, 2026 was **Sept. 24, 2025**: crypto history starts there, five days after the stock anchors. Rule P2 checks the app's crypto prices match the saved files.

**Attribution.** CoinGecko's API terms require displaying "Powered by CoinGecko" ([api_terms](https://www.coingecko.com/en/api_terms)), and their [attribution guide](https://brand.coingecko.com/resources/attribution-guide) lists the accepted wordings: "Data provided by CoinGecko", "Price data by CoinGecko", "Source: CoinGecko" (each with "CoinGecko" linked to https://www.coingecko.com), or "Powered by CoinGecko API" (with "CoinGecko API" linked to https://www.coingecko.com/en/api/). The app uses **"Powered by CoinGecko API"**, which satisfies both, placed right next to the crypto data, at 14px or larger (the terms ask for at least 10pt), with no endorsement wording.

## SIPC protection (for the glossary word and the account notice)

From [What SIPC Protects](https://www.sipc.org/for-investors/what-sipc-protects), fetched Sept. 24, 2026:
- "SIPC protects against the loss of cash and securities – such as stocks and bonds – held by a customer at a financially-troubled SIPC-member brokerage firm. The limit of SIPC protection is $500,000, which includes a $250,000 limit for cash."
- "SIPC does not protect against the decline in value of your securities."
- "SIPC does not protect any digital or crypto asset that does not qualify as a "security."" The same page cites the SEC and CFTC, whose examples of "digital commodities" include Bitcoin (BTC), Ether (ETH) and Solana (SOL).

From [SIPC: Introduction](https://www.sipc.org/for-investors/introduction): "SIPC protection is only available if your brokerage firm fails and SIPC steps in."
