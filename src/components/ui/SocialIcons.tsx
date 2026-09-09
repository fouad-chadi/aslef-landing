interface IconProps {
  className?: string;
}

export function FacebookIcon({ className = '' }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.25-1.5 1.55-1.5H16.5V4.3c-.27-.04-1.2-.11-2.28-.11-2.26 0-3.8 1.38-3.8 3.9V10.5H8v3h2.42V21h3.08Z" />
    </svg>
  );
}

export function TikTokIcon({ className = '' }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.5 3c.35 1.9 1.6 3.35 3.5 3.6v2.75c-1.25.05-2.4-.32-3.5-1.05v6.4c0 3-2.42 5.3-5.35 5.3S5.8 17.7 5.8 14.7c0-2.85 2.2-5.1 4.95-5.28v2.8a2.5 2.5 0 1 0 2.4 2.5V3h3.35Z" />
    </svg>
  );
}
