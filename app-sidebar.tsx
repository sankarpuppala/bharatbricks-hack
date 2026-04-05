import { NextRequest, NextResponse } from 'next/server'
import { analyzeFraud, analyzeFraudBatch } from '@/lib/fraud-detection'
import type { UPITransaction } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle single transaction
    if (body.transaction) {
      const transaction: UPITransaction = body.transaction
      const analysis = analyzeFraud(transaction)
      return NextResponse.json({ success: true, analysis })
    }
    
    // Handle batch transactions
    if (body.transactions && Array.isArray(body.transactions)) {
      const transactions: UPITransaction[] = body.transactions
      const analyses = analyzeFraudBatch(transactions)
      return NextResponse.json({ success: true, analyses })
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid request. Provide transaction or transactions array.' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to analyze transaction' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'UPI Fraud Detection API',
    version: '1.0.0',
    endpoints: {
      POST: '/api/analyze',
      description: 'Analyze UPI transactions for fraud',
      body: {
        transaction: 'Single UPITransaction object',
        transactions: 'Array of UPITransaction objects for batch analysis'
      }
    }
  })
}
