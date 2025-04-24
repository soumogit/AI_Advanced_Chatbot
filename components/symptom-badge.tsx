import { cn } from "@/lib/utils"
import { Activity } from "lucide-react"

interface SymptomBadgeProps {
  symptom: string
  className?: string
  size?: "sm" | "md" | "lg"
  withIcon?: boolean
  icon?: boolean
}

export function SymptomBadge({ symptom, className, size = "md", withIcon = true, icon = true }: SymptomBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        size === "sm" ? "text-xs" : "text-sm",
        size === "lg" ? "px-3 py-1.5" : "",
        className || "bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200",
      )}
    >
      {icon && (
        <span className="mr-1.5">
          <Activity className="h-3 w-3" />
        </span>
      )}
      {symptom}
    </span>
  )
}
