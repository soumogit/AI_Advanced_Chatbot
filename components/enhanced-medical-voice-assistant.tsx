"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, Loader2, AlertTriangle, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface EnhancedMedicalVoiceAssistantProps {
  onCommand: (command: string) => void
  isListening: boolean
  setIsListening: (isListening: boolean) => void
  isSpeaking: boolean
  isProcessing: boolean
  selectedLanguage: string
  className?: string
}

export function EnhancedMedicalVoiceAssistant({
  onCommand,
  isListening,
  setIsListening,
  isSpeaking,
  isProcessing,
  selectedLanguage,
  className,
}: EnhancedMedicalVoiceAssistantProps) {
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(true)
  const [animationState, setAnimationState] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [confidenceLevel, setConfidenceLevel] = useState(0)
  const [suggestedQueries, setSuggestedQueries] = useState<string[]>([
    "What could be causing my headache?",
    "How can I manage my allergies?",
    "What are common cold symptoms?",
    "When should I see a doctor about fever?",
  ])
  const recognitionRef = useRef<any>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isRecognitionActiveRef = useRef(false)
  const { toast } = useToast()

  // Check if browser supports speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsSupported(false)
      setErrorMessage("Speech recognition is not supported in this browser. Try using Chrome, Edge, or Safari.")
      return
    }

    // Initialize speech recognition
    const initRecognition = () => {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = selectedLanguage

      recognitionRef.current.onresult = (event: any) => {
        const result = event.results[event.results.length - 1]
        const transcriptText = result[0].transcript.trim()
        setTranscript(transcriptText)

        // Update confidence level
        if (result[0].confidence) {
          setConfidenceLevel(Math.round(result[0].confidence * 100))
        }

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
        isRecognitionActiveRef.current = false
        if (isListening) {
          try {
            startRecognition()
          } catch (error) {
            console.error("Error restarting recognition:", error)
          }
        }
      }

      recognitionRef.current.onstart = () => {
        isRecognitionActiveRef.current = true
      }
    }

    initRecognition()

    return () => {
      stopRecognition()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Safe methods to start and stop recognition
  const startRecognition = () => {
    if (!recognitionRef.current) return

    if (!isRecognitionActiveRef.current) {
      try {
        recognitionRef.current.start()
        isRecognitionActiveRef.current = true
      } catch (error) {
        console.error("Error starting recognition:", error)
      }
    }
  }

  const stopRecognition = () => {
    if (!recognitionRef.current) return

    if (isRecognitionActiveRef.current) {
      try {
        recognitionRef.current.stop()
        isRecognitionActiveRef.current = false
      } catch (error) {
        console.error("Error stopping recognition:", error)
      }
    }
  }

  // Update language when it changes
  useEffect(() => {
    if (!recognitionRef.current) return

    // Update the language property
    recognitionRef.current.lang = selectedLanguage

    // If currently listening, we need to restart recognition with the new language
    if (isListening) {
      // First, stop the current recognition
      stopRecognition()

      // Wait for recognition to fully stop before starting again
      const restartTimeout = setTimeout(() => {
        if (isListening) {
          // Recreate the recognition instance with the new language
          const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
          if (SpeechRecognition) {
            // Clean up old instance
            if (recognitionRef.current) {
              try {
                recognitionRef.current.onend = null
                recognitionRef.current.onerror = null
                recognitionRef.current.onresult = null
                recognitionRef.current.onstart = null
              } catch (error) {
                console.error("Error cleaning up recognition:", error)
              }
            }

            // Create new instance
            recognitionRef.current = new SpeechRecognition()
            recognitionRef.current.continuous = true
            recognitionRef.current.interimResults = true
            recognitionRef.current.lang = selectedLanguage

            // Set up event handlers
            recognitionRef.current.onresult = (event: any) => {
              const result = event.results[event.results.length - 1]
              const transcriptText = result[0].transcript.trim()
              setTranscript(transcriptText)

              if (result[0].confidence) {
                setConfidenceLevel(Math.round(result[0].confidence * 100))
              }

              if (result.isFinal) {
                handleFinalTranscript(transcriptText)
              }
            }

            recognitionRef.current.onerror = (event: any) => {
              console.error("Speech recognition error", event.error)
              if (event.error === "not-allowed") {
                setIsSupported(false)
                setErrorMessage("Microphone access was denied. Please allow microphone access to use voice features.")
              }
            }

            recognitionRef.current.onend = () => {
              isRecognitionActiveRef.current = false
              if (isListening) {
                try {
                  startRecognition()
                } catch (error) {
                  console.error("Error restarting recognition:", error)
                }
              }
            }

            recognitionRef.current.onstart = () => {
              isRecognitionActiveRef.current = true
            }

            // Start the new instance
            startRecognition()
          }
        }
      }, 300) // Increased timeout to ensure recognition has fully stopped

      return () => clearTimeout(restartTimeout)
    }
  }, [selectedLanguage])

  // Handle listening state changes
  useEffect(() => {
    if (!recognitionRef.current) return

    if (isListening) {
      startRecognition()
      setErrorMessage(null)
    } else {
      stopRecognition()
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

    // Process the transcript
    onCommand(text)
    setTranscript("")
  }

  const toggleListening = () => {
    if (isProcessing) return

    if (!isListening) {
      // Starting to listen
      toast({
        title: "Listening",
        description: "Speak clearly about your health concern",
        duration: 3000,
      })
    }

    setIsListening(!isListening)
  }

  const handleSuggestedQuery = (query: string) => {
    onCommand(query)

    // Generate new suggested queries based on the current one
    const newSuggestions = generateRelatedQueries(query)
    setSuggestedQueries(newSuggestions)
  }

  const generateRelatedQueries = (query: string): string[] => {
    // In a real app, this would be more sophisticated and based on the query
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("headache")) {
      return [
        "How long should a headache last?",
        "What's the difference between a migraine and a headache?",
        "Can stress cause headaches?",
        "What pain relievers are best for headaches?",
      ]
    }

    if (lowerQuery.includes("cold") || lowerQuery.includes("flu")) {
      return [
        "How long is a cold contagious?",
        "What's the difference between a cold and the flu?",
        "How can I boost my immune system?",
        "When should I see a doctor for a cold?",
      ]
    }

    // Default suggestions
    return [
      "What are common symptoms of anxiety?",
      "How can I improve my sleep?",
      "What should I know about blood pressure?",
      "How often should I exercise?",
    ]
  }

  if (!isSupported) {
    return (
      <Card
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
      </Card>
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

        {/* Enhanced Microphone Button with Prominent Visual Indicator */}
        <div className="flex flex-col items-center justify-center mb-6">
          {/* Tap to Talk Label */}
          <div className="mb-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
            Tap microphone to talk
          </div>

          {/* Microphone Button with Outer Ring */}
          <div
            className={cn(
              "relative rounded-full p-1",
              isListening
                ? "bg-gradient-to-r from-teal-400 to-blue-500 animate-pulse"
                : "bg-gradient-to-r from-teal-200 to-blue-300 dark:from-teal-800/40 dark:to-blue-800/40",
            )}
          >
            <Button
              onClick={toggleListening}
              disabled={isProcessing}
              variant="outline"
              size="lg"
              className={cn(
                "rounded-full h-20 w-20 transition-all duration-300 flex items-center justify-center",
                isListening
                  ? "bg-teal-100 dark:bg-teal-900/50 border-teal-300 dark:border-teal-700 text-teal-600 dark:text-teal-400"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400",
                isProcessing && "opacity-50 cursor-not-allowed",
              )}
              aria-label={isListening ? "Stop listening" : "Start listening"}
            >
              {isProcessing ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : isListening ? (
                <Mic className="h-8 w-8 animate-pulse text-teal-600 dark:text-teal-400" />
              ) : (
                <Mic className="h-8 w-8 text-teal-600 dark:text-teal-400" />
              )}
            </Button>
          </div>

          {/* Status Text */}
          <div className="mt-2 text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isListening ? "I'm listening... Speak now" : "Tap to start speaking"}
            </p>
          </div>
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
                {confidenceLevel > 0 && (
                  <span className="text-xs ml-2 text-gray-500">({confidenceLevel}% confidence)</span>
                )}
              </div>
            )}
          </div>
        )}

        {!isListening && !isProcessing && (
          <div className="text-center mt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              You can ask about symptoms, general health advice, or medical information
            </p>
          </div>
        )}

        {/* Suggested queries */}
        {!isListening && !isProcessing && (
          <div className="mt-4">
            <div className="flex items-center mb-2">
              <Wand2 className="h-3 w-3 text-teal-500 mr-1" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Suggested questions</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestedQueries.map((query, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs justify-start h-auto py-2 text-left"
                  onClick={() => handleSuggestedQuery(query)}
                >
                  {query}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
