"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Heart,
  Activity,
  Footprints,
  Moon,
  ArrowUpRight,
  ArrowDownRight,
  Maximize2,
  BarChart3,
  LineChartIcon,
  PieChart,
  Settings,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Sample data for each metric
const generateWeekData = (startDate = new Date()) => {
  const result = []
  const date = new Date(startDate)
  date.setDate(date.getDate() - 6) // Start 6 days ago

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(date)
    currentDate.setDate(date.getDate() + i)

    // Generate realistic data with some variation
    const heartRate = Math.floor(65 + Math.random() * 20)
    const systolic = Math.floor(110 + Math.random() * 20)
    const diastolic = Math.floor(70 + Math.random() * 15)
    const steps = Math.floor(5000 + Math.random() * 7000)
    const sleep = 5 + Math.random() * 4

    result.push({
      date: currentDate.toISOString().split("T")[0],
      day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][currentDate.getDay()],
      heartRate,
      bloodPressure: {
        systolic,
        diastolic,
      },
      steps,
      sleep,
      // Add target values for comparison
      targetSteps: 10000,
      targetSleep: 8,
    })
  }

  return result
}

// Calculate trends and statistics
const calculateStats = (data) => {
  if (!data || data.length < 2) return { trend: 0, average: 0, min: 0, max: 0 }

  const values = data.map((d) => d.value)
  const average = values.reduce((a, b) => a + b, 0) / values.length
  const min = Math.min(...values)
  const max = Math.max(...values)
  const trend = values[values.length - 1] - values[0]

  return { trend, average, min, max }
}

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
        <p className="font-medium text-sm">{formatDate(label)}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value} {unit}
          </p>
        ))}
      </div>
    )
  }
  return null
}

// Blood pressure tooltip component
const BloodPressureTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
        <p className="font-medium text-sm">{formatDate(label)}</p>
        <p className="text-sm text-blue-500">Systolic: {payload[0]?.value} mmHg</p>
        <p className="text-sm text-indigo-500">Diastolic: {payload[1]?.value} mmHg</p>
      </div>
    )
  }
  return null
}

// Metric summary card component
const MetricSummaryCard = ({ title, value, unit, change, icon, color, onClick }) => {
  const isPositive = change > 0
  const isNeutral = change === 0

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <div className="flex items-baseline mt-1">
              <span className="text-2xl font-bold">{value}</span>
              <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">{unit}</span>
            </div>
          </div>
          <div className={`p-2 rounded-full bg-${color}-100 dark:bg-${color}-900/30`}>{icon}</div>
        </div>

        <div className="mt-3 flex items-center">
          <span
            className={cn(
              "text-xs font-medium flex items-center",
              isPositive
                ? "text-green-600 dark:text-green-400"
                : isNeutral
                  ? "text-gray-500 dark:text-gray-400"
                  : "text-red-600 dark:text-red-400",
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : isNeutral ? null : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            {Math.abs(change).toFixed(1)}% from last week
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

// Main component
export function HealthMetricsDashboard() {
  const [data, setData] = useState([])
  const [timeframe, setTimeframe] = useState("7d")
  const [chartType, setChartType] = useState("line")
  const [selectedMetric, setSelectedMetric] = useState("all")
  const [showTargets, setShowTargets] = useState(true)
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 6)),
    end: new Date(),
  })

  // Generate data on mount and when date range changes
  useEffect(() => {
    setData(generateWeekData(dateRange.end))
  }, [dateRange])

  // Navigate to previous week
  const goToPreviousWeek = () => {
    setDateRange((prev) => {
      const newEnd = new Date(prev.start)
      newEnd.setDate(newEnd.getDate() - 1)
      const newStart = new Date(newEnd)
      newStart.setDate(newEnd.getDate() - 6)
      return { start: newStart, end: newEnd }
    })
  }

  // Navigate to next week
  const goToNextWeek = () => {
    const today = new Date()
    setDateRange((prev) => {
      const newStart = new Date(prev.end)
      newStart.setDate(newStart.getDate() + 1)
      const newEnd = new Date(newStart)
      newEnd.setDate(newStart.getDate() + 6)
      // Don't allow going beyond today
      if (newEnd > today) {
        newEnd.setTime(today.getTime())
        newStart.setTime(new Date(today.setDate(today.getDate() - 6)).getTime())
      }
      return { start: newStart, end: newEnd }
    })
  }

  // Format date range for display
  const formatDateRange = () => {
    const startFormatted = dateRange.start.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const endFormatted = dateRange.end.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    return `${startFormatted} - ${endFormatted}`
  }

  // Prepare data for heart rate chart
  const heartRateData = data.map((d) => ({
    date: d.date,
    day: d.day,
    value: d.heartRate,
  }))

  // Prepare data for blood pressure chart
  const bloodPressureData = data.map((d) => ({
    date: d.date,
    day: d.day,
    systolic: d.bloodPressure.systolic,
    diastolic: d.bloodPressure.diastolic,
  }))

  // Prepare data for steps chart
  const stepsData = data.map((d) => ({
    date: d.date,
    day: d.day,
    value: d.steps,
    target: d.targetSteps,
  }))

  // Prepare data for sleep chart
  const sleepData = data.map((d) => ({
    date: d.date,
    day: d.day,
    value: d.sleep,
    target: d.targetSleep,
  }))

  // Calculate statistics
  const heartRateStats = calculateStats(heartRateData)
  const stepsStats = calculateStats(stepsData)
  const sleepStats = calculateStats(sleepData)

  // Calculate blood pressure average
  const bpSystolicAvg = bloodPressureData.reduce((sum, d) => sum + d.systolic, 0) / bloodPressureData.length
  const bpDiastolicAvg = bloodPressureData.reduce((sum, d) => sum + d.diastolic, 0) / bloodPressureData.length

  // Calculate trends (percentage change from first to last day)
  const calculateTrend = (data) => {
    if (!data || data.length < 2) return 0
    const firstValue = data[0].value
    const lastValue = data[data.length - 1].value
    return firstValue === 0 ? 0 : ((lastValue - firstValue) / firstValue) * 100
  }

  const heartRateTrend = calculateTrend(heartRateData)
  const stepsTrend = calculateTrend(stepsData)
  const sleepTrend = calculateTrend(sleepData)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Health Metrics</h2>
          <p className="text-gray-500 dark:text-gray-400">Track your health metrics over time</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center border rounded-md overflow-hidden">
            <Button variant="ghost" size="sm" onClick={goToPreviousWeek} className="h-8 px-2">
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="px-2 py-1 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm">{formatDateRange()}</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextWeek}
              className="h-8 px-2"
              disabled={dateRange.end.toDateString() === new Date().toDateString()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="h-8 w-[100px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="14d">14 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="h-8">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricSummaryCard
          title="Heart Rate"
          value={Math.round(heartRateStats.average)}
          unit="bpm"
          change={heartRateTrend}
          icon={<Heart className="h-5 w-5 text-red-500" />}
          color="red"
          onClick={() => setSelectedMetric("heartRate")}
        />

        <MetricSummaryCard
          title="Blood Pressure"
          value={`${Math.round(bpSystolicAvg)}/${Math.round(bpDiastolicAvg)}`}
          unit="mmHg"
          change={0} // Blood pressure trend is more complex
          icon={<Activity className="h-5 w-5 text-blue-500" />}
          color="blue"
          onClick={() => setSelectedMetric("bloodPressure")}
        />

        <MetricSummaryCard
          title="Daily Steps"
          value={Math.round(stepsStats.average).toLocaleString()}
          unit="steps"
          change={stepsTrend}
          icon={<Footprints className="h-5 w-5 text-green-500" />}
          color="green"
          onClick={() => setSelectedMetric("steps")}
        />

        <MetricSummaryCard
          title="Sleep Duration"
          value={sleepStats.average.toFixed(1)}
          unit="hours"
          change={sleepTrend}
          icon={<Moon className="h-5 w-5 text-purple-500" />}
          color="purple"
          onClick={() => setSelectedMetric("sleep")}
        />
      </div>

      {/* Chart Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="h-8 w-[150px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Metrics</SelectItem>
              <SelectItem value="heartRate">Heart Rate</SelectItem>
              <SelectItem value="bloodPressure">Blood Pressure</SelectItem>
              <SelectItem value="steps">Daily Steps</SelectItem>
              <SelectItem value="sleep">Sleep Duration</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-1 border rounded-md p-1">
            <Button
              variant={chartType === "line" ? "default" : "ghost"}
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setChartType("line")}
            >
              <LineChartIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={chartType === "bar" ? "default" : "ghost"}
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setChartType("bar")}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button
              variant={chartType === "area" ? "default" : "ghost"}
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setChartType("area")}
            >
              <PieChart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="show-targets" checked={showTargets} onCheckedChange={setShowTargets} />
            <Label htmlFor="show-targets" className="text-sm">
              Show targets
            </Label>
          </div>

          <Button variant="ghost" size="sm" className="h-8">
            <Settings className="h-4 w-4 mr-2" />
            Customize
          </Button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        {/* Conditional rendering based on selected metric */}
        {(selectedMetric === "all" || selectedMetric === "heartRate") && (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 text-red-500 mr-2" />
                    Heart Rate
                  </CardTitle>
                  <CardDescription>Average: {Math.round(heartRateStats.average)} bpm</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="h-8">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "line" ? (
                    <LineChart data={heartRateData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(120, 120, 120, 0.15)" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                      />
                      <YAxis
                        domain={["dataMin - 5", "dataMax + 5"]}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip content={<CustomTooltip unit="bpm" />} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Heart Rate"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                      <ReferenceLine y={60} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.6}>
                        <Label value="Min" position="insideBottomLeft" fontSize={10} fill="#ef4444" />
                      </ReferenceLine>
                      <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.6}>
                        <Label value="Max" position="insideTopLeft" fontSize={10} fill="#ef4444" />
                      </ReferenceLine>
                    </LineChart>
                  ) : chartType === "bar" ? (
                    <BarChart data={heartRateData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(120, 120, 120, 0.15)" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                      />
                      <YAxis
                        domain={["dataMin - 5", "dataMax + 5"]}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip content={<CustomTooltip unit="bpm" />} />
                      <Bar dataKey="value" name="Heart Rate" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <AreaChart data={heartRateData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(120, 120, 120, 0.15)" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                      />
                      <YAxis
                        domain={["dataMin - 5", "dataMax + 5"]}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip content={<CustomTooltip unit="bpm" />} />
                      <defs>
                        <linearGradient id="colorHeartRate" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        name="Heart Rate"
                        stroke="#ef4444"
                        fillOpacity={1}
                        fill="url(#colorHeartRate)"
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Min</p>
                  <p className="text-lg font-semibold">
                    {Math.round(heartRateStats.min)} <span className="text-xs">bpm</span>
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Average</p>
                  <p className="text-lg font-semibold">
                    {Math.round(heartRateStats.average)} <span className="text-xs">bpm</span>
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Max</p>
                  <p className="text-lg font-semibold">
                    {Math.round(heartRateStats.max)} <span className="text-xs">bpm</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {(selectedMetric === "all" || selectedMetric === "bloodPressure") && (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 text-blue-500 mr-2" />
                    Blood Pressure
                  </CardTitle>
                  <CardDescription>
                    Average: {Math.round(bpSystolicAvg)}/{Math.round(bpDiastolicAvg)} mmHg
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="h-8">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "line" ? (
                    <LineChart data={bloodPressureData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(120, 120, 120, 0.15)" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                      />
                      <YAxis
                        domain={[60, "dataMax + 10"]}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip content={<BloodPressureTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="systolic"
                        name="Systolic"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="diastolic"
                        name="Diastolic"
                        stroke="#6366f1"
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                      {showTargets && (
                        <>
                          <ReferenceLine y={120} stroke="#3b82f6" strokeDasharray="3 3" strokeOpacity={0.6}>
                            <Label value="Normal Systolic" position="insideBottomLeft" fontSize={10} fill="#3b82f6" />
                          </ReferenceLine>
                          <ReferenceLine y={80} stroke="#6366f1" strokeDasharray="3 3" strokeOpacity={0.6}>
                            <Label value="Normal Diastolic" position="insideBottomLeft" fontSize={10} fill="#6366f1" />
                          </ReferenceLine>
                        </>
                      )}
                    </LineChart>
                  ) : chartType === "bar" ? (
                    <BarChart data={bloodPressureData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(120, 120, 120, 0.15)" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                      />
                      <YAxis
                        domain={[60, "dataMax + 10"]}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip content={<BloodPressureTooltip />} />
                      <Legend />
                      <Bar dataKey="systolic" name="Systolic" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="diastolic" name="Diastolic" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <AreaChart data={bloodPressureData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(120, 120, 120, 0.15)" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                      />
                      <YAxis
                        domain={[60, "dataMax + 10"]}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip content={<BloodPressureTooltip />} />
                      <Legend />
                      <defs>
                        <linearGradient id="colorSystolic" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorDiastolic" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="systolic"
                        name="Systolic"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorSystolic)"
                      />
                      <Area
                        type="monotone"
                        dataKey="diastolic"
                        name="Diastolic"
                        stroke="#6366f1"
                        fillOpacity={1}
                        fill="url(#colorDiastolic)"
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Average Systolic</p>
                  <p className="text-lg font-semibold">
                    {Math.round(bpSystolicAvg)} <span className="text-xs">mmHg</span>
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Average Diastolic</p>
                  <p className="text-lg font-semibold">
                    {Math.round(bpDiastolicAvg)} <span className="text-xs">mmHg</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {(selectedMetric === "all" || selectedMetric === "steps") && (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Footprints className="h-5 w-5 text-green-500 mr-2" />
                    Daily Steps
                  </CardTitle>
                  <CardDescription>Average: {Math.round(stepsStats.average).toLocaleString()} steps</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="h-8">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "line" ? (
                    <LineChart data={stepsData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(120, 120, 120, 0.15)" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                      />
                      <YAxis
                        domain={[0, "auto"]}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${value / 1000}k`}
                      />
                      <Tooltip content={<CustomTooltip unit="steps" />} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Steps"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                      {showTargets && (
                        <ReferenceLine y={10000} stroke="#10b981" strokeDasharray="3 3" strokeOpacity={0.6}>
                          <Label value="Target" position="insideBottomLeft" fontSize={10} fill="#10b981" />
                        </ReferenceLine>
                      )}
                    </LineChart>
                  ) : chartType === "bar" ? (
                    <BarChart data={stepsData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(120, 120, 120, 0.15)" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                      />
                      <YAxis
                        domain={[0, "auto"]}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${value / 1000}k`}
                      />
                      <Tooltip content={<CustomTooltip unit="steps" />} />
                      <Bar dataKey="value" name="Steps" fill="#10b981" radius={[4, 4, 0, 0]} />
                      {showTargets && (
                        <ReferenceLine y={10000} stroke="#10b981" strokeDasharray="3 3" strokeOpacity={0.6} />
                      )}
                    </BarChart>
                  ) : (
                    <AreaChart data={stepsData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(120, 120, 120, 0.15)" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                      />
                      <YAxis
                        domain={[0, "auto"]}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${value / 1000}k`}
                      />
                      <Tooltip content={<CustomTooltip unit="steps" />} />
                      <defs>
                        <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        name="Steps"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorSteps)"
                      />
                      {showTargets && (
                        <ReferenceLine y={10000} stroke="#10b981" strokeDasharray="3 3" strokeOpacity={0.6} />
                      )}
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Average</p>
                  <p className="text-lg font-semibold">
                    {Math.round(stepsStats.average).toLocaleString()} <span className="text-xs">steps</span>
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Target</p>
                  <p className="text-lg font-semibold">
                    10,000 <span className="text-xs">steps</span>
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Progress</p>
                  <p className="text-lg font-semibold">
                    {Math.round((stepsStats.average / 10000) * 100)}% <span className="text-xs">of goal</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {(selectedMetric === "all" || selectedMetric === "sleep") && (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Moon className="h-5 w-5 text-purple-500 mr-2" />
                    Sleep Duration
                  </CardTitle>
                  <CardDescription>Average: {sleepStats.average.toFixed(1)} hours</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="h-8">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "line" ? (
                    <LineChart data={sleepData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(120, 120, 120, 0.15)" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                      />
                      <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}`} />
                      <Tooltip content={<CustomTooltip unit="hours" />} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Sleep"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                      {showTargets && (
                        <ReferenceLine y={8} stroke="#8b5cf6" strokeDasharray="3 3" strokeOpacity={0.6}>
                          <Label value="Target" position="insideBottomLeft" fontSize={10} fill="#8b5cf6" />
                        </ReferenceLine>
                      )}
                    </LineChart>
                  ) : chartType === "bar" ? (
                    <BarChart data={sleepData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(120, 120, 120, 0.15)" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                      />
                      <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}`} />
                      <Tooltip content={<CustomTooltip unit="hours" />} />
                      <Bar dataKey="value" name="Sleep" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      {showTargets && (
                        <ReferenceLine y={8} stroke="#8b5cf6" strokeDasharray="3 3" strokeOpacity={0.6} />
                      )}
                    </BarChart>
                  ) : (
                    <AreaChart data={sleepData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(120, 120, 120, 0.15)" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                      />
                      <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}`} />
                      <Tooltip content={<CustomTooltip unit="hours" />} />
                      <defs>
                        <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        name="Sleep"
                        stroke="#8b5cf6"
                        fillOpacity={1}
                        fill="url(#colorSleep)"
                      />
                      {showTargets && (
                        <ReferenceLine y={8} stroke="#8b5cf6" strokeDasharray="3 3" strokeOpacity={0.6} />
                      )}
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Average</p>
                  <p className="text-lg font-semibold">
                    {sleepStats.average.toFixed(1)} <span className="text-xs">hours</span>
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Target</p>
                  <p className="text-lg font-semibold">
                    8.0 <span className="text-xs">hours</span>
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Quality</p>
                  <p className="text-lg font-semibold">
                    {Math.round((sleepStats.average / 8) * 100)}% <span className="text-xs">of goal</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Health Data Table</CardTitle>
            <Button variant="outline" size="sm" className="h-8">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-right py-3 px-4">Heart Rate</th>
                  <th className="text-right py-3 px-4">Blood Pressure</th>
                  <th className="text-right py-3 px-4">Steps</th>
                  <th className="text-right py-3 px-4">Sleep</th>
                </tr>
              </thead>
              <tbody>
                {data.map((day) => (
                  <tr key={day.date} className="border-b">
                    <td className="py-3 px-4">
                      {formatDate(day.date)} ({day.day})
                    </td>
                    <td className="text-right py-3 px-4">{day.heartRate} bpm</td>
                    <td className="text-right py-3 px-4">
                      {day.bloodPressure.systolic}/{day.bloodPressure.diastolic} mmHg
                    </td>
                    <td className="text-right py-3 px-4">{day.steps.toLocaleString()} steps</td>
                    <td className="text-right py-3 px-4">{day.sleep.toFixed(1)} hours</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Health Insights */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Info className="h-5 w-5 text-teal-500 mr-2" />
            Health Insights
          </CardTitle>
          <CardDescription>Personalized insights based on your health data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Sleep Pattern</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Your sleep duration varies significantly throughout the week. Aim for a more consistent sleep schedule
                to improve overall sleep quality.
              </p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/50">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">Activity Level</h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                You're averaging {Math.round(stepsStats.average).toLocaleString()} steps daily, which is{" "}
                {Math.round(stepsStats.average) >= 10000 ? "meeting" : "below"} the recommended 10,000 steps.{" "}
                {Math.round(stepsStats.average) < 10000
                  ? "Try to increase your daily activity."
                  : "Great job maintaining an active lifestyle!"}
              </p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/50">
              <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-2">Heart Rate Trends</h3>
              <p className="text-sm text-purple-700 dark:text-purple-400">
                Your resting heart rate is within normal range. Continue monitoring for any significant changes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
