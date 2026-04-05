import type { UPITransaction, FraudAnalysis, RBIGuideline, FeatureImportance } from './types'
import { RBI_GUIDELINES } from './types'

// Simulated Isolation Forest model weights
// In production, this would be loaded from a trained model
const MODEL_WEIGHTS = {
  amount_deviation: 0.25,
  is_collect_request: 0.20,
  is_first_time_payee: 0.15,
  transaction_velocity: 0.15,
  suspicious_keywords: 0.15,
  time_anomaly: 0.10,
}

// Suspicious keywords in transaction notes
const SUSPICIOUS_KEYWORDS = [
  'kyc', 'urgent', 'lottery', 'prize', 'winner', 'cashback',
  'otp', 'pin', 'verify', 'blocked', 'suspend', 'claim',
  'refund', 'update', 'link', 'click', 'immediately'
]

/**
 * Calculate anomaly score using simulated Isolation Forest algorithm
 * Returns a score between 0 (normal) and 1 (anomalous)
 */
function calculateAnomalyScore(transaction: UPITransaction): {
  score: number
  features: FeatureImportance[]
} {
  const features: FeatureImportance[] = []
  let totalScore = 0

  // 1. Amount deviation from average
  const avgAmount = transaction.average_transaction_amount || 2000
  const amountRatio = transaction.amount / avgAmount
  const amountDeviation = Math.min(amountRatio / 10, 1) // Normalize to 0-1
  const amountContribution = amountDeviation * MODEL_WEIGHTS.amount_deviation
  totalScore += amountContribution
  features.push({
    feature: 'Amount Deviation',
    value: amountRatio,
    contribution: amountContribution,
    description: `Transaction is ${amountRatio.toFixed(1)}x the average amount`
  })

  // 2. Collect request check (high risk)
  const isCollect = transaction.transaction_type === 'COLLECT'
  const collectContribution = isCollect ? MODEL_WEIGHTS.is_collect_request : 0
  totalScore += collectContribution
  features.push({
    feature: 'Collect Request',
    value: isCollect ? 1 : 0,
    contribution: collectContribution,
    description: isCollect ? 'Collect requests from unknown sources are risky' : 'Normal PAY transaction'
  })

  // 3. First-time payee
  const firstTimeContribution = transaction.is_first_time_payee 
    ? MODEL_WEIGHTS.is_first_time_payee * (transaction.amount > 10000 ? 1 : 0.5)
    : 0
  totalScore += firstTimeContribution
  features.push({
    feature: 'First-time Payee',
    value: transaction.is_first_time_payee ? 1 : 0,
    contribution: firstTimeContribution,
    description: transaction.is_first_time_payee 
      ? 'First transaction with this recipient' 
      : 'Known recipient'
  })

  // 4. Transaction velocity (frequency in 24h)
  const freq = transaction.transaction_frequency_24h || 1
  const velocityScore = Math.min(freq / 20, 1)
  const velocityContribution = velocityScore * MODEL_WEIGHTS.transaction_velocity
  totalScore += velocityContribution
  features.push({
    feature: 'Transaction Velocity',
    value: freq,
    contribution: velocityContribution,
    description: `${freq} transactions in the last 24 hours`
  })

  // 5. Suspicious keywords in note
  const note = (transaction.transaction_note || '').toLowerCase()
  const foundKeywords = SUSPICIOUS_KEYWORDS.filter(kw => note.includes(kw))
  const keywordScore = Math.min(foundKeywords.length / 3, 1)
  const keywordContribution = keywordScore * MODEL_WEIGHTS.suspicious_keywords
  totalScore += keywordContribution
  features.push({
    feature: 'Suspicious Keywords',
    value: foundKeywords.length,
    contribution: keywordContribution,
    description: foundKeywords.length > 0 
      ? `Found suspicious terms: ${foundKeywords.join(', ')}`
      : 'No suspicious keywords detected'
  })

  // 6. Time anomaly (transactions at unusual hours - simplified)
  const hour = new Date(transaction.timestamp).getHours()
  const isUnusualTime = hour >= 0 && hour < 6 // Midnight to 6 AM
  const timeContribution = isUnusualTime ? MODEL_WEIGHTS.time_anomaly : 0
  totalScore += timeContribution
  features.push({
    feature: 'Time Analysis',
    value: isUnusualTime ? 1 : 0,
    contribution: timeContribution,
    description: isUnusualTime 
      ? 'Transaction at unusual hour' 
      : 'Normal transaction time'
  })

  // Normalize score to 0-1 range
  const normalizedScore = Math.min(totalScore, 1)

  return {
    score: normalizedScore,
    features: features.sort((a, b) => b.contribution - a.contribution)
  }
}

/**
 * Get fraud label based on anomaly score
 */
function getFraudLabel(score: number): 'SAFE' | 'SUSPICIOUS' | 'FRAUD' {
  if (score < 0.3) return 'SAFE'
  if (score < 0.6) return 'SUSPICIOUS'
  return 'FRAUD'
}

/**
 * Find most relevant RBI guideline using vector similarity simulation
 * In production, this would use actual embeddings and FAISS/vector search
 */
function findRelevantGuideline(transaction: UPITransaction, signals: string[]): RBIGuideline {
  // Simple keyword matching to simulate vector search
  const note = (transaction.transaction_note || '').toLowerCase()
  
  // Check for collect request fraud
  if (transaction.transaction_type === 'COLLECT' && transaction.is_first_time_payee) {
    return RBI_GUIDELINES.find(g => g.rule_id === 'RBI-001')!
  }
  
  // Check for lottery/prize scam
  if (note.includes('lottery') || note.includes('prize') || note.includes('winner')) {
    return RBI_GUIDELINES.find(g => g.rule_id === 'RBI-005')!
  }
  
  // Check for KYC/phishing
  if (note.includes('kyc') || note.includes('otp') || note.includes('pin')) {
    return RBI_GUIDELINES.find(g => g.rule_id === 'RBI-002')!
  }
  
  // Check for urgency/pressure tactics
  if (note.includes('urgent') || note.includes('immediately')) {
    return RBI_GUIDELINES.find(g => g.rule_id === 'RBI-004')!
  }
  
  // High value first-time payee
  if (transaction.is_first_time_payee && transaction.amount > 10000) {
    return RBI_GUIDELINES.find(g => g.rule_id === 'RBI-006')!
  }
  
  // Default to identity verification
  return RBI_GUIDELINES.find(g => g.rule_id === 'RBI-003')!
}

/**
 * Generate fraud signals based on transaction analysis
 */
function generateFraudSignals(transaction: UPITransaction): string[] {
  const signals: string[] = []
  
  if (transaction.transaction_type === 'COLLECT') {
    signals.push('Collect request from external source')
  }
  
  if (transaction.is_first_time_payee) {
    signals.push('First-time payee')
  }
  
  const avgAmount = transaction.average_transaction_amount || 2000
  if (transaction.amount > avgAmount * 5) {
    signals.push(`Amount significantly higher than average (${(transaction.amount / avgAmount).toFixed(1)}x)`)
  }
  
  const note = (transaction.transaction_note || '').toLowerCase()
  if (note.includes('kyc') || note.includes('update')) {
    signals.push('Mentions KYC update - common scam tactic')
  }
  if (note.includes('urgent') || note.includes('immediately')) {
    signals.push('Creates artificial urgency')
  }
  if (note.includes('lottery') || note.includes('prize') || note.includes('winner')) {
    signals.push('Lottery/prize scam indicator')
  }
  
  if ((transaction.transaction_frequency_24h || 0) > 10) {
    signals.push('High transaction velocity')
  }
  
  return signals
}

/**
 * Generate explanation based on fraud analysis
 */
function generateExplanation(
  transaction: UPITransaction,
  fraudLabel: 'SAFE' | 'SUSPICIOUS' | 'FRAUD',
  signals: string[],
  guideline: RBIGuideline
): { en: string; hi: string } {
  if (fraudLabel === 'SAFE') {
    return {
      en: `This transaction appears safe. The amount of Rs ${transaction.amount} is within normal patterns, and no suspicious indicators were detected.`,
      hi: `यह लेनदेन सुरक्षित प्रतीत होता है। रु ${transaction.amount} की राशि सामान्य पैटर्न के भीतर है, और कोई संदिग्ध संकेतक नहीं पाए गए।`
    }
  }
  
  const signalText = signals.slice(0, 3).join('; ')
  
  if (fraudLabel === 'FRAUD') {
    return {
      en: `WARNING: This transaction is flagged as potentially fraudulent. Detected signals: ${signalText}. According to RBI guidelines: "${guideline.rule_text_en}"`,
      hi: `चेतावनी: इस लेनदेन को संभावित धोखाधड़ी के रूप में चिह्नित किया गया है। पाए गए संकेत: ${signalText}। RBI दिशानिर्देशों के अनुसार: "${guideline.rule_text_hi}"`
    }
  }
  
  return {
    en: `CAUTION: This transaction shows suspicious patterns. Signals: ${signalText}. RBI recommends: "${guideline.rule_text_en}"`,
    hi: `सावधानी: इस लेनदेन में संदिग्ध पैटर्न दिखाई दे रहे हैं। संकेत: ${signalText}। RBI सिफारिश करता है: "${guideline.rule_text_hi}"`
  }
}

/**
 * Main fraud analysis function
 * Combines anomaly detection, RAG-based explanation, and multilingual output
 */
export function analyzeFraud(transaction: UPITransaction): FraudAnalysis {
  // Step 1: Calculate anomaly score using Isolation Forest simulation
  const { score, features } = calculateAnomalyScore(transaction)
  
  // Step 2: Determine fraud label
  const fraudLabel = getFraudLabel(score)
  
  // Step 3: Generate fraud signals
  const signals = generateFraudSignals(transaction)
  
  // Step 4: Find relevant RBI guideline (RAG simulation)
  const guideline = findRelevantGuideline(transaction, signals)
  
  // Step 5: Generate explanation in both languages
  const explanation = generateExplanation(transaction, fraudLabel, signals, guideline)
  
  return {
    transaction_id: transaction.transaction_id,
    anomaly_score: score,
    fraud_label: fraudLabel,
    fraud_signals: signals,
    explanation_en: explanation.en,
    explanation_hi: explanation.hi,
    rbi_guideline: guideline,
    confidence: 0.85 + Math.random() * 0.1, // Simulated confidence
    feature_importance: features
  }
}

/**
 * Batch analysis for multiple transactions
 */
export function analyzeFraudBatch(transactions: UPITransaction[]): FraudAnalysis[] {
  return transactions.map(analyzeFraud)
}
