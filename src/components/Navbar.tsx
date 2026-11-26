import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import { divisions } from '@/data/divisions';
interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description: string }[];
}

const NAV: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Technology',
    href: '/technology',
    children: [
      { label: 'Technology Explorer', href: '/technology', description: 'All twelve fields in one view' },
      ...divisions.map((d) => ({
        label: d.name,
        href: d.slug,
        description: d.tagline,
      })),
    ],
  },
  {
    label: 'YX Projects',
    href: '/projects',
    children: [
      { label: 'LINER', href: '/liner', description: 'Unified digital workspace' },
      { label: 'YQRO', href: '/yqro', description: 'QR & barcode platform' },
      { label: 'YXAI', href: '/yxai', description: 'AI creation & engineering' },
    ],
  },
  { label: 'Projects', href: '/projects' },
  {
    label: 'Labs',
    href: '/labs',
    children: [
      { label: 'YX Labs', href: '/labs', description: 'Research and experimentation' },
      { label: 'YX Journal', href: '/journal', description: 'Articles, publications, and insights' },
      { label: 'Roadmap', href: '/roadmap', description: 'Milestones and long-term direction' },
    ],
  },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar({ onOpenSearch }: { onOpenSearch: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  const enter = (label: string) => {
    window.clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const leave = () => {
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 120);
  };

  const isActivePath = (item: NavItem) =>
    item.href === pathname ||
    (item.children?.some((c) => c.href === pathname) ?? false) ||
    (item.href !== '/' && pathname.startsWith(item.href));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled || open
          ? 'border-b border-line bg-[color-mix(in_srgb,var(--paper)_78%,transparent)] backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-yx flex h-16 items-center justify-between" aria-label="Main">
        <Link to="/" className="flex items-center gap-3" aria-label="YX home">
          <Logo className="h-8 w-8" />
          <span className="text-lg font-semibold tracking-tight">YX</span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => enter(item.label)}
                onMouseLeave={leave}
              >
                <button
                  aria-expanded={openMenu === item.label}
                  aria-haspopup="true"
                  onClick={() => setOpenMenu((m) => (m === item.label ? null : item.label))}
                  className={`nav-link flex items-center gap-1 text-sm transition-colors duration-300 ${
                    isActivePath(item) ? 'text-[var(--ink)]' : 'text-muted hover:text-[var(--ink)]'
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-300 ${openMenu === item.label ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                <div
                  className={`absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3 transition-all duration-300 ${
                    openMenu === item.label
                      ? 'pointer-events-auto translate-y-0 opacity-100'
                      : 'pointer-events-none -translate-y-1 opacity-0'
                  }`}
                >
                  <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xl">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.href}
                        to={child.href}
                        className={({ isActive }) =>
                          `block border-b border-line px-5 py-4 transition-colors last:border-b-0 hover:bg-[color-mix(in_srgb,var(--accent)_6%,transparent)] ${
                            isActive ? 'text-[var(--ink)]' : 'text-muted hover:text-[var(--ink)]'
                          }`
                        }
                      >
                        <span className="block text-sm font-medium">{child.label}</span>
                        <span className="mt-0.5 block text-xs">{child.description}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `nav-link text-sm transition-colors duration-300 ${
                    isActive ? 'text-[var(--ink)]' : 'text-muted hover:text-[var(--ink)]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            )
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSearch}
            aria-label="Search the site"
            className="hidden items-center gap-2 rounded-full border border-line py-2 pl-3 pr-2 text-xs text-muted transition-colors duration-300 hover:text-[var(--ink)] md:flex"
          >
            <Search size={14} aria-hidden="true" />
            Search
            <kbd className="rounded-md border border-line px-1.5 py-0.5 text-[10px] tracking-wider">
              Ctrl K
            </kbd>
          </button>
          <button
            onClick={onOpenSearch}
            aria-label="Search the site"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line md:hidden"
          >
            <Search size={16} aria-hidden="true" />
          </button>
          <ThemeToggle />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={17} aria-hidden="true" /> : <Menu size={17} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <div
        className={`overflow-hidden border-b border-line bg-[color-mix(in_srgb,var(--paper)_92%,transparent)] backdrop-blur-xl transition-all duration-300 lg:hidden ${
          open ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container-yx flex max-h-[70vh] flex-col gap-1 overflow-y-auto py-4">
          {NAV.map((item) => (
            <div key={item.label}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-3 text-sm transition-colors hover:bg-surface ${
                    isActive ? 'text-[var(--ink)]' : 'text-muted'
                  }`
                }
              >
                {item.label}
              </NavLink>
              {item.children?.slice(1).map((child) => (
                <NavLink
                  key={child.href}
                  to={child.href}
                  className={({ isActive }) =>
                    `block rounded-lg px-6 py-2.5 text-xs transition-colors hover:bg-surface ${
                      isActive ? 'text-[var(--ink)]' : 'text-muted'
                    }`
                  }
                >
                  {child.label}
                </NavLink>
              ))}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
