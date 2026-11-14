import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { certificationsList } from '@/data/profile';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/components/ui/primitives';

export function CertificationsSection(): React.JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cards per page: 6 on desktop, 3 on tablet, 1 or 2 on mobile
  const itemsPerPage = 6;
  const totalPages = Math.ceil(certificationsList.length / itemsPerPage);

  const prev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalPages - 1 : prevIndex - 1));
  };

  const next = () => {
    setCurrentIndex((prevIndex) => (prevIndex === totalPages - 1 ? 0 : prevIndex + 1));
  };

  const currentItems = certificationsList.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage,
  );

  return (
    <section
      id="certifications"
      className="relative overflow-hidden bg-[#f7f6f0] py-20 text-[#071910] transition-colors dark:bg-[#06180f] dark:text-white"
    >
      <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8">
        {/* Header and Slider Controls */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Reveal direction="down" distance={10}>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span>CERTIFICATIONS</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.1}>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-[#0a1e12] dark:text-white sm:text-3xl lg:text-4xl">
                Professional Certifications
              </h2>
            </Reveal>

            <Reveal direction="up" delay={0.15}>
              <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-emerald-100/70">
                Key certifications that strengthened my technical and domain expertise.
              </p>
            </Reveal>
          </div>

          {/* Slider Controls */}
          <Reveal direction="left" delay={0.2}>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous certifications"
                className="flex size-9 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700 shadow-sm transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-500/30 dark:bg-[#071d12] dark:text-emerald-300 dark:hover:bg-emerald-900/50 dark:hover:text-white"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={next}
                aria-label="Next certifications"
                className="flex size-9 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700 shadow-sm transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-500/30 dark:bg-[#071d12] dark:text-emerald-300 dark:hover:bg-emerald-900/50 dark:hover:text-white"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </Reveal>
        </div>

        {/* Certifications Cards Row */}
        <div className="mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
            >
              {currentItems.map((cert) => {
                const targetUrl = cert.assetUrl ?? cert.verifyUrl ?? '#';
                return (
                  <a
                    key={cert.id}
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center justify-between rounded-2xl border border-stone-200/80 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg dark:border-emerald-500/20 dark:bg-[#0b2115]"
                  >
                    {/* Logo/Icon Container */}
                    <div className="flex h-16 w-full items-center justify-center">
                      {cert.logo ? (
                        <img
                          src={cert.logo}
                          alt={cert.issuer}
                          className="max-h-12 max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                          <Icon icon={cert.icon} size={24} />
                        </div>
                      )}
                    </div>

                    {/* Title & Issuer */}
                    <div className="mt-4 flex flex-col items-center">
                      <span className="font-display text-xs font-bold leading-snug text-[#0a1e12] group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-300">
                        {cert.title}
                      </span>
                      <span className="mt-1 text-[0.6875rem] font-medium text-stone-500 dark:text-emerald-100/60">
                        {cert.issuer}
                      </span>
                    </div>

                    {/* External Link subtle pill */}
                    <div className="mt-3 flex items-center gap-1 text-[0.625rem] font-semibold text-emerald-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-emerald-400">
                      <span>View Credential</span>
                      <ExternalLink size={10} />
                    </div>
                  </a>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Pagination indicator dots */}
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to page ${i + 1}`}
                className={`size-2 rounded-full transition-all duration-300 ${
                  currentIndex === i
                    ? 'w-6 bg-emerald-600 dark:bg-emerald-400'
                    : 'bg-stone-300 hover:bg-stone-400 dark:bg-emerald-900 dark:hover:bg-emerald-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
