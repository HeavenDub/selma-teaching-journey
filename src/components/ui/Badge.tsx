interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export function Badge({ children, color = "var(--color-zellige-500)", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold text-white ${className}`}
      style={{ backgroundColor: color }}
    >
      {children}
    </span>
  );
}
