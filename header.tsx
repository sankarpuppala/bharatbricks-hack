import { NextRequest, NextResponse } from 'next/server'
import { translateLongText, isSarvamConfigured, UI_TRANSLATIONS } from '@/lib/sarvam-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, sourceLanguage = 'en', targetLanguage = 'hi' } = body

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Text is required' },
        { status: 400 }
      )
    }

    // If same language, return original
    if (sourceLanguage === targetLanguage) {
      return NextResponse.json({
        success: true,
        translatedText: text,
        source: 'passthrough'
      })
    }

    // Check if Sarvam is configured
    if (!isSarvamConfigured()) {
      // Use built-in translations for common UI strings
      return NextResponse.json({
        success: true,
        translatedText: text,
        source: 'fallback',
        message: 'Sarvam API not configured, returning original text'
      })
    }

    // Translate using Sarvam AI
    const translatedText = await translateLongText(
      text,
      sourceLanguage,
      targetLanguage
    )

    return NextResponse.json({
      success: true,
      translatedText,
      source: 'sarvam',
      sourceLanguage,
      targetLanguage
    })
  } catch (error) {
    console.error('Translation API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Translation failed'
      },
      { status: 500 }
    )
  }
}
