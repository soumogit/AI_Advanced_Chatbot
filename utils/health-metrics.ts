// Sample health data for demonstration purposes
export type HealthMetric = {
  id: string
  name: string
  value: number
  unit: string
  date: string
  status: "normal" | "warning" | "critical" | "good"
  range?: {
    min: number
    max: number
  }
}

export type HealthGoal = {
  id: string
  name: string
  target: number
  current: number
  unit: string
  dueDate: string
  category: "activity" | "nutrition" | "sleep" | "mental" | "medical"
  progress: number
}

export type HealthInsight = {
  id: string
  title: string
  description: string
  category: "activity" | "nutrition" | "sleep" | "mental" | "medical"
  priority: "low" | "medium" | "high"
  date: string
  actionable: boolean
  action?: string
}

// Generate sample health metrics data
export const generateSampleMetrics = (): HealthMetric[] => {
  return [
    {
      id: "1",
      name: "Heart Rate",
      value: 72,
      unit: "bpm",
      date: new Date().toISOString(),
      status: "normal",
      range: { min: 60, max: 100 },
    },
    {
      id: "2",
      name: "Blood Pressure",
      value: 120,
      unit: "mmHg",
      date: new Date().toISOString(),
      status: "normal",
      range: { min: 90, max: 140 },
    },
    {
      id: "3",
      name: "Blood Glucose",
      value: 95,
      unit: "mg/dL",
      date: new Date().toISOString(),
      status: "normal",
      range: { min: 70, max: 140 },
    },
    {
      id: "4",
      name: "Body Temperature",
      value: 98.6,
      unit: "°F",
      date: new Date().toISOString(),
      status: "normal",
      range: { min: 97, max: 99 },
    },
    {
      id: "5",
      name: "Oxygen Saturation",
      value: 98,
      unit: "%",
      date: new Date().toISOString(),
      status: "good",
      range: { min: 95, max: 100 },
    },
    {
      id: "6",
      name: "Sleep",
      value: 7.5,
      unit: "hours",
      date: new Date().toISOString(),
      status: "good",
      range: { min: 7, max: 9 },
    },
  ]
}

// Generate sample health history data for charts
export const generateHealthHistory = (metric: string, days = 14) => {
  const data = []
  const today = new Date()

  let baseValue = 0
  let variance = 0

  switch (metric) {
    case "Heart Rate":
      baseValue = 72
      variance = 8
      break
    case "Blood Pressure":
      baseValue = 120
      variance = 10
      break
    case "Blood Glucose":
      baseValue = 95
      variance = 15
      break
    case "Sleep":
      baseValue = 7.5
      variance = 1.5
      break
    case "Steps":
      baseValue = 8000
      variance = 2000
      break
    default:
      baseValue = 100
      variance = 10
  }

  // Ensure we generate at least one data point even if days is invalid
  const daysToGenerate = Math.max(1, days)

  for (let i = 0; i < daysToGenerate; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - (daysToGenerate - i - 1))

    // Generate a somewhat realistic pattern with some randomness
    const randomFactor = Math.sin(i * 0.5) * (variance / 2) + (Math.random() - 0.5) * variance
    const value = Math.max(0, baseValue + randomFactor)

    data.push({
      date: date.toISOString().split("T")[0],
      value: Number.parseFloat(value.toFixed(1)),
    })
  }

  return data
}

// Generate sample health goals
export const generateSampleGoals = (): HealthGoal[] => {
  return [
    {
      id: "1",
      name: "Daily Steps",
      target: 10000,
      current: 7500,
      unit: "steps",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
      category: "activity",
      progress: 75,
    },
    {
      id: "2",
      name: "Water Intake",
      target: 8,
      current: 5,
      unit: "glasses",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
      category: "nutrition",
      progress: 62.5,
    },
    {
      id: "3",
      name: "Sleep Duration",
      target: 8,
      current: 6.5,
      unit: "hours",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
      category: "sleep",
      progress: 81.25,
    },
    {
      id: "4",
      name: "Meditation",
      target: 15,
      current: 10,
      unit: "minutes",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
      category: "mental",
      progress: 66.67,
    },
  ]
}

// Generate sample health insights
export const generateSampleInsights = (): HealthInsight[] => {
  return [
    {
      id: "1",
      title: "Improve Sleep Quality",
      description:
        "Your sleep pattern shows inconsistency. Try to maintain a regular sleep schedule to improve quality.",
      category: "sleep",
      priority: "medium",
      date: new Date().toISOString(),
      actionable: true,
      action: "Set a consistent bedtime reminder",
    },
    {
      id: "2",
      title: "Hydration Reminder",
      description:
        "Your water intake is below the recommended amount. Staying hydrated can help with energy levels and overall health.",
      category: "nutrition",
      priority: "high",
      date: new Date().toISOString(),
      actionable: true,
      action: "Set water intake reminders",
    },
    {
      id: "3",
      title: "Activity Pattern",
      description:
        "Your activity levels tend to drop in the afternoon. Consider a short walk after lunch to maintain energy.",
      category: "activity",
      priority: "low",
      date: new Date().toISOString(),
      actionable: true,
      action: "Schedule afternoon walk",
    },
    {
      id: "4",
      title: "Stress Management",
      description: "Based on your reported symptoms and activity, you may benefit from stress-reduction techniques.",
      category: "mental",
      priority: "medium",
      date: new Date().toISOString(),
      actionable: true,
      action: "Try guided meditation",
    },
  ]
}

// Calculate health score based on metrics
export const calculateHealthScore = (metrics: HealthMetric[]): number => {
  let score = 80 // Base score

  metrics.forEach((metric) => {
    if (metric.status === "good") score += 2
    if (metric.status === "warning") score -= 5
    if (metric.status === "critical") score -= 10
  })

  // Ensure score is between 0 and 100
  return Math.min(100, Math.max(0, score))
}

// Utility function to validate health data
export const validateHealthData = (data: any[]): boolean => {
  if (!Array.isArray(data) || data.length === 0) {
    return false
  }

  // Check if each item has the required properties
  return data.every(
    (item) => item && typeof item === "object" && "date" in item && "value" in item && !isNaN(Number(item.value)),
  )
}
