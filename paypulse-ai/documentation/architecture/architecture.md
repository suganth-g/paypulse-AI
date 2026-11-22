# PayPulse AI — System Architecture Document

**Version:** 1.0  
**Date:** November 2026  
**Status:** Draft  

---

## 1. Architecture Overview

PayPulse AI follows a **microservices-inspired architecture** with three primary services communicating over HTTP REST:

1. **Merchant Dashboard** — React.js SPA (browser client)
2. **Payment Service** — Java/Spring Boot (core orchestration backend)
3. **AI Service** — Python/FastAPI (ML inference service)

All services share a **PostgreSQL** database in Phase 1–3 (the AI service writes model metadata and audit logs, the payment service writes transactions). Redis is introduced in Phase 2 for caching provider health data and rate limiting.

---

## 2. Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Browser                                                                │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │          Merchant Dashboard  (React + TypeScript + Tailwind)       │  │
│  │   ┌──────────────┐  ┌───────────────┐  ┌─────────────────────┐  │  │
│  │   │ Transactions  │  │  Analytics    │  │  Fraud Alerts       │  │  │
│  │   │    View       │  │  Dashboard    │  │  Management         │  │  │
│  │   └──────┬───────┘  └──────┬────────┘  └─────────┬───────────┘  │  │
│  └──────────┼─────────────────┼─────────────────────┼──────────────┘  │
└─────────────┼─────────────────┼─────────────────────┼─────────────────┘
              │   REST / JSON   │                      │
              ▼                 ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Payment Service  (Java 21 · Spring Boot 3 · Port 8080)                │
│                                                                         │
│  ┌─────────────────┐   ┌──────────────────┐   ┌────────────────────┐  │
│  │  Transaction     │   │  Routing Engine   │   │  Recovery Engine  │  │
│  │  Controller      │──▶│                  │──▶│                   │  │
│  │  (REST API)      │   │  - Health scoring │   │  - Retry logic    │  │
│  └─────────────────┘   │  - AI integration │   │  - Backoff        │  │
│                         │  - Strategy select│   │  - Provider swap  │  │
│  ┌─────────────────┐   └──────────┬───────┘   └────────────────────┘  │
│  │  Provider        │             │                                     │
│  │  Health Monitor  │             │ HTTP                               │
│  │  (Scheduler)     │             ▼                                     │
│  └─────────────────┘   ┌──────────────────┐                           │
│                         │  AI Service      │                           │
│  ┌─────────────────┐   │  Client          │                           │
│  │  Fraud Alert     │   │  (Feign/Rest)    │                           │
│  │  Service         │   └──────────────────┘                           │
│  └─────────────────┘                                                   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  Data Access Layer  (Spring Data JPA / Repository Pattern)       │  │
│  └──────────────────────────────┬──────────────────────────────────┘  │
└─────────────────────────────────┼───────────────────────────────────────┘
                                  │
              ┌───────────────────┼─────────────────────┐
              │                   │                      │
              ▼                   ▼                      ▼
┌─────────────────┐  ┌────────────────────────┐  ┌──────────────────┐
│  PostgreSQL 16   │  │  AI Service             │  │  Redis 7         │
│  (Port 5432)     │  │  (Python · FastAPI)     │  │  (Port 6379)     │
│                  │  │  (Port 8000)            │  │  - Provider      │
│  Tables:         │  │                         │  │    health cache  │
│  - transactions  │  │  /predict/failure        │  │  - Rate limits   │
│  - providers     │  │  /detect/fraud           │  │  - Sessions      │
│  - routing_logs  │  │  /optimize/route         │  │                  │
│  - fraud_alerts  │  │  /health                 │  │                  │
│  - recovery_logs │  │                         │  │                  │
└─────────────────┘  │  ML Models:             │  └──────────────────┘
                      │  - failure_predictor.pkl│
                      │  - fraud_detector.pkl   │
                      └────────────┬────────────┘
                                   │ HTTP (simulated)
              ┌────────────────────┼─────────────────────┐
              │                    │                      │
              ▼                    ▼                      ▼
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│  Simulated        │  │  Simulated        │  │  Simulated        │
│  Provider Alpha   │  │  Provider Beta    │  │  Provider Gamma   │
│  (In-memory stub) │  │  (In-memory stub) │  │  (In-memory stub) │
│  Success: ~90%    │  │  Success: ~75%    │  │  Success: ~60%    │
└───────────────────┘  └───────────────────┘  └───────────────────┘
```

---

## 3. Service Descriptions

### 3.1 Merchant Dashboard (Frontend)

**Technology:** React 18 + TypeScript 5 + Tailwind CSS 3  
**Port:** 3000 (development)  
**Responsibility:**
- Render payment analytics, transaction tables, and provider health cards.
- Display fraud alerts and recovery attempt logs.
- Communicate with the Payment Service via REST APIs.
- Use WebSocket (Phase 8) for real-time transaction feed.

**Key Design Decisions:**
- TypeScript is mandatory for type safety at the API boundary.
- No business logic lives in the frontend — it is a pure view layer.
- Tailwind CSS avoids heavy UI framework lock-in and keeps the bundle lean.

---

### 3.2 Payment Service (Backend)

**Technology:** Java 21 + Spring Boot 3.x + Spring Data JPA  
**Port:** 8080  
**Responsibility:**
- Receive and validate transaction requests.
- Orchestrate the routing decision (calls AI service, checks provider health).
- Dispatch transactions to simulated payment providers.
- Store all results in PostgreSQL.
- Run the recovery engine for failed transactions.
- Expose REST APIs for the dashboard and developer consumers.

**Key Design Decisions:**
- Java 21 LTS is chosen for strong typing, ecosystem maturity, and Spring Boot compatibility.
- Repository pattern (Spring Data JPA) cleanly separates persistence from business logic.
- Simulated providers are interface-backed beans — swapping them for real providers requires only an implementation change.
- The AI service is called via an HTTP client; the payment service degrades gracefully if AI is unavailable.

**Package Structure (planned):**
```
com.paypulse.payment/
├── api/            # REST controllers, DTOs, request/response models
├── domain/         # Core business entities (Transaction, Provider, etc.)
├── service/        # Business logic (RoutingService, RecoveryService, etc.)
├── repository/     # JPA repositories
├── client/         # AI service HTTP client
├── provider/       # Simulated payment provider stubs
├── scheduler/      # Health check scheduler
└── config/         # Spring configuration beans
```

---

### 3.3 AI Service (ML)

**Technology:** Python 3.11 + FastAPI + Scikit-learn + Pandas  
**Port:** 8000  
**Responsibility:**
- Serve trained ML models for failure prediction, fraud detection, and route optimization.
- Accept transaction features as JSON and return predictions.
- Expose a `/health` endpoint for liveness checks.

**Key Design Decisions:**
- FastAPI is chosen over Flask for async support, automatic OpenAPI docs, and Pydantic validation.
- Models are trained offline and loaded from `.pkl` files at startup — no online learning in Phase 1.
- Pydantic schemas enforce strict input validation, preventing garbage-in model calls.

**Directory Structure (planned):**
```
ai-service/
├── app/
│   ├── main.py           # FastAPI application entry point
│   ├── models/           # Pydantic request/response schemas
│   ├── routers/          # FastAPI route definitions
│   ├── services/         # Model loading and inference logic
│   └── config.py         # Settings (loaded from environment)
├── ml/
│   ├── data/             # Synthetic data generation scripts
│   ├── training/         # Model training scripts
│   └── artifacts/        # Saved model files (.pkl)
├── tests/
├── requirements.txt
└── Dockerfile
```

---

## 4. Data Architecture

### 4.1 Key Entities

```
Transaction
├── id (UUID, PK)
├── merchant_id (FK)
├── amount (BIGINT — stored in smallest unit, e.g., paise)
├── currency (VARCHAR 3)
├── status (ENUM: PENDING, ROUTED, SUCCESS, FAILED, RECOVERED)
├── provider_id (FK)
├── failure_probability (DECIMAL)
├── risk_score (DECIMAL)
├── risk_label (ENUM: LOW, MEDIUM, HIGH)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

Provider
├── id (UUID, PK)
├── name (VARCHAR)
├── type (ENUM: ALPHA, BETA, GAMMA)
├── success_rate (DECIMAL)
├── health_score (DECIMAL)
├── is_active (BOOLEAN)
└── last_health_check (TIMESTAMP)

RoutingLog
├── id (UUID, PK)
├── transaction_id (FK → Transaction)
├── selected_provider_id (FK → Provider)
├── routing_strategy (VARCHAR)
├── ai_recommendation (VARCHAR)
├── routing_time_ms (INTEGER)
└── created_at (TIMESTAMP)

FraudAlert
├── id (UUID, PK)
├── transaction_id (FK → Transaction)
├── risk_score (DECIMAL)
├── risk_label (ENUM)
├── alert_status (ENUM: OPEN, REVIEWED, DISMISSED)
├── triggered_at (TIMESTAMP)
└── reviewed_at (TIMESTAMP)

RecoveryLog
├── id (UUID, PK)
├── transaction_id (FK → Transaction)
├── attempt_number (INTEGER)
├── provider_tried (FK → Provider)
├── outcome (ENUM: SUCCESS, FAILED)
└── attempted_at (TIMESTAMP)
```

### 4.2 Database Migration Strategy
- Flyway is used for versioned migrations.
- All migration files live in `database/migrations/`.
- Naming convention: `V{version}__{description}.sql` (e.g., `V1__create_transactions_table.sql`).

---

## 5. API Design

### 5.1 Payment Service API (Base: `/api/v1`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/transactions` | Submit a new payment transaction |
| `GET` | `/transactions/{id}` | Get a transaction by ID |
| `GET` | `/transactions` | List transactions (paginated, filterable) |
| `GET` | `/providers` | List all payment providers and health |
| `GET` | `/providers/{id}/health` | Get detailed health for a provider |
| `GET` | `/fraud/alerts` | List fraud alerts |
| `PATCH` | `/fraud/alerts/{id}` | Update alert status (review/dismiss) |
| `GET` | `/recovery/logs` | List recovery attempt logs |
| `GET` | `/analytics/summary` | Get summary metrics |
| `GET` | `/actuator/health` | Service health check |

### 5.2 AI Service API (Base: `/api/v1`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/predict/failure` | Predict failure probability for a transaction |
| `POST` | `/detect/fraud` | Score a transaction for fraud risk |
| `POST` | `/optimize/route` | Recommend optimal routing provider |
| `GET` | `/models/status` | List loaded models and their versions |
| `GET` | `/health` | Service health check |

### 5.3 Standard Response Envelope

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "uuid",
    "timestamp": "ISO-8601"
  },
  "error": null
}
```

Error response:
```json
{
  "success": false,
  "data": null,
  "meta": {
    "requestId": "uuid",
    "timestamp": "ISO-8601"
  },
  "error": {
    "code": "TRANSACTION_NOT_FOUND",
    "message": "Transaction with ID ... was not found.",
    "details": []
  }
}
```

---

## 6. Security Architecture

| Concern | Approach |
|---|---|
| Secret management | Environment variables only; never hardcoded |
| Data sensitivity | No real card numbers, CVVs, or PINs stored |
| Log safety | Sensitive fields (amount, merchant ID) masked in debug logs |
| Inter-service auth | Shared secret header (Phase 2) |
| API authentication | API key (hashed, stored in DB) — Phase 2 |
| Network isolation | All services on a private Docker network |

---

## 7. Architecture Decision Records (ADRs)

### ADR-001: Why Java for the Payment Service?
**Context:** The payment orchestration service needs strong typing, mature ecosystem, and enterprise-grade concurrency support.  
**Decision:** Java 21 with Spring Boot 3.  
**Rationale:** Spring Boot's ecosystem (JPA, Security, Actuator, OpenAPI) reduces boilerplate. Java's type system prevents entire categories of runtime bugs at the payment processing layer.  
**Trade-off:** More verbose than Node.js or Go; heavier startup time.

### ADR-002: Why Python for the AI Service?
**Context:** The ML service needs to train and serve Scikit-learn models.  
**Decision:** Python 3.11 + FastAPI.  
**Rationale:** Python is the lingua franca of ML. Scikit-learn, Pandas, and NumPy are unmatched for rapid model development. FastAPI provides async HTTP serving with automatic validation.  
**Trade-off:** Requires a separate process; adds network hop for inference.

### ADR-003: Why PostgreSQL over MySQL or MongoDB?
**Context:** Payment data requires ACID transactions, complex queries, and strong consistency.  
**Decision:** PostgreSQL 16.  
**Rationale:** PostgreSQL's JSONB support, advanced indexing, and strict SQL compliance make it ideal. ACID compliance is non-negotiable for financial data.  
**Trade-off:** More operational overhead than SQLite; heavier than a simple key-value store.

### ADR-004: Why amounts are stored as integers?
**Context:** Floating-point arithmetic is unreliable for monetary calculations.  
**Decision:** Store all amounts as BIGINT in the smallest currency unit (paise for INR, cents for USD).  
**Rationale:** Eliminates rounding errors entirely. Industry-standard practice (Stripe, Razorpay, etc.).  
**Trade-off:** Division required for display; must carry currency for context.

### ADR-005: Why simulated providers instead of sandbox APIs?
**Context:** This is a portfolio project; real sandbox APIs require registration and credentials.  
**Decision:** Implement in-memory provider stubs with configurable success rates and latency jitter.  
**Rationale:** Removes all external dependencies; reproducible tests; demonstrates architectural pattern without real credential risk.  
**Trade-off:** Does not validate real API contracts.

