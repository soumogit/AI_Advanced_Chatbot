"use client"

import { useState } from "react"
import { AlertTriangle, X, Phone, MapPin, Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface EmergencyDetectionSystemProps {
  onDismiss: () => void
}

export function EmergencyDetectionSystem({ onDismiss }: EmergencyDetectionSystemProps) {
  const [showingDetails, setShowingDetails] = useState(false)

  const emergencyServices = [
    { name: "Emergency Services", number: "911", icon: Phone },
    { name: "Poison Control", number: "1-800-222-1222", icon: Pill },
  ]

  const nearbyHospitals = [
    { name: "General Hospital", distance: "2.3 miles", address: "123 Main St" },
    { name: "Memorial Medical Center", distance: "3.7 miles", address: "456 Oak Ave" },
    { name: "University Hospital", distance: "5.1 miles", address: "789 College Blvd" },
  ]

  return (
    <Card className="bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800 mb-6 overflow-hidden">
      <CardHeader className="bg-red-100 dark:bg-red-900/30 py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-red-700 dark:text-red-300 flex items-center text-base">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Medical Emergency Detected
        </CardTitle>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onDismiss}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-red-700 dark:text-red-300 font-medium mb-2">
          Your symptoms may indicate a serious medical condition requiring immediate attention.
        </p>
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">
          If you're experiencing chest pain, difficulty breathing, severe bleeding, or other emergency symptoms, please
          seek immediate medical help.
        </p>

        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">Emergency Contacts:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {emergencyServices.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 bg-white dark:bg-gray-800 rounded-md border border-red-200 dark:border-red-800/50"
                >
                  <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3">
                    <service.icon className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{service.name}</p>
                    <p className="text-sm text-red-600 dark:text-red-400">{service.number}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showingDetails && (
            <div>
              <h3 className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">Nearby Hospitals:</h3>
              <div className="space-y-2">
                {nearbyHospitals.map((hospital, index) => (
                  <div
                    key={index}
                    className="p-2 bg-white dark:bg-gray-800 rounded-md border border-red-200 dark:border-red-800/50"
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3">
                        <MapPin className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{hospital.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {hospital.address} • {hospital.distance}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-red-50 dark:bg-red-900/10 p-3 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-800/50"
          onClick={() => setShowingDetails(!showingDetails)}
        >
          {showingDetails ? "Hide Details" : "Show Nearby Hospitals"}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            // In a real app, this would initiate a call
            window.location.href = "tel:911"
          }}
        >
          Call 911
        </Button>
      </CardFooter>
    </Card>
  )
}
