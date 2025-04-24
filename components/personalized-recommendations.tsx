"use client"

import { useState } from "react"
import { User, Heart, Activity, Calendar, Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface PersonalizedRecommendationsProps {
  userProfile: {
    name: string
    age: string
    gender: string
    medicalHistory: string[]
    allergies: string[]
    medications: string[]
  }
  symptoms: string[]
  className?: string
}

export function PersonalizedRecommendations({ userProfile, symptoms, className }: PersonalizedRecommendationsProps) {
  const [expanded, setExpanded] = useState(false)

  // Generate recommendations based on user profile and symptoms
  const recommendations = generateRecommendations(userProfile, symptoms)

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-blue-50 dark:bg-blue-900/20 py-3 px-4">
        <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center text-base">
          <User className="h-5 w-5 mr-2" />
          Personalized Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {recommendations.slice(0, expanded ? recommendations.length : 3).map((recommendation, index) => (
            <div
              key={index}
              className="p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 mt-0.5">
                  <recommendation.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">{recommendation.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{recommendation.description}</p>
                  {recommendation.tags && recommendation.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {recommendation.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {recommendations.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-blue-600 dark:text-blue-400"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Show Less" : `Show ${recommendations.length - 3} More Recommendations`}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to generate recommendations based on user profile and symptoms
function generateRecommendations(userProfile: PersonalizedRecommendationsProps["userProfile"], symptoms: string[]) {
  const recommendations = [
    {
      title: "Schedule a follow-up appointment",
      description: "Based on your symptoms, we recommend scheduling a follow-up with your primary care physician.",
      icon: Calendar,
      tags: ["Priority", "Healthcare"],
    },
    {
      title: "Monitor your symptoms",
      description: "Keep track of your symptoms and note any changes in frequency or severity.",
      icon: Activity,
      tags: ["Self-care", "Monitoring"],
    },
  ]

  // Add recommendations based on symptoms
  if (symptoms.includes("headache")) {
    recommendations.push({
      title: "Headache management",
      description: "Ensure you're staying hydrated and consider reducing screen time to help with your headaches.",
      icon: Heart,
      tags: ["Lifestyle", "Self-care"],
    })
  }

  if (symptoms.includes("fever")) {
    recommendations.push({
      title: "Fever management",
      description: "Rest and stay hydrated. Consider over-the-counter fever reducers if appropriate.",
      icon: Pill,
      tags: ["Medication", "Self-care"],
    })
  }

  // Add recommendations based on medical history
  if (userProfile.medicalHistory.includes("hypertension")) {
    recommendations.push({
      title: "Blood pressure monitoring",
      description: "Continue monitoring your blood pressure regularly and maintain your prescribed medication regimen.",
      icon: Activity,
      tags: ["Chronic condition", "Monitoring"],
    })
  }

  if (userProfile.medicalHistory.includes("diabetes")) {
    recommendations.push({
      title: "Blood sugar management",
      description: "Monitor your blood sugar levels closely, especially when experiencing these symptoms.",
      icon: Activity,
      tags: ["Chronic condition", "Monitoring"],
    })
  }

  return recommendations
}
