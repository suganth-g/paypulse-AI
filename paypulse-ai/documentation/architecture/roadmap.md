# PayPulse AI — Development Roadmap

**Version:** 1.0  
**Date:** November 2026  

---

## Roadmap Summary

```
Phase 1  ████████████████████  COMPLETE   Foundation & Documentation
Phase 2  ░░░░░░░░░░░░░░░░░░░░  PLANNED    Backend Core (Java/Spring Boot)
Phase 3  ░░░░░░░░░░░░░░░░░░░░  PLANNED    AI Service Core (Python/FastAPI)
Phase 4  ░░░░░░░░░░░░░░░░░░░░  PLANNED    Frontend Dashboard (React)
Phase 5  ░░░░░░░░░░░░░░░░░░░░  PLANNED    Smart Routing Engine
Phase 6  ░░░░░░░░░░░░░░░░░░░░  PLANNED    Fraud Detection
Phase 7  ░░░░░░░░░░░░░░░░░░░░  PLANNED    Recovery Engine
Phase 8  ░░░░░░░░░░░░░░░░░░░░  PLANNED    Kafka Event Streaming
Phase 9  ░░░░░░░░░░░░░░░░░░░░  PLANNED    Analytics & Reporting
Phase 10 ░░░░░░░░░░░░░░░░░░░░  PLANNED    Hardening & Demo Polish
```

---

## Phase 1 — Project Foundation ✅

**Goal:** Establish the project structure, documentation, and architectural decisions before writing any application code.

**Deliverables:**
- [x] Project folder structure created
- [x] README.md with full project description
- [x] Requirements document (functional + non-functional)
- [x] System architecture document with ADRs
- [x] Mermaid architecture diagrams (component, sequence, recovery, roadmap)
- [x] Development roadmap document
- [x] `.gitignore` covering Java, Python, Node.js, IDE, OS, secrets

**Exit Criteria:** All documentation complete; folder structure matches the specification.

---

## Phase 2 — Backend Core (Java / Spring Boot)

**Goal:** Build the Spring Boot skeleton with domain models, database schema, and a working REST API — no AI integration yet.

**Deliverables:**
- [ ] Spring Boot 3 project initialized (`backend/payment-service/`)
- [ ] PostgreSQL schema via Flyway migrations:
  - `V1__create_transactions_table.sql`
  - `V2__create_providers_table.sql`
  - `V3__create_routing_logs_table.sql`
  - `V4__create_fraud_alerts_table.sql`
  - `V5__create_recovery_logs_table.sql`
- [ ] Domain entities: `Transaction`, `Provider`, `RoutingLog`, `FraudAlert`, `RecoveryLog`
- [ ] JPA repositories for each entity
- [ ] `TransactionController` — POST, GET endpoints (stubbed responses)
- [ ] `ProviderController` — list providers, get health
- [ ] 3 simulated providers with configurable success rates (interface-backed)
- [ ] Provider health scheduler (runs every 30 seconds)
- [ ] Standard JSON response envelope
- [ ] Spring Actuator health endpoint
- [ ] Docker Compose file for PostgreSQL + payment-service
- [ ] Integration tests for core endpoints

**Exit Criteria:** `POST /api/v1/transactions` creates a record; `GET /api/v1/transactions/{id}` retrieves it; all provider stubs callable.

---

## Phase 3 — AI Service Core (Python / FastAPI)

**Goal:** Build the Python ML service with synthetic data generation, trained models, and working inference endpoints.

**Deliverables:**
- [ ] FastAPI project initialized (`ai-service/`)
- [ ] Synthetic transaction data generator (10,000+ records with realistic distributions)
- [ ] Feature engineering pipeline
- [ ] Failure prediction model (Random Forest / Gradient Boosting, Scikit-learn)
- [ ] Model training script with cross-validation
- [ ] Model evaluation report (Precision, Recall, F1, ROC-AUC)
- [ ] Saved model artifact (`failure_predictor.pkl`)
- [ ] Fraud detection model (Isolation Forest or one-class SVM)
- [ ] `POST /api/v1/predict/failure` endpoint (Pydantic-validated)
- [ ] `POST /api/v1/detect/fraud` endpoint
- [ ] `GET /api/v1/health` endpoint
- [ ] Unit tests for inference endpoints
- [ ] Dockerfile for the AI service
- [ ] Docker Compose updated to include the AI service

**Exit Criteria:** Calling `/predict/failure` with transaction features returns a valid probability and confidence score.

---

## Phase 4 — Frontend Dashboard (React / TypeScript)

**Goal:** Build the merchant dashboard UI with Tailwind CSS, connected to the Payment Service API.

**Deliverables:**
- [ ] React 18 + TypeScript + Vite project (`frontend/merchant-dashboard/`)
- [ ] Tailwind CSS v3 configured
- [ ] React Router v6 for navigation
- [ ] API client layer (Axios + typed interfaces)
- [ ] Dashboard layout (sidebar, header, main area)
- [ ] Transaction list page with status badges
- [ ] Transaction detail page
- [ ] Provider health status cards
- [ ] Loading and error states for all API calls
- [ ] Responsive layout (desktop-first)

**Exit Criteria:** Dashboard loads from `localhost:3000`, displays live data from the Payment Service, and handles API errors gracefully.

---

## Phase 5 — Smart Routing Engine

**Goal:** Integrate the AI service into routing decisions, selecting providers dynamically.

**Deliverables:**
- [ ] `RoutingService` calls AI service for failure probability and route recommendation
- [ ] `RoutingStrategy` interface with implementations:
  - `AiGuidedStrategy` — uses AI recommendation
  - `HealthBasedStrategy` — uses provider health scores only (fallback)
  - `RoundRobinStrategy` — for load testing scenarios
- [ ] Provider health scored and cached in Redis
- [ ] Routing decision logged to `routing_logs` table
- [ ] Response includes `routing_strategy_used` and `ai_confidence`
- [ ] `GET /api/v1/routing/logs` endpoint added
- [ ] Dashboard updated: show routing strategy per transaction

**Exit Criteria:** Transactions are routed to different providers based on AI recommendation; routing logs are stored and queryable.

---

## Phase 6 — Fraud Detection

**Goal:** Integrate the fraud detection model and build the alert management system.

**Deliverables:**
- [ ] `FraudDetectionService` calls AI `/detect/fraud` for every incoming transaction
- [ ] Transactions with risk score > 0.80 auto-flagged and held in `PENDING_REVIEW`
- [ ] `FraudAlert` records created for flagged transactions
- [ ] `GET /api/v1/fraud/alerts` endpoint (filterable by status)
- [ ] `PATCH /api/v1/fraud/alerts/{id}` to review or dismiss
- [ ] Dashboard: Fraud alerts page with risk badges, alert management UI
- [ ] AI service: improve fraud model with velocity and time-of-day features

**Exit Criteria:** A transaction with high-risk features is flagged; alert appears in the dashboard; reviewer can dismiss it.

---

## Phase 7 — Recovery Engine

**Goal:** Automatically recover failed payments by retrying on alternative providers.

**Deliverables:**
- [ ] `RecoveryEngine` service (Spring `@Async`)
- [ ] Exponential backoff: 1s → 2s → 4s (configurable max attempts, default 3)
- [ ] Provider rotation on each retry (excludes the failed provider)
- [ ] `RecoveryLog` created for each attempt
- [ ] Transaction status transitions: `FAILED` → `RECOVERING` → `RECOVERED` or `PERMANENTLY_FAILED`
- [ ] `GET /api/v1/recovery/logs` endpoint
- [ ] Dashboard: Recovery attempt timeline per transaction

**Exit Criteria:** A transaction that fails on Provider Alpha is retried on Provider Beta; recovery outcome is logged and visible in the dashboard.

---

## Phase 8 — Kafka Event Streaming

**Goal:** Decouple services with async event-driven messaging; enable real-time dashboard updates.

**Deliverables:**
- [ ] Kafka + Zookeeper added to Docker Compose
- [ ] Payment Service publishes events:
  - `transaction.created`
  - `transaction.routed`
  - `transaction.succeeded`
  - `transaction.failed`
  - `transaction.recovered`
  - `fraud.alert.created`
- [ ] AI Service consumes `transaction.created` for async scoring (non-blocking path)
- [ ] WebSocket endpoint in Payment Service for dashboard push notifications
- [ ] Dashboard: real-time transaction feed using WebSocket
- [ ] Kafka UI (Conduktor or Redpanda Console) added for local dev monitoring

**Exit Criteria:** A new transaction appears in the dashboard transaction feed within 2 seconds without page refresh.

---

## Phase 9 — Analytics & Reporting

**Goal:** Add a comprehensive analytics layer with charts and trend data.

**Deliverables:**
- [ ] Analytics aggregation queries (daily totals, provider breakdown, failure rates)
- [ ] `GET /api/v1/analytics/summary` returns: volume, success rate, failure rate, recovery rate, avg fraud score
- [ ] `GET /api/v1/analytics/trends` returns time-series data (hourly/daily)
- [ ] `GET /api/v1/analytics/providers` returns per-provider breakdown
- [ ] Dashboard: analytics page with charts (Recharts or Chart.js)
  - Transaction volume over time (line chart)
  - Success vs failure rate (pie/donut chart)
  - Provider performance comparison (bar chart)
  - Fraud risk distribution (histogram)

**Exit Criteria:** Analytics dashboard renders charts populated with real (synthetic) data from the database.

---

## Phase 10 — Hardening & Demo Polish

**Goal:** Make the full stack runnable with a single `docker-compose up` and produce a polished, demo-ready project.

**Deliverables:**
- [ ] Full `docker-compose.yml` orchestrating all services (PostgreSQL, Redis, Kafka, Payment Service, AI Service, Dashboard)
- [ ] `.env.example` file with all required environment variables documented
- [ ] Database seed script generating 500+ synthetic transactions
- [ ] API documentation (Swagger UI accessible at `/swagger-ui.html`)
- [ ] AI service model cards (description of each model, training data, performance metrics)
- [ ] Architecture diagram updated to reflect final state
- [ ] `CONTRIBUTING.md` document
- [ ] README updated with final running instructions
- [ ] GitHub Actions CI pipeline (lint + test on PR)
- [ ] Demo walkthrough video script

**Exit Criteria:** A new developer can run `docker-compose up --build` and reach a working, data-populated dashboard within 5 minutes.

