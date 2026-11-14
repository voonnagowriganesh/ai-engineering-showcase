import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CheckCircle2, X } from 'lucide-react';
import { projects } from '@/data/profile';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/components/ui/primitives';
import type { Project } from '@/domain/models';

export function FeaturedProjects(): React.JSX.Element {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const getTagStyle = (category: string) => {
    switch (category) {
      case 'AI Product':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-500/30';
      case 'AI Engineering':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300 border-sky-500/30';
      case 'Agentic AI':
      case 'Automation':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-500/30';
      case 'Full-Stack':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-500/30';
      case 'AI / RAG':
      case 'ML / Data':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-500/30';
      case 'Computer Vision':
        return 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950/70 dark:text-fuchsia-300 border-fuchsia-500/30';
      default:
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-[#f7f6f0] py-20 text-[#071910] transition-colors dark:bg-[#06180f] dark:text-white"
    >
      <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Reveal direction="down" distance={10}>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span>FEATURED PROJECTS</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.1}>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-[#0a1e12] dark:text-white sm:text-3xl lg:text-4xl">
                Real-World Projects & Products
              </h2>
            </Reveal>
          </div>

          <Reveal direction="left" delay={0.15}>
            <a
              href="https://github.com/voonnagowriganesh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 transition-colors hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              <span>View All Projects</span>
              <ArrowRight size={14} />
            </a>
          </Reveal>
        </div>

        {/* 5 Project Cards Horizontal/Grid */}
        {/* 6 real projects, 3 columns — divides evenly into two full rows
            rather than leaving an odd card alone on its own row. */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 6).map((project, index) => (
            <Reveal key={project.id} direction="up" delay={0.08 * index}>
              {/* A real <button>, not a plain div with onClick: the custom
                  cursor's hover-grow state and keyboard activation both key
                  off interactive elements, and a div matched neither. */}
              <button
                type="button"
                onClick={() => setSelectedProject(project)}
                className="group flex h-full w-full flex-col justify-between overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl dark:border-emerald-500/20 dark:bg-[#0b2115]"
              >
                <div>
                  {/* Category Pill */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.6875rem] font-bold ${getTagStyle(
                        project.category,
                      )}`}
                    >
                      {project.category}
                    </span>
                  </div>

                  {/* Generative artwork — derived from the project's own
                      palette, so no card depends on a generated image that
                      might bake in text of its own. */}
                  <div
                    className="relative mt-3.5 flex h-32 items-center justify-center overflow-hidden rounded-2xl border border-stone-200/80 dark:border-emerald-500/30"
                    style={{
                      background: `linear-gradient(135deg, ${project.palette[0]}, ${project.palette[1]})`,
                    }}
                  >
                    <span className="grid size-12 place-items-center rounded-2xl border border-white/25 bg-white/15 text-white backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-1">
                      <Icon icon={project.icon} size={22} />
                    </span>
                    <span className="absolute top-3 right-3 rounded-full border border-white/25 bg-black/25 px-2 py-0.5 font-mono text-[0.625rem] text-white backdrop-blur-md">
                      {project.year}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-4 font-display text-sm font-bold leading-snug text-[#0a1e12] group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-300">
                    {project.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-stone-600 dark:text-emerald-100/70">
                    {project.subtitle}
                  </p>
                </div>

                {/* Bottom Circular Arrow Button */}
                <div className="mt-5 flex items-center justify-end pt-3 border-t border-stone-100 dark:border-emerald-500/15">
                  <div className="flex size-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-slate-950 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedProject ? (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-emerald-500/30 bg-[#071910] p-6 text-white shadow-2xl sm:p-8"
            >
              <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${getTagStyle(
                    selectedProject.category,
                  )}`}
                >
                  {selectedProject.category}
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="rounded-full p-2 text-slate-400 hover:bg-emerald-900/40 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-5">
                <h3 className="font-display text-2xl font-bold text-white">
                  {selectedProject.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {selectedProject.summary}
                </p>

                {/* Metrics */}
                {selectedProject.metrics?.length ? (
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {selectedProject.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="rounded-2xl border border-emerald-500/20 bg-emerald-950/40 p-3 text-center"
                      >
                        <span className="font-display block text-xl font-bold text-emerald-400">
                          {m.value}
                        </span>
                        <span className="mt-1 block text-[0.6875rem] text-slate-400">{m.label}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Highlights */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                    Key Highlights
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {selectedProject.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-xs text-slate-200">
                        <CheckCircle2 size={15} className="mt-0.5 text-emerald-400 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stack */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                    Technologies
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedProject.stack.map((item) => (
                      <span
                        key={item}
                        className="rounded-lg border border-emerald-500/20 bg-emerald-950/60 px-2.5 py-1 text-xs font-medium text-emerald-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
