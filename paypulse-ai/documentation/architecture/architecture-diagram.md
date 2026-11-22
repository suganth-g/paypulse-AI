# PayPulse AI — Architecture Diagram

This document contains the Mermaid source for the PayPulse AI system architecture diagram.
Render this in any Mermaid-compatible viewer (GitHub, Mermaid Live Editor, Obsidian, etc.).

---

## System Architecture — Component Overview

```mermaid
flowchart TD
    subgraph BROWSER["🌐 Browser"]
        DASH["Merchant Dashboard\nReact 18 + TypeScript + Tailwind CSS\n:3000"]
    end

    subgraph BACKEND["☕ Payment Service — Java 21 · Spring Boot 3 · :8080"]
        TXN_CTRL["Transaction\nController\nREST API"]
        ROUTING["Routing\nEngine"]
        RECOVERY["Recovery\nEngine"]
        HEALTH_SCH["Provider Health\nScheduler"]
        FRAUD_SVC["Fraud Alert\nService"]
        AI_CLIENT["AI Service\nHTTP Client"]
        REPO["Data Access Layer\nSpring Data JPA"]
    end

    subgraph AI["🐍 AI Service — Python 3.11 · FastAPI · :8000"]
        FAIL_PRED["Failure\nPredictor\n/predict/failure"]
        FRAUD_DET["Fraud\nDetector\n/detect/fraud"]
        ROUTE_OPT["Route\nOptimizer\n/optimize/route"]
        ML_MODELS["ML Models\nScikit-learn .pkl"]
    end

    subgraph DB["🗄️ Data Layer"]
        PG[("PostgreSQL 16\n:5432\ntransactions\nproviders\nrouting_logs\nfraud_alerts\nrecovery_logs")]
        REDIS[("Redis 7\n:6379\nProvider health cache\nRate limiting\nSessions")]
    end

    subgraph PROVIDERS["💳 Simulated Payment Providers"]
        PA["Provider Alpha\nIn-memory stub\nSuccess ≈ 90%"]
        PB["Provider Beta\nIn-memory stub\nSuccess ≈ 75%"]
        PC["Provider Gamma\nIn-memory stub\nSuccess ≈ 60%"]
    end

    %% Frontend ↔ Backend
    DASH -- "REST / JSON\nHTTP" --> TXN_CTRL

    %% Backend internal
    TXN_CTRL --> ROUTING
    TXN_CTRL --> FRAUD_SVC
    ROUTING --> AI_CLIENT
    ROUTING --> RECOVERY
    AI_CLIENT --> FAIL_PRED
    AI_CLIENT --> FRAUD_DET
    AI_CLIENT --> ROUTE_OPT
    HEALTH_SCH --> REDIS

    %% Backend ↔ DB
    REPO --> PG
    ROUTING --> REPO
    FRAUD_SVC --> REPO
    RECOVERY --> REPO

    %% Backend ↔ Cache
    ROUTING --> REDIS

    %% AI Service internals
    FAIL_PRED --> ML_MODELS
    FRAUD_DET --> ML_MODELS
    ROUTE_OPT --> ML_MODELS

    %% Backend ↔ Providers
    ROUTING --> PA
    ROUTING --> PB
    ROUTING --> PC
    RECOVERY --> PA
    RECOVERY --> PB
    RECOVERY --> PC

    %% Styling
    classDef frontend fill:#3B82F6,color:#fff,stroke:#1D4ED8
    classDef backend fill:#059669,color:#fff,stroke:#047857
    classDef aiService fill:#7C3AED,color:#fff,stroke:#5B21B6
    classDef database fill:#D97706,color:#fff,stroke:#B45309
    classDef provider fill:#DB2777,color:#fff,stroke:#9D174D

    class DASH frontend
    class TXN_CTRL,ROUTING,RECOVERY,HEALTH_SCH,FRAUD_SVC,AI_CLIENT,REPO backend
    class FAIL_PRED,FRAUD_DET,ROUTE_OPT,ML_MODELS aiService
    class PG,REDIS database
    class PA,PB,PC provider
```

---

## Transaction Lifecycle — Sequence Diagram

```mermaid
sequenceDiagram
    participant D as Merchant Dashboard
    participant PS as Payment Service
    participant AI as AI Service
    participant DB as PostgreSQL
    participant P as Payment Provider

    D->>PS: POST /api/v1/transactions
    PS->>DB: Save PENDING transaction
    PS->>AI: POST /predict/failure (tx features)
    AI-->>PS: failure_probability: 0.12
    PS->>AI: POST /detect/fraud (tx features)
    AI-->>PS: risk_score: 0.05, label: LOW
    PS->>AI: POST /optimize/route (features + scores)
    AI-->>PS: recommended_provider: ALPHA
    PS->>DB: Save routing_log
    PS->>P: Dispatch transaction to Provider Alpha
    P-->>PS: SUCCESS (tx_ref: PAL-9823)
    PS->>DB: Update transaction → SUCCESS
    PS-->>D: 200 OK {status: SUCCESS, ...}
```

---

## Recovery Flow — Sequence Diagram

```mermaid
sequenceDiagram
    participant PS as Payment Service
    participant DB as PostgreSQL
    participant P1 as Provider Alpha
    participant P2 as Provider Beta
    participant P3 as Provider Gamma

    Note over PS: Transaction failed on Provider Alpha
    PS->>DB: Update status → FAILED
    PS->>PS: Recovery Engine triggered

    loop Max 3 attempts
        PS->>P2: Retry on Provider Beta (attempt 1)
        P2-->>PS: FAILED (timeout)
        PS->>DB: Log recovery_attempt (FAILED)
        Note over PS: Wait: backoff × 2^attempt

        PS->>P3: Retry on Provider Gamma (attempt 2)
        P3-->>PS: SUCCESS
        PS->>DB: Update transaction → RECOVERED
        PS->>DB: Log recovery_attempt (SUCCESS)
    end
```

---

## Development Phases — Roadmap

```mermaid
flowchart LR
    P1["Phase 1\n📁 Foundation\nDocs + Structure"] --> P2
    P2["Phase 2\n☕ Backend Core\nSpring Boot + DB"] --> P3
    P3["Phase 3\n🐍 AI Service\nFastAPI + Models"] --> P4
    P4["Phase 4\n⚛️ Frontend\nReact Dashboard"] --> P5
    P5["Phase 5\n🔀 Smart Routing\nProvider selection"] --> P6
    P6["Phase 6\n🔍 Fraud Detection\nAnomaly models"] --> P7
    P7["Phase 7\n🔄 Recovery\nRetry + Failover"] --> P8
    P8["Phase 8\n📡 Kafka Events\nAsync streaming"] --> P9
    P9["Phase 9\n📊 Analytics\nCharts + Reports"] --> P10
    P10["Phase 10\n🚀 Demo Ready\nDocker + Docs"]

    style P1 fill:#22C55E,color:#fff
    style P2 fill:#3B82F6,color:#fff
    style P3 fill:#8B5CF6,color:#fff
    style P4 fill:#06B6D4,color:#fff
    style P5 fill:#F59E0B,color:#fff
    style P6 fill:#EF4444,color:#fff
    style P7 fill:#EC4899,color:#fff
    style P8 fill:#10B981,color:#fff
    style P9 fill:#6366F1,color:#fff
    style P10 fill:#F97316,color:#fff
```

