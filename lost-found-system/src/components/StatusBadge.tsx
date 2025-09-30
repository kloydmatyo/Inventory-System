interface StatusBadgeProps {
  status: 'lost' | 'found' | 'claimed' | 'returned';
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  lost: {
    label: 'Lost',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  found: {
    label: 'Found',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  claimed: {
    label: 'Claimed',
    className: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  returned: {
    label: 'Returned',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
};

const sizeConfig = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base',
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClass = sizeConfig[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${config.className} ${sizeClass}`}
    >
      {config.label}
    </span>
  );
}