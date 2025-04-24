"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SeveritySliderProps {
  onSelect: (severity: string) => void
}

export function SeveritySlider({ onSelect }: SeveritySliderProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null)
  const [sliderValue, setSliderValue] = useState(1)

  const severityOptions = [
    {
      value: "Mild",
      color:
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800",
      description: "Noticeable but doesn't interfere with daily activities",
    },
    {
      value: "Moderate",
      color:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800",
      description: "Interferes somewhat with daily activities",
    },
    {
      value: "Severe",
      color:
        "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800",
      description: "Significantly interferes with daily activities",
    },
    {
      value: "Very Severe",
      color: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800",
      description: "Unable to perform daily activities",
    },
  ]

  const handleSelect = (severity: string) => {
    setSelectedSeverity(severity)

    // Set slider value based on selected severity
    const index = severityOptions.findIndex((option) => option.value === severity)
    if (index !== -1) {
      setSliderValue(index + 1)
    }
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    setSliderValue(value)
    setSelectedSeverity(severityOptions[value - 1].value)
  }

  const handleSubmit = () => {
    if (selectedSeverity) {
      onSelect(selectedSeverity)
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">How severe are your symptoms?</div>

      {/* Slider control */}
      <div className="space-y-4">
        <input
          type="range"
          min="1"
          max="4"
          value={sliderValue}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />

        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Mild</span>
          <span>Moderate</span>
          <span>Severe</span>
          <span>Very Severe</span>
        </div>
      </div>

      {/* Selected severity display */}
      {selectedSeverity && (
        <div
          className={cn(
            "p-4 rounded-lg border transition-all text-center",
            severityOptions.find((o) => o.value === selectedSeverity)?.color || "",
          )}
        >
          <h3 className="text-lg font-medium mb-1">{selectedSeverity}</h3>
          <p className="text-sm">{severityOptions.find((o) => o.value === selectedSeverity)?.description}</p>
        </div>
      )}

      {/* Visual severity indicators */}
      <div className="grid grid-cols-4 gap-3">
        {severityOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={cn(
              "p-4 rounded-lg border transition-all text-center",
              option.color,
              selectedSeverity === option.value
                ? "ring-2 ring-offset-2 ring-teal-500 dark:ring-offset-gray-800 scale-[1.02]"
                : "opacity-80 hover:opacity-100",
            )}
          >
            <div className="text-center font-medium">{option.value}</div>
          </button>
        ))}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!selectedSeverity}
        className="w-full py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-medium disabled:opacity-50 transition-colors duration-200"
      >
        Continue
      </Button>
    </div>
  )
}
