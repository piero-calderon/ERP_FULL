interface Props {
  label: string;
  color: string;
  bg: string;
  size?: 'sm' | 'md';
}

export function PortalStatusBadge({ label, color, bg, size = 'sm' }: Props) {
  const cls = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${color} ${bg} ${cls}`}>
      {label}
    </span>
  );
}
