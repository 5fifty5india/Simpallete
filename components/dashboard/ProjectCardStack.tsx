'use client';

import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Project } from '@/types';

interface ProjectCardStackProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
}

type ViewMode = 'stack' | 'gallery';

// Stack tuning
const OFFSET = 6;
const SCALE_STEP = 0.04;
const DIM_STEP = 0.18;
const VISIBLE = 5;
const SWIPE_THRESHOLD = 50;
const BORDER_RADIUS = 16;
const SCROLL_DELTA_THRESHOLD = 60; // accumulated px before triggering
const SCROLL_RESET_MS = 200;       // reset accumulator after idle

// Subtle neon purple glow
const GLOW_FRONT = '0 0 20px rgba(168,85,247,0.15), 0 0 60px rgba(168,85,247,0.06), 0 25px 50px rgba(0,0,0,0.5)';
const GLOW_BACK = '0 0 12px rgba(168,85,247,0.08), 0 10px 25px rgba(0,0,0,0.3)';

const spring = { type: 'spring' as const, stiffness: 200, damping: 30 };

export default function ProjectCardStack({ projects, onSelectProject }: ProjectCardStackProps) {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('stack');
  const [cards, setCards] = useState(projects);
  const [dragDirection, setDragDirection] = useState<'up' | 'down' | null>(null);
  const dragY = useMotionValue(0);
  const rotateX = useTransform(dragY, [-200, 0, 200], [6, 0, -6]);

  // Scroll accumulator — prevents trackpad momentum from cycling multiple cards
  const scrollAccum = useRef(0);
  const scrollTimer = useRef<ReturnType<typeof setTimeout>>();
  const isScrollLocked = useRef(false);

  // Sync cards when projects change (e.g. new project added)
  useEffect(() => {
    setCards(projects);
  }, [projects]);

  // Filter by search
  const filtered = useMemo(() => {
    if (!search.trim()) return cards;
    const q = search.toLowerCase();
    return cards.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        p.projectType.toLowerCase().includes(q)
    );
  }, [cards, search]);

  const currentIndex = projects.findIndex((p) => p.id === filtered[0]?.id);

  const moveToEnd = useCallback(() => {
    setCards((prev) => [...prev.slice(1), prev[0]]);
  }, []);

  const moveToStart = useCallback(() => {
    setCards((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)]);
  }, []);

  const handleDragEnd = useCallback((_: unknown, info: { velocity: { y: number }; offset: { y: number } }) => {
    const offset = info.offset.y;
    if (Math.abs(offset) > SWIPE_THRESHOLD) {
      if (offset < 0) {
        setDragDirection('up');
        setTimeout(() => { moveToEnd(); setDragDirection(null); }, 120);
      } else {
        setDragDirection('down');
        setTimeout(() => { moveToStart(); setDragDirection(null); }, 120);
      }
    }
    dragY.set(0);
  }, [dragY, moveToEnd, moveToStart]);

  // Accumulate scroll delta — only fire once per "scroll gesture"
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (isScrollLocked.current) return;

    scrollAccum.current += e.deltaY;

    // Reset accumulator after scroll stops
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      scrollAccum.current = 0;
    }, SCROLL_RESET_MS);

    if (Math.abs(scrollAccum.current) >= SCROLL_DELTA_THRESHOLD) {
      const direction = scrollAccum.current > 0 ? 'down' : 'up';
      scrollAccum.current = 0;
      isScrollLocked.current = true;

      if (direction === 'down') {
        moveToEnd();
      } else {
        moveToStart();
      }

      // Lock for a beat so momentum doesn't fire again
      setTimeout(() => { isScrollLocked.current = false; }, 400);
    }
  }, [moveToEnd, moveToStart]);

  const handleCardClick = useCallback((projectId: string, isFront: boolean) => {
    if (isFront) onSelectProject(projectId);
  }, [onSelectProject]);

  if (projects.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Search bar + view toggle — z-10 so stack tail goes under it */}
      <div className="relative z-10 w-full max-w-[680px] flex items-center gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5">
          <button
            onClick={() => setViewMode('stack')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'stack' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
            title="Stack view"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('gallery')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'gallery' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
            title="Gallery view"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* No results */}
      {filtered.length === 0 ? (
        <div className="py-16">
          <p className="text-neutral-500 text-sm">No projects match &ldquo;{search}&rdquo;</p>
        </div>
      ) : viewMode === 'stack' ? (
        /* ── Stack View ── */
        <>
          <div
            className="relative w-[340px] sm:w-[560px] lg:w-[680px] h-[260px] sm:h-[400px] lg:h-[480px] mt-12"
            onWheel={handleWheel}
          >
            <AnimatePresence>
              {filtered.slice(0, VISIBLE).map((project, i) => {
                const isFront = i === 0;
                const brightness = Math.max(0.3, 1 - i * DIM_STEP);
                const baseZ = filtered.length - i;

                return (
                  <motion.div
                    key={project.id}
                    className="absolute inset-0 overflow-hidden border border-purple-500/20"
                    style={{
                      borderRadius: BORDER_RADIUS,
                      cursor: isFront ? 'grab' : 'default',
                      touchAction: 'none',
                      boxShadow: isFront ? GLOW_FRONT : GLOW_BACK,
                      rotateX: isFront ? rotateX : 0,
                      transformPerspective: 1000,
                    }}
                    animate={{
                      top: `${i * -OFFSET}%`,
                      scale: 1 - i * SCALE_STEP,
                      filter: `brightness(${brightness})`,
                      zIndex: baseZ,
                      opacity: (dragDirection && isFront) ? 0 : 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                      transition: { duration: 0.2 },
                    }}
                    transition={spring}
                    drag={isFront ? 'y' : false}
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.6}
                    onDrag={(_, info) => {
                      if (isFront) dragY.set(info.offset.y);
                    }}
                    onDragEnd={isFront ? handleDragEnd : undefined}
                    whileDrag={isFront ? { zIndex: filtered.length + 1, cursor: 'grabbing', scale: 1.02 } : {}}
                    onClick={() => handleCardClick(project.id, isFront)}
                  >
                    <StackCard project={project} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {projects.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'bg-white w-5'
                    : 'bg-white/20 w-1.5'
                }`}
              />
            ))}
          </div>

          <p className="text-neutral-600 text-xs">Scroll or drag to browse</p>
        </>
      ) : (
        /* ── Gallery View ── */
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <GalleryCard
              key={project.id}
              project={project}
              onClick={() => onSelectProject(project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Stack card content ────────────────────────────────────────

function StackCard({ project }: { project: Project }) {
  const typeLabel = project.projectType === 'series' ? 'Series' : 'Film';
  const typeBadgeColors = project.projectType === 'series'
    ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
    : 'bg-amber-500/20 text-amber-300 border-amber-400/30';

  const isEmpty =
    project.characters.length === 0 &&
    project.scenes.length === 0 &&
    project.teamMembers.length === 0;

  return (
    <div className="w-full h-full bg-neutral-900 p-6 sm:p-8 lg:p-10 flex flex-col justify-between select-none">
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">{project.name || 'Untitled Project'}</h3>
          <span className={`text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border shrink-0 ${typeBadgeColors}`}>
            {typeLabel}
          </span>
        </div>
        {project.description && (
          <p className="text-sm sm:text-base text-neutral-400 mt-3 line-clamp-2 leading-relaxed">{project.description}</p>
        )}
      </div>

      <div>
        {isEmpty ? (
          <p className="text-neutral-600 text-sm italic">Empty project — tap to start building</p>
        ) : (
          <>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-neutral-500">
              <StatBadge icon="person" count={project.characters.length} label="character" />
              <StatBadge icon="scene" count={project.scenes.length} label="scene" />
              {project.projectType === 'series' && project.episodes.length > 0 && (
                <StatBadge icon="episode" count={project.episodes.length} label="ep" />
              )}
            </div>
            <TeamAvatars members={project.teamMembers} size="sm" />
          </>
        )}
      </div>
    </div>
  );
}

// ── Gallery card ──────────────────────────────────────────────

function GalleryCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const typeLabel = project.projectType === 'series' ? 'Series' : 'Film';
  const typeBadgeColors = project.projectType === 'series'
    ? 'bg-blue-500/20 text-blue-200 border-blue-400/30'
    : 'bg-amber-500/20 text-amber-200 border-amber-400/30';

  const isEmpty =
    project.characters.length === 0 &&
    project.scenes.length === 0 &&
    project.teamMembers.length === 0;

  return (
    <button
      onClick={onClick}
      className="bg-neutral-900 rounded-xl border border-purple-500/15 p-6 text-left hover:border-purple-500/30 transition-all group w-full"
      style={{ boxShadow: '0 0 12px rgba(168,85,247,0.06)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-white group-hover:text-white/90 truncate">
          {project.name || 'Untitled Project'}
        </h3>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${typeBadgeColors}`}>
          {typeLabel}
        </span>
      </div>

      {project.description ? (
        <p className="text-sm text-neutral-500 mt-2 line-clamp-2">{project.description}</p>
      ) : isEmpty ? (
        <p className="text-sm text-neutral-600 mt-2 italic">Empty project</p>
      ) : null}

      {!isEmpty && (
        <div className="flex items-center gap-4 mt-4 text-xs text-neutral-400">
          <StatBadge icon="person" count={project.characters.length} label="character" />
          <StatBadge icon="scene" count={project.scenes.length} label="scene" />
          {project.projectType === 'series' && project.episodes.length > 0 && (
            <StatBadge icon="episode" count={project.episodes.length} label="ep" />
          )}
        </div>
      )}

      <TeamAvatars members={project.teamMembers} size="xs" />
    </button>
  );
}

// ── Shared sub-components ─────────────────────────────────────

function StatBadge({ icon, count, label }: { icon: 'person' | 'scene' | 'episode'; count: number; label: string }) {
  const paths: Record<string, string> = {
    person: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    scene: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z',
    episode: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  };
  return (
    <span className="flex items-center gap-1.5">
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths[icon]} />
      </svg>
      {count} {label}{count !== 1 ? 's' : ''}
    </span>
  );
}

function TeamAvatars({ members, size }: { members: Project['teamMembers']; size: 'xs' | 'sm' }) {
  if (members.length === 0) return null;
  const dim = size === 'sm' ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-7 h-7';
  const textSize = size === 'sm' ? 'text-[10px] sm:text-xs' : 'text-[10px]';

  return (
    <div className="flex items-center mt-4 -space-x-2">
      {members.slice(0, 5).map((m) => (
        <div
          key={m.id}
          className={`${dim} rounded-full bg-neutral-700 border-2 border-neutral-900 flex items-center justify-center shrink-0`}
          title={`${m.name} — ${m.role}`}
        >
          <span className={`text-white font-medium ${textSize}`}>
            {m.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
          </span>
        </div>
      ))}
      {members.length > 5 && (
        <div className={`${dim} rounded-full bg-neutral-800 border-2 border-neutral-900 flex items-center justify-center shrink-0`}>
          <span className={`text-neutral-400 ${textSize}`}>+{members.length - 5}</span>
        </div>
      )}
    </div>
  );
}
