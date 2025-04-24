"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateHealthHistory } from "@/utils/health-metrics"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { cn } from "@/lib/utils"

interface HealthChartProps {
  title: string
  metric: string
  unit: string
  className?: string
  color?: string
  fillColor?: string
  timeRange?: "7d" | "14d" | "30d" | "90d"
}

export function HealthChart({
  title,
  metric,
  unit,
  className,
  color = "#14b8a6",
  fillColor = "rgba(20, 184, 166, 0.2)",
  timeRange = "14d",
}: HealthChartProps) {
  const [data, setData] = useState<any[]>([])
  const [selectedRange, setSelectedRange] = useState<"7d" | "14d" | "30d" | "90d">(timeRange)

  useEffect(() => {
    // Generate data based on the selected time range
    const days = selectedRange === "7d" ? 7 : selectedRange === "14d" ? 14 : selectedRange === "30d" ? 30 : 90
    const generatedData = generateHealthHistory(metric, days)

    // Ensure data is properly formatted
    if (Array.isArray(generatedData) && generatedData.length > 0) {
      setData(generatedData)
    } else {
      console.error("Invalid data generated for metric:", metric)
      // Provide fallback data if generation fails
      setData([{ date: new Date().toISOString().split("T")[0], value: 0 }])
    }
  }, [metric, selectedRange])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <Tabs defaultValue={selectedRange} onValueChange={(value) => setSelectedRange(value as any)}>
            <TabsList className="h-7 p-1">
              <TabsTrigger value="7d" className="text-xs px-2 py-0.5">
                7D
              </TabsTrigger>
              <TabsTrigger value="14d" className="text-xs px-2 py-0.5">
                14D
              </TabsTrigger>
              <TabsTrigger value="30d" className="text-xs px-2 py-0.5">
                30D
              </TabsTrigger>
              <TabsTrigger value="90d" className="text-xs px-2 py-0.5">
                90D
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {data.length > 0 ? (
              <AreaChart
                data={data}
                margin={{
                  top: 5,
                  right: 20,
                  left: 10,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient id={`color${metric.replace(/\s+/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(120, 120, 120, 0.15)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 10 }}
                  tickMargin={5}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => `${value}${unit}`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [`${value} ${unit}`, metric]}
                  labelFormatter={(label) => formatDate(label)}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid #f0f0f0",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  fillOpacity={1}
                  fill={`url(#color${metric.replace(/\s+/g, "")}`}
                />
              </AreaChart>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">No data available</div>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
