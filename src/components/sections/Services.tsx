import { Check } from 'lucide-react';
import { services } from '@/data/profile';
import { Section, SectionHeader } from '@/components/ui/Section';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { Icon, SpotlightCard } from '@/components/ui/primitives';

export function Services(): React.JSX.Element {
  return (
    <Section id="services" grid tone="amber">
      <SectionHeader
        index="06"
        eyebrow="Services"
        title="What I can"
        titleAccent="build for you."
        description="Available for AI and full-stack product work — whole builds or a specific layer that needs an engineer who understands the rest of the stack."
      />

      <RevealGroup as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
        {services.map((service, index) => (
          <RevealItem as="li" key={service.id}>
            <SpotlightCard className="h-full p-7">
              {/* Index watermark */}
              <span
                aria-hidden="true"
                className="font-display absolute top-5 right-6 text-5xl leading-none font-bold text-stroke opacity-40 transition-opacity duration-500 group-hover/card:opacity-70"
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <span className="grid size-12 place-items-center rounded-2xl border border-line bg-canvas text-accent-2 transition-transform duration-500 group-hover/card:scale-110">
                <Icon icon={service.icon} size={21} />
              </span>

              <h3 className="mt-5 text-lg font-semibold text-ink">{service.title}</h3>

              <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-muted">
                {service.description}
              </p>

              <ul className="mt-6 flex flex-col gap-2.5 border-t border-line pt-5">
                {service.deliverables.map((deliverable) => (
                  <li
                    key={deliverable}
                    className="flex items-start gap-2.5 text-[0.8125rem] text-ink-muted"
                  >
                    <Check size={14} className="mt-0.5 shrink-0 text-accent" />
                    {deliverable}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
