"use client"

import { useState } from "react"
import { AlertTriangle, Phone, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface EmergencyContact {
  name: string
  relation: string
  phone: string
}

interface EmergencyAlertSystemProps {
  className?: string
  onClose?: () => void
}

export function EmergencyAlertSystem({ className, onClose }: EmergencyAlertSystemProps) {
  const [countdown, setCountdown] = useState<number | null>(null)
  const [alertSent, setAlertSent] = useState(false)
  const [showContacts, setShowContacts] = useState(false)

  // Mock emergency contacts
  const emergencyContacts: EmergencyContact[] = [
    { name: "Emergency Services", relation: "Emergency", phone: "911" },
    { name: "Dr. Sarah Johnson", relation: "Primary Physician", phone: "(555) 123-4567" },
    { name: "John Smith", relation: "Emergency Contact", phone: "(555) 987-6543" },
  ]

  const startCountdown = () => {
    setCountdown(5)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer)
          setAlertSent(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const cancelCountdown = () => {
    setCountdown(null)
  }

  const resetAlert = () => {
    setAlertSent(false)
    setCountdown(null)
  }

  const callEmergency = (phone: string) => {
    window.location.href = `tel:${phone.replace(/[^\d]/g, "")}`
  }

  return (
    <Card className={cn("border-red-200 dark:border-red-900/50 overflow-hidden", className)}>
      <div className="bg-red-500 text-white py-2 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <h3 className="font-medium">Emergency Alert System</h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white hover:text-red-100">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <CardContent className="p-4">
        {alertSent ? (
          <div className="text-center py-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Alert Sent Successfully</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Emergency services have been notified. Help is on the way.
            </p>
            <Button variant="outline" onClick={resetAlert}>
              Reset
            </Button>
          </div>
        ) : countdown !== null ? (
          <div className="text-center py-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">{countdown}</span>
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Sending Alert</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Emergency alert will be sent in {countdown} seconds
            </p>
            <Button variant="destructive" onClick={cancelCountdown}>
              Cancel
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button
                className="h-auto py-4 flex flex-col items-center bg-red-500 hover:bg-red-600"
                onClick={startCountdown}
              >
                <AlertTriangle className="h-6 w-6 mb-2" />
                <span>Medical Emergency</span>
              </Button>
              <Button
                className="h-auto py-4 flex flex-col items-center bg-red-500 hover:bg-red-600"
                onClick={() => callEmergency("911")}
              >
                <Phone className="h-6 w-6 mb-2" />
                <span>Call 911</span>
              </Button>
            </div>

            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setShowContacts(!showContacts)}
              >
                <span>Emergency Contacts</span>
                <span>{showContacts ? "−" : "+"}</span>
              </Button>

              {showContacts && (
                <div className="mt-3 space-y-2">
                  {emergencyContacts.map((contact, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div>
                        <div className="font-medium text-sm">{contact.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{contact.relation}</div>
                      </div>
                      <Button size="sm" variant="outline" className="h-8" onClick={() => callEmergency(contact.phone)}>
                        <Phone className="h-3 w-3 mr-1" />
                        {contact.phone}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
              In case of emergency, please call 911 or your local emergency number immediately.
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
