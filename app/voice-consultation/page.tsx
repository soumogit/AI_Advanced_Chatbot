"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Volume2, VolumeX, Bot, User, Globe, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { EnhancedMedicalVoiceAssistant } from "@/components/enhanced-medical-voice-assistant"
import { LanguageSelector } from "@/components/language-selector"
import { EmergencyDetectionSystem } from "@/components/emergency-detection-system"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TypingIndicator } from "@/components/typing-indicator"

export default function EnhancedVoiceConsultationPage() {
  const [messages, setMessages] = useState<
    {
      role: "user" | "assistant"
      content: string
      timestamp: Date
      isProcessing?: boolean
    }[]
  >([])
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [muted, setMuted] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en-US")
  const [userProfile, setUserProfile] = useState({
    name: "Guest User",
    age: "",
    gender: "",
    medicalHistory: [],
    allergies: [],
    medications: [],
  })
  const [emergencyDetected, setEmergencyDetected] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [conversationContext, setConversationContext] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = {
        role: "assistant" as const,
        content:
          "Hello, I'm Dr. AI, your virtual medical consultant. How can I help you today? You can speak to me about any health concerns or questions you might have.",
        timestamp: new Date(),
      }
      setMessages([greeting])
      if (!muted) {
        speakText(greeting.content)
      }
    }
  }, [messages.length, muted])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleVoiceCommand = (command: string) => {
    // Add user message
    const userMessage = {
      role: "user" as const,
      content: command,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Add a placeholder for the assistant's response
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isProcessing: true,
      },
    ])

    // Process the command and generate a response
    processUserInput(command)
  }

  const processUserInput = async (input: string) => {
    setIsProcessing(true)

    try {
      // Check for emergency keywords
      const isEmergency = checkForEmergency(input)
      if (isEmergency) {
        setEmergencyDetected(true)
        handleEmergency(input)
        return
      }

      // Update conversation context
      const updatedContext = [...conversationContext, input].slice(-5)
      setConversationContext(updatedContext)

      // Call the AI service to generate a response
      const response = await generateAIResponse(input, updatedContext, userProfile, selectedLanguage)

      // Update the last message (which is the processing placeholder)
      setMessages((prev) => {
        const newMessages = [...prev]
        const lastIndex = newMessages.length - 1
        newMessages[lastIndex] = {
          role: "assistant",
          content: response,
          timestamp: new Date(),
        }
        return newMessages
      })

      // Speak the response if not muted
      if (!muted) {
        speakText(response)
      }
    } catch (error) {
      console.error("Error processing input:", error)

      // Update the last message with an error
      setMessages((prev) => {
        const newMessages = [...prev]
        const lastIndex = newMessages.length - 1
        newMessages[lastIndex] = {
          role: "assistant",
          content: "I'm sorry, I encountered an issue processing your request. Could you please try again?",
          timestamp: new Date(),
        }
        return newMessages
      })

      toast({
        title: "Error",
        description: "There was a problem processing your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const generateAIResponse = async (
    input: string,
    context: string[],
    profile: typeof userProfile,
    language: string,
  ): Promise<string> => {
    // In a real implementation, this would call your backend API
    // For now, we'll simulate a network request
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // This is a placeholder. In a real implementation, you would call your AI service
    // and return the response
    return simulateAIResponse(input, context, profile, language)
  }

  const simulateAIResponse = (
    input: string,
    context: string[],
    profile: typeof userProfile,
    language: string,
  ): string => {
    const lowerInput = input.toLowerCase()

    // Check for greetings
    if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
      return `Hello${profile.name !== "Guest User" ? " " + profile.name : ""}! I'm Dr. AI, your virtual medical consultant. I can help answer your health questions or discuss symptoms you're experiencing. How are you feeling today?`
    }

    // Check for common symptoms
    if (lowerInput.includes("headache")) {
      return "I understand you're experiencing a headache. Headaches can be caused by various factors including stress, dehydration, lack of sleep, or eye strain. If it's a mild headache, you might try resting in a dark room, staying hydrated, and taking over-the-counter pain relievers if appropriate. If your headache is severe, sudden, or accompanied by other symptoms like fever, neck stiffness, or vision changes, you should seek medical attention promptly."
    }

    if (lowerInput.includes("fever")) {
      return "I hear you're experiencing a fever. Fever is often your body's response to infection. It's generally recommended to rest, stay hydrated, and take fever-reducing medication if your temperature is causing discomfort. If your fever is above 103°F (39.4°C), persists for more than three days, or is accompanied by severe symptoms, please consult with a healthcare provider immediately."
    }

    if (lowerInput.includes("cough")) {
      return "I understand you're dealing with a cough. Coughs can be caused by various conditions including viral infections, allergies, or irritants. For relief, you might try staying hydrated, using honey (if you're not allergic and over 1 year old), or over-the-counter cough suppressants. If your cough is severe, produces colored phlegm, or is accompanied by shortness of breath or chest pain, please seek medical attention."
    }

    // Default response
    return "I understand your concern. While I can provide general health information, for specific medical advice, diagnosis, or treatment, it's important to consult with a qualified healthcare provider. Is there a particular aspect of your health concern you'd like to discuss further?"
  }

  const checkForEmergency = (input: string): boolean => {
    const emergencyKeywords = [
      "chest pain",
      "heart attack",
      "stroke",
      "can't breathe",
      "difficulty breathing",
      "severe bleeding",
      "unconscious",
      "suicide",
      "kill myself",
      "overdose",
    ]

    return emergencyKeywords.some((keyword) => input.toLowerCase().includes(keyword))
  }

  const handleEmergency = (input: string) => {
    const emergencyResponse = {
      role: "assistant" as const,
      content:
        "I'm detecting that you may be describing a medical emergency. If you're experiencing chest pain, difficulty breathing, or other severe symptoms, please call emergency services (911) immediately or have someone take you to the nearest emergency room. Do not wait or try to drive yourself.",
      timestamp: new Date(),
    }

    // Update the last message (which is the processing placeholder)
    setMessages((prev) => {
      const newMessages = [...prev]
      const lastIndex = newMessages.length - 1
      newMessages[lastIndex] = emergencyResponse
      return newMessages
    })

    // Speak the emergency response with urgency
    if (!muted) {
      speakText(emergencyResponse.content, true)
    }

    // Show an emergency toast
    toast({
      title: "Medical Emergency Detected",
      description: "Please call emergency services (911) immediately if you're experiencing a medical emergency.",
      variant: "destructive",
      duration: 10000,
    })
  }

  const speakText = (text: string, isEmergency = false) => {
    if (window.speechSynthesis) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)

      // Configure voice
      utterance.rate = isEmergency ? 1.1 : 0.9 // Slightly faster for emergencies
      utterance.pitch = 1.0
      utterance.lang = selectedLanguage

      // Get voices and try to select a good one
      const voices = window.speechSynthesis.getVoices()

      // Try to find a voice that matches the selected language
      const preferredVoice = voices.find((voice) => voice.lang.startsWith(selectedLanguage.split("-")[0]))

      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      // Handle speech end
      utterance.onend = () => {
        setIsSpeaking(false)
      }

      window.speechSynthesis.speak(utterance)
    }
  }

  const toggleMute = () => {
    setMuted(!muted)
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    toast({
      title: "Language Changed",
      description: `Voice consultation language set to ${getLanguageName(language)}`,
      duration: 3000,
    })
  }

  const getLanguageName = (code: string): string => {
    const languages: Record<string, string> = {
      "en-US": "English (US)",
      "es-ES": "Spanish",
      "fr-FR": "French",
      "de-DE": "German",
      "zh-CN": "Chinese (Simplified)",
      "ja-JP": "Japanese",
      "hi-IN": "Hindi",
    }
    return languages[code] || code
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 px-4 md:px-6 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <span className="font-medium text-gray-800 dark:text-gray-200">Back to HealthChat</span>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Settings className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="p-6 space-y-6">
                  <h3 className="text-lg font-medium">Voice Consultation Settings</h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Language</h4>
                      <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={handleLanguageChange} />
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Voice Output</h4>
                      <Button variant="outline" onClick={toggleMute} className="w-full justify-start">
                        {muted ? (
                          <VolumeX className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                        ) : (
                          <Volume2 className="h-4 w-4 mr-2 text-teal-600 dark:text-teal-400" />
                        )}
                        {muted ? "Unmute Voice" : "Mute Voice"}
                      </Button>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Personal Information</h4>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          // In a real app, this would open a profile editor
                          toast({
                            title: "Profile Editor",
                            description: "This would open a profile editor in a real application.",
                            duration: 3000,
                          })
                        }}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Edit Medical Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleMute}
              className="rounded-full h-10 w-10 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              {muted ? (
                <VolumeX className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Volume2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/30 dark:to-blue-900/30 border border-teal-100 dark:border-teal-800/50 p-4 md:p-6 shadow-sm mb-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Avatar className="h-12 w-12 border-2 border-teal-100 dark:border-teal-800/50">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Dr. AI" />
                  <AvatarFallback className="bg-teal-100 dark:bg-teal-800/50 text-teal-600 dark:text-teal-400">
                    <Bot className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h1 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-1">
                  Voice Medical Consultation with Dr. AI
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Speak naturally about your health concerns or ask medical questions. Your virtual doctor is here to
                  help with personalized guidance.
                </p>
                <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <Globe className="h-3 w-3 mr-1" />
                  <span>Speaking {getLanguageName(selectedLanguage)}</span>
                </div>
              </div>
            </div>
          </Card>

          {emergencyDetected && <EmergencyDetectionSystem onDismiss={() => setEmergencyDetected(false)} />}

          <div className="space-y-4 mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn("flex animate-fadeIn", message.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "flex max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3.5 shadow-sm",
                    message.role === "user"
                      ? "bg-gradient-to-br from-teal-500 to-teal-600 text-white"
                      : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                  )}
                >
                  <div className="flex-shrink-0 mr-3">
                    {message.role === "user" ? (
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-teal-600/50 text-white">
                        <User className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-teal-500 dark:text-teal-400">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    {message.isProcessing ? (
                      <div className="flex items-center">
                        <TypingIndicator />
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Dr. AI is thinking...</span>
                      </div>
                    ) : (
                      <p className={message.role === "user" ? "text-white" : "text-gray-800 dark:text-gray-200"}>
                        {message.content}
                      </p>
                    )}
                    <div className="mt-1 text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 transition-colors duration-200">
        <div className="max-w-4xl mx-auto">
          <EnhancedMedicalVoiceAssistant
            onCommand={handleVoiceCommand}
            isListening={isListening}
            setIsListening={setIsListening}
            isSpeaking={isSpeaking}
            isProcessing={isProcessing}
            selectedLanguage={selectedLanguage}
          />

          <Tabs defaultValue="disclaimer" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="disclaimer">Disclaimer</TabsTrigger>
              <TabsTrigger value="emergency">Emergency Info</TabsTrigger>
              <TabsTrigger value="tips">Speaking Tips</TabsTrigger>
            </TabsList>
            <TabsContent value="disclaimer" className="mt-2">
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                This AI assistant is not a substitute for professional medical advice, diagnosis, or treatment. Always
                consult with qualified healthcare providers for medical concerns.
              </p>
            </TabsContent>
            <TabsContent value="emergency" className="mt-2">
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                In case of emergency, call 911 or your local emergency number immediately. Do not rely on this system
                for emergency medical situations.
              </p>
            </TabsContent>
            <TabsContent value="tips" className="mt-2">
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Speak clearly and describe your symptoms in detail. Mention when they started, their severity, and any
                other relevant information for better assistance.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
