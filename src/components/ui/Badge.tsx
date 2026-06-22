import { cn } from '@/lib/utils';
import { Category, getCategoryBadgeClass } from '@/lib/constants';

interface BadgeProps {
  category: Category;
  className?: string;
}

export function CategoryBadge({ category, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-2 py-0.5 text-xs font-medium rounded-full',
        getCategoryBadgeClass(category),
        className
      )}
    >
      {category}
    </span>
  );
}

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Chip({ label, selected, onClick, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-3 py-1 text-sm rounded-full border transition-colors',
        selected
          ? 'bg-primary text-white border-primary'
          : 'bg-white text-textDark border-border hover:border-primary',
        className
      )}
    >
      {label}
    </button>
  );
}
