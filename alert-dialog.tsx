'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  ShieldAlert,
  BookOpen,
  BarChart3,
  Phone,
  Info,
} from 'lucide-react'
import type { FraudAnalysis } from '@/lib/types'
import { t } from '@/lib/sarvam-client'

interface FraudResultProps {
  analysis: FraudAnalysis
  language: 'en' | 'hi'
}

export function FraudResult({ analysis, language }: FraudResultProps) {
  const getStatusConfig = () => {
    switch (analysis.fraud_label) {
      case 'SAFE':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
          label: t('safe', language),
          progressColor: 'bg-green-500',
        }
      case 'SUSPICIOUS':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30',
          label: t('suspicious', language),
          progressColor: 'bg-yellow-500',
        }
      case 'FRAUD':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          label: t('fraud', language),
          progressColor: 'bg-red-500',
        }
    }
  }

  const status = getStatusConfig()
  const StatusIcon = status.icon

  return (
    <div className="space-y-4">
      {/* Main Status Card */}
      <Card className={`${status.bgColor} ${status.borderColor} border-2`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <StatusIcon className={`h-10 w-10 ${status.color}`} />
              <div>
                <h3 className={`text-2xl font-bold ${status.color}`}>{status.label}</h3>
                <p className="text-sm text-muted-foreground">
                  Transaction ID: {analysis.transaction_id}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-foreground">
                {(analysis.anomaly_score * 100).toFixed(0)}%
              </div>
              <p className="text-sm text-muted-foreground">{t('fraudScore', language)}</p>
            </div>
          </div>
          
          <Progress
            value={analysis.anomaly_score * 100}
            className="h-3 bg-muted"
          />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Safe</span>
            <span>Suspicious</span>
            <span>Fraud</span>
          </div>
        </CardContent>
      </Card>

      {/* Explanation Card */}
      <Card className="bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="h-5 w-5 text-primary" />
            {t('explanation', language)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-foreground leading-relaxed">
              {language === 'hi' ? analysis.explanation_hi : analysis.explanation_en}
            </p>
          </div>
          
          {analysis.fraud_signals.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-destructive" />
                  {t('fraudSignals', language)}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.fraud_signals.map((signal, index) => (
                    <Badge key={index} variant="outline" className="border-destructive/50 text-destructive">
                      {signal}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* RBI Guideline Card */}
      <Card className="bg-card border-primary/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-primary" />
            {t('rbiGuideline', language)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <Badge className="mb-2" variant="secondary">
              {analysis.rbi_guideline.category}
            </Badge>
            <p className="text-foreground leading-relaxed">
              {language === 'hi'
                ? analysis.rbi_guideline.rule_text_hi
                : analysis.rbi_guideline.rule_text_en}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Source: {analysis.rbi_guideline.source}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Feature Analysis Card */}
      <Card className="bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            {t('featureAnalysis', language)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.feature_importance.map((feature, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{feature.feature}</span>
                  <span className="text-muted-foreground">
                    {(feature.contribution * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={feature.contribution * 100}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Fraud Card */}
      {analysis.fraud_label !== 'SAFE' && (
        <Card className="bg-destructive/5 border-destructive/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Phone className="h-8 w-8 text-destructive" />
              <div>
                <h4 className="font-bold text-foreground">{t('reportFraud', language)}</h4>
                <p className="text-lg font-mono text-destructive">{t('cybercrime', language)}</p>
                <p className="text-sm text-muted-foreground">
                  Report immediately to prevent financial loss
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
