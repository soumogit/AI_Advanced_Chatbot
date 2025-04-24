"use client"

import { cn } from "@/lib/utils"

interface QuickRepliesProps {
  options: string[]
  onSelect: (option: string) => void
  className?: string
}

export function QuickReplies({ options, onSelect, className }: QuickRepliesProps) {
  if (!options.length) return null

  return (
    <div className={cn("flex flex-wrap gap-2 mt-2", className)}>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className="px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-sm border border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors duration-200"
        >
          {option}
        </button>
      ))}
    </div>
  )
}
