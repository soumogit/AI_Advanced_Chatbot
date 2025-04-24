"use client"

import { useState, useEffect } from "react"
import { Check, Plus, X, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface InteractiveSymptomSelectorProps {
  onSelect: (symptoms: string[]) => void
  onAddSymptom: (symptom: string) => void
  className?: string
  preselectedSymptoms?: string[]
}

const commonSymptomCategories = [
  {
    name: "General",
    symptoms: ["Fever", "Fatigue", "Weakness", "Chills", "Weight loss", "Dizziness"],
  },
  {
    name: "Head & Neck",
    symptoms: ["Headache", "Sore throat", "Neck pain", "Ear pain", "Vision changes", "Hearing loss"],
  },
  {
    name: "Respiratory",
    symptoms: ["Cough", "Shortness of breath", "Chest pain", "Wheezing", "Runny nose", "Nasal congestion"],
  },
  {
    name: "Digestive",
    symptoms: ["Nausea", "Vomiting", "Diarrhea", "Constipation", "Abdominal pain", "Loss of appetite"],
  },
  {
    name: "Musculoskeletal",
    symptoms: ["Joint pain", "Muscle pain", "Back pain", "Swelling", "Stiffness", "Limited mobility"],
  },
  {
    name: "Skin",
    symptoms: ["Rash", "Itching", "Hives", "Bruising", "Dryness", "Discoloration"],
  },
]

export function InteractiveSymptomSelector({
  onSelect,
  onAddSymptom,
  className,
  preselectedSymptoms = [],
}: InteractiveSymptomSelectorProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(preselectedSymptoms)
  const [customSymptom, setCustomSymptom] = useState("")
  const [activeCategory, setActiveCategory] = useState(commonSymptomCategories[0].name)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (preselectedSymptoms.length > 0) {
      setSelectedSymptoms(preselectedSymptoms)
    }
  }, [preselectedSymptoms])

  const toggleSymptom = (symptom: string) => {
    const newSelectedSymptoms = selectedSymptoms.includes(symptom)
      ? selectedSymptoms.filter((s) => s !== symptom)
      : [...selectedSymptoms, symptom]

    setSelectedSymptoms(newSelectedSymptoms)
    onSelect(newSelectedSymptoms) // Notify parent component immediately of ALL symptoms
  }

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      const newSymptom = customSymptom.trim()
      setSelectedSymptoms((prev) => [...prev, newSymptom])
      setCustomSymptom("")
      onAddSymptom(newSymptom)
    }
  }

  const handleSubmit = () => {
    if (selectedSymptoms.length > 0) {
      onSelect(selectedSymptoms) // Send all selected symptoms to parent
    }
  }

  const filteredSymptoms = searchQuery
    ? commonSymptomCategories
        .flatMap((category) => category.symptoms)
        .filter((symptom) => symptom.toLowerCase().includes(searchQuery.toLowerCase()))
    : commonSymptomCategories.find((category) => category.name === activeCategory)?.symptoms || []

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Select your symptoms:</div>
        <div className="flex items-center">
          <span className="text-xs text-teal-600 dark:text-teal-400 mr-2">{selectedSymptoms.length} selected</span>
          <button
            onClick={() => setIsSearching(!isSearching)}
            className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isSearching ? (
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search symptoms..."
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin">
          {commonSymptomCategories.map((category) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors",
                activeCategory === category.name
                  ? "bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200 font-medium"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
        {filteredSymptoms.map((symptom) => (
          <button
            key={symptom}
            onClick={() => toggleSymptom(symptom)}
            className={cn(
              "px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center justify-between",
              selectedSymptoms.includes(symptom)
                ? "bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200 border-teal-200 dark:border-teal-800 shadow-sm"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-800",
              selectedSymptoms.includes(symptom) && "scale-[1.02]",
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
                className="px-2 py-1 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200 text-xs flex items-center group"
              >
                <span>{symptom}</span>
                <button
                  onClick={() => toggleSymptom(symptom)}
                  className="ml-1 rounded-full hover:bg-teal-200 dark:hover:bg-teal-800 p-0.5 opacity-70 group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={selectedSymptoms.length === 0}
        className="w-full py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-medium disabled:opacity-50 transition-colors duration-200"
      >
        Continue with {selectedSymptoms.length} {selectedSymptoms.length === 1 ? "symptom" : "symptoms"}
      </Button>
    </div>
  )
}
