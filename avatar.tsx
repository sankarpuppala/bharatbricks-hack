'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  BarChart3,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react'

interface StatsDashboardProps {
  language: 'en' | 'hi'
}

// Sample statistics data
const stats = {
  totalAnalyzed: 1247,
  fraudDetected: 89,
  suspicious: 156,
  safe: 1002,
  avgProcessingTime: '0.3s',
  modelAccuracy: 94.2,
}

const fraudTypes = [
  { name: 'Collect Request Scam', count: 34, percentage: 38 },
  { name: 'Phishing', count: 28, percentage: 31 },
  { name: 'Lottery/Prize Scam', count: 15, percentage: 17 },
  { name: 'Social Engineering', count: 12, percentage: 14 },
]

export function StatsDashboard({ language }: StatsDashboardProps) {
  const title = language === 'hi' ? 'विश्लेषण सांख्यिकी' : 'Analysis Statistics'
  const subtitle = language === 'hi'
    ? 'धोखाधड़ी पहचान प्रदर्शन मेट्रिक्स'
    : 'Fraud detection performance metrics'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          {title}
        </h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'hi' ? 'कुल विश्लेषित' : 'Total Analyzed'}
                </p>
                <p className="text-3xl font-bold text-foreground">{stats.totalAnalyzed}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-400">
                  {language === 'hi' ? 'सुरक्षित' : 'Safe'}
                </p>
                <p className="text-3xl font-bold text-green-500">{stats.safe}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-400">
                  {language === 'hi' ? 'संदिग्ध' : 'Suspicious'}
                </p>
                <p className="text-3xl font-bold text-yellow-500">{stats.suspicious}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-400">
                  {language === 'hi' ? 'धोखाधड़ी' : 'Fraud'}
                </p>
                <p className="text-3xl font-bold text-red-500">{stats.fraudDetected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Performance */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {language === 'hi' ? 'मॉडल प्रदर्शन' : 'Model Performance'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{language === 'hi' ? 'सटीकता' : 'Accuracy'}</span>
              <span className="font-bold text-green-500">{stats.modelAccuracy}%</span>
            </div>
            <Progress value={stats.modelAccuracy} className="h-3" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-muted-foreground">
                {language === 'hi' ? 'औसत प्रोसेसिंग समय' : 'Avg Processing Time'}
              </p>
              <p className="text-xl font-bold text-foreground">{stats.avgProcessingTime}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-muted-foreground">
                {language === 'hi' ? 'मॉडल प्रकार' : 'Model Type'}
              </p>
              <p className="text-xl font-bold text-foreground">Isolation Forest</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fraud Types Distribution */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {language === 'hi' ? 'धोखाधड़ी प्रकार वितरण' : 'Fraud Type Distribution'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fraudTypes.map((type, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground">{type.name}</span>
                <span className="text-muted-foreground">{type.count} ({type.percentage}%)</span>
              </div>
              <Progress value={type.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>
            {language === 'hi' ? 'प्रौद्योगिकी स्टैक' : 'Technology Stack'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Databricks', desc: 'Data Platform' },
              { name: 'Spark MLlib', desc: 'ML Engine' },
              { name: 'FAISS', desc: 'Vector Search' },
              { name: 'Sarvam AI', desc: 'Translation' },
            ].map((tech, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="font-bold text-foreground">{tech.name}</p>
                <p className="text-xs text-muted-foreground">{tech.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
