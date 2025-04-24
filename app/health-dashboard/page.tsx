"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { HealthChart } from "@/components/health-chart"
import { HealthMetricCard } from "@/components/health-metric-card"
import { HealthGoalCard } from "@/components/health-goal-card"
import { HealthInsightCard } from "@/components/health-insight-card"
import { SymptomChecker } from "@/components/symptom-checker"
import { NearbyHospitals } from "@/components/nearby-hospitals"
import { EmergencyAlertSystem } from "@/components/emergency-alert-system"
import { AppointmentBooking } from "@/components/appointment-booking"
import { HealthResources } from "@/components/health-resources"
import { ThemeToggle } from "@/components/theme-toggle"
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
import {
  Activity,
  AlertTriangle,
  Calendar,
  LineChart,
  Stethoscope,
  Target,
  User,
  LogOut,
  FileText,
  MapPin,
  ArrowLeft,
  Plus,
  Bell,
  BookOpen,
} from "lucide-react"
import Link from "next/link"

export default function HealthDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [metrics, setMetrics] = useState<HealthMetric[]>([])
  const [goals, setGoals] = useState<HealthGoal[]>([])
  const [insights, setInsights] = useState<HealthInsight[]>([])
  const [healthScore, setHealthScore] = useState(0)
  const [notifications, setNotifications] = useState(3)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const notificationRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load sample data
    const sampleMetrics = generateSampleMetrics()
    const sampleGoals = generateSampleGoals()
    const sampleInsights = generateSampleInsights()

    setMetrics(sampleMetrics)
    setGoals(sampleGoals)
    setInsights(sampleInsights)
    setHealthScore(calculateHealthScore(sampleMetrics))
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
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

    // Mark as actioned by removing from the list
    setInsights((prev) => prev.filter((insight) => insight.id !== id))

    // Reduce notification count
    if (notifications > 0) {
      setNotifications(notifications - 1)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-blue-500"
    if (score >= 40) return "text-amber-500"
    return "text-red-500"
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 px-4 md:px-6 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <span className="font-medium text-gray-800 dark:text-gray-200">Back to HealthChat</span>
            </Link>
          </div>
          <div className="text-xl font-bold text-teal-600 dark:text-teal-400">Health Dashboard</div>
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notification Dropdown */}
            <div ref={notificationRef} className="relative">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full relative"
                onClick={() => {
                  setShowNotifications(!showNotifications)
                  setShowProfile(false)
                }}
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </Button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-20 border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications > 0 ? (
                      <>
                        <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <div className="flex items-center">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-2">
                              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Appointment Reminder</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Your checkup is scheduled for tomorrow at 10:00 AM
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">2h ago</p>
                          </div>
                        </div>
                        <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <div className="flex items-center">
                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-2">
                              <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Goal Achieved</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                You've reached your daily step goal!
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">5h ago</p>
                          </div>
                        </div>
                        <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <div className="flex items-center">
                            <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full mr-2">
                              <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Lab Results Available</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Your recent lab results are now available
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">1d ago</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                        No new notifications
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-center">
                    <button className="text-xs text-blue-600 dark:text-blue-400">View all notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div ref={profileRef} className="relative">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => {
                  setShowProfile(!showProfile)
                  setShowNotifications(false)
                }}
              >
                <User className="h-5 w-5" />
              </Button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-20 border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium">My Account</h3>
                  </div>
                  <div>
                    <Link
                      href="/profile"
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/medical-records"
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Medical Records</span>
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => router.push("/login")}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <TabsList className="mb-4 md:mb-0">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-teal-50 dark:data-[state=active]:bg-teal-900/20"
              >
                <Activity className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="metrics"
                className="data-[state=active]:bg-teal-50 dark:data-[state=active]:bg-teal-900/20"
              >
                <LineChart className="h-4 w-4 mr-2" />
                Health Metrics
              </TabsTrigger>
              <TabsTrigger
                value="goals"
                className="data-[state=active]:bg-teal-50 dark:data-[state=active]:bg-teal-900/20"
              >
                <Target className="h-4 w-4 mr-2" />
                Goals
              </TabsTrigger>
              <TabsTrigger
                value="checker"
                className="data-[state=active]:bg-teal-50 dark:data-[state=active]:bg-teal-900/20"
              >
                <Stethoscope className="h-4 w-4 mr-2" />
                Symptom Checker
              </TabsTrigger>
              <TabsTrigger
                value="services"
                className="data-[state=active]:bg-teal-50 dark:data-[state=active]:bg-teal-900/20"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Services
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="data-[state=active]:bg-teal-50 dark:data-[state=active]:bg-teal-900/20"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Resources
              </TabsTrigger>
            </TabsList>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Reminders
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Data
              </Button>
            </div>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Health Score */}
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Health Score</CardTitle>
                    <CardDescription>Based on your recent metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-baseline">
                        <span className={cn("text-4xl font-bold", getScoreColor(healthScore))}>{healthScore}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">/ 100</span>
                      </div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {healthScore >= 80
                          ? "Excellent"
                          : healthScore >= 60
                            ? "Good"
                            : healthScore >= 40
                              ? "Fair"
                              : "Needs Attention"}
                      </div>
                    </div>
                    <Progress value={healthScore} className="h-2" />
                    <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>0</span>
                      <span>25</span>
                      <span>50</span>
                      <span>75</span>
                      <span>100</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  {metrics.slice(0, 4).map((metric) => (
                    <HealthMetricCard key={metric.id} metric={metric} />
                  ))}
                </div>

                {/* Today's Goals */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Today's Goals</CardTitle>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {goals.slice(0, 2).map((goal) => (
                      <HealthGoalCard key={goal.id} goal={goal} onUpdate={handleGoalUpdate} />
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Middle Column */}
              <div className="space-y-6">
                {/* Recent Insights */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Health Insights</CardTitle>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        View All
                      </Button>
                    </div>
                    <CardDescription>Personalized recommendations based on your data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {insights.slice(0, 3).map((insight) => (
                      <HealthInsightCard key={insight.id} insight={insight} onAction={handleInsightAction} />
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Symptom Check */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Quick Symptom Check</CardTitle>
                    <CardDescription>Feeling unwell? Check your symptoms</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Use our symptom checker to get a quick assessment of your health concerns.
                      </p>
                      <Button onClick={() => setActiveTab("checker")} className="w-full">
                        <Stethoscope className="h-4 w-4 mr-2" />
                        Start Symptom Check
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Recent Activity Chart */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <HealthChart
                      title=""
                      metric="Heart Rate"
                      unit="bpm"
                      color="#ef4444"
                      fillColor="rgba(239, 68, 68, 0.2)"
                    />
                  </CardContent>
                </Card>

                {/* Quick Services */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Health Services</CardTitle>
                    <CardDescription>Quick access to healthcare services</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="h-auto py-3 flex flex-col items-center justify-center gap-2 text-xs"
                        onClick={() => setActiveTab("services")}
                      >
                        <MapPin className="h-5 w-5 text-teal-500" />
                        Find Hospitals
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto py-3 flex flex-col items-center justify-center gap-2 text-xs"
                        onClick={() => setActiveTab("services")}
                      >
                        <Calendar className="h-5 w-5 text-teal-500" />
                        Book Appointment
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto py-3 flex flex-col items-center justify-center gap-2 text-xs"
                        onClick={() => setActiveTab("services")}
                      >
                        <AlertTriangle className="h-5 w-5 text-teal-500" />
                        Emergency Info
                      </Button>
                      <Link href="/voice-consultation" className="w-full">
                        <Button
                          variant="outline"
                          className="h-auto py-3 flex flex-col items-center justify-center gap-2 text-xs w-full"
                        >
                          <Stethoscope className="h-5 w-5 text-teal-500" />
                          Voice Consultation
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Alert */}
                <Card className="border-red-200 dark:border-red-900/50">
                  <CardHeader className="pb-2 bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                      <CardTitle className="text-lg text-red-700 dark:text-red-400">Emergency Alert</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      In case of emergency, call 911 or your local emergency number immediately.
                    </p>
                    <Button variant="destructive" className="w-full" onClick={() => setActiveTab("services")}>
                      View Emergency Services
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Health Metrics Tab */}
          <TabsContent value="metrics" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Charts */}
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Heart Rate</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <HealthChart
                      title=""
                      metric="Heart Rate"
                      unit="bpm"
                      color="#ef4444"
                      fillColor="rgba(239, 68, 68, 0.2)"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Blood Pressure</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <HealthChart
                      title=""
                      metric="Blood Pressure"
                      unit="mmHg"
                      color="#3b82f6"
                      fillColor="rgba(59, 130, 246, 0.2)"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Sleep Duration</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <HealthChart
                      title=""
                      metric="Sleep"
                      unit="hrs"
                      color="#8b5cf6"
                      fillColor="rgba(139, 92, 246, 0.2)"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Daily Steps</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <HealthChart title="" metric="Steps" unit="" color="#10b981" fillColor="rgba(16, 185, 129, 0.2)" />
                  </CardContent>
                </Card>
              </div>

              {/* All Metrics */}
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">All Health Metrics</CardTitle>
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        <Plus className="h-3 w-3 mr-1" />
                        Add Metric
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {metrics.map((metric) => (
                      <HealthMetricCard key={metric.id} metric={metric} />
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Track New Metric</CardTitle>
                    <CardDescription>Add a new health metric to track</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        You can track various health metrics like weight, blood sugar, cholesterol, and more.
                      </p>
                      <Button className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Metric
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Goals */}
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Your Health Goals</CardTitle>
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        <Plus className="h-3 w-3 mr-1" />
                        Add Goal
                      </Button>
                    </div>
                    <CardDescription>Track your progress towards your health goals</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {goals.map((goal) => (
                      <HealthGoalCard key={goal.id} goal={goal} onUpdate={handleGoalUpdate} />
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Goal Achievements</CardTitle>
                    <CardDescription>Your recent accomplishments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="p-2 bg-green-100 dark:bg-green-800/50 rounded-full mr-3">
                          <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-green-800 dark:text-green-300">
                            10,000 Steps Goal Achieved
                          </h4>
                          <p className="text-xs text-green-700 dark:text-green-400">Completed 3 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-full mr-3">
                          <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                            30-Day Exercise Streak
                          </h4>
                          <p className="text-xs text-blue-700 dark:text-blue-400">Completed 1 week ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Insights */}
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Personalized Insights</CardTitle>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        Refresh
                      </Button>
                    </div>
                    <CardDescription>Recommendations based on your goals and metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {insights.map((insight) => (
                      <HealthInsightCard key={insight.id} insight={insight} onAction={handleInsightAction} />
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Goal Setting Guide</CardTitle>
                    <CardDescription>Tips for setting achievable health goals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Setting SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) can help you make
                        meaningful progress in your health journey.
                      </p>
                      <Button variant="outline" className="w-full">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Read Goal Setting Guide
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Symptom Checker Tab */}
          <TabsContent value="checker" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Symptom Checker</CardTitle>
                    <CardDescription>Check your symptoms and get a preliminary assessment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SymptomChecker />
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recent Symptom Checks</CardTitle>
                    <CardDescription>Your previous symptom assessments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">Headache & Fatigue</h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2 days ago</span>
                        </div>
                        <div className="flex items-center mb-2">
                          <div className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs rounded-full">
                            Consult healthcare provider
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Possible causes: Tension headache, Dehydration, Stress
                        </p>
                      </div>
                      <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">Sore Throat & Cough</h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1 week ago</span>
                        </div>
                        <div className="flex items-center mb-2">
                          <div className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                            Monitor symptoms
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Possible causes: Common cold, Allergies, Viral infection
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">When to Seek Medical Care</CardTitle>
                    <CardDescription>Important guidelines for emergency situations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
                        <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
                          Seek immediate medical attention if you experience:
                        </h4>
                        <ul className="text-xs text-red-700 dark:text-red-400 space-y-1 list-disc pl-4">
                          <li>Difficulty breathing or shortness of breath</li>
                          <li>Chest or upper abdominal pain or pressure</li>
                          <li>Fainting, sudden dizziness, or weakness</li>
                          <li>Changes in vision or difficulty speaking</li>
                          <li>Confusion or changes in mental status</li>
                          <li>Any sudden or severe pain</li>
                          <li>Uncontrolled bleeding</li>
                          <li>Severe or persistent vomiting or diarrhea</li>
                        </ul>
                      </div>
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab("services")}>
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        View Emergency Services
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="m-0">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold text-teal-600 dark:text-teal-400">
                      Healthcare Services
                    </CardTitle>
                    <CardDescription>Find and connect with healthcare providers near you</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <NearbyHospitals />
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Emergency Alert System</CardTitle>
                    <CardDescription>Quick access to emergency services and contacts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EmergencyAlertSystem />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Appointment Booking</CardTitle>
                    <CardDescription>Schedule appointments with healthcare providers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AppointmentBooking />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Health Resources</CardTitle>
                    <CardDescription>Educational materials and health information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <HealthResources />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Health Articles</CardTitle>
                    <CardDescription>Latest health news and articles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h4 className="text-sm font-medium mb-1">Understanding Blood Pressure Readings</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          Learn how to interpret your blood pressure numbers and what they mean for your health.
                        </p>
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          Read Article
                        </Button>
                      </div>
                      <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h4 className="text-sm font-medium mb-1">The Importance of Sleep for Heart Health</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          Discover how quality sleep contributes to cardiovascular health and overall wellbeing.
                        </p>
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          Read Article
                        </Button>
                      </div>
                      <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h4 className="text-sm font-medium mb-1">Nutrition Basics: Building a Balanced Diet</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          Learn the fundamentals of nutrition and how to create balanced meals for optimal health.
                        </p>
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          Read Article
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Health Videos</CardTitle>
                    <CardDescription>Educational videos on health topics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h4 className="text-sm font-medium mb-1">5-Minute Stress Relief Exercises</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          Quick and effective exercises to reduce stress and anxiety in just 5 minutes.
                        </p>
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          Watch Video
                        </Button>
                      </div>
                      <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h4 className="text-sm font-medium mb-1">Understanding Your Lab Results</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          A guide to interpreting common laboratory test results and what they mean for your health.
                        </p>
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          Watch Video
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 md:mb-0">
            © 2025 HealthChat. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/privacy"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
