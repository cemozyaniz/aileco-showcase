'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslation } from '@/providers/LanguageProvider'

function ResetPasswordForm() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage(t('reset.errorMismatch'))
      return
    }

    if (password.length < 6) {
      setMessage(t('reset.errorMinLength'))
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('https://api.aileco.com/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: password }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setMessage(t('reset.success'))
      } else {
        setMessage(data.detail || t('reset.invalidToken'))
      }
    } catch (error) {
      setMessage(t('reset.errorConnection'))
    } finally {
      setLoading(false)
    }
  }

  // No token - show error
  if (!token) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-md mx-auto px-4 py-16">
          {/* Back to home */}
          <a href="/" className="inline-flex items-center text-[#D4A853] hover:text-[#c49a48] mb-8 font-light">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('reset.backToHome')}
          </a>

          <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-light tracking-wide text-white mb-2">{t('reset.invalidToken')}</h1>
            <p className="text-white/50 font-light mb-6">
              {t('reset.errorConnection')}
            </p>
            <a
              href="https://app.aileco.com"
              className="inline-block bg-[#D4A853] text-black py-3 px-8 rounded-full font-semibold hover:bg-[#c49a48] transition-all"
            >
              {t('reset.goToApp')}
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Reset password form
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-md mx-auto px-4 py-16">
        {/* Back to home */}
        <a href="/" className="inline-flex items-center text-[#D4A853] hover:text-[#c49a48] mb-8 font-light">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('reset.backToHome')}
        </a>

        <div className="bg-[#111111] border border-white/10 rounded-2xl p-8">
          <h1 className="text-3xl font-light tracking-wide text-white mb-2">{t('reset.title')}</h1>
          <p className="text-white/50 mb-6 font-light">
            {t('reset.subtitle')}
          </p>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-1">
                  {t('reset.newPassword')}
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl focus:ring-2 focus:ring-[#D4A853] focus:border-[#D4A853] text-white placeholder:text-white/30 transition-all"
                  placeholder={t('reset.placeholder')}
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/70 mb-1">
                  {t('reset.confirmPassword')}
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl focus:ring-2 focus:ring-[#D4A853] focus:border-[#D4A853] text-white placeholder:text-white/30 transition-all"
                  placeholder={t('reset.placeholder')}
                  required
                />
              </div>

              {message && (
                <p className={`text-sm ${message.includes(t('reset.success')) || !message.includes(t('reset.errorMismatch')) && !message.includes(t('reset.errorMinLength')) && !message.includes(t('reset.errorConnection')) ? 'text-red-400' : 'text-red-400'}`}>
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D4A853] text-black py-3 px-6 rounded-full font-semibold hover:bg-[#c49a48] transition-all disabled:opacity-50"
              >
                {loading ? t('reset.resetting') : t('reset.resetButton')}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white font-light mb-6">{message}</p>
              <a
                href="https://app.aileco.com"
                className="inline-block bg-[#D4A853] text-black py-3 px-8 rounded-full font-semibold hover:bg-[#c49a48] transition-all"
              >
                {t('reset.goToApp')}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SifreSifirlamaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/50">Yükleniyor...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
