'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BookOpen, Shield, AlertTriangle, Info } from 'lucide-react'
import { RBI_GUIDELINES } from '@/lib/types'

interface RBIGuidelinesProps {
  language: 'en' | 'hi'
}

const categoryIcons: Record<string, typeof Shield> = {
  'Collect Request Fraud': AlertTriangle,
  'Phishing': Shield,
  'Identity Verification': Info,
  'Social Engineering': AlertTriangle,
  'Lottery Scam': AlertTriangle,
  'High Value Transaction': Info,
  'Reporting': Info,
  'Velocity Check': Info,
}

export function RBIGuidelinesView({ language }: RBIGuidelinesProps) {
  return (
    <Card className="bg-card h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          {language === 'hi' ? 'RBI सुरक्षा दिशानिर्देश' : 'RBI Safety Guidelines'}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {language === 'hi'
            ? 'डिजिटल भुगतान धोखाधड़ी से बचने के लिए RBI के दिशानिर्देश'
            : 'RBI guidelines to protect against digital payment fraud'}
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {RBI_GUIDELINES.map((guideline) => {
              const Icon = categoryIcons[guideline.category] || Info
              return (
                <Card key={guideline.rule_id} className="bg-muted/30 border-border">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {guideline.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {guideline.rule_id}
                          </span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">
                          {language === 'hi' ? guideline.rule_text_hi : guideline.rule_text_en}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {language === 'hi' ? 'स्रोत: ' : 'Source: '}{guideline.source}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
