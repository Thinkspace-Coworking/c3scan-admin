import { getStatusColor, getStatusLabel } from "@/lib/data";

interface StatusPillProps {
  status: string;
  className?: string;
}

export function StatusPill({ status, className = "" }: StatusPillProps) {
  const colors = getStatusColor(status);
  const label = getStatusLabel(status);

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
        ${colors.bg} ${colors.text}
        ${className}
      `}
    >
      {label}
    </span>
  );
}
