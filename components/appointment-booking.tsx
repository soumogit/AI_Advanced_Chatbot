"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, Clock, User, FileText, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AppointmentBookingProps {
  className?: string
  onClose?: () => void
  patientName?: string
  patientSymptoms?: string
}

type AppointmentType = "checkup" | "consultation" | "followup" | "specialist"
type TimeSlot = { time: string; available: boolean }

export function AppointmentBooking({ className, onClose, patientName, patientSymptoms }: AppointmentBookingProps) {
  const [step, setStep] = useState(1)
  const [appointmentType, setAppointmentType] = useState<AppointmentType | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: patientName || "",
    phone: "",
    email: "",
    notes: patientSymptoms ? `Symptoms: ${patientSymptoms}` : "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isBooked, setIsBooked] = useState(false)

  // Generate next 7 available dates (excluding weekends for demo)
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    let daysToAdd = 0

    while (dates.length < 7) {
      const date = new Date(today)
      date.setDate(today.getDate() + daysToAdd)

      // Skip weekends for this demo
      const day = date.getDay()
      if (day !== 0 && day !== 6) {
        dates.push({
          date: date.toISOString().split("T")[0],
          display: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        })
      }

      daysToAdd++
    }

    return dates
  }

  // Generate time slots
  const getTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const startHour = 9
    const endHour = 17

    for (let hour = startHour; hour < endHour; hour++) {
      // Morning slots
      slots.push({
        time: `${hour}:00`,
        available: Math.random() > 0.3, // Randomly mark some as unavailable
      })
      slots.push({
        time: `${hour}:30`,
        available: Math.random() > 0.3,
      })
    }

    return slots
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsBooked(true)
    }, 1500)
  }

  const resetForm = () => {
    setStep(1)
    setAppointmentType(null)
    setSelectedDate(null)
    setSelectedTime(null)
    setFormData({
      name: "",
      phone: "",
      email: "",
      notes: "",
    })
    setIsBooked(false)
  }

  const appointmentTypes = [
    { id: "checkup", label: "General Checkup", icon: <User className="h-5 w-5" /> },
    { id: "consultation", label: "Consultation", icon: <FileText className="h-5 w-5" /> },
    { id: "followup", label: "Follow-up Visit", icon: <Clock className="h-5 w-5" /> },
    { id: "specialist", label: "Specialist Referral", icon: <User className="h-5 w-5" /> },
  ]

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-teal-500 text-white py-4 px-6">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Book an Appointment
          </CardTitle>
          {onClose && (
            <button onClick={onClose} className="text-white hover:text-teal-100">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {isBooked ? (
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Appointment Confirmed!</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your appointment has been scheduled for:</p>
            <p className="font-medium text-teal-600 dark:text-teal-400 mb-4">
              {selectedDate &&
                new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}{" "}
              at {selectedTime}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              A confirmation has been sent to your email. You will receive a reminder 24 hours before your appointment.
            </p>
            <Button onClick={resetForm}>Book Another Appointment</Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-4">
              <div className="flex space-x-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-8 h-1 rounded-full",
                      step >= i ? "bg-teal-500 dark:bg-teal-400" : "bg-gray-200 dark:bg-gray-700",
                    )}
                  ></div>
                ))}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Step {step} of 3</div>
            </div>

            {step === 1 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Select Appointment Type</h4>
                <div className="grid grid-cols-2 gap-3">
                  {appointmentTypes.map((type) => (
                    <button
                      key={type.id}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-lg border transition-all",
                        appointmentType === type.id
                          ? "border-teal-500 dark:border-teal-400 bg-teal-50 dark:bg-teal-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-800",
                      )}
                      onClick={() => setAppointmentType(type.id as AppointmentType)}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center mb-2",
                          appointmentType === type.id
                            ? "bg-teal-100 dark:bg-teal-800/50 text-teal-600 dark:text-teal-400"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
                        )}
                      >
                        {type.icon}
                      </div>
                      <span className="text-sm">{type.label}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => setStep(2)} disabled={!appointmentType}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Select Date & Time</h4>
                <div className="mb-4">
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Available Dates</label>
                  <div className="grid grid-cols-3 gap-2">
                    {getAvailableDates().map((date) => (
                      <button
                        key={date.date}
                        className={cn(
                          "p-2 text-center rounded-lg border text-sm transition-all",
                          selectedDate === date.date
                            ? "border-teal-500 dark:border-teal-400 bg-teal-50 dark:bg-teal-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-800",
                        )}
                        onClick={() => setSelectedDate(date.date)}
                      >
                        {date.display}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedDate && (
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Available Time Slots</label>
                    <div className="grid grid-cols-4 gap-2">
                      {getTimeSlots().map((slot, index) => (
                        <button
                          key={index}
                          disabled={!slot.available}
                          className={cn(
                            "p-2 text-center rounded-lg border text-xs transition-all",
                            !slot.available && "opacity-50 cursor-not-allowed",
                            selectedTime === slot.time
                              ? "border-teal-500 dark:border-teal-400 bg-teal-50 dark:bg-teal-900/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-800",
                          )}
                          onClick={() => slot.available && setSelectedTime(slot.time)}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} disabled={!selectedDate || !selectedTime}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit}>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Your Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Notes (Optional)</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 bg-white dark:bg-gray-800"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Booking...
                      </>
                    ) : (
                      "Confirm Appointment"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
