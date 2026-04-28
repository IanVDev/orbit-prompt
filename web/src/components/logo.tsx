type LogoProps = React.SVGProps<SVGSVGElement>;

export function Logo({ className, ...rest }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <ellipse cx="12" cy="12" rx="10" ry="4.2" />
      <ellipse cx="12" cy="12" rx="4.2" ry="10" transform="rotate(60 12 12)" opacity="0.55" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}
