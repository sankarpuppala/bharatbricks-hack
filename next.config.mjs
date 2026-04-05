# Databricks Apps runtime configuration
# Reference: nyaya-dhwani-hackathon/app.yaml
# https://docs.databricks.com/aws/en/dev-tools/databricks-apps/app-runtime

# For Next.js deployment on Vercel, this file serves as documentation
# The actual deployment uses Vercel's native Next.js support

env:
  # Sarvam AI for Indian language support
  # Load from Databricks secret scope at startup via SDK
  - name: "SARVAM_API_KEY"
    description: "Sarvam AI API key for translation, TTS, STT"
    # value loaded from dbutils.secrets.get(scope="upi-fraud", key="sarvam_api_key")
  
  # LLM Configuration (Databricks AI Gateway)
  - name: "LLM_OPENAI_BASE_URL"
    value: "https://your-workspace.cloud.databricks.com/mlflow/v1"
    description: "Databricks AI Gateway endpoint"
  
  - name: "LLM_MODEL"
    value: "databricks-llama-4-maverick"
    description: "LLM model for explanation generation"
  
  # Vector Search Configuration (primary backend)
  - name: "UPI_RETRIEVAL_BACKEND"
    value: "vector_search"
    description: "Retrieval backend: 'vector_search' or 'faiss'"
  
  - name: "UPI_VS_ENDPOINT_NAME"
    value: "upi_fraud_vs_endpoint"
    description: "Databricks Vector Search endpoint name"
  
  - name: "UPI_VS_INDEX_NAME"
    value: "main.upi_fraud.rbi_guidelines_index"
    description: "Vector Search index for RBI guidelines"
  
  # FAISS Fallback
  - name: "UPI_FAISS_INDEX_PATH"
    value: "/Volumes/main/upi_fraud/models/rbi_guidelines.faiss"
    description: "FAISS index file path for fallback retrieval"
  
  # Application Settings
  - name: "DEFAULT_LANGUAGE"
    value: "en"
    description: "Default UI language (en or hi)"
  
  - name: "FRAUD_THRESHOLD_HIGH"
    value: "0.7"
    description: "Threshold for high-risk classification"
  
  - name: "FRAUD_THRESHOLD_CRITICAL"
    value: "0.85"
    description: "Threshold for critical-risk classification"

# Resources for Databricks Apps (not used in Vercel deployment)
resources:
  - name: "upi_fraud_serving"
    type: "model_serving"
    endpoint_name: "upi_fraud_model"
  
  - name: "vector_search"
    type: "vector_search_index"
    endpoint_name: "upi_fraud_vs_endpoint"
    index_name: "main.upi_fraud.rbi_guidelines_index"

# Permissions
permissions:
  - principal: "service_principal"
    level: "CAN_QUERY"
    target: "vector_search"
