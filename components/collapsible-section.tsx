"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
  icon?: React.ReactNode
}

export function CollapsibleSection({ title, children, defaultOpen = false, className, icon }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <div className={cn("mt-4 overflow-hidden rounded-md border", className)}>
      <div
        className={cn(
          "flex cursor-pointer items-center justify-between bg-gray-50 dark:bg-gray-800/50 px-4 py-3",
          isOpen ? "border-b" : "border-b-0",
        )}
        onClick={toggleOpen}
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-500 transition-transform duration-200",
            isOpen ? "rotate-180 transform" : "",
          )}
        />
      </div>
      <div className={cn("overflow-hidden transition-all duration-300 ease-in-out", isOpen ? "max-h-96" : "max-h-0")}>
        <div className="p-4 text-sm">{children}</div>
      </div>
    </div>
  )
}
