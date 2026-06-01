import { Card } from './Card';

interface StatItemProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: number;
  color?: 'purple' | 'cyan' | 'green' | 'orange';
}

const colorMap = {
  purple: 'text-[#7C3AED]',
  cyan: 'text-[#06B6D4]',
  green: 'text-[#22C55E]',
  orange: 'text-[#F97316]',
};

export function StatItem({
  icon,
  label,
  value,
  trend,
  color = 'purple',
}: StatItemProps) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {trend !== undefined && (
          <span
            className={`text-sm font-medium ${
              trend > 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-3">{label}</p>
      <p className={`text-4xl font-bold ${colorMap[color]}`}>{value}</p>
    </Card>
  );
}
