import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Award,
  TrendingUp,
  Handshake,
  ChevronRight,
  Truck,
  Cog,
  Shield,
  Clock,
  MapPin,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Про компанію — Baggertrans',
  description:
    'Baggertrans — провідна компанія з оренди будівельної техніки в Україні. Понад 10 років досвіду, 150+ одиниць техніки, 500+ завершених проектів.',
};

const stats = [
  { value: '150+', label: 'Одиниць техніки', icon: Truck },
  { value: '10+', label: 'Років на ринку', icon: Award },
  { value: '500+', label: 'Завершених проектів', icon: TrendingUp },
  { value: '50+', label: 'Партнерів', icon: Handshake },
];

const teamMembers = [
  { initials: 'ОК', name: 'Олексій Коваленко', role: 'Генеральний директор' },
  { initials: 'МС', name: 'Марина Савченко', role: 'Керівник відділу продажів' },
  { initials: 'ВП', name: 'Василь Петренко', role: 'Головний інженер парку техніки' },
];

const fleetCategories = [
  { label: 'Екскаватори гусеничні та колісні', detail: '20–50 тонн' },
  { label: 'Міні-екскаватори', detail: '1.5–8 тонн' },
  { label: 'Самоскиди', detail: 'до 30 тонн вантажопідйомності' },
  { label: 'Фронтальні навантажувачі', detail: '2–5 м³ ківш' },
  { label: 'Телескопічні маніпулятори', detail: 'до 18 м висота підйому' },
  { label: 'Бульдозери', detail: 'клас D6–D9' },
  { label: 'Автокрани та гусеничні крани', detail: '25–250 тонн' },
  { label: 'Котки та ґрунтоущільнювачі', detail: '2–12 тонн' },
];

const values = [
  {
    icon: Shield,
    title: 'Надійність',
    desc: 'Вся техніка проходить регулярне технічне обслуговування та сертифікацію.',
  },
  {
    icon: Clock,
    title: 'Пунктуальність',
    desc: 'Техніка подається вчасно. Ми поважаємо ваш графік і дедлайни.',
  },
  {
    icon: MapPin,
    title: 'Географія',
    desc: 'Обслуговуємо об\'єкти по всій Україні — від Києва до регіонів.',
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="gradient-navy section-padding" aria-labelledby="about-hero-heading">
        <div className="container-site">
          <div className="max-w-3xl animate-fade-in">
            <span className="inline-block text-[var(--color-orange-300)] text-xs font-semibold uppercase tracking-widest mb-4">
              Про нас
            </span>
            <h1
              id="about-hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight"
            >
              Про компанію{' '}
              <span className="text-gradient-orange">Baggertrans</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl">
              Ми — команда професіоналів, яка вже понад 10 років забезпечує будівельні компанії
              та підрядників надійною важкою технікою. Від невеликих котлованів до масштабних
              інфраструктурних проектів — ми підберемо правильне рішення.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-[var(--color-surface)]" aria-label="Ключові показники">
        <div className="container-site">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map(({ value, label, icon: Icon }, i) => (
              <div
                key={label}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center mb-4">
                  <Icon size={22} className="text-[var(--color-accent)]" aria-hidden="true" />
                </div>
                <p className="text-4xl font-black text-[var(--color-text)] tracking-tight">{value}</p>
                <p className="text-sm text-[var(--color-text-muted)] mt-2 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company story */}
      <section className="section-padding bg-[var(--color-bg)]" aria-labelledby="story-heading">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-block text-[var(--color-accent)] text-xs font-semibold uppercase tracking-widest mb-4">
                Наша історія
              </span>
              <h2
                id="story-heading"
                className="text-3xl sm:text-4xl font-black text-[var(--color-text)] tracking-tight mb-6"
              >
                Від невеликого парку до лідера галузі
              </h2>
              <div className="flex flex-col gap-5 text-[var(--color-text-muted)] leading-relaxed">
                <p>
                  Baggertrans було засновано у 2014 році групою інженерів та підприємців із
                  будівельного сектору. Починали ми з п'яти одиниць техніки та кількох постійних
                  клієнтів у Київській області. Вже з першого року роботи ми зосередились на
                  якості обслуговування та справності парку — і саме це стало нашою головною
                  конкурентною перевагою. Сьогодні наш флот нараховує понад 150 одиниць важкої
                  та спеціальної техніки провідних світових брендів: Caterpillar, Komatsu, Liebherr,
                  Volvo та Hitachi.
                </p>
                <p>
                  За роки роботи ми брали участь у будівництві житлових комплексів, промислових
                  підприємств, доріг та мостів, об'єктів енергетики. Наші клієнти — великі
                  генеральні підрядники, девелопери, державні структури та малий бізнес. Ми
                  однаково відповідально ставимося до кожного замовлення незалежно від його
                  масштабу. Власна ремонтна база та штат кваліфікованих механіків дозволяють нам
                  гарантувати мінімальний простій техніки і вчасне виконання завдань на вашому
                  об'єкті.
                </p>
              </div>
            </div>

            {/* Values */}
            <div className="flex flex-col gap-5">
              {values.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-start gap-5 p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm"
                >
                  <div className="w-11 h-11 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-[var(--color-accent)]" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--color-text)] mb-1">{title}</h3>
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-[var(--color-surface)]" aria-labelledby="team-heading">
        <div className="container-site">
          <div className="text-center mb-12">
            <span className="inline-block text-[var(--color-accent)] text-xs font-semibold uppercase tracking-widest mb-3">
              Команда
            </span>
            <h2
              id="team-heading"
              className="text-3xl sm:text-4xl font-black text-[var(--color-text)] tracking-tight"
            >
              Люди, які за цим стоять
            </h2>
            <p className="mt-4 text-[var(--color-text-muted)] max-w-xl mx-auto">
              Досвідчена команда з глибоким знанням будівельної галузі та техніки.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {teamMembers.map(({ initials, name, role }) => (
              <div
                key={name}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-colors"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-black text-white mb-4 gradient-navy"
                  aria-label={`Аватар ${name}`}
                >
                  {initials}
                </div>
                <p className="font-bold text-[var(--color-text)]">{name}</p>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet */}
      <section className="section-padding bg-[var(--color-bg)]" aria-labelledby="fleet-heading">
        <div className="container-site">
          <div className="text-center mb-12">
            <span className="inline-block text-[var(--color-accent)] text-xs font-semibold uppercase tracking-widest mb-3">
              Парк техніки
            </span>
            <h2
              id="fleet-heading"
              className="text-3xl sm:text-4xl font-black text-[var(--color-text)] tracking-tight"
            >
              Що є в нашому парку
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {fleetCategories.map(({ label, detail }) => (
              <div
                key={label}
                className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 hover:shadow-sm transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center mb-3">
                  <Cog size={16} className="text-[var(--color-accent)]" aria-hidden="true" />
                </div>
                <p className="font-semibold text-sm text-[var(--color-text)] leading-snug">{label}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-navy section-padding" aria-labelledby="about-cta-heading">
        <div className="container-site text-center">
          <h2
            id="about-cta-heading"
            className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4"
          >
            Готові розпочати?
          </h2>
          <p className="text-slate-300 mb-8 max-w-md mx-auto">
            Підберіть техніку у каталозі або зв'яжіться з нами для консультації.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2 h-13 px-8 rounded-xl bg-[var(--color-accent)] text-[var(--color-primary)] text-sm font-bold hover:bg-[var(--color-accent-hover)] transition-colors shadow-[0_4px_20px_0_rgba(244,184,21,0.4)]"
            >
              Замовити техніку
              <ChevronRight size={16} aria-hidden="true" />
            </Link>
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center gap-2 h-13 px-8 rounded-xl border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Переглянути каталог
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
