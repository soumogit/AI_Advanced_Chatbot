"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HealthChart } from "@/components/health-chart"
import { ChartDebugger } from "@/components/chart-debugger"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DebugPage() {
  const [activeTab, setActiveTab] = useState("charts")
  const metrics = ["Heart Rate", "Blood Pressure", "Blood Glucose", "Sleep", "Steps"]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Health Dashboard Diagnostics</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics.map((metric) => (
              <Card key={metric}>
                <CardHeader>
                  <CardTitle className="text-lg">{metric}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <HealthChart
                    title=""
                    metric={metric}
                    unit={
                      metric === "Heart Rate"
                        ? "bpm"
                        : metric === "Blood Pressure"
                          ? "mmHg"
                          : metric === "Blood Glucose"
                            ? "mg/dL"
                            : metric === "Sleep"
                              ? "hrs"
                              : ""
                    }
                    color={
                      metric === "Heart Rate"
                        ? "#ef4444"
                        : metric === "Blood Pressure"
                          ? "#3b82f6"
                          : metric === "Blood Glucose"
                            ? "#f59e0b"
                            : metric === "Sleep"
                              ? "#8b5cf6"
                              : "#10b981"
                    }
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="data" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics.map((metric) => (
              <ChartDebugger key={metric} metric={metric} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button onClick={() => (window.location.href = "/health-dashboard")}>Return to Dashboard</Button>
      </div>
    </div>
  )
}
