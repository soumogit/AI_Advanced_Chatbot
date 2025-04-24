"use client"

import { useState } from "react"
import { Check, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface SymptomSelectorProps {
  onSelect: (symptoms: string[]) => void
  className?: string
}

const commonSymptoms = [
  "Headache",
  "Fever",
  "Cough",
  "Fatigue",
  "Nausea",
  "Sore throat",
  "Shortness of breath",
  "Muscle pain",
  "Dizziness",
  "Runny nose",
  "Stomach pain",
  "Rash",
]

export function SymptomSelector({ onSelect, className }: SymptomSelectorProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [customSymptom, setCustomSymptom] = useState("")

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]))
  }

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms((prev) => [...prev, customSymptom.trim()])
      setCustomSymptom("")
    }
  }

  const handleSubmit = () => {
    if (selectedSymptoms.length > 0) {
      onSelect(selectedSymptoms)
    }
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Select your symptoms:</div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {commonSymptoms.map((symptom) => (
          <button
            key={symptom}
            onClick={() => toggleSymptom(symptom)}
            className={cn(
              "px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center justify-between",
              selectedSymptoms.includes(symptom)
                ? "bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200 border-teal-200 dark:border-teal-800"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-800",
            )}
          >
            <span>{symptom}</span>
            {selectedSymptoms.includes(symptom) && <Check className="h-4 w-4 text-teal-600 dark:text-teal-400" />}
          </button>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={customSymptom}
          onChange={(e) => setCustomSymptom(e.target.value)}
          placeholder="Add other symptom"
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addCustomSymptom()
            }
          }}
        />
        <button
          onClick={addCustomSymptom}
          disabled={!customSymptom.trim()}
          className="px-3 py-2 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {selectedSymptoms.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected symptoms:</div>
          <div className="flex flex-wrap gap-2">
            {selectedSymptoms.map((symptom) => (
              <div
                key={symptom}
                className="px-2 py-1 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200 text-xs flex items-center"
              >
                <span>{symptom}</span>
                <button
                  onClick={() => toggleSymptom(symptom)}
                  className="ml-1 rounded-full hover:bg-teal-200 dark:hover:bg-teal-800 p-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={selectedSymptoms.length === 0}
        className="w-full py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-medium disabled:opacity-50 transition-colors duration-200"
      >
        Continue
      </button>
    </div>
  )
}
