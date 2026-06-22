'use client'

import { useTranslation } from '@/providers/LanguageProvider'

export default function GizlilikPage() {
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

        <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-white mb-6">{t('privacy.title')}</h1>
          <p className="text-white/50 mb-8 font-light">
            {t('privacy.updated')}
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">{t('privacy.section1.title')}</h2>
              <p className="text-white/60 font-light leading-relaxed">
                {t('privacy.section1.desc')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">{t('privacy.section2.title')}</h2>
              <p className="text-white/60 font-light mb-2">{t('privacy.section2.desc')}</p>
              <ul className="list-disc pl-6 text-white/60 font-light space-y-1">
                <li>{t('privacy.section2.item1')}</li>
                <li>{t('privacy.section2.item2')}</li>
                <li>{t('privacy.section2.item3')}</li>
                <li>{t('privacy.section2.item4')}</li>
                <li>{t('privacy.section2.item5')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">{t('privacy.section3.title')}</h2>
              <p className="text-white/60 font-light mb-2">{t('privacy.section3.desc')}</p>
              <ul className="list-disc pl-6 text-white/60 font-light space-y-1">
                <li>{t('privacy.section3.item1')}</li>
                <li>{t('privacy.section3.item2')}</li>
                <li>{t('privacy.section3.item3')}</li>
                <li>{t('privacy.section3.item4')}</li>
                <li>{t('privacy.section3.item5')}</li>
                <li>{t('privacy.section3.item6')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">{t('privacy.section4.title')}</h2>
              <p className="text-white/60 font-light mb-2">{t('privacy.section4.desc')}</p>
              <ul className="list-disc pl-6 text-white/60 font-light space-y-1">
                <li>{t('privacy.section4.item1')}</li>
                <li>{t('privacy.section4.item2')}</li>
                <li>{t('privacy.section4.item3')}</li>
                <li>{t('privacy.section4.item4')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">{t('privacy.section5.title')}</h2>
              <p className="text-white/60 font-light leading-relaxed">
                {t('privacy.section5.desc')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">{t('privacy.section6.title')}</h2>
              <p className="text-white/60 font-light mb-2">{t('privacy.section6.desc')}</p>
              <ul className="list-disc pl-6 text-white/60 font-light space-y-1">
                <li>{t('privacy.section6.item1')}</li>
                <li>{t('privacy.section6.item2')}</li>
                <li>{t('privacy.section6.item3')}</li>
                <li>{t('privacy.section6.item4')}</li>
                <li>{t('privacy.section6.item5')}</li>
                <li>{t('privacy.section6.item6')}</li>
              </ul>
              <p className="text-white/60 font-light mt-2">
                {t('privacy.section6.contact')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">{t('privacy.section7.title')}</h2>
              <p className="text-white/60 font-light leading-relaxed">
                {t('privacy.section7.desc')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">{t('privacy.section8.title')}</h2>
              <p className="text-white/60 font-light leading-relaxed">
                {t('privacy.section8.desc')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">{t('privacy.section9.title')}</h2>
              <p className="text-white/60 font-light leading-relaxed">
                {t('privacy.section9.desc')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">{t('privacy.section10.title')}</h2>
              <p className="text-white/60 font-light leading-relaxed">
                {t('privacy.section10.desc')}
              </p>
              <p className="text-[#D4A853] mt-2 font-light">
                E-posta: <a href="mailto:destek@aileco.com" className="underline hover:text-[#c49a48]">destek@aileco.com</a>
                <br />
                Web sitesi: <a href="https://aileco.com" className="underline hover:text-[#c49a48]">https://aileco.com</a>
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/30 text-sm font-light">
            <p>© 2026 AileCo. {t('common.rights')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
