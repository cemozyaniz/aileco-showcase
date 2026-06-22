'use client'

import { useTranslation } from '@/providers/LanguageProvider'

export default function DestekPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Back to home */}
        <a href="/" className="inline-flex items-center text-[#D4A853] hover:text-[#c49a48] mb-8 font-light">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Ana sayfaya dön
        </a>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-light tracking-[0.15em] text-white mb-4">
            {t('support.title')}
          </h1>
          <p className="text-white/50 text-lg font-light">
            {t('support.subtitle')}
          </p>
        </div>

        {/* Support Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Email Support */}
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 hover:border-[#D4A853]/30 transition-colors">
            <div className="w-12 h-12 bg-[#D4A853]/10 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#D4A853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-white">{t('support.email.title')}</h2>
            <p className="text-white/50 mb-4 font-light">
              {t('support.email.desc')}
            </p>
            <a href="mailto:destek@aileco.com" className="text-[#D4A853] hover:text-[#c49a48] font-medium">
              destek@aileco.com
            </a>
          </div>

          {/* FAQ */}
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 hover:border-[#D4A853]/30 transition-colors">
            <div className="w-12 h-12 bg-[#D4A853]/10 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#D4A853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-white">{t('support.faq.title')}</h2>
            <p className="text-white/50 mb-4 font-light">
              {t('support.faq.desc')}
            </p>
            <a href="#faq" className="text-[#D4A853] hover:text-[#c49a48] font-medium">
              {t('support.faq.link')}
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="bg-[#111111] border border-white/10 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-light tracking-wide mb-6 text-white">{t('support.faq.title')}</h2>

          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="font-semibold mb-2 text-white">{t('faq.whatIs.title')}</h3>
              <p className="text-white/50 font-light">
                {t('faq.whatIs.desc')}
              </p>
            </div>

            <div className="border-b border-white/10 pb-4">
              <h3 className="font-semibold mb-2 text-white">{t('faq.forgotPassword.title')}</h3>
              <p className="text-white/50 font-light">
                {t('faq.forgotPassword.desc')}
              </p>
            </div>

            <div className="border-b border-white/10 pb-4">
              <h3 className="font-semibold mb-2 text-white">{t('faq.qrScan.title')}</h3>
              <p className="text-white/50 font-light">
                {t('faq.qrScan.desc')}
              </p>
            </div>

            <div className="border-b border-white/10 pb-4">
              <h3 className="font-semibold mb-2 text-white">{t('faq.vcard.title')}</h3>
              <p className="text-white/50 font-light">
                {t('faq.vcard.desc')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-white">{t('faq.update.title')}</h3>
              <p className="text-white/50 font-light">
                {t('faq.update.desc')}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-light tracking-wide mb-6 text-white">{t('support.contact.title')}</h2>

          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1">
                {t('support.name')}
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl focus:ring-2 focus:ring-[#D4A853] focus:border-[#D4A853] text-white placeholder:text-white/30 transition-all"
                placeholder={t('support.name.placeholder')}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">
                {t('support.email')}
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl focus:ring-2 focus:ring-[#D4A853] focus:border-[#D4A853] text-white placeholder:text-white/30 transition-all"
                placeholder={t('support.email.placeholder')}
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-white/70 mb-1">
                {t('support.subject')}
              </label>
              <select
                id="subject"
                className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl focus:ring-2 focus:ring-[#D4A853] focus:border-[#D4A853] text-white transition-all"
              >
                <option value="" className="bg-[#111111]">{t('support.subject.placeholder')}</option>
                <option value="technical" className="bg-[#111111]">{t('support.subject.technical')}</option>
                <option value="account" className="bg-[#111111]">{t('support.subject.account')}</option>
                <option value="feature" className="bg-[#111111]">{t('support.subject.feature')}</option>
                <option value="other" className="bg-[#111111]">{t('support.subject.other')}</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-white/70 mb-1">
                {t('support.message')}
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl focus:ring-2 focus:ring-[#D4A853] focus:border-[#D4A853] text-white placeholder:text-white/30 transition-all resize-none"
                placeholder={t('support.message.placeholder')}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#D4A853] text-black py-3 px-6 rounded-full font-semibold hover:bg-[#c49a48] transition-all"
            >
              {t('support.submit')}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-white/30 text-sm font-light">
          <p>© 2026 AileCo. {t('common.rights')}</p>
          <p className="mt-2">
            <a href="https://aileco.com" className="text-[#D4A853] hover:text-[#c49a48]">
              {t('common.home')}
            </a>
            {' • '}
            <a href="/gizlilik" className="text-[#D4A853] hover:text-[#c49a48]">
              {t('common.privacy')}
            </a>
            {' • '}
            <a href="/kullanim" className="text-[#D4A853] hover:text-[#c49a48]">
              {t('common.terms')}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
