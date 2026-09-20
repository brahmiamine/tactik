import { useCallback, useEffect, useState } from 'react'
import CoachPanel from './coach/CoachPanel.jsx'
import { buildReport } from './coach/decisions.js'
import Footer from './components/Footer.jsx'
import FormActions from './components/FormActions.jsx'
import Header from './components/Header.jsx'
import TipBanner from './components/TipBanner.jsx'
import TacticalForm from './components/form/TacticalForm.jsx'
import Modal from './components/ui/Modal.jsx'
import Toast from './components/ui/Toast.jsx'
import { useLanguage, useModal, useStatusMessage, useTacticalForm, useTheme } from './hooks/index.js'
import { I18nProvider, useI18n } from './i18n/index.js'
import { copyText } from './lib/clipboard.js'

/** Contenu applicatif : ne contient que de l'orchestration. */
function TacticalGrid({ onToggleLanguage }) {
  const { t, language } = useI18n()
  const { isDark, toggleTheme } = useTheme()
  const { message, notify } = useStatusMessage()
  const { modal, openModal, closeModal } = useModal()
  const { form, setField, reset, save, load } = useTacticalForm()

  const [ai, setAI] = useState(null)
  const report = buildReport(form, language, ai)
  const exportJson = JSON.stringify(report, null, 2)

  useEffect(() => { setAI(null) }, [form])

  useEffect(() => {
    document.title = t('meta.title')
  }, [t])

  const handleExport = useCallback(async () => {
    const copied = await copyText(exportJson)
    notify(copied ? t('status.copied') : t('status.copyFailed'))
  }, [notify, t, exportJson])

  const handleSave = useCallback(() => {
    notify(save() ? t('status.saved') : t('status.saveFailed'))
  }, [notify, save, t])

  const handleLoad = useCallback(() => {
    try {
      load()
      notify(t('status.loaded'))
    } catch (error) {
      notify(error.message === 'EMPTY_SAVE' ? t('status.noSave') : t('status.invalidSave'))
    }
  }, [load, notify, t])

  const handleClear = useCallback(() => {
    reset()
    notify(t('status.cleared'))
  }, [notify, reset, t])

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()
      notify(t('status.validated'))
    },
    [notify, t],
  )

  return (
    <>
      <Header
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onToggleLanguage={onToggleLanguage}
        onClear={handleClear}
        onPrint={() => window.print()}
      />

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <CoachPanel form={form} onChange={setField} report={report} onAI={setAI} />
        <TipBanner />
        <TacticalForm
          form={form}
          onChange={setField}
          onHelp={openModal}
          onSubmit={handleSubmit}
          actions={<FormActions onExport={handleExport} onSave={handleSave} onLoad={handleLoad} />}
        />
        <Footer />
      </main>

      {modal && <Modal title={modal.title} content={modal.content} onClose={closeModal} closeLabel={t('modal.close')} />}
      <Toast message={message} />
    </>
  )
}

export default function App() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <I18nProvider language={language}>
      <TacticalGrid onToggleLanguage={toggleLanguage} />
    </I18nProvider>
  )
}
