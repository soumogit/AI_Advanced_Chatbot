"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SevenDayHealthChart } from "@/components/seven-day-health-chart"

export function GuaranteedHealthDashboard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Health Metrics Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SevenDayHealthChart title="Heart Rate" metric="Heart Rate" unit="bpm" color="#ef4444" />

          <SevenDayHealthChart title="Blood Pressure" metric="Blood Pressure" unit="mmHg" color="#3b82f6" />

          <SevenDayHealthChart title="Sleep Duration" metric="Sleep" unit="hrs" color="#8b5cf6" />

          <SevenDayHealthChart title="Daily Steps" metric="Steps" unit="" color="#10b981" />
        </div>
      </CardContent>
    </Card>
  )
}
