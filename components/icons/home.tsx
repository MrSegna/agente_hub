import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export const AgentIcon = ({ size = 16, ...props }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 16 16" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    {...props}
  >
    <rect x="2" y="2" width="12" height="12" rx="2" />
    <line x1="8" y1="5" x2="8" y2="11" />
    <line x1="5" y1="8" x2="11" y2="8" />
  </svg>
);

export const ApiIcon = ({ size = 16, ...props }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 16 16" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    {...props}
  >
    <circle cx="8" cy="8" r="3" />
    <line x1="3" y1="8" x2="13" y2="8" />
  </svg>
);

export const MarketIcon = ({ size = 16, ...props }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 16 16" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    {...props}
  >
    <rect x="2" y="4" width="12" height="10" rx="1" />
    <line x1="2" y1="4" x2="14" y2="4" />
  </svg>
);