"use client"

import { useEffect } from "react"

import { useState } from "react"

import { cn } from "@/lib/utils"

interface TypingIndicatorProps {
  className?: string
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <div
        className="w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-400 animate-bounce"
        style={{ animationDelay: "0ms" }}
      ></div>
      <div
        className="w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-400 animate-bounce"
        style={{ animationDelay: "150ms" }}
      ></div>
      <div
        className="w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-400 animate-bounce"
        style={{ animationDelay: "300ms" }}
      ></div>
    </div>
  )
}

interface TypingMessageProps {
  message: string
  className?: string
  typingSpeed?: number
  onComplete?: () => void
}

export function TypingMessage({ message, className, typingSpeed = 50, onComplete }: TypingMessageProps) {
  const [displayedMessage, setDisplayedMessage] = useState("")
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < message.length) {
      const timer = setTimeout(() => {
        setDisplayedMessage((prev) => prev + message[index])
        setIndex((prev) => prev + 1)
      }, typingSpeed)

      return () => clearTimeout(timer)
    } else {
      onComplete?.()
    }
  }, [message, index, typingSpeed, onComplete])

  return <span className={className}>{displayedMessage}</span>
}
