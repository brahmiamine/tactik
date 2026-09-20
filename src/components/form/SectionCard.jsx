import Card from '../ui/Card.jsx'
import InfoBadge from '../ui/InfoBadge.jsx'

/** Carte d'une section du formulaire : titre, sous-titre, icône et grille de champs. */
export default function SectionCard({ title, subtitle, icon, children }) {
  return (
    <Card as="section" className="print:break-inside-avoid">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
        </div>
        <InfoBadge icon={icon} />
      </header>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </Card>
  )
}
