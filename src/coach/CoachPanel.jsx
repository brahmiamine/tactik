import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n/index.js'
import Button from '../components/ui/Button.jsx'
import { localize, visibleQuestions } from './questions.js'
import { createLocalSession, MODEL } from './local-ai.js'

export default function CoachPanel({ form, onChange, report, onAI }) {
  const { language } = useI18n()
  const l = (fr, ar) => localize([fr, ar], language)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const session = useRef(null)
  const sequence = useRef(0)
  const fingerprint = JSON.stringify(form)
  const current = useRef(fingerprint)
  current.current = fingerprint
  const analysis = report.analysis

  useEffect(() => {
    // Edits invalidate pending results as well as the displayed AI decision.
    sequence.current += 1
    session.current?.dispose()
    session.current = null
    setBusy(false)
    setError('')
  }, [fingerprint])
  useEffect(() => () => { sequence.current += 1; session.current?.dispose() }, [])

  const cancel = () => {
    sequence.current += 1
    session.current?.dispose()
    session.current = null
    setBusy(false)
  }
  const runAI = async () => {
    const request = ++sequence.current
    const snapshot = fingerprint
    setBusy(true); setProgress(0); setError('')
    session.current ??= createLocalSession()
    const timer = setTimeout(() => {
      if (request === sequence.current) { cancel(); setError('timeout') }
    }, 180000)
    try {
      const id = await session.current.select(form, analysis.candidates, p => {
        if (request === sequence.current) setProgress(p)
      })
      if (request === sequence.current && snapshot === current.current) onAI({ decisionId: id, model: MODEL, fingerprint: snapshot })
    } catch (e) {
      if (request === sequence.current) {
        setError(e.message === 'NO_WEBGPU' ? 'gpu' : 'failed')
        session.current?.dispose(); session.current = null
      }
    } finally {
      clearTimeout(timer)
      if (request === sequence.current) setBusy(false)
    }
  }
  const download = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }))
    const a = document.createElement('a'); a.href = url; a.download = 'tactik-decision.json'; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return (
    <section className="mb-8 rounded-2xl border border-indigo-300 bg-indigo-50 p-4 sm:p-6 dark:border-indigo-800 dark:bg-slate-900" aria-labelledby="coach-title">
      <h2 id="coach-title" className="text-xl font-bold">{l('Décision immédiate', 'قرار فوري')}</h2>
      <p className="mt-2 text-sm">{l('Décris une situation récente. Les questions suivantes s’adaptent au problème choisi. Les conseils restent des hypothèses à vérifier sur le terrain.', 'صف موقفاً حديثاً. تتكيف الأسئلة مع المشكلة المختارة. النصائح فرضيات يجب التحقق منها في الملعب.')}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {visibleQuestions(form).map(q => (
          <label key={q.id} className="flex flex-col gap-2 text-sm font-medium" htmlFor={`coach-${q.id}`}>
            {localize(q.label, language)}
            {Array.isArray(q.options) ? <select id={`coach-${q.id}`} value={form[q.id] ?? ''} onChange={e => onChange(q.id, e.target.value)} className="rounded-lg border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">
              <option value="">{l('Choisir…', 'اختر…')}</option>
              <option value="unknown">{l('Je ne sais pas / non observé', 'لا أعرف / لم ألاحظ')}</option>
              {q.options.map(([value, fr, ar]) => <option key={value} value={value}>{l(fr, ar)}</option>)}
            </select> : <input id={`coach-${q.id}`} type={q.options} min={q.options === 'number' ? 0 : undefined} max={q.options === 'number' ? q.max : undefined} maxLength={q.options === 'text' ? q.max : undefined} value={form[q.id] ?? ''} placeholder={l('Laisser vide si inconnu', 'اتركه فارغاً إن لم تعرف')} onChange={e => onChange(q.id, e.target.value)} className="rounded-lg border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-950" />}
          </label>
        ))}
      </div>
      <div className="mt-6 rounded-xl bg-white p-4 dark:bg-slate-950" aria-live="polite">
        {analysis.status === 'needs_information' ? <>
          <h3 className="font-semibold">{l('À préciser avant de décider', 'معلومات مطلوبة قبل القرار')}</h3>
          <ul className="mt-2 list-inside list-disc text-sm">{analysis.missing.map(q => <li key={q.id}><a className="underline" href={`#coach-${q.id}`}>{q.label}</a></li>)}</ul>
        </> : analysis.decision ? <>
          <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">{analysis.source === 'local-ai' ? l('Priorité sélectionnée par l’IA locale', 'الأولوية اختارها الذكاء المحلي') : l('Proposition fondée sur tes réponses', 'اقتراح مبني على إجاباتك')}</p>
          <h3 className="mt-2 text-lg font-bold">{analysis.decision.title}</h3>
          <dl className="mt-3 space-y-3 text-sm">
            {[[l('Pourquoi', 'السبب'),'why'],[l('À faire maintenant', 'ما تفعله الآن'),'action'],[l('Risque', 'المخاطر'),'risk'],[l('À vérifier ensuite', 'ما تراقبه لاحقاً'),'check']].map(([label,key]) => <div key={key}><dt className="font-semibold">{label}</dt><dd>{analysis.decision[key]}</dd></div>)}
          </dl>
          {analysis.candidates.filter(c => c.id !== analysis.decision.id).map(c => <details key={c.id} className="mt-4 text-sm"><summary className="cursor-pointer font-semibold">{l('Alternative : ', 'بديل: ')}{c.title}</summary><p className="mt-2">{c.action}</p><p>{l('Risque : ', 'المخاطر: ')}{c.risk}</p></details>)}
        </> : <>
          <h3 className="font-semibold">{l('Observer avant de changer', 'راقب قبل التغيير')}</h3>
          <p className="mt-2 text-sm">{form.tried === 'yes' ? l('Une consigne a déjà été tentée. Compare ses effets avant une nouvelle décision ; cette première version ne traite pas automatiquement ce cas.', 'سبق تجربة تعديل. قارن نتائجه قبل قرار جديد؛ هذه النسخة لا تعالج هذه الحالة تلقائياً.') : form.ourPlayers !== '11' || form.theirPlayers !== '11' ? l('Cette première version couvre le 11 contre 11. Une infériorité ou supériorité numérique demande une analyse spécifique.', 'هذه النسخة تغطي 11 ضد 11. التفوق أو النقص العددي يحتاج تحليلاً خاصاً.') : l('Aucun ajustement suffisamment étayé. Observe plusieurs séquences : localisation des pertes, soutien du porteur et couverture défensive.', 'لا يوجد تعديل تدعمه المعطيات بما يكفي. راقب عدة لقطات: مكان فقدان الكرة ومساندة حاملها والتغطية الدفاعية.')}</p>
        </>}
      </div>
      <div className="mt-4 space-y-3 print:hidden">
        <p className="text-xs">{l('IA locale facultative : téléchargement initial volumineux (plusieurs centaines de Mo, voire plus de 1 Go). Internet est nécessaire au premier chargement. Le calcul reste sur cet appareil ; aucune réponse n’est envoyée à une API d’IA. Navigateur WebGPU requis. La vitesse dépend de l’appareil.', 'ذكاء محلي اختياري: تنزيل أولي كبير (مئات الميغابايت وقد يتجاوز 1 غيغابايت). يتطلب الإنترنت أول مرة. الحساب على جهازك ولا ترسل الإجابات إلى خدمة ذكاء اصطناعي. يتطلب WebGPU والسرعة حسب الجهاز.')}</p>
        <p className="text-xs">{l('L’IA compare uniquement les options admissibles ci-dessus. Avec une seule option, le conseil est déjà disponible sans téléchargement.', 'يقارن الذكاء الخيارات المقبولة أعلاه فقط. إذا كان هناك خيار واحد فالنصيحة جاهزة دون تنزيل.')}</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={runAI} disabled={busy || analysis.candidates.length < 2}>{l('Analyser avec l’IA locale', 'تحليل بالذكاء المحلي')}</Button>
          {busy && <Button onClick={cancel}>{l('Annuler', 'إلغاء')}</Button>}
          <Button onClick={download}>{l('Télécharger le rapport JSON', 'تنزيل تقرير JSON')}</Button>
        </div>
        {busy && <p aria-live="polite" className="text-sm">{progress < 100 ? `${l('Chargement du modèle', 'تحميل النموذج')} : ${progress} %` : l('Analyse locale en cours…', 'التحليل المحلي جارٍ…')}</p>}
        {error && <p role="alert" className="text-sm text-red-700 dark:text-red-300">{error === 'gpu' ? l('WebGPU indisponible sur cet appareil.', 'WebGPU غير متاح على هذا الجهاز.') : error === 'timeout' ? l('Délai dépassé. Tu peux réessayer.', 'انتهت المهلة. يمكنك المحاولة مجدداً.') : l('Analyse IA indisponible (chargement, mémoire ou réponse invalide). Tu peux réessayer.', 'التحليل غير متاح (تحميل أو ذاكرة أو إجابة غير صالحة). حاول مجدداً.')} {l('Les conseils par règles restent disponibles.', 'النصائح المبنية على القواعد تبقى متاحة.')}</p>}
      </div>
    </section>
  )
}
