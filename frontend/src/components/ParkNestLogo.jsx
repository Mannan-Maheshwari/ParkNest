export default function ParkNestLogo({ size = 40, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="42" height="42" rx="12" fill="#2563EB" />
      <path d="M14 18.5C14 15.4624 16.4624 13 19.5 13H28.5C31.5376 13 34 15.4624 34 18.5V27.5C34 30.5376 31.5376 33 28.5 33H19.5C16.4624 33 14 30.5376 14 27.5V18.5Z" stroke="white" strokeWidth="2.6" />
      <path d="M17 26.5C20.5 23.3 27.5 23.3 31 26.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M17 30C20.5 27.2 27.5 27.2 31 30" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M24 16V21.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="24" cy="16" r="1.7" fill="white" />
    </svg>
  );
}
