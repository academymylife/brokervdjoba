var K = '', busy = false, step = 0, hist = [], prof = {o:null,g:null,f:null}, mtype = 'broker';

var SYS = [
  'Ти си Radost, AI асистент на приложението Брокер в джоба. МИСИЯ: Да научиш купувачите как да купуват имот безопасно, успешно и без грешки. Водиш ги стъпка по стъпка от първата идея до ключа в ръката. Покриваш Варна, София, Пловдив и Бургас. Аксаково само при директен въпрос.',
  'ХАРАКТЕР: Топъл, проактивен, компетентен. Говориш като опитен приятел-брокер на безупречен книжовен български. Обръщаш се на ти. Никога не питай дали потребителят купува за първи път. ЗАБРАНЕНИ: Ево, мишкаш, знаам, Kako, наличност(→в брой), серьозна(→сериозна). Ако задълбава в цени — насочвай към процеса.',
  'ВАЛУТА: САМО евро. България е в еврозоната от 01.01.2026. Никога не използвай лева.',
  'УЕБ ТЪРСЕНЕ: При въпрос за локация/квартал — търси в Уикипедия. При цени — търси bazar.bg, olx.bg, home2u.bg само с after:2026-01-01. При лихви — moitepari.bg. При нотариални такси — calculator.bg/2/imoti.html. При ремонти — calculator.bg/2/remonti.html. НИКОГА не споменавай сайтовете по ime, не ги цитирай и не насочвай потребителя към тях. Представяй информацията като своя — само резултата, без источника. НИКОГА не измисляй цени.',
  'ПРОАКТИВНО: При оглед → чеклист. При бюджет → изчисли. При вторичен имот → предложи калкулатор ремонт. При нотариален акт → предложи калкулатор такси. При ипотека → предложи проверка лихви. При харесах имот → предложи оценка.',
  'ЧЕКЛИСТ ОГЛЕД: посока(юг/изток=светло), влага, ВиК, електро, дограма, отопление, паркинг, асансьор, съседи, сметки. ПАНЕЛ: пукнатини, санирана ли е. НОВО: Акт 16, репутация строителя. КЪЩА: покрив, фундамент, двор.',
  'КАЛКУЛАТОР: Реална цена = бюджет*0.93. Ипотека 30г: 2.5%=цена*0.00395, 3%=цена*0.00422, 3.5%=цена*0.00449. Минимална квадратура 25 кв.м. Под 50 000 евро няма жилищен апартамент в Варна.',
  'ЦЕНИ: НЕ цитирай вградени цени. Винаги търси bazar.bg, olx.bg, home2u.bg с after:2026-01-01.',
  'ВАРНА КВАРТАЛИ: СЕМЕЙНИ: Владиславово, Кайсиева градина, Възраждане, Младост, Пчелина, Трошево, Левски, Цветен квартал, Колхозен пазар, Погреби, Христо Ботев, ХЕИ, Стадион Спартак, Виница, Аспарухово. ЦЕНТРАЛНИ: Гръцка махала(НАЙ-СКЪПО!), Винс-Червен площад, Фестивален комплекс, Спортна зала, Окр.болница-Генерали, Чаталджа, Център, Централна поща, Жп гара, Операта, Автогара, Зимно/Лятно кино Тракия, Завод Дружба. МОРСКИ: Чайка, Бриз, Аспарухово, Галата, Зеленика, Долна/Горна Трака, Евксиноград, К.К.Константин и Елена, Победа/Конфуто/Гранд Мол. КУРОРТНИ: Златни пясъци, Слънчев ден, Ален мак.',
  'ВАРНА ГЕОГРАФИЈА: Виница е СЕВЕРОИЗТОК, ~2км от К.К.Константин и Елена. НЕ е южно, НЕ е до магистрала. Аспарухово е на юг. Чайка и Бриз са северно. Ако не си сигурна — НЕ посочвай.',
  'СОФИЯ: НЯМА МОРЕ. Метрото е ключов фактор.',
  'КАПАРО: 10%, само по банков път — НИКОГА в брой. Клауза за връщане при банков отказ. НЯМА 48ч за размисъл.',
  'ДЕПОЗИТ ЗА ПРЕГОВОРИ: мин. 1000 евро към агенцията с договор. НЕ е капаро към продавача.',
  'ПРЕДВАРИТЕЛЕН ДОГОВОР: 1)ЕГН 2)Идентификатор в кадастъра 3)Документи за собственост и тежести ПРЕДИ подписване 4)Цена с цифри И думи 5)Капаро 10% по банков път 6)Точна дата за нотариален акт 7)Клауза за връщане при отказ или неизрядност 8)Неустойки 9)Опис обзавеждане 10)Санкции. ДОКУМЕНТИ ПРИ ПРЕДВАРИТЕЛЕН ДОГОВОР: Нотариален акт — поискай копие и оригинал за справка. Данъчна оценка — желателна, но не задължителна. Скица от Агенция по Кадастър — желателна, но не задължителна; при липса може онлайн справка от електронния кадастър. Справка за тежести — може онлайн от Агенция по вписванията или при нотариус, за последните 10 години. ДОКУМЕНТИ ПРИ НОТАРИАЛЕН АКТ: Всички документи задължително са официални и оригинални — нотариален акт оригинал, данъчна оценка оригинал, скица оригинал, удостоверение за тежести оригинал от Агенция по вписванията за последните 10 години.',
  'НОТАРИАЛЕН АКТ: ПРЕДИ обяд. Клауза Евикция — споменавай я САМО при нотариален акт, никога при предварителен договор или другаде. Плащане по банков път. Нотариусът по район на имота.',
  'ДОКУМЕНТИ НА КУПУВАЧА: При покупка от физическо лице се изискват САМО: 1)Валиден документ за самоличност — паспорт или лична карта 2)Документ за доход — последен фиш или справка от работодател (за банката). ПРИ ИПОТЕКА допълнително: 3)Банкови извлечения — последни 3 месеца 4)Данъчна декларация — последната (само ако си самоосигуряващо се лице) 5)Трудов договор — копие. НА НОТАРИАЛНИЯ АКТ: само оригинален документ за самоличност — ЕГН се вижда от него, НЕ го споменавай отделно. НИКОГА не споменавай Справка за несъстояние — тя НЕ е изискуем документ при покупка на имот от физическо лице. СЪВЕТ СЛЕД ДОКУМЕНТИ: Предлагай предварително банково одобрение — дава сигурност и убеждение с продавача. После питай: Имаш ли вече оглед на имот или все още търсиш?',
  'ПРОЦЕС: 1)Бюджет 2)Предв.одобрение ПРЕДИ капаро! 3)Търсене в имотни портали 4)Оглед 2 пъти с технически експерт 5)Документи 6)Предв.договор с адвокат 7)Нотариален акт 8)Деклариране Общината. СРОКОВЕ: 2-3 седмици.',
  'РАЗХОДИ: данък 2-3%, нотариални ~2%, АВп 0.1%, адвокат 300-800 евро, комисионна ~3%. Общо 5-8%.',
  'КОМБИНИРАНЕ КРЕДИТИ: При липса самоучастие — потребителски + ипотечен кредит. Независим кредитен консултант е безплатен за купувача.',
  'ПРЕГОВОРИ: Реалното намаление е 3-5% от обявената цена. В редки случаи може да достигне повече от 5%, но не разчитай на повече от 10%. Аргументи: ремонт, лош етаж, без асансьор/паркинг, само север, дълго на пазара. Не показвай ентусиазъм.',
  'ОЦЕНКА НА ИМОТ: При харесах имот — събери: 1)Квартал 2)Площ 3)Стаи 4)Цена 5)Изложение 6)Етаж/общо 7)Асансьор 8)Състояние 9)Паркомясто 10)Изба/таван 11)Строителство. Търси актуални обяви в имотни портали after:2026-01-01 без да споменаваш сайтовете по ime. Дай оценка: ИЗГОДНА/СПРАВЕДЛИВА/НАДЦЕНЕНА.',
  'ДИСКЛЕЙМЕР: Посочените оферти и цени се основават на актуални пазарни обяви. Не се подвеждай по цена на квадрат! Регресия на цените — по-малка квадратура = по-висока цена на кв.м. СЛЕД СРАВНЕНИЕ: Запомни: при еднотипни обяви цената се различава според: строителство, изложение, етаж, състояние, асансьор. Понякога дори една улица прави разлика! Винаги сравнявай имоти, които си видял на живо!',
  'НЕ ПРАВИШ: правни съвети, препоръки на банки/брокери по ime, теми извън имоти, лева.',
  'ГРАМАТИКА: във пред думи започващи с в/ф (във Варна, във Фонда). в пред всички останали (в София, в Бургас, в Пловдив). със пред думи започващи с с/з (със самоучастие, със задатък). с пред всички останали (с ипотека, с банката). Винаги запетая пред: че, който, която, което.',
  'ФОРМАТИРАНЕ: Кратко при прости въпроси. При сложни — структурирано. Предлагай 2-3 следващи въпроса. Бъди проактивен.',
  'ВЪПРОСИ ЗА БЮДЖЕТ: Питай "Колко евро можеш да вложиш — с ипотека или изцяло в брой и колко е сумата?" НИКОГА не пиши "само в брой".',
  'ВЪПРОСИ ЗА ЛОКАЦИЯ: Питай за конкретен квартал само в избрания от потребителя град. НИКОГА не предлагай друг град като алтернатива — ако е избран Пловдив, питай само за квартали в Пловдив. Опцията друг град категорично отпада.',
  'ВЪПРОСИ ЗА ТИП ИМОТ: При апартамент — питай колко стаи. При къща — питай дали с двор. Питай дали гараж/паркомясто са важни.',
  'ВЪПРОСИ ЗА СЪСТОЯНИЕ: Предлагай три варианта: ново строителство (готово за нанасяне?), вторичен имот (готов или с ремонт?), нуждае се от ремонт (колко средства може да отдели?). При ремонт — предложи калкулатор за ремонт.'
].join('\n\n');

var OB = [
  {m:'Здравей! Аз съм Radost — тук съм, за да те науча как да купиш имот безопасно и успешно, без да пропуснеш нищо важно.\n\nТук съм, за да те водя уверено от първата идея до ключа в ръката.\n\nМога да ти помогна с:\n- Процесът на покупка\n- Финансиране и кредитиране\n- Скрити капани при сделка\n- Сравнение на имоти\n- Генериране на чеклисти\n- Разходи при покупката\n- Съвети за успешна сделка\n- Предварителни и окончателни договори\n- Калкулатори по разходи и такси\n- Актуални оферти от банки\n- Калкулатор за ремонт\n\nКупувал ли си имот преди?', c:['Не, за пръв път','Имам малко опит','Да, имам опит'], k:'o'},
  {m:'В кой град търсиш?', c:['Варна','София','Пловдив','Бургас','Друг град'], k:'g'},
  {m:'Как планираш да финансираш покупката?', c:['Собствени средства','С ипотека','Комбинирано','Още не знам'], k:'f'}
];

function startApp() {
  var k = document.getElementById('akey').value.trim();
  if (!k || k.length < 4) { alert('Моля въведи паролата за достъп.'); return; }
  K = k;
  document.getElementById('AS').style.display = 'none';
  document.getElementById('AP').style.display = 'flex';
  var saved = loadProfile();
  if (saved) {
    prof = saved; step = 3;
    document.getElementById('chat').innerHTML = '';
    addTS('Добре дошъл обратно!');
    showBadge();
    var g = prof.g, f = prof.f, hasIp = (f === 'С ипотека' || f === 'Комбинирано');
    var gc = (g !== 'Друг град') ? g : 'избрания град';
    addBot('Здравей отново! Помня те — търсиш в ' + g + ', финансиране: ' + f + '.\n\nС какво мога да помогна днес?');
    var cbar = document.querySelector('.cbar');
    if (cbar) { cbar.style.display = (g === 'Варна') ? 'flex' : 'none'; }
    var fc = hasIp ? ['Изчисли бюджета ми', 'Цени в ' + gc + '?', 'Типични грешки при покупка'] : ['Изчисли бюджета ми', 'Цени в ' + gc + '?', 'Какви документи трябват?'];
    setTimeout(function() { addQuickChips(fc); }, 400);
  } else { beginOB(); }
}

function addQuickChips(fc) {
  var c = document.getElementById('chat');
  var r = document.createElement('div'); r.className = 'ch'; r.id = 'chips';
  for (var i = 0; i < fc.length; i++) {
    (function(v) {
      var b = document.createElement('button'); b.className = 'cp'; b.textContent = v;
      b.onclick = function() { rmChips(); addUser(v); callAPI(v); };
      r.appendChild(b);
    })(fc[i]);
  }
  c.appendChild(r); sc();
}

function saveProfile() {
  try { localStorage.setItem('radost_prof', JSON.stringify(prof)); } catch(e) {}
}

function loadProfile() {
  try {
    var s = localStorage.getItem('radost_prof');
    if (s) { var p = JSON.parse(s); if (p.o && p.g && p.f) return p; }
  } catch(e) {}
  return null;
}

function clearProfile() {
  try { localStorage.removeItem('radost_prof'); } catch(e) {}
}

function beginOB() {
  step = 0; prof = {o:null,g:null,f:null}; hist = [];
  document.getElementById('chat').innerHTML = '';
  addTS('Днес');
  setTimeout(function() { showOB(0); }, 400);
}

function showOB(s) {
  addBot(OB[s].m);
  setTimeout(function() { addChips(OB[s].c, s); }, 300);
}

function addChips(arr, s) {
  var c = document.getElementById('chat');
  var r = document.createElement('div'); r.className = 'ch'; r.id = 'chips';
  for (var i = 0; i < arr.length; i++) {
    (function(v, idx) {
      var b = document.createElement('button'); b.className = 'cp'; b.textContent = v;
      b.onclick = function() { pickOB(v, idx); };
      r.appendChild(b);
    })(arr[i], s);
  }
  c.appendChild(r); sc();
}

function pickOB(v, s) {
  rmChips(); addUser(v); prof[OB[s].k] = v;
  if (s < OB.length - 1) { setTimeout(function() { showOB(s + 1); }, 500); }
  else { step = 3; setTimeout(finishOB, 600); }
}

function finishOB() {
  var g = prof.g, f = prof.f, hasIp = (f === 'С ипотека' || f === 'Комбинирано');
  saveProfile();
  showBadge();
  var cbar = document.querySelector('.cbar');
  if (cbar) { cbar.style.display = (g === 'Варна') ? 'flex' : 'none'; }
  var m = 'Страхотно!\n\n';
  if (g !== 'Друг град') { m += 'Търсиш в ' + g + ', финансиране: ' + f + '.\n\n'; }
  m += 'Твоят план:\n1. ' + (hasIp ? 'Предварително одобрение от банка (ПРЕДИ капаро!)' : 'Определяне на точния бюджет');
  m += '\n2. Търсене и огледи (поне 2 пъти)\n3. Проверка на документи преди капаро\n4. Предварителен договор с адвокат\n5. Нотариален акт\n\n';
  m += hasIp ? 'Важно: Предварително одобрение ПРЕДИ капаро!' : 'С ' + (f === 'Собствени средства' ? 'собствени средства' : 'комбинирано финансиране') + ' процесът е по-директен.';
  addBot(m);
  setTimeout(function() {
    addPro('Искаш ли да изчислим заедно реалния ти бюджет?');
  }, 800);
  var gc = (g !== 'Друг град') ? g : 'избрания град';
  var fc = hasIp ? ['Изчисли бюджета ми', 'Цени в ' + gc + '?', 'Типични грешки при покупка'] : ['Изчисли бюджета ми', 'Цени в ' + gc + '?', 'Какви документи трябват?'];
  setTimeout(function() { addQuickChips(fc); }, 1200);
}

function showBadge() {
  var c = document.getElementById('chat');
  var b = document.createElement('div'); b.className = 'bg';
  b.textContent = '\u2713 ' + prof.o + ' \u00b7 ' + prof.g + ' \u00b7 ' + prof.f;
  c.appendChild(b); sc();
}

function addPro(text) {
  var c = document.getElementById('chat');
  var p = document.createElement('div'); p.className = 'pr';
  p.innerHTML = '\ud83d\udca1 ' + fmt(text);
  c.appendChild(p); sc();
}

function addTS(t) {
  var c = document.getElementById('chat');
  var e = document.createElement('div'); e.className = 'ts'; e.textContent = t; c.appendChild(e);
}

function addBot(text) {
  var c = document.getElementById('chat');
  var r = document.createElement('div'); r.className = 'rw';
  var a = document.createElement('div'); a.className = 'av bav'; a.textContent = 'R';
  var b = document.createElement('div'); b.className = 'bb b'; b.innerHTML = fmt(text);
  r.appendChild(a); r.appendChild(b); c.appendChild(r); sc();
}

function addUser(text) {
  var c = document.getElementById('chat');
  var r = document.createElement('div'); r.className = 'rw u';
  var a = document.createElement('div'); a.className = 'av uav'; a.textContent = '\u0422\u0418';
  var b = document.createElement('div'); b.className = 'bb u'; b.textContent = text;
  r.appendChild(b); r.appendChild(a); c.appendChild(r); sc();
}

function showTyping() {
  var c = document.getElementById('chat');
  var r = document.createElement('div'); r.className = 'rw'; r.id = 'typing';
  var a = document.createElement('div'); a.className = 'av bav'; a.textContent = 'R';
  var b = document.createElement('div'); b.className = 'bb b';
  b.innerHTML = '<div class="td"><span></span><span></span><span></span></div>';
  r.appendChild(a); r.appendChild(b); c.appendChild(r); sc();
}

function hideTyping() { var e = document.getElementById('typing'); if (e) e.remove(); }
function rmChips() { var e = document.getElementById('chips'); if (e) e.remove(); }
function sc() { var c = document.getElementById('chat'); setTimeout(function() { c.scrollTop = c.scrollHeight; }, 50); }

function showErr(m) {
  var c = document.getElementById('chat');
  var e = document.createElement('div'); e.className = 'er'; e.textContent = '\u26a0 ' + m; c.appendChild(e); sc();
}

async function callAPI(txt) {
  if (busy) return; busy = true;
  document.getElementById('sb').disabled = true;
  rmChips(); showTyping();
  var ctx = step >= 3 ? '[Профил: Опит=' + prof.o + ', Град=' + prof.g + ', Финансиране=' + prof.f + ']' : '';
  hist.push({role: 'user', content: txt});
  try {
    var messages = hist.slice();
    var reply = '';
    var maxIter = 5;
    while (maxIter-- > 0) {
      var res = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          password: K,
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1000,
          system: SYS + (ctx ? '\n\n' + ctx : ''),
          tools: [{type: 'web_search_20250305', name: 'web_search'}],
          messages: messages
        })
      });
      if (!res.ok) {
        var ed = await res.json().catch(function() { return {}; });
        var errMsg = ed.error ? (ed.error.message || ed.error) : ('Грешка ' + res.status);
        throw new Error(res.status + '|' + errMsg);
      }
      var data = await res.json();
      if (data.content) {
        for (var ci = 0; ci < data.content.length; ci++) {
          if (data.content[ci].type === 'text' && data.content[ci].text) {
            reply += data.content[ci].text;
          }
        }
      }
      if (data.stop_reason === 'end_turn') break;
      if (data.stop_reason === 'tool_use') {
        messages.push({role: 'assistant', content: data.content});
        var toolResults = [];
        for (var ti = 0; ti < data.content.length; ti++) {
          if (data.content[ti].type === 'tool_use') {
            toolResults.push({type: 'tool_result', tool_use_id: data.content[ti].id, content: ''});
          }
        }
        if (toolResults.length > 0) {
          messages.push({role: 'user', content: toolResults});
        }
      } else { break; }
    }
    if (!reply) { reply = 'Съжалявам, не получих отговор.'; }
    hist.push({role: 'assistant', content: reply});
    hideTyping(); addBot(reply);
    if (hist.length > 20) { hist = hist.slice(-16); }
  } catch(e) {
    hideTyping();
    var msg = e.message || '';
    if (msg.indexOf('401') >= 0 || msg.indexOf('Грешна парола') >= 0) {
      showErr('Грешна парола. Провери паролата и презареди страницата.');
    } else if (msg.indexOf('429') >= 0) {
      showErr('Много заявки едновременно. Изчакай 30 секунди и опитай пак.');
    } else if (msg.indexOf('529') >= 0 || msg.toLowerCase().indexOf('overload') >= 0) {
      showErr('В момента има голямо натоварване. Изчакай малко и опитай отново — обикновено минава за под минута.');
    } else if (msg.indexOf('500') >= 0 || msg.indexOf('502') >= 0 || msg.indexOf('503') >= 0) {
      showErr('Временен проблем със сървъра. Опитай пак след няколко секунди.');
    } else if (msg.indexOf('network') >= 0 || msg.indexOf('fetch') >= 0 || msg.indexOf('Failed') >= 0) {
      showErr('Няма интернет връзка. Провери връзката и опитай пак.');
    } else {
      showErr('Нещо се обърка. Опитай пак или презареди страницата.');
    }
  }
  busy = false;
  document.getElementById('sb').disabled = false;
}

function snd() {
  var i = document.getElementById('ui'); var t = i.value.trim();
  if (!t || busy) return;
  i.value = ''; i.style.height = 'auto';
  rmChips(); addUser(t); callAPI(t);
}

function hk(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); snd(); } }
function ar(el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 110) + 'px'; }

function resetChat() {
  var choice = confirm('Нов разговор?\n\nOK = нов разговор (профилът се помни)\nОтказ = изтрий профила и започни отначало');
  if (choice) {
    hist = [];
    document.getElementById('chat').innerHTML = '';
    addTS('Нов разговор');
    var g = prof.g, f = prof.f, hasIp = (f === 'С ипотека' || f === 'Комбинирано');
    var gc = (g !== 'Друг град') ? g : 'избрания град';
    addBot('Нов разговор! Помня те — търсиш в ' + g + ', финансиране: ' + f + '. С какво мога да помогна?');
    var fc = hasIp ? ['Изчисли бюджета ми', 'Цени в ' + gc + '?', 'Типични грешки'] : ['Изчисли бюджета ми', 'Цени в ' + gc + '?', 'Какви документи трябват?'];
    setTimeout(function() { addQuickChips(fc); }, 300);
  } else {
    clearProfile();
    prof = {o:null,g:null,f:null};
    hist = [];
    beginOB();
  }
}

function fmt(t) {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n(\d+)\. /g, '<br><strong>$1.</strong> ')
    .replace(/\n- /g, '<br>&bull; ')
    .replace(/\n/g, '<br>');
}

function openModal(type) {
  mtype = type;
  document.getElementById('mtitle').textContent = type === 'broker' ? 'Консултация с брокер' : 'Консултация с кредитен консултант';
  document.getElementById('mdesc').textContent = type === 'broker' ? 'Оставете контакт и брокерът ще се свърже с вас в рамките на работния ден.' : 'Безплатна консултация за ипотека. Оставете контакт и ще се свържем с вас.';
  document.getElementById('mform').style.display = 'block';
  document.getElementById('msucc').style.display = 'none';
  document.getElementById('ovl').style.display = 'flex';
}

function closeModal() {
  document.getElementById('ovl').style.display = 'none';
  document.getElementById('mname').value = '';
  document.getElementById('mphone').value = '';
  document.getElementById('memail').value = '';
  document.getElementById('mtime').value = '';
}

function submitForm() {
  var name = document.getElementById('mname').value.trim();
  var phone = document.getElementById('mphone').value.trim();
  if (!name || !phone) { alert('Моля въведи ime и телефон.'); return; }
  var time = document.getElementById('mtime').value || 'По всяко време';
  var email = document.getElementById('memail').value.trim();
  var label = mtype === 'broker' ? 'БРОКЕР' : 'КРЕДИТЕН КОНСУЛТАНТ';
  var subj = encodeURIComponent('Заявка за ' + label + ' - ' + name);
  var body = encodeURIComponent('Заявка за консултация с ' + label + '\n\nИме: ' + name + '\nТелефон: ' + phone + '\n' + (email ? 'Имейл: ' + email + '\n' : '') + 'Кога: ' + time + '\n\nПрофил: ' + (prof.o||'') + ' | ' + (prof.g||'') + ' | ' + (prof.f||''));
  window.open('mailto:imot.space@gmail.com?subject=' + subj + '&body=' + body, '_blank');
  document.getElementById('mform').style.display = 'none';
  document.getElementById('msucc').style.display = 'block';
  document.getElementById('msucctxt').textContent = mtype === 'broker' ? 'Заявката е изпратена! Брокерът ще се свърже с теб скоро.' : 'Заявката е изпратена! Кредитният консултант ще се свърже с теб скоро.';
}

document.getElementById('akey').addEventListener('keydown', function(e) { if (e.key === 'Enter') { startApp(); } });
