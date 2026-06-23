import * as React from "react"
import { cn } from "../../lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger'
}

export const Badge = ({ className, variant = 'primary', ...props }: BadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "bg-brand/10 text-brand border-brand/20": variant === 'primary',
          "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700": variant === 'secondary',
          "text-slate-600 dark:text-slate-300 border-slate-250 dark:border-slate-700": variant === 'outline',
          "bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 border-emerald-500/20": variant === 'success',
          "bg-amber-500/10 text-amber-650 dark:text-amber-400 border-amber-500/20": variant === 'warning',
          "bg-red-500/10 text-red-650 dark:text-red-400 border-red-500/20": variant === 'danger',
        },
        className
      )}
      {...props}
    />
  )
}
