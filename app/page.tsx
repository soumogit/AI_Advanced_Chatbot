"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { SplashScreen } from "@/components/splash-screen"
import {
  Send,
  Loader2,
  Sparkles,
  BotIcon,
  ShieldAlert,
  Moon,
  Sun,
  Zap,
  Clock,
  ThermometerIcon,
  MessageSquare,
  Mic,
  Activity,
} from "lucide-react"
import ChatMessage from "@/components/chat-message"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TypingIndicator } from "@/components/typing-indicator"
import { InteractiveSymptomSelector } from "@/components/interactive-symptom-selector"
import { InteractiveDurationSelector } from "@/components/interactive-duration-selector"
import { SeveritySlider } from "@/components/severity-slider"
import { SymptomBadge } from "@/components/symptom-badge"
import { useTheme } from "next-themes"
import Link from "next/link"
import { AppointmentBooking } from "@/components/appointment-booking"
import { GuaranteedHealthDashboard } from "@/components/guaranteed-health-dashboard"

type MessageType = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

type ConversationStage =
  | "greeting"
  | "ask_name"
  | "ask_age"
  | "ask_symptoms"
  | "ask_additional_symptoms"
  | "ask_duration"
  | "ask_severity"
  | "diagnosis"

export default function HealthchatPage() {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [stage, setStage] = useState<ConversationStage>("greeting")
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age: "",
    symptoms: "",
    additionalSymptoms: "",
    duration: "",
    severity: "",
  })
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [latestMessageId, setLatestMessageId] = useState<string | null>(null)
  const [showSymptomSelector, setShowSymptomSelector] = useState(false)
  const [showDurationSelector, setShowDurationSelector] = useState(false)
  const [showSeveritySlider, setShowSeveritySlider] = useState(false)
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([])
  const [conversationProgress, setConversationProgress] = useState(0)
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showPostDiagnosisOptions, setShowPostDiagnosisOptions] = useState(false)
  const [diagnosisReport, setDiagnosisReport] = useState("")
  const [showSplash, setShowSplash] = useState(true)
  // Add a new state to track if we should show the appointment booking modal
  const [showAppointmentBooking, setShowAppointmentBooking] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Start conversation with greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greetingMessage = {
        id: Date.now().toString(),
        role: "assistant" as const,
        content:
          "👋 Hello! I'm your AI healthcare assistant. I'm here to help you understand your symptoms. What's your name?",
      }
      setMessages([greetingMessage])
      setLatestMessageId(greetingMessage.id)
      setStage("ask_name")
      setConversationProgress(10)
      setSuggestedReplies([])
    }
  }, [messages.length])

  // Focus input field when it appears
  useEffect(() => {
    inputRef.current?.focus()
  }, [stage])

  // Update suggested replies based on conversation stage
  useEffect(() => {
    switch (stage) {
      case "ask_name":
        setSuggestedReplies([])
        break
      case "ask_age":
        setSuggestedReplies(["18-25", "26-40", "41-60", "60+"])
        break
      case "ask_symptoms":
        setSuggestedReplies([])
        setShowSymptomSelector(true)
        break
      case "ask_duration":
        setSuggestedReplies([])
        setShowDurationSelector(true)
        break
      case "ask_severity":
        setSuggestedReplies([])
        setShowSeveritySlider(true)
        break
      case "diagnosis":
        setSuggestedReplies(["Thank you", "I have more questions", "Is this serious?"])
        break
      default:
        setSuggestedReplies([])
    }
  }, [stage])

  // Update progress based on stage
  useEffect(() => {
    switch (stage) {
      case "greeting":
        setConversationProgress(10)
        break
      case "ask_name":
        setConversationProgress(20)
        break
      case "ask_age":
        setConversationProgress(30)
        break
      case "ask_symptoms":
        setConversationProgress(45)
        break
      case "ask_additional_symptoms":
        setConversationProgress(60)
        break
      case "ask_duration":
        setConversationProgress(75)
        break
      case "ask_severity":
        setConversationProgress(90)
        break
      case "diagnosis":
        setConversationProgress(100)
        break
    }
  }, [stage])

  // Handle splash screen timer
  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false)
      }, 8000) // Set to 8 seconds to account for exit animation
      return () => clearTimeout(timer)
    }
  }, [showSplash])

  // Add this useEffect to expose the bookAppointment function to the window
  useEffect(() => {
    // Expose the function to the window object for the button to call
    ;(window as any).bookAppointment = () => {
      setShowAppointmentBooking(true)
    }

    return () => {
      // Clean up
      delete (window as any).bookAppointment
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!input.trim() && !showSymptomSelector && !showDurationSelector && !showSeveritySlider) || isLoading) return

    // Add user message to chat
    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setShowSymptomSelector(false)
    setShowDurationSelector(false)
    setShowSeveritySlider(false)

    // Process based on conversation stage
    try {
      switch (stage) {
        case "ask_name":
          setPatientInfo((prev) => ({ ...prev, name: input.trim() }))
          await processStage("ask_age", `Thanks ${input.trim()}! How old are you?`)
          break

        case "ask_age":
          setPatientInfo((prev) => ({ ...prev, age: input.trim() }))
          await processStage("ask_symptoms", "What are your primary symptoms? You can select multiple.")
          break

        case "ask_symptoms":
          // If we have selected symptoms from the interactive selector, use those
          if (selectedSymptoms.length > 0) {
            const symptomsText = selectedSymptoms.join(", ")
            setPatientInfo((prev) => ({ ...prev, symptoms: symptomsText }))
          } else {
            // If manually typed, use the input
            setPatientInfo((prev) => ({ ...prev, symptoms: input.trim() }))
            // Since we're not using the selector, we need to manually move to additional symptoms stage
            await processStage("ask_additional_symptoms", "Do you have any additional symptoms you'd like to mention?")
          }
          break

        case "ask_additional_symptoms":
          setPatientInfo((prev) => ({ ...prev, additionalSymptoms: input.trim() || "None" }))
          await processStage("ask_duration", "How long have you been having these symptoms?")
          break

        case "ask_duration":
          setPatientInfo((prev) => ({ ...prev, duration: input.trim() }))
          await processStage("ask_severity", "How severe are your symptoms?")
          break

        case "ask_severity":
          setPatientInfo((prev) => ({ ...prev, severity: input.trim() }))

          // Now we have all info, send to API for diagnosis
          const loadingMessage = {
            id: Date.now().toString(),
            role: "assistant" as const,
            content: "Thank you for providing all that information. I'm analyzing your symptoms now...",
          }
          setMessages((prev) => [...prev, loadingMessage])

          // Get diagnosis from API
          await getDiagnosis()
          break

        case "diagnosis":
          // Continue conversation after diagnosis
          await sendToChatAPI(input)
          break
      }
    } catch (error) {
      console.error("Error in conversation flow:", error)
      const errorMessage = {
        id: Date.now().toString(),
        role: "assistant" as const,
        content: "I'm sorry, I encountered an error. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
      setLatestMessageId(errorMessage.id)
    } finally {
      setIsLoading(false)
    }
  }

  const processStage = async (nextStage: ConversationStage, responseMessage: string) => {
    const botResponse = {
      id: Date.now().toString(),
      role: "assistant" as const,
      content: responseMessage,
    }
    setMessages((prev) => [...prev, botResponse])
    setLatestMessageId(botResponse.id)
    setStage(nextStage)
  }

  const getDiagnosis = async () => {
    setStage("diagnosis")
    try {
      // Format severity to ensure it's displayed properly
      const formattedSeverity = patientInfo.severity.toLowerCase().includes("mild")
        ? "Mild"
        : patientInfo.severity.toLowerCase().includes("moderate")
          ? "Moderate"
          : patientInfo.severity.toLowerCase().includes("severe")
            ? "Severe"
            : patientInfo.severity.toLowerCase().includes("very severe")
              ? "Very Severe"
              : patientInfo.severity

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `Patient information: Name: ${patientInfo.name}, Age: ${patientInfo.age}, Primary Symptoms: ${patientInfo.symptoms}, Additional Symptoms: ${patientInfo.additionalSymptoms}, Duration: ${patientInfo.duration}, Severity: ${formattedSeverity}`,
            },
          ],
        }),
      })

      // Handle the response even if it's not OK
      const data = await response.text()

      if (!response.ok && !data) {
        throw new Error(`API error: ${response.status}`)
      }

      const diagnosisMessage = {
        id: Date.now().toString(),
        role: "assistant" as const,
        content: `I'm sorry to hear about your health conditions, ${patientInfo.name}. Let me analyze your symptoms.

👤 Patient Name: ${patientInfo.name}

🤝 Age: ${patientInfo.age}

🤒 Primary Symptoms: ${patientInfo.symptoms}

🔍 Additional Symptoms: ${patientInfo.additionalSymptoms}

⏱️ Duration: ${patientInfo.duration}

🔍 Severity: ${formattedSeverity}

<hr>

${data}`,
      }

      setMessages((prev) =>
        prev
          .filter(
            (m) => m.content !== "Thank you for providing all that information. I'm analyzing your symptoms now...",
          )
          .concat(diagnosisMessage),
      )
      setLatestMessageId(diagnosisMessage.id)
      setDiagnosisReport(data) // Store the diagnosis for download
      setShowPostDiagnosisOptions(true) // Show the post-diagnosis options
    } catch (error) {
      console.error("Error getting diagnosis:", error)
      // Format severity for the error message too
      const formattedSeverity = patientInfo.severity.toLowerCase().includes("mild")
        ? "Mild"
        : patientInfo.severity.toLowerCase().includes("moderate")
          ? "Moderate"
          : patientInfo.severity.toLowerCase().includes("severe")
            ? "Severe"
            : patientInfo.severity.toLowerCase().includes("very severe")
              ? "Very Severe"
              : patientInfo.severity

      const errorMessage = {
        id: Date.now().toString(),
        role: "assistant" as const,
        content: `
👤 Patient Name: ${patientInfo.name}

🤝 Age: ${patientInfo.age}

🤒 Primary Symptoms: ${patientInfo.symptoms}

🔍 Additional Symptoms: ${patientInfo.additionalSymptoms}

⏱️ Duration: ${patientInfo.duration}

🔍 Severity: ${formattedSeverity}

<hr>

I'm sorry to hear about your health conditions, ${patientInfo.name}. I couldn't analyze your symptoms at this time. This might be due to a temporary issue with my diagnostic system. Here's some general information that might help:

🩺 Possible Causes:
- 🔹 Your symptoms could be related to several different conditions
- 🔹 A combination of symptoms often requires professional evaluation
- 🔹 The duration and severity you've described are important factors for diagnosis

🏠 Home Remedies:
- 🍃 Rest and stay hydrated
- 🍃 Over-the-counter pain relievers may help with discomfort
- 🍃 Monitor your symptoms and note any changes

🚨 Emergency Alert:
- ⚠️ If symptoms worsen significantly, seek medical attention
- ⚠️ If you develop difficulty breathing, severe pain, or high fever, seek immediate medical care

🔔 Important Notes:
- 📝 Please consult with a healthcare professional for proper diagnosis
- 📝 This information is general and not specific to your condition
- 📝 Always prioritize professional medical advice

I hope you feel better soon, ${patientInfo.name}. Remember that proper medical advice comes from healthcare professionals.
      `,
      }
      setMessages((prev) =>
        prev
          .filter(
            (m) => m.content !== "Thank you for providing all that information. I'm analyzing your symptoms now...",
          )
          .concat(errorMessage),
      )
      setLatestMessageId(errorMessage.id)
    }
  }

  const sendToChatAPI = async (userInput: string) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `Patient information: Name: ${patientInfo.name}, Age: ${patientInfo.age}, Primary Symptoms: ${patientInfo.symptoms}, Duration: ${patientInfo.duration}, Severity: ${patientInfo.severity}`,
            },
            {
              role: "user",
              content: userInput,
            },
          ],
        }),
      })

      // Handle the response even if it's not OK
      const data = await response.text()

      if (!response.ok && !data) {
        throw new Error(`API error: ${response.status}`)
      }

      const botResponse = {
        id: Date.now().toString(),
        role: "assistant" as const,
        content: data,
      }

      setMessages((prev) => [...prev, botResponse])
      setLatestMessageId(botResponse.id)
    } catch (error) {
      console.error("Error in chat API:", error)
      const errorMessage = {
        id: Date.now().toString(),
        role: "assistant" as const,
        content: "I'm sorry, I couldn't process your message at this time. Please try again later.",
      }
      setMessages((prev) => [...prev, errorMessage])
      setLatestMessageId(errorMessage.id)
    }
  }

  // Manual theme toggle
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  // Handle quick replies
  const handleQuickReply = (reply: string) => {
    setInput(reply)
    handleSubmit(new Event("submit") as unknown as React.FormEvent)
  }

  const handleSymptomSelection = (symptoms: string[]) => {
    setSelectedSymptoms(symptoms)
    const symptomText = symptoms.join(", ")

    // Add user message to chat to show what was selected
    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: `My primary symptoms are: ${symptomText}`,
    }
    setMessages((prev) => [...prev, userMessage])

    // Store the symptoms in patient info
    setPatientInfo((prev) => ({ ...prev, symptoms: symptomText }))

    // Show a summary of selected symptoms with proper formatting
    const summaryMessage = {
      id: Date.now().toString() + "-response",
      role: "assistant" as const,
      content:
        symptoms.length === 1
          ? `I see you're experiencing ${symptomText}. Do you have any additional symptoms you'd like to mention?`
          : `I see you're experiencing ${symptoms.length} symptoms: ${symptoms.join(", ")}. Do you have any additional symptoms you'd like to mention?`,
    }
    setMessages((prev) => [...prev, summaryMessage])
    setLatestMessageId(summaryMessage.id)

    // Move to next stage - ask for additional symptoms
    setStage("ask_additional_symptoms")
    setShowSymptomSelector(false)
    setInput("")
  }

  // Handle adding a single symptom
  const handleAddSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) => [...prev, symptom])
    // We don't submit the form here, just update the UI
  }

  // Add a new function to handle additional symptoms
  const handleAdditionalSymptoms = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && isLoading) return

    // Add user message to chat
    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input || "No additional symptoms",
    }
    setMessages((prev) => [...prev, userMessage])

    // Store additional symptoms
    const additionalSymptomsText = input.trim() || "None"
    setPatientInfo((prev) => ({ ...prev, additionalSymptoms: additionalSymptomsText }))

    setInput("")
    setIsLoading(true)

    // Move to duration stage
    await processStage("ask_duration", "How long have you been having these symptoms?")
    setIsLoading(false)
  }

  // Handle duration selection
  const handleDurationSelection = (duration: string) => {
    // Add user message to chat to show what was selected
    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: duration,
    }
    setMessages((prev) => [...prev, userMessage])

    // Store the duration in patient info
    setPatientInfo((prev) => ({ ...prev, duration }))

    // Show response and move to next stage
    const responseMessage = {
      id: Date.now().toString() + "-response",
      role: "assistant" as const,
      content: "How severe are your symptoms?",
    }
    setMessages((prev) => [...prev, responseMessage])
    setLatestMessageId(responseMessage.id)

    // Move to next stage
    setStage("ask_severity")
    setShowSeveritySlider(true)
    setShowDurationSelector(false)
    setInput("")
  }

  // Handle severity selection
  const handleSeveritySelection = (severity: string) => {
    // Add user message to chat to show what was selected
    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: `My symptoms are ${severity} in severity`,
    }
    setMessages((prev) => [...prev, userMessage])

    // Store the severity in patient info
    setPatientInfo((prev) => ({ ...prev, severity }))

    // Show loading message
    const loadingMessage = {
      id: Date.now().toString() + "-response",
      role: "assistant" as const,
      content: "Thank you for providing all that information. I'm analyzing your symptoms now...",
    }
    setMessages((prev) => [...prev, loadingMessage])

    // Get diagnosis
    setShowSeveritySlider(false)
    getDiagnosis()
  }

  // Get all symptoms for highlighting
  const getAllSymptoms = () => {
    const primarySymptoms = patientInfo.symptoms ? patientInfo.symptoms.split(",").map((s) => s.trim()) : []
    return [...primarySymptoms].filter((s) => s && s !== "None")
  }

  const downloadDiagnosisReport = () => {
    // Create a clean text version of the diagnosis (remove HTML)
    const cleanReport = diagnosisReport.replace(/<[^>]*>?/gm, "")

    // Format severity for the report
    const formattedSeverity = patientInfo.severity.toLowerCase().includes("mild")
      ? "Mild"
      : patientInfo.severity.toLowerCase().includes("moderate")
        ? "Moderate"
        : patientInfo.severity.toLowerCase().includes("severe")
          ? "Severe"
          : patientInfo.severity.toLowerCase().includes("very severe")
            ? "Very Severe"
            : patientInfo.severity

    // Create a blob with the diagnosis text
    const blob = new Blob(
      [
        `HEALTH DIAGNOSIS REPORT\n\n` +
          `Patient: ${patientInfo.name}\n` +
          `Age: ${patientInfo.age}\n` +
          `Primary Symptoms: ${patientInfo.symptoms}\n` +
          `Additional Symptoms: ${patientInfo.additionalSymptoms}\n` +
          `Duration: ${patientInfo.duration}\n` +
          `Severity: ${formattedSeverity}\n\n` +
          `${cleanReport}\n\n` +
          `Generated on: ${new Date().toLocaleString()}\n` +
          `Note: This is not a substitute for professional medical advice.`,
      ],
      { type: "text/plain" },
    )

    // Create a download link and trigger it
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `health_diagnosis_${patientInfo.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const restartConversation = () => {
    // Reset all state
    setMessages([])
    setInput("")
    setIsLoading(false)
    setStage("greeting")
    setPatientInfo({
      name: "",
      age: "",
      symptoms: "",
      additionalSymptoms: "",
      duration: "",
      severity: "",
    })
    setSelectedSymptoms([])
    setLatestMessageId(null)
    setShowSymptomSelector(false)
    setShowDurationSelector(false)
    setShowSeveritySlider(false)
    setSuggestedReplies([])
    setConversationProgress(0)
    setShowPostDiagnosisOptions(false)
    setDiagnosisReport("")
  }

  // Add a function to handle the appointment booking button click
  const handleBookAppointment = () => {
    setShowAppointmentBooking(true)
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">HealthChat</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Health Metrics</h2>
        <GuaranteedHealthDashboard />
      </section>

      {/* Other content */}

      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {showSplash && <SplashScreen />}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 px-4 md:px-6 shadow-sm">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-md">
                <BotIcon className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">HealthChat</h1>
              <div className="hidden sm:flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Powered
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="mr-2 flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                <ShieldAlert className="h-3 w-3 mr-1" />
                Not Medical Advice
              </div>

              {/* Dashboard link */}
              <Link href="/login">
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 rounded-full px-3 py-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <Activity className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <span className="text-sm">Full Dashboard</span>
                </Button>
              </Link>

              {/* Theme toggle button */}
              {mounted && (
                <Button
                  variant="outline"
                  onClick={toggleTheme}
                  className="flex items-center space-x-2 rounded-full px-3 py-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  {resolvedTheme === "dark" ? (
                    <>
                      <Sun className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 text-slate-700" />
                      <span className="text-sm">Dark</span>
                    </>
                  )}
                </Button>
              )}
              {/* Voice consultation link */}
              <Link href="/voice-consultation">
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 rounded-full px-3 py-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <Mic className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <span className="text-sm">Voice Consultation</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Progress bar */}
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-teal-600 transition-all duration-500 ease-in-out"
            style={{ width: `${conversationProgress}%` }}
          ></div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
            <div className="max-w-4xl mx-auto space-y-4">
              <Card className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/30 dark:to-blue-900/30 border border-teal-100 dark:border-teal-800/50 p-4 md:p-6 shadow-sm mb-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-teal-100 dark:bg-teal-800/50 rounded-full p-2">
                    <BotIcon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">Welcome to HealthChat</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      I'll help you understand your symptoms and provide general health guidance. Remember that I'm not
                      a substitute for professional medical advice.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <Zap className="h-3 w-3 mr-1 text-teal-500" />
                        <span>AI-powered analysis</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <Clock className="h-3 w-3 mr-1 text-teal-500" />
                        <span>Quick assessment</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <ThermometerIcon className="h-3 w-3 mr-1 text-teal-500" />
                        <span>Symptom tracking</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Show selected symptoms summary if we have them */}
              {selectedSymptoms.length > 0 && stage === "ask_symptoms" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 animate-fadeIn">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected symptoms:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map((symptom) => (
                      <SymptomBadge key={symptom} symptom={symptom} />
                    ))}
                  </div>
                </div>
              )}

              {messages
                .filter((m) => m.role !== "system")
                .map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isNew={message.id === latestMessageId}
                    onQuickReply={handleQuickReply}
                    suggestedReplies={
                      message.role === "assistant" && message.id === latestMessageId ? suggestedReplies : []
                    }
                    highlightSymptoms={getAllSymptoms()}
                    severity={stage === "diagnosis" ? patientInfo.severity : undefined}
                  />
                ))}

              {isLoading && (
                <div className="flex items-center space-x-2 px-4 py-3 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 max-w-[85%] md:max-w-[75%] animate-fadeIn">
                  <div className="flex-shrink-0 mr-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-teal-500 dark:text-teal-400">
                      <BotIcon className="h-4 w-4" />
                    </div>
                  </div>
                  <TypingIndicator />
                </div>
              )}

              {showSymptomSelector && !isLoading && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 animate-fadeIn">
                  <InteractiveSymptomSelector
                    onSelect={handleSymptomSelection}
                    onAddSymptom={handleAddSymptom}
                    preselectedSymptoms={selectedSymptoms}
                  />
                </div>
              )}

              {showDurationSelector && !isLoading && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 animate-fadeIn">
                  <InteractiveDurationSelector onSelect={handleDurationSelection} symptoms={selectedSymptoms} />
                </div>
              )}

              {showSeveritySlider && !isLoading && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 animate-fadeIn">
                  <SeveritySlider onSelect={handleSeveritySelection} />
                </div>
              )}

              {showPostDiagnosisOptions && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 animate-fadeIn">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    What would you like to do next?
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={downloadDiagnosisReport}
                      className="bg-teal-500 hover:bg-teal-600 text-white flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      Download Diagnosis Report
                    </Button>
                    <Button
                      onClick={restartConversation}
                      variant="outline"
                      className="border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 2v6h6"></path>
                        <path d="M3 13a9 9 0 1 0 3-7.7L3 8"></path>
                      </svg>
                      Restart Conversation
                    </Button>
                    <Button
                      onClick={handleBookAppointment}
                      className="bg-teal-500 hover:bg-teal-600 text-white flex items-center gap-2"
                    >
                      Book Appointment
                    </Button>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {showAppointmentBooking && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
              <AppointmentBooking
                patientName={patientInfo.name}
                patientSymptoms={patientInfo.symptoms}
                onClose={() => setShowAppointmentBooking(false)}
              />
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 transition-colors duration-200">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-full px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  showSymptomSelector
                    ? "Or type your symptoms manually..."
                    : showDurationSelector
                      ? "Or type duration manually..."
                      : showSeveritySlider
                        ? "Or describe severity in your own words..."
                        : "Type your message or say 'Jarvis' to use voice..."
                }
                disabled={isLoading || stage === "diagnosis"}
              />
              <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <Button
              type="submit"
              disabled={
                isLoading ||
                (!input.trim() && !showSymptomSelector && !showDurationSelector && !showSeveritySlider) ||
                stage === "diagnosis"
              }
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-full p-3 h-12 w-12 flex items-center justify-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </form>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
            This AI assistant is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </div>
    </main>
  )
}
