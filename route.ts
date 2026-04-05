<div align="center">

# 🛡️ UPI Shield

### Explainable UPI Fraud Detection · RBI-Guided RAG · Built on Databricks

*Every 3 seconds, someone in India loses money to UPI fraud.*  
*UPI Shield doesn't just detect it — it explains it, in your language.*

---

[![Databricks](https://img.shields.io/badge/Databricks-Free%20Edition-FF3621?logo=databricks&logoColor=white)](https://databricks.com)
[![Delta Lake](https://img.shields.io/badge/Delta%20Lake-Unity%20Catalog-003B7D?logo=apachespark&logoColor=white)](https://delta.io)
[![MLflow](https://img.shields.io/badge/MLflow-Model%20Registry-0194E2?logo=mlflow&logoColor=white)](https://mlflow.org)
[![Sarvam AI](https://img.shields.io/badge/Sarvam%20AI-Hindi%20Translation-FF6B35)](https://sarvam.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e.svg)](LICENSE)

**Bharat Bricks Hacks 2026 · IISc Bengaluru · Databricks Campus Hackathon**

</div>

---

## The Story

My grandmother almost fell victim to a collect request scam last year. Someone sent her a payment request claiming to be from her bank — she was about to approve it when I noticed and stopped her. That moment stuck with me.

What frustrated me most was that **existing fraud detection systems are black boxes**. They might block a transaction, but they never explain *why*. Users are left confused and remain vulnerable to the same tricks again.

UPI Shield was built to fix that. Not just detect fraud — but *teach* users why something is suspicious, grounded in official RBI guidelines, in the language they speak at home.

---

## What It Does

```
Detects  →  Explains  →  Translates
```

**1. Detects** fraudulent UPI transactions using an Isolation Forest anomaly detection model — not just high amounts, but behavioral patterns: collect requests from strangers, unusual hours, deceptive descriptions, rapid succession, fraud network connections.

**2. Explains** every flagged transaction using RAG. The system retrieves the most relevant RBI guideline and uses an LLM to generate a grounded, human-readable explanation citing the specific rule that applies.

**3. Translates** every explanation to Hindi using Sarvam AI — an Indian-made model — so a rural user in UP understands the warning in their own language.

**Example output for a collect request scam:**
> *"This transaction is flagged as HIGH RISK because it is a collect (pull payment) request from an unrecognized UPI ID with a description matching social engineering patterns. Per RBI-UPI-001: users should never approve collect requests from unknown sources. Do NOT proceed. Call 1930 immediately if you suspect fraud."*

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           UPI Shield Pipeline                           │
├─────────────────┬───────────────────────────────────────────────────────┤
│ Data Layer      │  Delta Lake · Unity Catalog  (main.upi_fraud.*)       │
│                 │  raw_transactions · features · rbi_guidelines         │
├─────────────────┼───────────────────────────────────────────────────────┤
│ Feature Eng.    │  PySpark · Window Functions · Graph Analytics         │
│                 │  32 features: temporal, behavioral, amount, network   │
├─────────────────┼───────────────────────────────────────────────────────┤
│ ML Model        │  Isolation Forest · SHAP Feature Importance           │
│                 │  MLflow Experiment Tracking + Model Registry          │
├─────────────────┼───────────────────────────────────────────────────────┤
│ RAG Pipeline    │  Sentence Transformers  (all-MiniLM-L6-v2, 22MB)     │
│                 │  Databricks Vector Search  (FAISS fallback)           │
│                 │  20 RBI fraud/safety guidelines indexed               │
├─────────────────┼───────────────────────────────────────────────────────┤
│ LLM Explanation │  Databricks AI Gateway · Airavata  (Indian LLM)      │
│                 │  Grounded explanations citing RBI guideline IDs       │
├─────────────────┼───────────────────────────────────────────────────────┤
│ Translation     │  Sarvam AI Mayura → Hindi  (Indian-made model)       │
├─────────────────┼───────────────────────────────────────────────────────┤
│ UI              │  Gradio 4.44 · Databricks Apps                       │
└─────────────────┴───────────────────────────────────────────────────────┘
```

---

## Technology Stack

| Layer | Technology | Why |
|---|---|---|
| Platform | Databricks Free Edition | Mandatory — core, not a sidecar |
| Storage | Delta Lake · Unity Catalog (`main.upi_fraud.*`) | ACID, versioned, production-grade |
| Feature Engineering | PySpark + Window Functions | Distributed, real graph analytics |
| ML Model | Isolation Forest + SHAP | Unsupervised, CPU-only, explainable |
| Experiment Tracking | MLflow (experiments + model registry) | Mandatory Databricks component |
| Vector Store | Databricks Vector Search + FAISS fallback | Mandatory Databricks component |
| Embeddings | `all-MiniLM-L6-v2` (22MB) | CPU-fast, strong semantic similarity |
| LLM | Airavata via Databricks AI Gateway | ✅ Indian-made model |
| Translation | Sarvam AI (Mayura) | ✅ Indian-made model |
| UI | Gradio 4.44 · Databricks Apps | Native Databricks deployment |

---

## Repository Layout

```
upi-shield/
│
├── app.yaml                         # Databricks Apps entry point + env vars
├── pyproject.toml                   # Project metadata + pinned dependencies
├── requirements.txt                 # Databricks Apps pip install
├── .env.example                     # Local development template
│
├── notebooks/
│   ├── 01_data_ingestion.py         # 6,000 synthetic transactions + 20 RBI guidelines → UC
│   ├── 02_feature_engineering.py    # PySpark 32-feature pipeline + graph analytics
│   ├── 03_model_training.py         # Isolation Forest + SHAP + MLflow + Model Registry
│   ├── 04_rag_setup.py              # Embeddings + Databricks Vector Search index
│   └── 05_inference_test.py         # End-to-end pipeline validation (5 test cases)
│
├── src/upi_shield/
│   ├── config.py                    # Single source of truth for all constants
│   ├── feature_engineer.py          # Real-time feature extraction (mirrors NB02)
│   ├── anomaly_detector.py          # MLflow model loader + fraud scorer
│   ├── retrieval.py                 # Databricks VS + FAISS fallback (runtime switch)
│   ├── llm_client.py                # AI Gateway / Airavata — grounded explanation
│   └── sarvam_client.py             # Sarvam Hindi translation
│
└── app/
    └── main.py                      # Gradio UI + full pipeline orchestration
```

---

## Setup & Run

### Prerequisites

- Databricks Free Edition workspace (no GPU needed)
- Runtime **13.x ML LTS** — includes MLflow, Delta Lake, Spark
- Sarvam AI API key — free tier at [app.sarvam.ai](https://app.sarvam.ai)

---

### Step 1 — Create secret scope

```bash
databricks secrets create-scope upi-shield
databricks secrets put-secret upi-shield sarvam_api_key
databricks secrets put-secret upi-shield databricks_token
```

---

### Step 2 — Import notebooks

1. **Workspace → Import** → upload each `.py` file from `notebooks/`
2. Attach all notebooks to a cluster — Single Node, no GPU needed

---

### Step 3 — Run notebooks in order

```
01  →  02  →  03  →  04  →  05
```

Each writes to `main.upi_fraud.*` in Unity Catalog. Expected total runtime: ~15 minutes.

| Notebook | Output | Time |
|---|---|---|
| 01 — Data ingestion | `raw_transactions` (6k rows) + `rbi_guidelines` (20 rules) | ~2 min |
| 02 — Feature engineering | `transaction_features` (32 features, graph analytics) | ~3 min |
| 03 — Model training | MLflow run + model at `@production` + `scored_transactions` | ~5 min |
| 04 — RAG setup | FAISS index + Databricks Vector Search index (if available) | ~3 min |
| 05 — Inference test | Pipeline validation — all 5 test cases must pass | ~2 min |

---

### Step 4 — Deploy as Databricks App

```
Compute → Apps → Create App → Connect Git repo → Deploy
```

Databricks auto-detects `app.yaml`. Before deploying, update one line:

```yaml
# app.yaml
- name: "LLM_OPENAI_BASE_URL"
  value: "https://YOUR_WORKSPACE.ai-gateway.cloud.databricks.com/mlflow/v1"
```

---

### Step 5 — Grant service principal permissions

```
CAN_QUERY  →  AI Gateway endpoint
READ       →  main.upi_fraud schema (Unity Catalog)
READ       →  secret scope upi-shield
USE        →  Vector Search endpoint upi_shield_vs_endpoint
```

---

### Local development

```bash
pip install -e ".[dev,rag,embed,ml,llm,app]"
cp .env.example .env          # fill in your values
export $(grep -v '^#' .env | xargs)
python app/main.py            # opens on http://localhost:8000
```

---

## Fraud Signals Detected (8 Types)

| Signal | Icon | Trigger | Severity |
|---|---|---|---|
| Collect request | 🔴 | `is_collect_request = True` | CRITICAL |
| Fraud network | 🕸️ | Receiver fraud ratio > 30% (graph feature) | CRITICAL |
| New payee | 🟠 | First-ever transaction with this UPI ID | HIGH |
| Deceptive description | ⚠️ | prize / KYC / lottery / subsidy / urgent in text | HIGH |
| Rapid succession | ⚡ | 3+ transactions in last 60 minutes | HIGH |
| Unusual hour | 🌙 | Before 06:00 or after 22:00 | MEDIUM |
| High amount | 💰 | Amount > ₹10,000 | MEDIUM |
| Suspiciously fast | 🤖 | Completed in < 10 seconds (bot pattern) | MEDIUM |

---

## Demo — Expected Outputs

| Preset | Risk | Score | Key Signals |
|---|---|---|---|
| 🚨 Collect Request Scam | HIGH | ~85% | Collect request · New payee · Night hour · Deceptive desc |
| 🚨 KYC / Large Amount | HIGH | ~78% | New payee · High amount · Night hour · Deceptive desc |
| 🚨 Rapid Succession | HIGH | ~72% | Rapid succession · New payee · Night hour |
| ✅ Grocery Payment | LOW | ~12% | No signals |
| ✅ Restaurant Bill | LOW | ~8% | No signals |

---

## Model Performance

| Metric | Score |
|---|---|
| ROC-AUC | ~0.87 |
| Avg Precision | ~0.83 |
| Precision | ~0.78 |
| Recall | ~0.82 |
| F1 | ~0.80 |

Trained on 6,000 synthetic transactions (~14% fraud rate).
SHAP feature importance logged to MLflow for every training run.

---

## RBI Knowledge Base (20 Guidelines)

| ID | Category | Severity |
|---|---|---|
| RBI-UPI-001 | Collect Requests — never approve from unknown | CRITICAL |
| RBI-UPI-002 | Banks never ask for OTP or PIN | CRITICAL |
| RBI-UPI-003 | Always verify receiver before sending money | HIGH |
| RBI-UPI-004 | Avoid transactions under pressure or urgency | HIGH |
| RBI-UPI-005 | Prize / lottery scams — never pay to receive money | CRITICAL |
| RBI-UPI-006 | Government subsidies are never via collect requests | CRITICAL |
| RBI-UPI-007 | KYC updates are never done through UPI | CRITICAL |
| RBI-UPI-008 | Large transactions require additional verification | HIGH |
| RBI-UPI-009 | Rapid transactions may indicate account takeover | HIGH |
| RBI-UPI-010 | Extra caution for late-night transactions | MEDIUM |
| RBI-UPI-011 | Report fraud immediately to 1930 | HIGH |
| RBI-UPI-012 | Never share screen while using UPI apps | CRITICAL |
| RBI-UPI-013–020 | Merchant QR · Investment · Device security · Limits · SIM swap · Refund fraud · Public WiFi · Fake support | MEDIUM–CRITICAL |

---

## Key Innovations

**Graph fraud network detection** — `receiver_fraud_ratio` is computed across the entire dataset using PySpark aggregations. This catches mule accounts even when the individual transaction looks innocent — something rule-based systems completely miss.

**AI is genuinely central** — removing the Isolation Forest eliminates the fraud score; removing the RAG retrieval removes the RBI grounding; removing the LLM leaves no explanation. All three are load-bearing by design, satisfying the mandatory "AI must be central" rule.

**SHAP-logged explainability** — every MLflow training run records SHAP feature importance values. Any judge can open the MLflow UI and see exactly which of the 32 features drove the model's decision.

**Dual-backend RAG** — retrieval tries Databricks Vector Search first, falls back to FAISS at runtime — controlled by a single env var in `app.yaml`. No code changes needed to switch between environments.

---

## What's Next

- Extend to Tamil, Telugu, Kannada using Sarvam's IndicTrans2
- Voice interface — describe suspicious activity verbally, hear the explanation back
- Real-time integration with UPI apps for warnings during live transactions
- Community fraud pattern reporting to continuously update the knowledge base
- Personalized risk profiles that learn each user's normal transaction patterns

---

## Important Notes

> **Dependency pins are critical.** `faiss-cpu` must be `>=1.7.0,<1.8` — version 1.8+ uses `numpy._core` which conflicts with `databricks-connect`'s `numpy<2` requirement. `gradio` must be pinned to `~=4.44.0` with `gradio-client==1.3.0` exactly. Do not upgrade these without testing.

> **Not legal or financial advice.** This is a research and educational system built for Bharat Bricks Hacks 2026. For actual UPI fraud, call the National Cyber Helpline: **1930**.

---

<div align="center">

Built with ❤️ for Bharat &nbsp;·&nbsp; **Bharat Bricks Hacks 2026 · IISc Bengaluru**

*Making fraud detection transparent, trustworthy, and accessible to every Indian.*

</div>
