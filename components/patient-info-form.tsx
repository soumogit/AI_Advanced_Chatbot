"use client"

import type React from "react"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

interface PatientInfoFormProps {
  onSubmit: (info: {
    name: string
    age: string
    symptoms: string
    additionalSymptoms: string
  }) => void
}

export default function PatientInfoForm({ onSubmit }: PatientInfoFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    symptoms: "",
    additionalSymptoms: "",
  })

  const [errors, setErrors] = useState({
    name: "",
    age: "",
    symptoms: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors = {
      name: !formData.name.trim() ? "Name is required" : "",
      age: !formData.age.trim() ? "Age is required" : "",
      symptoms: !formData.symptoms.trim() ? "Primary symptoms are required" : "",
    }

    setErrors(newErrors)

    // If no errors, submit the form
    if (!newErrors.name && !newErrors.age && !newErrors.symptoms) {
      onSubmit(formData)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-teal-600 mb-2">HealthChat</h1>
          <p className="text-gray-600">Please provide your information to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.age ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your age"
              min="1"
              max="120"
            />
            {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age}</p>}
          </div>

          <div>
            <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
              Primary Symptoms
            </label>
            <textarea
              id="symptoms"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              rows={2}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.symptoms ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Describe your main symptoms"
            />
            {errors.symptoms && <p className="mt-1 text-sm text-red-500">{errors.symptoms}</p>}
          </div>

          <div>
            <label htmlFor="additionalSymptoms" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Symptoms (Optional)
            </label>
            <textarea
              id="additionalSymptoms"
              name="additionalSymptoms"
              value={formData.additionalSymptoms}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Any other symptoms you're experiencing"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
          >
            <span>Start Consultation</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-gray-500">
          This AI assistant is not a substitute for professional medical advice, diagnosis, or treatment.
        </p>
      </div>
    </div>
  )
}
