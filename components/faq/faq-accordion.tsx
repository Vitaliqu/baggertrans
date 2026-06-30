'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: 'Як замовити техніку?',
    a: "Оберіть техніку в каталозі, заповніть форму бронювання або зателефонуйте нам. Після підтвердження ми підпишемо договір та узгодимо час подачі техніки на ваш об'єкт.",
  },
  {
    q: 'Яка мінімальна тривалість оренди?',
    a: 'Мінімальна тривалість — 1 робочий день (8 годин). Для деяких типів техніки доступна погодинна оренда.',
  },
  {
    q: 'Чи є доставка техніки?',
    a: 'Так, ми здійснюємо доставку технікою-тягачем. Вартість доставки розраховується індивідуально залежно від відстані та типу техніки.',
  },
  {
    q: 'Чи потрібен оператор?',
    a: 'Техніку можна орендувати як з оператором (машиністом), так і без нього — якщо у вас є власний кваліфікований оператор та відповідні документи.',
  },
  {
    q: 'Що входить у вартість оренди?',
    a: 'У базову вартість входить оренда техніки на вказаний термін та техобслуговування. Доставка, паливо та оператор — додаткові послуги за окрему плату.',
  },
  {
    q: 'Які способи оплати?',
    a: 'Приймаємо оплату банківським переказом (для юридичних осіб) та готівкою. Для постійних клієнтів доступна відстрочка платежу.',
  },
  {
    q: 'Чи є страхування?',
    a: 'Так, ми пропонуємо страхування техніки та цивільної відповідальності. Вартість страховки включається у вартість оренди або оплачується окремо.',
  },
  {
    q: 'Що робити при поломці?',
    a: 'Негайно повідомте нашого менеджера. Наша технічна служба виїде для усунення несправності. Якщо ремонт потребує тривалого часу — замінимо техніку.',
  },
  {
    q: 'Як скасувати бронювання?',
    a: 'Для скасування зверніться до менеджера не пізніше ніж за 24 години до початку оренди. Умови повернення авансу вказані в договорі.',
  },
  {
    q: 'Чи є знижки?',
    a: 'Так, для постійних клієнтів діє система знижок від 5% до 15%. Для великих проектів та довгострокової оренди — індивідуальні умови.',
  },
];

export function FAQAccordion() {
  return (
    <Accordion.Root type="single" collapsible className="flex flex-col gap-3">
      {faqs.map(({ q, a }, i) => (
        <Accordion.Item
          key={i}
          value={`item-${i}`}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-border-strong)] transition-colors data-[state=open]:border-[var(--color-accent)]/40 data-[state=open]:shadow-sm"
        >
          <Accordion.Header>
            <Accordion.Trigger
              className={cn(
                'w-full flex items-start justify-between gap-4 px-6 py-5 text-left',
                'text-sm font-semibold text-[var(--color-text)] cursor-pointer',
                'hover:text-[var(--color-accent)] transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-inset',
                '[&[data-state=open]]:text-[var(--color-accent)]',
              )}
            >
              <span className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs font-bold shrink-0 select-none">
                  {i + 1}
                </span>
                {q}
              </span>
              <ChevronDown
                size={16}
                className="shrink-0 mt-0.5 text-[var(--color-text-muted)] transition-transform duration-200 [[data-state=open]_&]:rotate-180"
                aria-hidden="true"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=open]:animate-[accordion-down_0.2s_ease] data-[state=closed]:animate-[accordion-up_0.2s_ease]">
            <p className="px-6 pb-5 text-sm text-[var(--color-text-muted)] leading-relaxed pl-[3.75rem]">
              {a}
            </p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
