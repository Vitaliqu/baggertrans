import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Умови оренди — Baggertrans',
  description: 'Умови та правила оренди будівельної техніки Baggertrans. Ознайомтесь з порядком замовлення, ціноутворенням та відповідальністю сторін.',
};

const sections = [
  { id: 'general', title: 'Загальні положення' },
  { id: 'rental-terms', title: 'Умови оренди та порядок замовлення' },
  { id: 'pricing', title: 'Ціни та порядок оплати' },
  { id: 'liability', title: 'Відповідальність сторін' },
  { id: 'termination', title: 'Умови розірвання договору' },
  { id: 'insurance', title: 'Страхування' },
];

const pricingTable = [
  {
    name: 'Екскаватор гусеничний (20 т)',
    day: '8 500 грн',
    week: '52 000 грн',
    month: '185 000 грн',
  },
  {
    name: 'Самоскид 20 т',
    day: '4 800 грн',
    week: '29 000 грн',
    month: '105 000 грн',
  },
  {
    name: 'Фронтальний навантажувач',
    day: '5 500 грн',
    week: '34 000 грн',
    month: '120 000 грн',
  },
];

export default function TermsPage() {
  return (
    <div>
      {/* Header */}
      <section className="gradient-navy section-padding" aria-labelledby="terms-heading">
        <div className="container-site">
          <div className="max-w-2xl animate-fade-in">
            <span className="inline-block text-[var(--color-orange-300)] text-xs font-semibold uppercase tracking-widest mb-4">
              Документи
            </span>
            <h1
              id="terms-heading"
              className="text-4xl sm:text-5xl font-black text-white tracking-tight"
            >
              Умови оренди
            </h1>
            <p className="mt-5 text-slate-300 text-lg leading-relaxed">
              Будь ласка, ознайомтесь із правилами та умовами оренди будівельної техніки
              Baggertrans перед укладанням договору.
            </p>
          </div>
        </div>
      </section>

      <div className="container-site py-12 lg:py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar: Table of contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-4">
                Зміст
              </p>
              <nav aria-label="Навігація по документу">
                <ol className="flex flex-col gap-1">
                  {sections.map(({ id, title }, i) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className="flex items-start gap-2 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors group"
                      >
                        <span className="text-[var(--color-accent)] font-bold shrink-0 w-4">{i + 1}.</span>
                        <span className="group-hover:underline underline-offset-2">{title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <article className="lg:col-span-3 flex flex-col gap-12">

            {/* Mobile table of contents */}
            <div className="lg:hidden bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">
                Зміст
              </p>
              <ol className="flex flex-col gap-1">
                {sections.map(({ id, title }, i) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="flex items-center gap-2 py-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                    >
                      <ChevronRight size={12} aria-hidden="true" className="text-[var(--color-accent)] shrink-0" />
                      <span>{i + 1}. {title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            {/* Section 1 */}
            <section id="general" aria-labelledby="section-general">
              <h2 id="section-general" className="text-2xl font-black text-[var(--color-text)] tracking-tight mb-5 pb-3 border-b border-[var(--color-border)]">
                1. Загальні положення
              </h2>
              <div className="prose-like text-sm text-[var(--color-text-muted)] leading-relaxed flex flex-col gap-4">
                <p>
                  Товариство з обмеженою відповідальністю "Баггертранс" (далі — Орендодавець)
                  надає послуги оренди будівельної та спеціальної техніки відповідно до чинного
                  законодавства України та цих Умов. Укладаючи договір оренди або надсилаючи
                  заявку на бронювання, Орендар підтверджує своє ознайомлення та беззаперечну
                  згоду з цими умовами.
                </p>
                <p>
                  Ці Умови поширюються на всі правовідносини між Орендодавцем та Орендарем,
                  що виникають у зв'язку з орендою техніки, наданням додаткових послуг
                  (доставка, оператор, паливо, страхування), а також з будь-якими супутніми
                  відносинами. У разі суперечності між цими Умовами та окремими положеннями
                  укладеного між сторонами договору, пріоритет мають умови такого договору.
                </p>
                <p>
                  Орендодавець залишає за собою право в будь-який час змінювати ці Умови шляхом
                  розміщення актуальної версії на офіційному вебсайті. Продовження використання
                  послуг після публікації змін означає прийняття нових умов. Орендар зобов'язується
                  самостійно відстежувати зміни в цих умовах.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="rental-terms" aria-labelledby="section-rental">
              <h2 id="section-rental" className="text-2xl font-black text-[var(--color-text)] tracking-tight mb-5 pb-3 border-b border-[var(--color-border)]">
                2. Умови оренди та порядок замовлення
              </h2>
              <div className="text-sm text-[var(--color-text-muted)] leading-relaxed flex flex-col gap-4">
                <p>
                  Замовлення техніки здійснюється шляхом заповнення онлайн-форми на вебсайті,
                  телефонного дзвінка або подачі заявки електронною поштою. Після отримання
                  заявки менеджер Орендодавця зв'язується з Орендарем протягом 15 хвилин у
                  робочий час для узгодження деталей замовлення.
                </p>
                <p>
                  Мінімальний строк оренди становить 1 (один) робочий день (8 годин роботи
                  техніки). Максимальний строк оренди встановлюється за домовленістю сторін.
                  Режим роботи техніки — стандартна зміна з 08:00 до 18:00 (10 машино-годин
                  з урахуванням перерв). Понаднормова робота узгоджується окремо та
                  оплачується за підвищеним тарифом відповідно до умов договору.
                </p>
                <p>
                  Орендар зобов'язаний забезпечити відповідні умови на об'єкті для безпечної
                  роботи техніки, в тому числі: під'їзні шляхи достатньої ширини та несучої
                  спроможності, відсутність підземних комунікацій у зоні виконання робіт,
                  технічне завдання та схему об'єкту при необхідності. Орендодавець не несе
                  відповідальності за наслідки, що виникли внаслідок ненадання або надання
                  недостовірної інформації про об'єкт.
                </p>
              </div>
            </section>

            {/* Section 3: Pricing */}
            <section id="pricing" aria-labelledby="section-pricing">
              <h2 id="section-pricing" className="text-2xl font-black text-[var(--color-text)] tracking-tight mb-5 pb-3 border-b border-[var(--color-border)]">
                3. Ціни та порядок оплати
              </h2>
              <div className="text-sm text-[var(--color-text-muted)] leading-relaxed flex flex-col gap-4 mb-8">
                <p>
                  Ціни на оренду техніки вказані у гривнях і не включають ПДВ для фізичних
                  осіб. Юридичні особи та ФОП на загальній системі оподаткування отримують
                  рахунок з ПДВ. Остаточна вартість замовлення визначається в договорі оренди
                  та може відрізнятися від орієнтовної вартості, вказаної на сайті, залежно
                  від конкретних умов і строку оренди.
                </p>
                <p>
                  Оплата здійснюється: для юридичних осіб та ФОП — 50% авансу до початку оренди,
                  залишок — не пізніше 3 банківських днів після закінчення оренди. Для фізичних
                  осіб — 100% передоплата. Постійним клієнтам з перевіреною платіжною
                  дисципліною може бути надана відстрочка платежу до 14 календарних днів.
                  Готівкова оплата приймається лише за умови попереднього узгодження.
                </p>
                <p>
                  Орендодавець залишає за собою право коригувати тарифи без попереднього
                  повідомлення. Заявки, прийняті до набрання чинності новими тарифами,
                  виконуються за попередніми цінами, що зафіксовані в договорі або підтверджені
                  рахунком. Тарифи на додаткові послуги вказані на вебсайті та є
                  орієнтовними.
                </p>
              </div>

              {/* Pricing table */}
              <div className="rounded-xl border border-[var(--color-border)] overflow-hidden shadow-sm">
                <div className="gradient-navy px-5 py-4">
                  <p className="text-white font-bold text-sm">Орієнтовні тарифи оренди</p>
                  <p className="text-slate-400 text-xs mt-1">Ціни вказані без ПДВ, в гривнях</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" aria-label="Тарифи оренди техніки">
                    <thead>
                      <tr className="bg-[var(--color-surface-2)] border-b border-[var(--color-border)]">
                        <th className="text-left px-5 py-3 font-semibold text-[var(--color-text)]">
                          Техніка
                        </th>
                        <th className="text-right px-5 py-3 font-semibold text-[var(--color-text)] whitespace-nowrap">
                          День
                        </th>
                        <th className="text-right px-5 py-3 font-semibold text-[var(--color-text)] whitespace-nowrap">
                          Тиждень
                        </th>
                        <th className="text-right px-5 py-3 font-semibold text-[var(--color-text)] whitespace-nowrap">
                          Місяць
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pricingTable.map(({ name, day, week, month }, i) => (
                        <tr
                          key={name}
                          className={i % 2 === 0 ? 'bg-[var(--color-surface)]' : 'bg-[var(--color-bg)]'}
                        >
                          <td className="px-5 py-4 text-[var(--color-text)] font-medium">{name}</td>
                          <td className="px-5 py-4 text-right text-[var(--color-accent)] font-bold whitespace-nowrap">
                            {day}
                          </td>
                          <td className="px-5 py-4 text-right text-[var(--color-text)] whitespace-nowrap">
                            {week}
                          </td>
                          <td className="px-5 py-4 text-right text-[var(--color-text)] whitespace-nowrap">
                            {month}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="liability" aria-labelledby="section-liability">
              <h2 id="section-liability" className="text-2xl font-black text-[var(--color-text)] tracking-tight mb-5 pb-3 border-b border-[var(--color-border)]">
                4. Відповідальність сторін
              </h2>
              <div className="text-sm text-[var(--color-text-muted)] leading-relaxed flex flex-col gap-4">
                <p>
                  Орендодавець несе відповідальність за технічний стан переданої в оренду
                  техніки на момент її передачі Орендарю. У разі виходу техніки з ладу з вини
                  Орендодавця, останній зобов'язаний у найкоротші строки виконати ремонт або
                  замінити техніку на рівноцінну. Час простою техніки з вини Орендодавця
                  понад 4 години не оплачується.
                </p>
                <p>
                  Орендар несе повну матеріальну відповідальність за пошкодження, знищення або
                  втрату техніки, що сталися під час дії договору оренди, за виключенням
                  природного зносу та поломок, що виникли внаслідок дефектів виробника. Розмір
                  відшкодування визначається на підставі ринкової вартості відновлювального
                  ремонту або заміни пошкоджених вузлів.
                </p>
                <p>
                  Жодна зі сторін не несе відповідальності за невиконання або неналежне
                  виконання своїх зобов'язань, якщо таке невиконання є наслідком обставин
                  непереборної сили (форс-мажор), зокрема: стихійних лих, воєнних дій, масових
                  заворушень, страйків, обмежувальних заходів органів державної влади тощо.
                  Сторона, що посилається на форс-мажор, зобов'язана письмово повідомити
                  іншу сторону протягом 3 (трьох) робочих днів.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="termination" aria-labelledby="section-termination">
              <h2 id="section-termination" className="text-2xl font-black text-[var(--color-text)] tracking-tight mb-5 pb-3 border-b border-[var(--color-border)]">
                5. Умови розірвання договору
              </h2>
              <div className="text-sm text-[var(--color-text-muted)] leading-relaxed flex flex-col gap-4">
                <p>
                  Договір оренди може бути достроково розірваний за взаємною письмовою згодою
                  сторін. При розірванні договору з ініціативи Орендаря раніше, ніж за 24
                  години до початку оренди, авансовий платіж повертається у повному обсязі.
                  При скасуванні менше ніж за 24 години або після початку оренди — утримується
                  плата за фактично замовлений першодень.
                </p>
                <p>
                  Орендодавець має право в односторонньому порядку розірвати договір без
                  повернення внесеного авансу у разі: надання Орендарем недостовірних відомостей
                  при укладанні договору; систематичного порушення правил експлуатації техніки;
                  перевищення допустимих навантажень; використання техніки в цілях, не
                  передбачених договором; або відмови Орендаря допустити технічних спеціалістів
                  Орендодавця для огляду техніки.
                </p>
                <p>
                  Дострокове повернення техніки Орендарем не звільняє його від обов'язку
                  оплатити оренду за весь визначений договором строк, якщо інше не передбачено
                  письмовим додатковим договором між сторонами. У разі затримки повернення
                  техніки понад строк, установлений договором, нараховується штраф у розмірі
                  200% від добової ставки за кожну добу прострочення.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="insurance" aria-labelledby="section-insurance">
              <h2 id="section-insurance" className="text-2xl font-black text-[var(--color-text)] tracking-tight mb-5 pb-3 border-b border-[var(--color-border)]">
                6. Страхування
              </h2>
              <div className="text-sm text-[var(--color-text-muted)] leading-relaxed flex flex-col gap-4">
                <p>
                  Вся техніка Орендодавця застрахована від ризиків пошкодження, знищення та
                  крадіжки відповідно до умов договору страхування з акредитованою страховою
                  компанією. Базове страхове покриття не включає страхові ризики, що виникли
                  внаслідок умисних дій Орендаря або грубої необережності при управлінні
                  технікою.
                </p>
                <p>
                  Орендар має право за окрему плату підключити розширений пакет страхування,
                  який включає: страхування цивільної відповідальності перед третіми особами;
                  страхування вантажів, переміщуваних технікою; страхування нещасних випадків
                  з оператором техніки. Тарифи страхування визначаються відповідно до умов
                  страхової компанії-партнера Орендодавця.
                </p>
                <p>
                  У разі настання страхового випадку Орендар зобов'язаний негайно повідомити
                  Орендодавця та за необхідності органи правопорядку (у разі крадіжки або
                  ДТП), не пізніше 3 (трьох) годин з моменту виявлення пошкодження. Самостійне
                  усунення пошкоджень або залучення третіх осіб для ремонту без письмового
                  дозволу Орендодавця забороняється та може бути підставою для відмови у
                  страховому відшкодуванні.
                </p>
              </div>
            </section>

            {/* CTA */}
            <div className="mt-4 p-8 rounded-2xl gradient-navy text-center">
              <p className="text-white font-bold text-lg mb-2">Маєте питання про умови?</p>
              <p className="text-slate-300 text-sm mb-6">
                Наші юристи та менеджери готові роз'яснити будь-які положення договору.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/contacts"
                  className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  Зв'язатися з нами
                </Link>
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] text-sm font-bold hover:bg-[var(--color-accent-hover)] transition-colors shadow-[0_4px_14px_0_rgba(244,184,21,0.35)]"
                >
                  Замовити техніку
                  <ChevronRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
