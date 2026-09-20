export const localize = (text, language = 'fr') => text[language === 'ar' ? 1 : 0]
const yesNo = [['yes', 'Oui', 'نعم'], ['no', 'Non', 'لا']]
const q = (id, fr, ar, options, when = () => true, max = 120) => ({ id, label: [fr, ar], options, when, max })
export const QUESTIONS = [
  q('liveMinute', 'Minute exacte', 'الدقيقة الحالية', 'number', undefined, 150),
  q('ourScore', 'Buts de ton équipe', 'أهداف فريقك', 'number', undefined, 30),
  q('theirScore', 'Buts adverses', 'أهداف المنافس', 'number', undefined, 30),
  q('ourPlayers', 'Joueurs de ton équipe sur le terrain', 'عدد لاعبي فريقك', [['11','11','11'],['10','10','10'],['9','9 ou moins','9 أو أقل']]),
  q('theirPlayers', 'Joueurs adverses sur le terrain', 'عدد لاعبي المنافس', [['11','11','11'],['10','10','10'],['9','9 ou moins','9 أو أقل']]),
  q('objective', 'Objectif maintenant', 'الهدف الآن', [['score','Chercher à marquer','البحث عن هدف'],['protect','Préserver le résultat','الحفاظ على النتيجة']]),
  q('problem', 'Problème prioritaire', 'المشكلة الأساسية', [['left','Difficulté à gauche','صعوبة في الجهة اليسرى'],['attack','Manque de présence offensive','نقص الحضور الهجومي'],['press','Pressing éliminé','تجاوز المنافس للضغط'],['counter','Contres concédés','هجمات مرتدة ضدنا']]),
  q('repeated', 'Problème répété sur au moins 3 séquences récentes ?', 'هل تكررت المشكلة في 3 لقطات حديثة على الأقل؟', yesNo),
  q('tried', 'Un ajustement a-t-il déjà été tenté pour ce problème ?', 'هل جربت تعديلاً لهذه المشكلة؟', yesNo),
  q('previousAdjustment', 'Quelle consigne et quel effet observé ?', 'ما التعليمات وما النتيجة الملحوظة؟', 'text', f => f.tried === 'yes'),
  q('leftDuel', 'Ton arrière gauche défend surtout…', 'الظهير الأيسر يدافع غالباً…', [['one','En 1 contre 1','واحد ضد واحد'],['two','En 1 contre 2','واحد ضد اثنين']], f => f.problem === 'left'),
  q('wingerTracks', 'Ton ailier gauche revient-il défendre ?', 'هل يعود الجناح الأيسر للدفاع؟', yesNo, f => f.problem === 'left'),
  q('leftBeaten', 'L’arrière gauche est-il régulièrement battu en duel ?', 'هل يُتجاوز الظهير الأيسر باستمرار؟', yesNo, f => f.problem === 'left'),
  q('leftTired', 'Montre-t-il des signes de fatigue ?', 'هل تظهر عليه علامات التعب؟', yesNo, f => f.problem === 'left'),
  q('delivery', 'Le ballon arrive-t-il régulièrement dans la surface ?', 'هل تصل الكرة بانتظام إلى منطقة الجزاء؟', yesNo, f => f.problem === 'attack'),
  q('strikerIsolated', 'L’avant-centre est-il isolé face aux centraux ?', 'هل المهاجم معزول أمام قلبي الدفاع؟', yesNo, f => f.problem === 'attack'),
  q('formation', 'Système actuel avec ballon', 'الخطة الحالية بالكرة', [['433','4-3-3','4-3-3'],['442','4-4-2','4-4-2'],['other','Autre','أخرى']], f => f.problem === 'attack'),
  q('opponentBlock', 'Hauteur du bloc adverse', 'ارتفاع كتلة المنافس', [['low','Bas','منخفض'],['mid','Médian','متوسط'],['high','Haut','عالٍ']], f => f.problem === 'attack'),
  q('cover', 'La couverture derrière le ballon est-elle en place ?', 'هل التغطية خلف الكرة موجودة؟', yesNo, f => ['attack','counter'].includes(f.problem)),
  q('pressTogether', 'Les lignes pressent-elles ensemble ?', 'هل تضغط الخطوط معاً؟', yesNo, f => f.problem === 'press'),
  q('depthExposed', 'L’adversaire exploite-t-il le dos de la défense ?', 'هل يستغل المنافس المساحة خلف الدفاع؟', yesNo, f => f.problem === 'press'),
  q('subsAvailable', 'Un changement est-il encore autorisé maintenant ?', 'هل يسمح بإجراء تبديل الآن؟', yesNo, f => ['left','attack'].includes(f.problem)),
  q('benchReady', 'Un remplaçant adapté est-il prêt (DG / second attaquant) ?', 'هل يوجد بديل جاهز ومناسب (ظهير أيسر / مهاجم ثانٍ)؟', yesNo, f => ['left','attack'].includes(f.problem) && f.subsAvailable === 'yes'),
  q('outgoing', 'Joueur à sortir (DG / relayeur, jamais la sentinelle)', 'اللاعب الخارج (ظهير أيسر / وسط متقدم وليس المحور)', 'text', f => ['left','attack'].includes(f.problem) && f.subsAvailable === 'yes' && f.benchReady === 'yes'),
  q('incoming', 'Nom du remplaçant adapté', 'اسم البديل المناسب', 'text', f => ['left','attack'].includes(f.problem) && f.subsAvailable === 'yes' && f.benchReady === 'yes'),
]
export const COACH_INITIAL = Object.fromEntries(QUESTIONS.map(q => [q.id, '']))
export const visibleQuestions = form => QUESTIONS.filter(q => q.when(form))
export function validAnswer(q, value) {
  if (typeof value !== 'string' || !value.trim() || value === 'unknown') return false
  if (q.options === 'number') return /^\d+$/.test(value) && Number(value) <= q.max
  if (q.options === 'text') return value.trim().length <= q.max
  return q.options.some(([id]) => id === value)
}
