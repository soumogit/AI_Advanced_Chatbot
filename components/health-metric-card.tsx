"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { HealthMetric } from "@/utils/health-metrics"
import { cn } from "@/lib/utils"
import { Activity, Heart, Thermometer, Droplets, Moon } from "lucide-react"

interface HealthMetricCardProps {
  metric: HealthMetric
  className?: string
}

export function HealthMetricCard({ metric, className }: HealthMetricCardProps) {
  // Add validation to ensure metric has all required properties
  const isValidMetric =
    metric &&
    typeof metric === "object" &&
    "name" in metric &&
    "value" in metric &&
    "status" in metric &&
    "unit" in metric

  if (!isValidMetric) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                <Activity className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Unknown Metric</h3>
                <div className="flex items-baseline">
                  <span className="text-xl font-semibold">--</span>
                </div>
              </div>
            </div>
            <div className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              No Data
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Rest of the component remains the same
  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
      case "normal":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
      case "warning":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
      case "critical":
        return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
    }
  }

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "heart rate":
        return <Heart className="h-5 w-5" />
      case "blood pressure":
        return <Activity className="h-5 w-5" />
      case "body temperature":
        return <Thermometer className="h-5 w-5" />
      case "oxygen saturation":
        return <Droplets className="h-5 w-5" />
      case "sleep":
        return <Moon className="h-5 w-5" />
      default:
        return <Activity className="h-5 w-5" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "good":
        return "Excellent"
      case "normal":
        return "Normal"
      case "warning":
        return "Attention"
      case "critical":
        return "Critical"
      default:
        return "Unknown"
    }
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn("p-2 rounded-full", getStatusColor(metric.status))}>{getIcon(metric.name)}</div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{metric.name}</h3>
              <div className="flex items-baseline">
                <span className="text-xl font-semibold">{metric.value}</span>
                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">{metric.unit}</span>
              </div>
            </div>
          </div>
          <div className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(metric.status))}>
            {getStatusText(metric.status)}
          </div>
        </div>

        {metric.range && (
          <div className="mt-3">
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={cn("absolute top-0 left-0 h-full rounded-full", getStatusColor(metric.status).split(" ")[0])}
                style={{
                  width: `${((metric.value - metric.range.min) / (metric.range.max - metric.range.min)) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>
                {metric.range.min} {metric.unit}
              </span>
              <span>
                {metric.range.max} {metric.unit}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
