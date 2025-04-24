"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MedicalVoiceAssistantProps {
  onCommand: (command: string) => void
  isListening: boolean
  setIsListening: (isListening: boolean) => void
  isSpeaking: boolean
  className?: string
}

export function MedicalVoiceAssistant({
  onCommand,
  isListening,
  setIsListening,
  isSpeaking,
  className,
}: MedicalVoiceAssistantProps) {
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(true)
  const [animationState, setAnimationState] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const recognitionRef = useRef<any>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Check if browser supports speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsSupported(false)
      setErrorMessage("Speech recognition is not supported in this browser. Try using Chrome, Edge, or Safari.")
      return
    }

    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = "en-US"

    recognitionRef.current.onresult = (event: any) => {
      const result = event.results[event.results.length - 1]
      const transcriptText = result[0].transcript.trim()
      setTranscript(transcriptText)

      if (result.isFinal) {
        handleFinalTranscript(transcriptText)
      }
    }

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error", event.error)
      if (event.error === "not-allowed") {
        setIsSupported(false)
        setErrorMessage("Microphone access was denied. Please allow microphone access to use voice features.")
      } else if (event.error === "no-speech") {
        // This is common and not a critical error
        console.log("No speech detected")
      } else {
        setErrorMessage(`Error: ${event.error}. Try speaking again or refresh the page.`)
      }
    }

    recognitionRef.current.onend = () => {
      if (isListening) {
        try {
          recognitionRef.current.start()
        } catch (error) {
          console.error("Error restarting recognition:", error)
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (error) {
          // Already stopped
        }
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Handle listening state changes
  useEffect(() => {
    if (!recognitionRef.current) return

    if (isListening) {
      try {
        recognitionRef.current.start()
        setErrorMessage(null)
      } catch (error) {
        console.error("Error starting recognition:", error)
      }
    } else {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        // Already stopped
      }
      setTranscript("")
    }
  }, [isListening])

  // Animation for voice visualization
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setAnimationState((prev) => (prev + 1) % 4)
      }, 300)
      return () => clearInterval(interval)
    }
  }, [isListening])

  // Auto-stop listening after period of silence
  useEffect(() => {
    if (isListening && !isSpeaking) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        if (!isSpeaking) {
          setIsListening(false)
        }
      }, 10000) // Stop after 10 seconds of silence

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }
  }, [isListening, isSpeaking, setIsListening])

  const handleFinalTranscript = (text: string) => {
    if (!text) return

    setIsProcessing(true)

    // Process the transcript
    onCommand(text)
    setTranscript("")

    // Reset processing state after a delay
    setTimeout(() => {
      setIsProcessing(false)
    }, 1000)
  }

  const toggleListening = () => {
    if (isProcessing) return
    setIsListening(!isListening)
  }

  if (!isSupported) {
    return (
      <div
        className={cn(
          "p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50",
          className,
        )}
      >
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-sm text-red-600 dark:text-red-400">{errorMessage || "Voice recognition not supported"}</p>
        </div>
        <p className="text-xs text-red-500 dark:text-red-400 mt-2">
          Try using a different browser like Chrome, Edge, or Safari, or type your questions instead.
        </p>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative w-full max-w-md mx-auto">
        {errorMessage && (
          <div className="absolute -top-12 left-0 right-0 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/50 text-xs text-red-600 dark:text-red-400 text-center">
            {errorMessage}
          </div>
        )}

        <div className="flex items-center justify-center mb-2">
          <Button
            onClick={toggleListening}
            disabled={isProcessing}
            variant="outline"
            size="lg"
            className={cn(
              "rounded-full h-16 w-16 transition-all duration-300 flex items-center justify-center",
              isListening
                ? "bg-teal-100 dark:bg-teal-900/50 border-teal-300 dark:border-teal-700 text-teal-600 dark:text-teal-400"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
              isProcessing && "opacity-50 cursor-not-allowed",
            )}
          >
            {isProcessing ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : isListening ? (
              <Mic className="h-6 w-6 animate-pulse" />
            ) : (
              <MicOff className="h-6 w-6" />
            )}
          </Button>
        </div>

        {isListening && (
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center space-x-1 h-8 mb-2">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 w-1 rounded-full bg-teal-500 dark:bg-teal-400 transition-all duration-200",
                    i % 4 === animationState
                      ? "h-8"
                      : i % 3 === animationState
                        ? "h-6"
                        : i % 2 === animationState
                          ? "h-4"
                          : "h-2",
                  )}
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
            {transcript && (
              <div className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400 italic max-w-md mx-auto">
                "{transcript}"
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isListening
              ? "I'm listening... Speak clearly about your health concern"
              : "Tap the microphone and speak to start a consultation"}
          </p>
          {!isListening && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              You can ask about symptoms, general health advice, or medical information
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
