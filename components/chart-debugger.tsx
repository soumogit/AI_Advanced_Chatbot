"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateHealthHistory } from "@/utils/health-metrics"

interface ChartDebuggerProps {
  metric: string
  days?: number
}

export function ChartDebugger({ metric, days = 14 }: ChartDebuggerProps) {
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const generatedData = generateHealthHistory(metric, days)
      setData(generatedData)
      setError(null)
    } catch (err) {
      setError(`Error generating data: ${err instanceof Error ? err.message : String(err)}`)
    }
  }, [metric, days])

  const regenerateData = () => {
    try {
      const generatedData = generateHealthHistory(metric, days)
      setData(generatedData)
      setError(null)
    } catch (err) {
      setError(`Error generating data: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Chart Debugger: {metric}</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md">{error}</div>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Generated Data ({data.length} points):</h3>
              <div className="max-h-40 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
              </div>
            </div>
          </>
        )}
        <Button size="sm" onClick={regenerateData}>
          Regenerate Data
        </Button>
      </CardContent>
    </Card>
  )
}
