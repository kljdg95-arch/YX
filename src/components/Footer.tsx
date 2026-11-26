import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

const NAV_GROUPS = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Roadmap', href: '/roadmap' },
      { label: 'Innovation & Future', href: '/innovation' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Divisions',
    links: [
      { label: 'YX Intelligence', href: '/divisions/intelligence' },
      { label: 'YX Engineering', href: '/divisions/engineering' },
      { label: 'YX Research', href: '/divisions/research' },
      { label: 'YX Ventures', href: '/divisions/ventures' },
    ],
  },
  {
    title: 'Work',
    links: [
      { label: 'Technology Explorer', href: '/technology' },
      { label: 'Projects', href: '/projects' },
      { label: 'YX Labs', href: '/labs' },
      { label: 'YX Journal', href: '/journal' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line py-16">
      <div className="container-yx">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <Logo className="h-7 w-7" />
              <span className="font-semibold tracking-tight">YX</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              An independent technology company exploring possibilities, engineering innovation,
              and building what comes next.
            </p>
          </div>

          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
                {group.title}
              </h3>
              <ul className="mt-5 flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted transition-colors hover:text-[var(--ink)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 md:flex-row">
          <p className="text-sm text-muted">© {new Date().getFullYear()} YX. All rights reserved.</p>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Building what comes next.</p>
        </div>
      </div>
    </footer>
  );
}
