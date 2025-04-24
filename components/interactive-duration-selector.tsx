"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, CalendarDays, CalendarRange } from "lucide-react"

interface InteractiveDurationSelectorProps {
  onSelect: (duration: string) => void
  className?: string
  symptoms?: string[]
}

const durationOptions = [
  { icon: <Clock className="h-4 w-4" />, label: "Today", value: "Today" },
  { icon: <CalendarDays className="h-4 w-4" />, label: "Few days", value: "A few days" },
  { icon: <Calendar className="h-4 w-4" />, label: "About a week", value: "About a week" },
  { icon: <CalendarRange className="h-4 w-4" />, label: "Several weeks", value: "Several weeks" },
  { icon: <CalendarRange className="h-4 w-4" />, label: "A month or more", value: "A month or more" },
]

export function InteractiveDurationSelector({ onSelect, className, symptoms = [] }: InteractiveDurationSelectorProps) {
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null)
  const [customDuration, setCustomDuration] = useState("")

  const handleSelect = (duration: string) => {
    setSelectedDuration(duration)
  }

  const handleSubmit = () => {
    if (selectedDuration) {
      onSelect(selectedDuration)
    } else if (customDuration.trim()) {
      onSelect(customDuration.trim())
    }
  }

  // Create a proper symptom text for the heading
  const symptomText =
    symptoms.length > 0
      ? symptoms.length === 1
        ? symptoms[0]
        : symptoms.slice(0, -1).join(", ") + " and " + symptoms[symptoms.length - 1]
      : "these symptoms"

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
        How long have you been experiencing {symptomText}?
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {durationOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={cn(
              "px-3 py-3 rounded-lg text-sm transition-all duration-200 flex flex-col items-center justify-center gap-2 border",
              selectedDuration === option.value
                ? "bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200 border-teal-200 dark:border-teal-800 shadow-sm scale-[1.02]"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-800",
            )}
          >
            <div
              className={cn(
                "p-2 rounded-full",
                selectedDuration === option.value
                  ? "bg-teal-200 dark:bg-teal-800 text-teal-700 dark:text-teal-300"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
              )}
            >
              {option.icon}
            </div>
            <span>{option.label}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col space-y-2">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Or specify another duration:</div>
        <input
          type="text"
          value={customDuration}
          onChange={(e) => {
            setCustomDuration(e.target.value)
            setSelectedDuration(null)
          }}
          placeholder="e.g., 3 months, on and off for a year"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!selectedDuration && !customDuration.trim()}
        className="w-full py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-medium disabled:opacity-50 transition-colors duration-200"
      >
        Continue
      </Button>
    </div>
  )
}
