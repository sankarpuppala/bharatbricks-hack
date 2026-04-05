'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Search, Zap } from 'lucide-react'
import type { UPITransaction } from '@/lib/types'
import { SAMPLE_TRANSACTIONS } from '@/lib/types'
import { t } from '@/lib/sarvam-client'

interface TransactionFormProps {
  language: 'en' | 'hi'
  onAnalyze: (transaction: UPITransaction) => void
  isLoading: boolean
}

export function TransactionForm({ language, onAnalyze, isLoading }: TransactionFormProps) {
  const [transaction, setTransaction] = useState<UPITransaction>({
    transaction_id: `TXN${Date.now()}`,
    sender_upi_id: '',
    receiver_upi_id: '',
    amount: 0,
    transaction_type: 'PAY',
    timestamp: new Date().toISOString(),
    is_first_time_payee: false,
    transaction_frequency_24h: 1,
    average_transaction_amount: 2000,
    transaction_note: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAnalyze({
      ...transaction,
      transaction_id: `TXN${Date.now()}`,
      timestamp: new Date().toISOString(),
    })
  }

  const loadSample = (index: number) => {
    setTransaction(SAMPLE_TRANSACTIONS[index])
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Search className="h-5 w-5 text-primary" />
          {t('transactionDetails', language)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick Sample Buttons */}
          <div className="flex flex-wrap gap-2 pb-4 border-b border-border">
            <span className="text-sm text-muted-foreground w-full mb-1">
              {t('sampleTransactions', language)}:
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadSample(0)}
              className="text-xs"
            >
              {t('normalTransaction', language)}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadSample(1)}
              className="text-xs bg-destructive/10 hover:bg-destructive/20 border-destructive/30"
            >
              {t('collectRequestScam', language)}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadSample(2)}
              className="text-xs bg-warning/10 hover:bg-warning/20 border-warning/30"
            >
              {t('lotteryScam', language)}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sender">{t('sender', language)} UPI ID</Label>
              <Input
                id="sender"
                placeholder="user@paytm"
                value={transaction.sender_upi_id}
                onChange={(e) => setTransaction({ ...transaction, sender_upi_id: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receiver">{t('receiver', language)} UPI ID</Label>
              <Input
                id="receiver"
                placeholder="merchant@icici"
                value={transaction.receiver_upi_id}
                onChange={(e) => setTransaction({ ...transaction, receiver_upi_id: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">{t('amount', language)} (INR)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="1000"
                value={transaction.amount || ''}
                onChange={(e) => setTransaction({ ...transaction, amount: Number(e.target.value) })}
                required
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">{t('type', language)}</Label>
              <Select
                value={transaction.transaction_type}
                onValueChange={(value: 'PAY' | 'COLLECT' | 'MANDATE') =>
                  setTransaction({ ...transaction, transaction_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAY">PAY (Send Money)</SelectItem>
                  <SelectItem value="COLLECT">COLLECT (Request Money)</SelectItem>
                  <SelectItem value="MANDATE">MANDATE (Auto-debit)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">{t('note', language)}</Label>
            <Textarea
              id="note"
              placeholder="Transaction description..."
              value={transaction.transaction_note || ''}
              onChange={(e) => setTransaction({ ...transaction, transaction_note: e.target.value })}
              rows={2}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="avgAmount">Average Transaction Amount</Label>
              <Input
                id="avgAmount"
                type="number"
                value={transaction.average_transaction_amount || ''}
                onChange={(e) =>
                  setTransaction({ ...transaction, average_transaction_amount: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Transactions in 24h</Label>
              <Input
                id="frequency"
                type="number"
                value={transaction.transaction_frequency_24h || ''}
                onChange={(e) =>
                  setTransaction({ ...transaction, transaction_frequency_24h: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2">
              <Switch
                id="firstTime"
                checked={transaction.is_first_time_payee}
                onCheckedChange={(checked) =>
                  setTransaction({ ...transaction, is_first_time_payee: checked })
                }
              />
              <Label htmlFor="firstTime" className="text-sm">
                {t('firstTimePayee', language)}
              </Label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gap-2"
            disabled={isLoading || !transaction.sender_upi_id || !transaction.receiver_upi_id || !transaction.amount}
          >
            {isLoading ? (
              <>
                <Spinner className="h-4 w-4" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                {t('analyze', language)}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
