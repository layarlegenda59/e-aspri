import * as React from "react"
import { cn } from "../../lib/utils"

const TabsContext = React.createContext<{ value: string; onValueChange: (val: string) => void } | null>(null)

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

export const Tabs = ({ value, onValueChange, children, className }: TabsProps) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export const TabsList = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("inline-flex h-10 items-center justify-center rounded-lg bg-slate-950/60 p-1 text-slate-400 border border-slate-850", className)}>
    {children}
  </div>
)

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsTrigger = ({ value, children, className }: TabsTriggerProps) => {
  const context = React.useContext(TabsContext)
  if (!context) return null
  const isActive = context.value === value
  return (
    <button
      type="button"
      onClick={() => context.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-xs sm:text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-slate-800 text-slate-100 shadow-sm": isActive,
          "hover:bg-slate-900/40 hover:text-slate-200": !isActive,
        },
        className
      )}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsContent = ({ value, children, className }: TabsContentProps) => {
  const context = React.useContext(TabsContext)
  if (!context || context.value !== value) return null
  return <div className={cn("mt-3 focus-visible:outline-none", className)}>{children}</div>
}
