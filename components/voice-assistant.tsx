"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VoiceAssistantProps {
  onCommand: (command: string) => void
  isListening?: boolean
  className?: string
}

export function VoiceAssistant({ onCommand, isListening = false, className }: VoiceAssistantProps) {
  const [listening, setListening] = useState(isListening)
  const [muted, setMuted] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(true)
  const [animationState, setAnimationState] = useState(0)
  const recognitionRef = useRef<any>(null)

  // Check if browser supports speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }

    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = "en-US"

    recognitionRef.current.onresult = (event: any) => {
      const result = event.results[event.results.length - 1]
      const transcript = result[0].transcript.trim()
      setTranscript(transcript)

      if (result.isFinal) {
        handleFinalTranscript(transcript)
      }
    }

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error", event.error)
      if (event.error === "not-allowed") {
        setIsSupported(false)
      }
    }

    recognitionRef.current.onend = () => {
      if (listening) {
        recognitionRef.current.start()
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  // Handle listening state changes
  useEffect(() => {
    if (!recognitionRef.current) return

    if (listening) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        // Already started
      }
    } else {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        // Already stopped
      }
      setTranscript("")
    }
  }, [listening])

  // Animation for voice visualization
  useEffect(() => {
    if (listening) {
      const interval = setInterval(() => {
        setAnimationState((prev) => (prev + 1) % 4)
      }, 300)
      return () => clearInterval(interval)
    }
  }, [listening])

  const handleFinalTranscript = (text: string) => {
    // Process commands
    const lowerText = text.toLowerCase()

    // Check for wake word "Jarvis" or "Health Assistant"
    if (lowerText.includes("jarvis") || lowerText.includes("health assistant")) {
      // Remove wake word from command
      const command = lowerText.replace("jarvis", "").replace("health assistant", "").trim()

      if (command) {
        onCommand(command)
        speak(`Processing command: ${command}`)
      } else {
        speak("How can I help you today?")
      }
    }

    setTranscript("")
  }

  const toggleListening = () => {
    setListening((prev) => !prev)
  }

  const toggleMute = () => {
    setMuted((prev) => !prev)
  }

  const speak = (text: string) => {
    if (muted || !window.speechSynthesis) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "en-US"
    utterance.rate = 1.0
    utterance.pitch = 1.0
    window.speechSynthesis.speak(utterance)
  }

  if (!isSupported) {
    return (
      <div className={cn("flex items-center justify-center p-2 text-sm text-gray-500", className)}>
        Voice assistant not supported in this browser
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="flex items-center space-x-2 mb-2">
        <Button
          onClick={toggleListening}
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full h-12 w-12 transition-all duration-300",
            listening
              ? "bg-teal-100 dark:bg-teal-900/50 border-teal-300 dark:border-teal-700 text-teal-600 dark:text-teal-400"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
          )}
        >
          {listening ? <Mic className="h-5 w-5 animate-pulse" /> : <MicOff className="h-5 w-5" />}
        </Button>

        <Button
          onClick={toggleMute}
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full h-10 w-10 transition-colors",
            muted
              ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              : "bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400",
          )}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>

      {listening && (
        <div className="relative w-full max-w-xs">
          <div className="flex items-center justify-center space-x-1 h-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1 w-1 rounded-full bg-teal-500 dark:bg-teal-400 transition-all duration-200",
                  i % 4 === animationState ? "h-6" : "h-2",
                )}
              ></div>
            ))}
          </div>
          {transcript && (
            <div className="mt-2 text-xs text-center text-gray-600 dark:text-gray-400 italic">"{transcript}"</div>
          )}
        </div>
      )}

      {!listening && (
        <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
          Say "Jarvis" or "Health Assistant" to activate
        </div>
      )}
    </div>
  )
}
