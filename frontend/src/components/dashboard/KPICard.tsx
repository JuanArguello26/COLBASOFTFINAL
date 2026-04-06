import { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: { value: number; positive: boolean };
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

export function KPICard({ title, value, icon, trend, color = 'primary' }: KPICardProps) {
  const colors = {
    primary: 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
    success: 'bg-success-50 dark:bg-success-900/30 text-success-500 dark:text-success-400',
    warning: 'bg-warning-50 dark:bg-warning-900/30 text-warning-500 dark:text-warning-400',
    danger: 'bg-danger-50 dark:bg-danger-900/30 text-danger-500 dark:text-danger-400'
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.positive ? 'text-success-500 dark:text-success-400' : 'text-danger-500 dark:text-danger-400'}`}>
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
