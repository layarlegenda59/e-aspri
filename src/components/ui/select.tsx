import * as React from "react"
import { cn } from "../../lib/utils"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[] | { value: string; label: string }[]
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-10 w-full rounded-lg border border-slate-850 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-250 cursor-pointer appearance-none",
          className
        )}
        ref={ref}
        {...props}
      >
        {options.map((option) => {
          if (typeof option === 'string') {
            return (
              <option key={option} value={option} className="bg-slate-900 text-slate-100">
                {option}
              </option>
            );
          }
          return (
            <option key={option.value} value={option.value} className="bg-slate-900 text-slate-100">
              {option.label}
            </option>
          );
        })}
      </select>
    )
  }
)
Select.displayName = "Select"
