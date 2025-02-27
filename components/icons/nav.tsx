import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const defaultProps = {
  size: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2
};

export const StatusIcon = (props: IconProps) => (
  <svg {...defaultProps} {...props}>
    <line x1="3" y1="8" x2="13" y2="8" />
    <line x1="3" y1="4" x2="8" y2="4" />
    <line x1="3" y1="12" x2="11" y2="12" />
  </svg>
);

export const AgentsIcon = (props: IconProps) => (
  <svg {...defaultProps} {...props}>
    <rect x="2" y="2" width="12" height="12" rx="2" />
    <circle cx="8" cy="6" r="2" />
    <path d="M4 12c0-2.4 1.8-4 4-4s4 1.6 4 4" />
  </svg>
);

export const ApisIcon = (props: IconProps) => (
  <svg {...defaultProps} {...props}>
    <rect x="2" y="2" width="12" height="12" rx="2" />
    <path d="M6 8h4" />
  </svg>
);

export const MessagingIcon = (props: IconProps) => (
  <svg {...defaultProps} {...props}>
    <rect x="2" y="4" width="8" height="6" rx="1" />
    <rect x="6" y="6" width="8" height="6" rx="1" />
  </svg>
);

export const MarketIcon = (props: IconProps) => (
  <svg {...defaultProps} {...props}>
    <rect x="2" y="4" width="12" height="10" rx="1" />
    <path d="M2 7h12" />
  </svg>
);

export const StatsIcon = (props: IconProps) => (
  <svg {...defaultProps} {...props}>
    <path d="M3 12h2v-4h-2v4z" />
    <path d="M7 12h2v-7h-2v7z" />
    <path d="M11 12h2v-3h-2v3z" />
  </svg>
);

export const SettingsIcon = (props: IconProps) => (
  <svg {...defaultProps} {...props}>
    <circle cx="8" cy="8" r="2" />
    <path d="M8 3v2" />
    <path d="M8 11v2" />
    <path d="M3 8h2" />
    <path d="M11 8h2" />
  </svg>
);

export const MenuIcon = (props: IconProps) => (
  <svg {...defaultProps} {...props}>
    <line x1="3" y1="4" x2="13" y2="4" />
    <line x1="3" y1="8" x2="13" y2="8" />
    <line x1="3" y1="12" x2="13" y2="12" />
  </svg>
);

export const CloseIcon = (props: IconProps) => (
  <svg {...defaultProps} {...props}>
    <line x1="4" y1="4" x2="12" y2="12" />
    <line x1="4" y1="12" x2="12" y2="4" />
  </svg>
);