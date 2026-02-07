'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/appStore';

const NAV_ITEMS = [
  { href: '/project', label: 'Project' },
  { href: '/characters', label: 'Characters' },
  { href: '/scenes', label: 'Scenes' },
  { href: '/import', label: 'Import' },
  { href: '/selector', label: 'Selector' },
];

export default function AppNavigation() {
  const pathname = usePathname();
  const { activeProjectId, project, deselectProject } = useApp();

  const isDashboard = pathname === '/' || !activeProjectId;

  return (
    <header className="bg-neutral-900/80 backdrop-blur-sm border-b border-white/5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo area */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Back to dashboard */}
            {!isDashboard && (
              <Link
                href="/"
                onClick={() => deselectProject()}
                className="text-neutral-500 hover:text-white transition-colors mr-1"
                title="Back to projects"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            )}

            <Link href="/" onClick={!isDashboard ? () => deselectProject() : undefined} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-neutral-900 font-bold text-sm">SP</span>
              </div>
              <span className="text-lg font-bold text-white hidden sm:block">Simpalette</span>
            </Link>

            {/* Project breadcrumb */}
            {!isDashboard && activeProjectId && (
              <>
                <span className="text-neutral-600 hidden sm:block">/</span>
                <span className="text-sm text-neutral-400 hidden sm:block truncate max-w-[200px]">
                  {project.name || 'Untitled'}
                </span>
              </>
            )}
          </div>

          {/* Nav Links — only shown inside a project */}
          {!isDashboard && (
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                const isSelector = item.href === '/selector';
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? isSelector
                          ? 'bg-white text-neutral-900'
                          : 'bg-white/10 text-white'
                        : isSelector
                          ? 'text-white border border-white/20 hover:bg-white hover:text-neutral-900'
                          : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
