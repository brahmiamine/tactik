import { localize as l, visibleQuestions, validAnswer } from './questions.js'

export function analyzeMatch(form, language = 'fr') {
  const missing = visibleQuestions(form).filter(q => !validAnswer(q, form[q.id])).map(q => ({ id: q.id, label: l(q.label, language) }))
  if (visibleQuestions(form).some(q => q.id === 'incoming') && form.incoming?.trim() && form.incoming.trim().toLowerCase() === form.outgoing?.trim().toLowerCase()) missing.push({ id: 'incoming', label: l(['Le remplaçant doit être différent du joueur sortant', 'يجب أن يختلف البديل عن اللاعب الخارج'], language) })
  const result = { status: 'needs_information', missing, candidates: [], source: 'rules' }
  if (missing.length) return result
  result.status = 'observe'
  // Numerical imbalance and a previously attempted adjustment require a fuller assessment.
  if (form.ourPlayers !== '11' || form.theirPlayers !== '11' || form.repeated !== 'yes' || form.tried === 'yes') return result
  const add = (id, title, why, action, risk, check) => result.candidates.push({ id, title: l(title, language), why: l(why, language), action: l(action, language), risk: l(risk, language), check: l(check, language) })
  if (form.problem === 'left') {
    if (form.leftDuel === 'two' || form.wingerTracks === 'no') add('cover-left',
      ['Renforcer la couverture à gauche','تعزيز التغطية يساراً'],
      ['Le latéral manque de soutien ou subit un surnombre.','الظهير يفتقد المساندة أو يواجه تفوقاً عددياً.'],
      ['Faire suivre le latéral adverse par ton ailier ; le relayeur ferme le demi-espace gauche.','اطلب من الجناح متابعة ظهير المنافس ومن لاعب الوسط تغطية نصف المساحة اليسرى.'],
      ['Moins de présence de l’ailier à la récupération.','حضور أقل للجناح عند استعادة الكرة.'],
      ['Observer si les 1 contre 2 diminuent sur les prochaines séquences.','راقب انخفاض حالات واحد ضد اثنين في اللقطات التالية.'])
    if (form.leftDuel === 'one' && form.wingerTracks === 'yes' && form.leftBeaten === 'yes') {
      if (form.leftTired === 'yes' && form.subsAvailable === 'yes' && form.benchReady === 'yes') add('replace-left',
        ['Remplacer l’arrière gauche','تبديل الظهير الأيسر'],
        ['Duels perdus répétés malgré le soutien, avec fatigue signalée.','خسارة متكررة للمواجهات رغم المساندة مع تعب ملحوظ.'],
        [`Faire entrer ${form.incoming} à la place de ${form.outgoing}, au poste de DG. Limiter ses premières montées.`, `إدخال ${form.incoming} مكان ${form.outgoing} كظهير أيسر مع تقليل التقدم في البداية.`],
        ['Le nouvel entrant doit retrouver les repères de la ligne défensive.','يحتاج البديل للتنسيق مع خط الدفاع.'],
        ['Vérifier les duels et la protection de la profondeur à gauche.','راقب المواجهات وحماية العمق يساراً.'])
      add('protect-left', ['Protéger le duel à gauche','حماية المواجهة يساراً'], ['Les duels restent défavorables.','المواجهات الفردية ما زالت صعبة.'], ['Limiter les montées du DG et rapprocher le relayeur en couverture intérieure.','قلل تقدم الظهير وقرّب لاعب الوسط للتغطية الداخلية.'], ['Moins de largeur offensive à gauche.','عرض هجومي أقل يساراً.'], ['Observer si les débordements diminuent.','راقب انخفاض الاختراقات الجانبية.'])
    }
  }
  if (form.problem === 'attack') {
    if (form.delivery === 'no') add('connect', ['Reconnecter le milieu et l’attaque','ربط الوسط بالهجوم'], ['Le ballon arrive trop rarement dans la surface.','الكرة لا تصل كثيراً إلى منطقة الجزاء.'], ['Rapprocher un relayeur du porteur et conserver une solution large pour progresser avant d’ajouter un attaquant.','قرّب لاعب وسط من حامل الكرة مع الحفاظ على خيار جانبي للتقدم.'], ['Un relayeur qui vient en soutien attaque moins la surface.','لاعب الوسط المساند سيكون أقل حضوراً في المنطقة.'], ['Compter les entrées dans la surface sur les prochaines attaques.','راقب عدد مرات دخول المنطقة في الهجمات القادمة.'])
    else if (form.strikerIsolated === 'yes' && form.objective === 'score' && form.cover === 'yes') {
      if (Number(form.liveMinute) >= 60 && Number(form.ourScore) < Number(form.theirScore) && form.formation === '433' && form.subsAvailable === 'yes' && form.benchReady === 'yes') add('two-strikers', ['Passer du 4-3-3 au 4-4-2','التحول من 4-3-3 إلى 4-4-2'], ['Équipe menée après 60 minutes, ballon amené dans la surface et avant-centre isolé.','الفريق متأخر بعد الدقيقة 60 والكرة تصل للمنطقة والمهاجم معزول.'], [`Remplacer le relayeur ${form.outgoing} par ${form.incoming} devant. Replacer les ailiers en milieux de côté ; garder la sentinelle et l’autre relayeur dans l’axe.`, `استبدل لاعب الوسط ${form.outgoing} بالمهاجم ${form.incoming}. أعد الجناحين إلى جانبي الوسط وأبق المحور ولاعب الوسط الآخر في العمق.`], ['Perte d’un joueur au milieu ; protéger les transitions et éviter la montée simultanée des deux latéraux.','نقص لاعب في الوسط؛ احمِ التحولات وتجنب تقدم الظهيرين معاً.'], ['Vérifier la présence sur les centres et les contres concédés.','راقب الحضور عند العرضيات والهجمات المرتدة ضدك.'])
      add('support-nine', ['Projeter un relayeur près du 9','دعم المهاجم بلاعب وسط متقدم'], ['Le 9 est isolé mais les ballons arrivent dans la surface.','المهاجم معزول رغم وصول الكرة للمنطقة.'], ['Faire accompagner les attaques par un relayeur, avec la sentinelle en couverture ; conserver le système.','اطلب من لاعب وسط مرافقة الهجمات مع تغطية المحور والحفاظ على الخطة.'], ['Espace libéré au milieu à la perte.','مساحة في الوسط عند فقدان الكرة.'], ['Observer les soutiens du 9 et la couverture à la perte.','راقب مساندة المهاجم والتغطية عند الفقد.'])
    }
  }
  if (form.problem === 'press' && (form.pressTogether === 'no' || form.depthExposed === 'yes')) add('mid-block', ['Revenir en bloc médian','العودة إلى كتلة متوسطة'], ['Pressing désynchronisé ou profondeur exposée.','ضغط غير متزامن أو عمق مكشوف.'], ['Rapprocher les lignes, fermer l’axe et déclencher ensemble sur une passe adverse vers le côté.','قرّب الخطوط وأغلق العمق واضغط جماعياً عند تمرير المنافس إلى الجانب.'], ['Les centraux adverses auront plus de temps avec le ballon.','وقت أكبر لقلبي دفاع المنافس بالكرة.'], ['Vérifier les réceptions entre les lignes et les appels dans le dos.','راقب الاستلام بين الخطوط والانطلاقات خلف الدفاع.'])
  if (form.problem === 'counter' && form.cover === 'no') add('secure', ['Sécuriser la perte du ballon','تأمين لحظة فقدان الكرة'], ['La couverture derrière le ballon est absente.','التغطية خلف الكرة غائبة.'], ['Garder la sentinelle devant les centraux et faire monter un seul latéral à la fois.','أبق المحور أمام قلبي الدفاع واسمح بتقدم ظهير واحد فقط.'], ['Moins de joueurs projetés simultanément.','عدد أقل من اللاعبين المتقدمين معاً.'], ['Observer si les contres adverses sont ralentis et orientés vers les côtés.','راقب إبطاء مرتدات المنافس وتوجيهها نحو الأطراف.'])
  if (result.candidates.length) result.status = 'ready'
  return result
}

export function validateSelection(text, candidates) {
  const value = JSON.parse(text)
  if (!value || Object.keys(value).length !== 1 || typeof value.decisionId !== 'string' || !candidates.some(c => c.id === value.decisionId)) throw new Error('INVALID_AI_OUTPUT')
  return value.decisionId
}
export function buildReport(form, language, ai) {
  const analysis = analyzeMatch(form, language)
  const current = ai?.fingerprint === JSON.stringify(form) && analysis.candidates.some(c => c.id === ai.decisionId)
  return { schemaVersion: 2, exportedAt: new Date().toISOString(), language, observations: form, analysis: { ...analysis, source: current ? 'local-ai' : 'rules', decision: analysis.candidates.find(c => c.id === (current ? ai.decisionId : analysis.candidates[0]?.id)) ?? null, model: current ? ai.model : null } }
}
