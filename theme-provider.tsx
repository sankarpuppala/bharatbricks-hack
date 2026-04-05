'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { AppSidebar } from '@/components/app-sidebar'
import { TransactionForm } from '@/components/transaction-form'
import { FraudResult } from '@/components/fraud-result'
import { RBIGuidelinesView } from '@/components/rbi-guidelines'
import { StatsDashboard } from '@/components/stats-dashboard'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, AlertTriangle, Info, Zap } from 'lucide-react'
import type { UPITransaction, FraudAnalysis } from '@/lib/types'
import { t } from '@/lib/sarvam-client'

export default function HomePage() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  const [activeTab, setActiveTab] = useState('analyze')
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState<FraudAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (transaction: UPITransaction) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction }),
      })

      const data = await response.json()

      if (data.success) {
        setAnalysis(data.analysis)
      } else {
        setError(data.error || 'Analysis failed')
      }
    } catch (err) {
      setError('Failed to connect to analysis service')
      console.error('Analysis error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'guidelines':
        return <RBIGuidelinesView language={language} />
      case 'stats':
        return <StatsDashboard language={language} />
      case 'history':
        return (
          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Info className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground">
                  {language === 'hi' ? 'कोई इतिहास नहीं' : 'No History Yet'}
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  {language === 'hi'
                    ? 'विश्लेषित लेनदेन यहां दिखाई देंगे'
                    : 'Analyzed transactions will appear here'}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      default:
        return (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <TransactionForm
                language={language}
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
              />
              
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-6">
              {analysis ? (
                <FraudResult analysis={analysis} language={language} />
              ) : (
                <Card className="bg-card h-full min-h-[400px]">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
                        <Shield className="relative h-16 w-16 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {language === 'hi'
                          ? 'लेनदेन का विश्लेषण करें'
                          : 'Analyze a Transaction'}
                      </h3>
                      <p className="text-muted-foreground max-w-sm mb-6">
                        {language === 'hi'
                          ? 'संभावित धोखाधड़ी का पता लगाने के लिए बाईं ओर लेनदेन विवरण दर्ज करें'
                          : 'Enter transaction details on the left to detect potential fraud'}
                      </p>
                      <div className="grid gap-3 text-left text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Zap className="h-4 w-4 text-primary" />
                          {language === 'hi'
                            ? 'AI-संचालित विसंगति पहचान'
                            : 'AI-powered anomaly detection'}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Zap className="h-4 w-4 text-primary" />
                          {language === 'hi'
                            ? 'RBI दिशानिर्देश-आधारित व्याख्या'
                            : 'RBI guideline-based explanation'}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Zap className="h-4 w-4 text-primary" />
                          {language === 'hi'
                            ? 'बहुभाषी समर्थन'
                            : 'Multilingual support'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar
        language={language}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header language={language} onLanguageChange={setLanguage} />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl">
            {/* Welcome Banner */}
            {activeTab === 'analyze' && !analysis && (
              <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h2 className="font-semibold text-foreground">
                      {language === 'hi'
                        ? 'UPI धोखाधड़ी शील्ड में आपका स्वागत है'
                        : 'Welcome to UPI Fraud Shield'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {language === 'hi'
                        ? 'RBI-निर्देशित RAG के साथ व्याख्यात्मक UPI धोखाधड़ी पहचान। लेनदेन का विश्लेषण करने के लिए नीचे दिए गए नमूना लेनदेन आज़माएं।'
                        : 'Explainable UPI fraud detection with RBI-guided RAG. Try the sample transactions below to analyze.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {renderContent()}

            {/* Footer Disclaimer */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs text-center text-muted-foreground">
                {t('disclaimer', language)}
              </p>
              <p className="text-xs text-center text-muted-foreground mt-1">
                Powered by Databricks | Spark MLlib | FAISS | Sarvam AI
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
