# Ticker Briefly

Ticker Briefly is a full-stack AI application that fetches real-time stock data and generates concise, natural-language performance summaries using large language models. The solution is deployed on Cloudflare and secured through Cloudflare AI Gateway to ensure reliable, low-latency, and protected API communication.

## Overview

This project demonstrates how to combine real-time financial data with language models to provide actionable summaries in a lightweight, production-oriented architecture. It was built as a portfolio project to showcase LLM orchestration, API integration, secure deployment, and cloud-native development.

## Features

- Real-time stock data retrieval for multiple tickers  
- LLM-generated natural-language summaries  
- Frontend built with React, backend in Python  
- API calls routed through **two Cloudflare Workers**:
  - **Polygon Worker** (with the Polygon API key configured as an environment variable)
  - **OpenAI Worker** (with the OpenAI API key configured as an environment variable)
- Ticker-Briefly app uses the worker URLs as environment variables
- Secured and monitored API routing with Cloudflare AI Gateway  
- Fully deployed and serverless architecture on Cloudflare Pages

## Architecture

```
[React Frontend] 
       │
       ▼
[Polygon Worker] ──► [Polygon API]
       │
       ▼
[OpenAI Worker] ──► [OpenAI API / AI Gateway]
```

This architecture keeps API keys off the client and ensures secure, scalable communication between the frontend and external APIs.

## Environment Variables

### Cloudflare Workers
- **Polygon Worker**
  - `POLYGON_API_KEY`

- **OpenAI Worker**
  - `OPENAI_API_KEY`

### Ticker-Briefly (Frontend)
- `VITE_CLOUDFLARE_POLYGON_WORKER_URL`
- `VITE_CLOUDFLARE_OPENAI_WORKER_URL`

These frontend variables point to the respective worker endpoints. The actual API keys remain securely stored in the workers.

## Tech Stack

- **Frontend:** React, Vite, TypeScript  
- **Backend:** Python  
- **APIs:** Polygon, OpenAI  
- **Infrastructure:** Cloudflare Pages, Cloudflare Workers, Cloudflare AI Gateway  
- **Deployment:** Continuous deployment on Cloudflare

## Example Output

```
Ticker: AAPL, TSLA
OK baby, here’s the read: AAPL glows steady—two up days, closing 249.34 after opening 246.60, with a daytime high near 251.82 and a rising VW. Demand looks persistent; the stock is riding a quiet momentum wave. If you’re shopping, this one leans BUY on pullbacks; otherwise HOLD if you already own and are riding the trend.

TSLA stays lit as well, climbing from 426.79 to 435.15, with a high of 440.51 and hefty volume. The move is broader and more volatile, but momentum is improving. For new money, consider a cautious BUY on a dip toward 430–433; for current holders, a HOLD with a tight stop is prudent.

Bottom line: both names show positive momentum, but stay disciplined; risk/reward favors buyers who can tolerate volatility.
```
