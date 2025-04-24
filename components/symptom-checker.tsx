"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Search, ChevronRight, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"

interface SymptomCheckerProps {
  className?: string
  onComplete?: (result: SymptomCheckResult) => void
}

interface Symptom {
  id: string
  name: string
  selected: boolean
}

interface SymptomCheckResult {
  symptoms: string[]
  possibleConditions: {
    name: string
    probability: "high" | "medium" | "low"
    description: string
    recommendation: string
  }[]
  urgency: "emergency" | "urgent" | "non-urgent"
}

export function SymptomChecker({ className, onComplete }: SymptomCheckerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([])
  const [stage, setStage] = useState<"search" | "duration" | "severity" | "results" | "loading">("search")
  const [duration, setDuration] = useState<"today" | "days" | "week" | "longer">("today")
  const [severity, setSeverity] = useState<"mild" | "moderate" | "severe" | "very-severe">("mild")
  const [results, setResults] = useState<SymptomCheckResult | null>(null)

  // Sample symptoms for demonstration
  const commonSymptoms: Symptom[] = [
    { id: "1", name: "Headache", selected: false },
    { id: "2", name: "Fever", selected: false },
    { id: "3", name: "Cough", selected: false },
    { id: "4", name: "Sore Throat", selected: false },
    { id: "5", name: "Fatigue", selected: false },
    { id: "6", name: "Shortness of Breath", selected: false },
    { id: "7", name: "Nausea", selected: false },
    { id: "8", name: "Dizziness", selected: false },
    { id: "9", name: "Chest Pain", selected: false },
    { id: "10", name: "Abdominal Pain", selected: false },
  ]

  const filteredSymptoms = searchTerm
    ? commonSymptoms.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : commonSymptoms

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms((prev) => {
      const symptom = commonSymptoms.find((s) => s.id === symptomId)
      if (!symptom) return prev

      const exists = prev.some((s) => s.id === symptomId)
      if (exists) {
        return prev.filter((s) => s.id !== symptomId)
      } else {
        return [...prev, { ...symptom, selected: true }]
      }
    })
  }

  const handleContinue = () => {
    if (stage === "search") {
      if (selectedSymptoms.length > 0) {
        setStage("duration")
      }
    } else if (stage === "duration") {
      setStage("severity")
    } else if (stage === "severity") {
      setStage("loading")
      // Simulate API call
      setTimeout(() => {
        const result = generateMockResults()
        setResults(result)
        setStage("results")
        if (onComplete) onComplete(result)
      }, 1500)
    }
  }

  const generateMockResults = (): SymptomCheckResult => {
    const symptoms = selectedSymptoms.map((s) => s.name)

    // Generate different results based on symptoms
    const possibleConditions = []
    let urgency: "emergency" | "urgent" | "non-urgent" = "non-urgent"

    if (symptoms.includes("Chest Pain") || symptoms.includes("Shortness of Breath")) {
      possibleConditions.push({
        name: "Possible Cardiac Issue",
        probability: "medium" as const,
        description: "Chest pain with shortness of breath could indicate a cardiac issue.",
        recommendation: "Seek immediate medical attention if severe or persistent.",
      })
      urgency = "urgent"
    }

    if (symptoms.includes("Headache")) {
      possibleConditions.push({
        name: "Tension Headache",
        probability: "high" as const,
        description: "Common headache characterized by mild to moderate pain.",
        recommendation: "Rest, hydration, and over-the-counter pain relievers may help.",
      })
    }

    if (symptoms.includes("Fever") && symptoms.includes("Cough")) {
      possibleConditions.push({
        name: "Upper Respiratory Infection",
        probability: "high" as const,
        description: "Common viral infection affecting the upper respiratory tract.",
        recommendation: "Rest, fluids, and over-the-counter medications for symptom relief.",
      })
    }

    if (symptoms.includes("Nausea") && symptoms.includes("Abdominal Pain")) {
      possibleConditions.push({
        name: "Gastroenteritis",
        probability: "medium" as const,
        description: "Inflammation of the stomach and intestines, often due to infection.",
        recommendation: "Stay hydrated, rest, and follow the BRAT diet (bananas, rice, applesauce, toast).",
      })
    }

    // If no specific conditions matched, provide a generic response
    if (possibleConditions.length === 0) {
      possibleConditions.push({
        name: "Non-specific Symptoms",
        probability: "low" as const,
        description: "Your symptoms could be related to various conditions.",
        recommendation: "Monitor your symptoms and consult a healthcare provider if they persist or worsen.",
      })
    }

    // Adjust urgency based on severity and duration
    if (severity === "very-severe" || (severity === "severe" && duration !== "today")) {
      urgency = "urgent"
    }

    if (symptoms.includes("Chest Pain") && severity === "severe") {
      urgency = "emergency"
    }

    return {
      symptoms,
      possibleConditions,
      urgency,
    }
  }

  const renderStage = () => {
    switch (stage) {
      case "search":
        return (
          <>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search symptoms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {filteredSymptoms.map((symptom) => (
                <div key={symptom.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`symptom-${symptom.id}`}
                    checked={selectedSymptoms.some((s) => s.id === symptom.id)}
                    onCheckedChange={() => handleSymptomToggle(symptom.id)}
                  />
                  <label htmlFor={`symptom-${symptom.id}`} className="text-sm cursor-pointer">
                    {symptom.name}
                  </label>
                </div>
              ))}

              {filteredSymptoms.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No symptoms found. Try a different search term.
                </p>
              )}
            </div>

            <div className="mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Selected: {selectedSymptoms.length} {selectedSymptoms.length === 1 ? "symptom" : "symptoms"}
              </p>
              <Button onClick={handleContinue} disabled={selectedSymptoms.length === 0} className="w-full">
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )

      case "duration":
        return (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              How long have you been experiencing these symptoms?
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "today", label: "Today only" },
                { id: "days", label: "Few days" },
                { id: "week", label: "About a week" },
                { id: "longer", label: "Longer than a week" },
              ].map((option) => (
                <Button
                  key={option.id}
                  variant={duration === option.id ? "default" : "outline"}
                  className={cn("h-auto py-3", duration === option.id ? "bg-teal-500 hover:bg-teal-600" : "")}
                  onClick={() => setDuration(option.id as any)}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            <Button onClick={handleContinue} className="w-full mt-4">
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        )

      case "severity":
        return (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">How severe are your symptoms?</p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "mild", label: "Mild", color: "bg-blue-500" },
                { id: "moderate", label: "Moderate", color: "bg-yellow-500" },
                { id: "severe", label: "Severe", color: "bg-orange-500" },
                { id: "very-severe", label: "Very Severe", color: "bg-red-500" },
              ].map((option) => (
                <Button
                  key={option.id}
                  variant={severity === option.id ? "default" : "outline"}
                  className={cn("h-auto py-3", severity === option.id ? option.color : "")}
                  onClick={() => setSeverity(option.id as any)}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            <Button onClick={handleContinue} className="w-full mt-4">
              Get Results
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        )

      case "loading":
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-teal-500 animate-spin mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Analyzing your symptoms...</p>
          </div>
        )

      case "results":
        if (!results) return null

        return (
          <>
            <div
              className={cn(
                "mb-4 p-3 rounded-lg flex items-center",
                results.urgency === "emergency"
                  ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                  : results.urgency === "urgent"
                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                    : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
              )}
            >
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">
                  {results.urgency === "emergency"
                    ? "Seek immediate medical attention"
                    : results.urgency === "urgent"
                      ? "Consult a healthcare provider soon"
                      : "Monitor your symptoms"}
                </p>
                <p className="text-xs">
                  {results.urgency === "emergency"
                    ? "Your symptoms may require emergency care."
                    : results.urgency === "urgent"
                      ? "Your symptoms should be evaluated by a healthcare provider."
                      : "Your symptoms appear to be non-urgent, but monitor for changes."}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Symptoms checked:</h4>
              <div className="flex flex-wrap gap-2">
                {results.symptoms.map((symptom, index) => (
                  <div key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
                    {symptom}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Possible conditions:</h4>
              {results.possibleConditions.map((condition, index) => (
                <div
                  key={index}
                  className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium">{condition.name}</h5>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        condition.probability === "high"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          : condition.probability === "medium"
                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
                      )}
                    >
                      {condition.probability} match
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{condition.description}</p>
                  <div className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-xs">{condition.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
              This is not a medical diagnosis. Always consult with a healthcare professional.
            </div>

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => {
                setStage("search")
                setSelectedSymptoms([])
                setSearchTerm("")
                setResults(null)
              }}
            >
              Start New Check
            </Button>
          </>
        )
    }
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Symptom Checker</CardTitle>
      </CardHeader>
      <CardContent>{renderStage()}</CardContent>
    </Card>
  )
}
