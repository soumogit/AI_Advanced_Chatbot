"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { HealthInsight } from "@/utils/health-metrics"
import { cn } from "@/lib/utils"
import { Lightbulb, Target, Utensils, Moon, Brain, Stethoscope, ArrowRight } from "lucide-react"

interface HealthInsightCardProps {
  insight: HealthInsight
  className?: string
  onAction?: (id: string) => void
}

export function HealthInsightCard({ insight, className, onAction }: HealthInsightCardProps) {
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
        return <Lightbulb className="h-5 w-5" />
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
      case "medium":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
      case "low":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
    }
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className={cn("p-2 rounded-full mt-0.5", getCategoryColor(insight.category))}>
            {getIcon(insight.category)}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{insight.title}</h3>
              <div className={cn("px-2 py-0.5 rounded-full text-xs font-medium", getPriorityColor(insight.priority))}>
                {insight.priority}
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{insight.description}</p>

            {insight.actionable && insight.action && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-8 px-2 text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
                onClick={() => onAction && onAction(insight.id)}
              >
                {insight.action}
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
