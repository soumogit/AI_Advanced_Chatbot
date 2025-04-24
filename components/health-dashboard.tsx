"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { HealthChart } from "@/components/health-chart"
import { HealthMetricCard } from "@/components/health-metric-card"
import { HealthGoalCard } from "@/components/health-goal-card"
import { HealthInsightCard } from "@/components/health-insight-card"
import { SymptomChecker } from "@/components/symptom-checker"
import {
  generateSampleMetrics,
  generateSampleGoals,
  generateSampleInsights,
  calculateHealthScore,
  type HealthMetric,
  type HealthGoal,
  type HealthInsight,
} from "@/utils/health-metrics"
import { cn } from "@/lib/utils"
import { X, Activity, LineChart, Target, Stethoscope, Plus, Calendar, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface HealthDashboardProps {
  className?: string
  onClose?: () => void
}

export function HealthDashboard({ className, onClose }: HealthDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [metrics, setMetrics] = useState<HealthMetric[]>([])
  const [goals, setGoals] = useState<HealthGoal[]>([])
  const [insights, setInsights] = useState<HealthInsight[]>([])
  const [healthScore, setHealthScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    try {
      // Load sample data
      const sampleMetrics = generateSampleMetrics()
      const sampleGoals = generateSampleGoals()
      const sampleInsights = generateSampleInsights()

      if (sampleMetrics.length === 0) {
        console.error("Failed to generate sample metrics")
        // Provide fallback data
        setMetrics([
          {
            id: "fallback-1",
            name: "Heart Rate",
            value: 72,
            unit: "bpm",
            date: new Date().toISOString(),
            status: "normal",
            range: { min: 60, max: 100 },
          },
        ])
      } else {
        setMetrics(sampleMetrics)
      }

      setGoals(sampleGoals)
      setInsights(sampleInsights)
      setHealthScore(calculateHealthScore(sampleMetrics))
    } catch (error) {
      console.error("Error loading health dashboard data:", error)
      // Set fallback data in case of error
      setMetrics([
        {
          id: "fallback-1",
          name: "Heart Rate",
          value: 72,
          unit: "bpm",
          date: new Date().toISOString(),
          status: "normal",
          range: { min: 60, max: 100 },
        },
      ])
      setGoals([])
      setInsights([])
      setHealthScore(50)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleGoalUpdate = (id: string, value: number) => {
    setGoals((prev) => {
      return prev.map((goal) => {
        if (goal.id === id) {
          const newCurrent = value
          const progress = Math.min(100, (newCurrent / goal.target) * 100)
          return { ...goal, current: newCurrent, progress }
        }
        return goal
      })
    })
  }

  const handleInsightAction = (id: string) => {
    // In a real app, this would trigger an action based on the insight
    console.log(`Action triggered for insight ${id}`)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-blue-500"
    if (score >= 40) return "text-amber-500"
    return "text-red-500"
  }

  return (
    <Card className={cn("overflow-hidden h-full flex flex-col", className)}>
      <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 px-4 flex-shrink-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">Health Dashboard</CardTitle>
          {onClose && (
            <button onClick={onClose} className="text-white hover:text-teal-100">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
          <TabsList className="w-full grid grid-cols-4 rounded-none">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-teal-50 dark:data-[state=active]:bg-teal-900/20"
            >
              <Activity className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="metrics"
              className="data-[state=active]:bg-teal-50 dark:data-[state=active]:bg-teal-900/20"
            >
              <LineChart className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Metrics</span>
            </TabsTrigger>
            <TabsTrigger
              value="goals"
              className="data-[state=active]:bg-teal-50 dark:data-[state=active]:bg-teal-900/20"
            >
              <Target className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
            <TabsTrigger
              value="checker"
              className="data-[state=active]:bg-teal-50 dark:data-[state=active]:bg-teal-900/20"
            >
              <Stethoscope className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Checker</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="overview" className="p-4 m-0 h-full">
              <div className="space-y-4">
                {/* Health Score */}
                <Card className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Health Score</h3>
                      <span className={cn("text-2xl font-bold", getScoreColor(healthScore))}>{healthScore}</span>
                    </div>
                    <Progress value={healthScore} className="h-2" />
                    <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>Needs Attention</span>
                      <span>Excellent</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  {isLoading
                    ? // Loading skeleton for metrics
                      Array(4)
                        .fill(0)
                        .map((_, index) => (
                          <Card key={`skeleton-${index}`} className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse h-9 w-9"></div>
                                <div className="space-y-2">
                                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                    : metrics.slice(0, 4).map((metric) => <HealthMetricCard key={metric.id} metric={metric} />)}
                </div>

                {/* Recent Insights */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Recent Insights</h3>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      View All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {insights.slice(0, 2).map((insight) => (
                      <HealthInsightCard key={insight.id} insight={insight} onAction={handleInsightAction} />
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="h-auto py-3 flex flex-col items-center justify-center gap-2 text-xs"
                      onClick={() => setActiveTab("checker")}
                    >
                      <Stethoscope className="h-5 w-5 text-teal-500" />
                      Check Symptoms
                    </Button>
                    <Link href="/voice-consultation" className="w-full">
                      <Button
                        variant="outline"
                        className="h-auto py-3 flex flex-col items-center justify-center gap-2 text-xs w-full"
                      >
                        <Stethoscope className="h-5 w-5 text-teal-500" />
                        Consultation
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="h-auto py-3 flex flex-col items-center justify-center gap-2 text-xs"
                    >
                      <Calendar className="h-5 w-5 text-teal-500" />
                      Book Appointment
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-3 flex flex-col items-center justify-center gap-2 text-xs"
                    >
                      <AlertTriangle className="h-5 w-5 text-teal-500" />
                      Emergency Info
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="p-4 m-0 h-full">
              <div className="space-y-4">
                {/* Charts */}
                <div className="grid grid-cols-1 gap-4">
                  <HealthChart
                    title="Heart Rate"
                    metric="Heart Rate"
                    unit="bpm"
                    color="#ef4444"
                    fillColor="rgba(239, 68, 68, 0.2)"
                  />
                  <HealthChart
                    title="Blood Pressure"
                    metric="Blood Pressure"
                    unit="mmHg"
                    color="#3b82f6"
                    fillColor="rgba(59, 130, 246, 0.2)"
                  />
                  <HealthChart
                    title="Sleep Duration"
                    metric="Sleep"
                    unit="hrs"
                    color="#8b5cf6"
                    fillColor="rgba(139, 92, 246, 0.2)"
                  />
                  <HealthChart
                    title="Daily Steps"
                    metric="Steps"
                    unit=""
                    color="#10b981"
                    fillColor="rgba(16, 185, 129, 0.2)"
                  />
                </div>

                {/* All Metrics */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">All Health Metrics</h3>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Metric
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {metrics.map((metric) => (
                      <HealthMetricCard key={metric.id} metric={metric} />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="goals" className="p-4 m-0 h-full">
              <div className="space-y-4">
                {/* Goals Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Today's Goals</h3>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Goal
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {goals.map((goal) => (
                      <HealthGoalCard key={goal.id} goal={goal} onUpdate={handleGoalUpdate} />
                    ))}
                  </div>
                </div>

                {/* Insights */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Personalized Insights</h3>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      View All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {insights.map((insight) => (
                      <HealthInsightCard key={insight.id} insight={insight} onAction={handleInsightAction} />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="checker" className="p-0 m-0 h-full">
              <SymptomChecker />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
