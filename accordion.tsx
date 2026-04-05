'use client'

import {
  Shield,
  Home,
  Search,
  FileText,
  Settings,
  HelpCircle,
  AlertTriangle,
  BarChart3,
  BookOpen,
  Phone,
} from 'lucide-react'
import { t } from '@/lib/sarvam-client'

interface AppSidebarProps {
  language: 'en' | 'hi'
  activeTab: string
  onTabChange: (tab: string) => void
}

const menuItems = [
  { id: 'analyze', icon: Search, labelKey: 'analyze' },
  { id: 'history', icon: FileText, labelKey: 'history' },
  { id: 'guidelines', icon: BookOpen, labelKey: 'rbiGuideline' },
  { id: 'stats', icon: BarChart3, labelKey: 'featureAnalysis' },
]

export function AppSidebar({ language, activeTab, onTabChange }: AppSidebarProps) {
  return (
    <aside className="hidden lg:flex w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <Shield className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-sidebar-foreground">UPI Fraud Shield</h1>
            <p className="text-xs text-muted-foreground">Powered by AI + RBI</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{t(item.labelKey, language)}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">Emergency</span>
          </div>
          <div className="flex items-center gap-2 text-sidebar-foreground">
            <Phone className="h-4 w-4" />
            <span className="font-mono font-bold">1930</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {language === 'hi' ? 'साइबर क्राइम हेल्पलाइन' : 'Cybercrime Helpline'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <HelpCircle className="h-4 w-4" />
          <span>
            {language === 'hi'
              ? 'AI-संचालित धोखाधड़ी पहचान'
              : 'AI-powered fraud detection'}
          </span>
        </div>
      </div>
    </aside>
  )
}
