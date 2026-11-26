interface LogoProps {
  className?: string;
}

export default function Logo({ className = 'h-8 w-8' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="YX logo"
      fill="none"
    >
      <rect width="64" height="64" rx="14" className="fill-[var(--ink)]" />
      <path
        d="M18 18 L46 46 M46 18 L32 32 M32 32 L32 50"
        stroke="var(--paper)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
