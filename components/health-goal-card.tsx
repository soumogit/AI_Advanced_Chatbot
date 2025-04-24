"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { HealthGoal } from "@/utils/health-metrics"
import { cn } from "@/lib/utils"
import { CheckCircle, Circle, Target, Utensils, Moon, Brain, Stethoscope } from "lucide-react"

interface HealthGoalCardProps {
  goal: HealthGoal
  className?: string
  onUpdate?: (id: string, value: number) => void
}

export function HealthGoalCard({ goal, className, onUpdate }: HealthGoalCardProps) {
  const getIcon = (category: string) => {
    switch (category) {
      case "activity":
        return <Target className="h-5 w-5" />
      case "nutrition":
        return <Utensils className="h-5 w-5" />
      case "sleep":
        return <Moon className="h-5 w-5" />
      case "mental":
        return <Brain className="h-5 w-5" />
      case "medical":
        return <Stethoscope className="h-5 w-5" />
      default:
        return <Target className="h-5 w-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "activity":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
      case "nutrition":
        return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
      case "sleep":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
      case "mental":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
      case "medical":
        return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500 dark:bg-green-400"
    if (progress >= 50) return "bg-blue-500 dark:bg-blue-400"
    if (progress >= 25) return "bg-amber-500 dark:bg-amber-400"
    return "bg-red-500 dark:bg-red-400"
  }

  const handleIncrement = () => {
    if (onUpdate && goal.current < goal.target) {
      onUpdate(goal.id, goal.current + 1)
    }
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn("p-2 rounded-full", getCategoryColor(goal.category))}>{getIcon(goal.category)}</div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{goal.name}</h3>
              <div className="flex items-baseline">
                <span className="text-lg font-semibold">{goal.current}</span>
                <span className="mx-1 text-xs text-gray-500 dark:text-gray-400">of</span>
                <span className="text-sm font-medium">{goal.target}</span>
                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">{goal.unit}</span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
            onClick={handleIncrement}
            disabled={goal.current >= goal.target}
          >
            {goal.current >= goal.target ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="mt-3">
          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={cn("absolute top-0 left-0 h-full rounded-full", getProgressColor(goal.progress))}
              style={{ width: `${goal.progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">{goal.progress}% complete</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Due {new Date(goal.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
