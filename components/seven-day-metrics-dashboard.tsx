"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Guaranteed data for each metric
const METRICS_DATA = {
  "Heart Rate": [
    { day: "Mon", value: 72 },
    { day: "Tue", value: 75 },
    { day: "Wed", value: 68 },
    { day: "Thu", value: 70 },
    { day: "Fri", value: 74 },
    { day: "Sat", value: 71 },
    { day: "Sun", value: 73 },
  ],
  "Blood Pressure": [
    { day: "Mon", value: 120 },
    { day: "Tue", value: 118 },
    { day: "Wed", value: 122 },
    { day: "Thu", value: 119 },
    { day: "Fri", value: 121 },
    { day: "Sat", value: 117 },
    { day: "Sun", value: 120 },
  ],
  "Daily Steps": [
    { day: "Mon", value: 8500 },
    { day: "Tue", value: 7200 },
    { day: "Wed", value: 9100 },
    { day: "Thu", value: 8300 },
    { day: "Fri", value: 9500 },
    { day: "Sat", value: 11200 },
    { day: "Sun", value: 7800 },
  ],
  "Sleep Duration": [
    { day: "Mon", value: 7.5 },
    { day: "Tue", value: 6.8 },
    { day: "Wed", value: 7.2 },
    { day: "Thu", value: 8.0 },
    { day: "Fri", value: 6.5 },
    { day: "Sat", value: 8.5 },
    { day: "Sun", value: 7.8 },
  ],
}

// Units for each metric
const METRIC_UNITS = {
  "Heart Rate": "bpm",
  "Blood Pressure": "mmHg",
  "Daily Steps": "steps",
  "Sleep Duration": "hours",
}

// Colors for each metric
const METRIC_COLORS = {
  "Heart Rate": "#ef4444",
  "Blood Pressure": "#3b82f6",
  "Daily Steps": "#10b981",
  "Sleep Duration": "#8b5cf6",
}

export default function SevenDayMetricsDashboard() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">7-Day Health Metrics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(METRICS_DATA).map((metric) => (
          <Card key={metric} className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle>{metric}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={METRICS_DATA[metric]} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}`} tickLine={false} />
                    <Tooltip
                      formatter={(value) => [`${value} ${METRIC_UNITS[metric]}`, metric]}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #f0f0f0",
                        borderRadius: "4px",
                        padding: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={METRIC_COLORS[metric]}
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
