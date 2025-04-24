"use client"

import { useEffect, useState, useRef } from "react"
import { User, Bot, AlertTriangle, Info } from "lucide-react"
import { TypingIndicator, TypingMessage } from "./typing-indicator"
import { QuickReplies } from "./quick-replies"
import { CollapsibleSection } from "./collapsible-section"
import { SymptomBadge } from "./symptom-badge"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  message: {
    id: string
    role: "user" | "assistant" | "system"
    content: string
  }
  isNew?: boolean
  onQuickReply?: (reply: string) => void
  suggestedReplies?: string[]
  highlightSymptoms?: string[]
  severity?: string
}

export default function ChatMessage({
  message,
  isNew = false,
  onQuickReply,
  suggestedReplies = [],
  highlightSymptoms = [],
  severity,
}: ChatMessageProps) {
  const isUser = message.role === "user"
  const [isTyping, setIsTyping] = useState(false)
  const [showFullContent, setShowFullContent] = useState(!isNew || isUser)
  const [isVisible, setIsVisible] = useState(false)
  const messageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsTyping(isNew && !isUser)
  }, [isNew, isUser])

  useEffect(() => {
    setIsVisible(true)

    // Add pulse effect to emergency alerts
    if (!isUser && messageRef.current) {
      const emergencyAlerts = messageRef.current.querySelectorAll(".emergency-alert")
      emergencyAlerts.forEach((alert) => {
        alert.classList.add("animate-pulse")
        setTimeout(() => {
          alert.classList.remove("animate-pulse")
        }, 2000)
      })
    }
  }, [isUser])

  if (message.role === "system") return null

  // Update the section detection in the ChatMessage component
  // Extract sections for collapsible content
  const hasEmergencyAlert =
    !isUser && (message.content.includes("🚨 Emergency Alert:") || message.content.includes("🚨 When to See a Doctor:"))
  const hasImportantNotes = !isUser && message.content.includes("🔔 Important Notes:")

  // Highlight symptoms in the message
  const highlightedContent =
    !isUser && highlightSymptoms.length > 0
      ? highlightSymptoms.reduce((content, symptom) => {
          // Use word boundary to match whole words only
          const regex = new RegExp(`\\b${symptom}\\b`, "gi")
          return content.replace(
            regex,
            `<span class="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-1 rounded">${symptom}</span>`,
          )
        }, message.content)
      : message.content

  return (
    <div
      ref={messageRef}
      className={cn(
        "group flex animate-fadeIn transition-opacity duration-500",
        isUser ? "justify-end" : "justify-start",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      <div
        className={cn(
          "flex max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3.5 shadow-sm transition-all",
          isUser
            ? "bg-gradient-to-br from-teal-500 to-teal-600 text-white"
            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
          !isUser && "hover:shadow-md",
        )}
      >
        <div className="flex-shrink-0 mr-3">
          {isUser ? (
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-teal-600/50 text-white">
              <User className="h-4 w-4" />
            </div>
          ) : (
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-teal-500 dark:text-teal-400">
              <Bot className="h-4 w-4" />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          {isUser ? (
            <div>
              {/* Check if the message contains symptoms to display as badges */}
              {highlightSymptoms.length > 0 &&
              highlightSymptoms.some((s) => message.content.toLowerCase().includes(s.toLowerCase())) ? (
                <div className="space-y-2">
                  <p className="text-sm md:text-base text-white">{message.content}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {highlightSymptoms
                      .filter((s) => message.content.toLowerCase().includes(s.toLowerCase()))
                      .map((symptom) => (
                        <SymptomBadge key={symptom} symptom={symptom} size="sm" className="bg-teal-600/30 text-white" />
                      ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm md:text-base text-white">{message.content}</p>
              )}
            </div>
          ) : isTyping ? (
            <>
              {!showFullContent && <TypingIndicator className="my-2" />}
              <div
                className={cn(
                  "prose prose-sm md:prose-base dark:prose-invert max-w-none",
                  !showFullContent && "hidden",
                )}
              >
                <TypingMessage
                  message={highlightedContent}
                  onComplete={() => setIsTyping(false)}
                  typingSpeed={10}
                  className="prose prose-sm md:prose-base dark:prose-invert max-w-none"
                />
              </div>
            </>
          ) : (
            <>
              <div
                className="prose prose-sm md:prose-base dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: formatMessage(highlightedContent, hasEmergencyAlert, hasImportantNotes, message),
                }}
              />
              {!isUser && severity && (
                <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Severity:</span>
                    <div
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        severity.toLowerCase().includes("mild")
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          : severity.toLowerCase().includes("moderate")
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                            : severity.toLowerCase().includes("severe")
                              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300"
                              : severity.toLowerCase().includes("very severe")
                                ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300",
                      )}
                    >
                      {severity.toLowerCase().includes("mild")
                        ? "Mild"
                        : severity.toLowerCase().includes("moderate")
                          ? "Moderate"
                          : severity.toLowerCase().includes("severe") && !severity.toLowerCase().includes("very")
                            ? "Severe"
                            : severity.toLowerCase().includes("very severe")
                              ? "Very Severe"
                              : severity}
                    </div>
                  </div>
                </div>
              )}

              {hasEmergencyAlert && (
                <CollapsibleSection
                  title="Emergency Information"
                  className="mt-3 border-red-200 dark:border-red-900/50"
                  icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
                  defaultOpen={true}
                >
                  <div
                    className="prose prose-sm max-w-none text-red-700 dark:text-red-400 emergency-alert"
                    dangerouslySetInnerHTML={{ __html: extractSection(message.content, "🚨 Emergency Alert:") }}
                  />
                </CollapsibleSection>
              )}

              {hasImportantNotes && (
                <CollapsibleSection
                  title="Important Notes"
                  className="mt-3 border-blue-200 dark:border-blue-900/50"
                  icon={<Info className="h-4 w-4 text-blue-500" />}
                >
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: extractSection(message.content, "🔔 Important Notes:") }}
                  />
                </CollapsibleSection>
              )}

              {!isUser && onQuickReply && suggestedReplies.length > 0 && isNew && (
                <QuickReplies options={suggestedReplies} onSelect={onQuickReply} className="mt-3" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Replace the entire formatMessage function with this improved version:

function formatMessage(content: string, hideEmergency = false, hideNotes = false, message: any): string {
  const isUser = message.role === "user"
  if (!content) return ""

  // First, handle the patient info section
  let formatted = content

  // Format the horizontal rule
  formatted = formatted.replace(/<hr>/g, '<hr class="my-4 border-gray-200 dark:border-gray-700" />')

  // Format section headers with proper spacing and consistent styling
  formatted = formatted.replace(
    /(🩺 Possible Causes:|🩺 Possible Explanations:|🏠 Home Remedies:|🏠 Self-Care Suggestions:|🚨 Emergency Alert:|🚨 When to See a Doctor:|🔔 Important Notes:)/g,
    (match) => {
      const headerMap: Record<string, string> = {
        "🩺 Possible Causes:": "🩺 Possible Explanations:",
        "🏠 Home Remedies:": "🏠 Self-Care Suggestions:",
        "🚨 Emergency Alert:": "🚨 When to See a Doctor:",
        "🔔 Important Notes:": "🔔 Important Notes:",
      }
      return `<h3 class="text-base font-medium mt-5 mb-3">${headerMap[match] || match}</h3>`
    },
  )

  // Define all possible sections with improved regex patterns
  const sections = [
    {
      header: "🩺 Possible Explanations:",
      regex:
        /🩺 Possible (Causes|Explanations):.*?(?=(🏠 Home Remedies:|🏠 Self-Care Suggestions:|🚨 Emergency Alert:|🚨 When to See a Doctor:|🔔 Important Notes:|Get well soon|$))/s,
    },
    {
      header: "🏠 Self-Care Suggestions:",
      regex:
        /🏠 (Home Remedies|Self-Care Suggestions):.*?(?=(🚨 Emergency Alert:|🚨 When to See a Doctor:|🔔 Important Notes:|Get well soon|$))/s,
    },
    {
      header: "🚨 When to See a Doctor:",
      regex: /🚨 (Emergency Alert|When to See a Doctor):.*?(?=(🔔 Important Notes:|Get well soon|$))/s,
    },
    {
      header: "🔔 Important Notes:",
      regex: /🔔 Important Notes:.*?(?=(Get well soon|$))/s,
    },
  ]

  // Process each section to format bullet points with proper indentation
  sections.forEach((section) => {
    // Skip sections that will be shown in collapsible components
    if (
      (hideEmergency && section.header.includes("When to See a Doctor")) ||
      (hideNotes && section.header.includes("Important Notes"))
    ) {
      return
    }

    const match = formatted.match(section.regex)
    if (match) {
      const sectionContent = match[0]

      // Replace bullet points with properly formatted and indented list items
      const formattedSection = sectionContent.replace(
        /- (🔹|🍃|⚠️|📝) (.*?)(?=\n|$)/g,
        '<li class="flex items-start mb-3 ml-4"><span class="mr-2 flex-shrink-0 mt-0.5">$1</span><span class="flex-1">$2</span></li>',
      )

      // Wrap the bullet points in a proper list with spacing
      const wrappedSection = formattedSection.replace(
        new RegExp(`(${section.header.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}).*?(<li.*?<\/li>)`, "s"),
        `$1<ul class="list-none pl-0 my-3 space-y-2">$2</ul>`,
      )

      // Replace multiple list items with proper spacing
      const cleanedSection = wrappedSection.replace(/<\/li>\s*<li/g, "</li><li")

      formatted = formatted.replace(sectionContent, cleanedSection)
    }
  })

  // If we're hiding sections in collapsible components, remove them from the main content
  if (hideEmergency) {
    formatted = formatted.replace(
      /🚨 (Emergency Alert|When to See a Doctor):.*?(?=(🔔 Important Notes:|Get well soon|$))/s,
      "",
    )
  }

  if (hideNotes) {
    formatted = formatted.replace(/🔔 Important Notes:.*?(?=(Get well soon|$))/s, "")
  }

  // Format patient info to display with proper spacing and badges for symptoms
  const patientInfoRegex =
    /(👤 Patient Name:.*?)(🤝 Age:.*?)(🤒 Primary Symptoms:.*?)(⏱️ Duration:.*?)(🔍 Severity:.*?)(<hr)/s
  const patientInfoMatch = formatted.match(patientInfoRegex)

  if (patientInfoMatch) {
    // Extract the primary symptoms to create badges
    const primarySymptomsMatch = patientInfoMatch[3].match(/🤒 Primary Symptoms: (.*?)$/)
    const primarySymptoms = primarySymptomsMatch ? primarySymptomsMatch[1].trim() : ""

    // Create symptom badges for primary symptoms with proper spacing
    let primarySymptomsBadges = ""
    if (primarySymptoms && primarySymptoms !== "None") {
      const symptoms = primarySymptoms
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s)
      primarySymptomsBadges = `
    <div class="flex flex-wrap gap-2 mt-2 mb-3">
      ${symptoms.map((s) => `<span class="inline-flex items-center rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200 text-xs px-2.5 py-1"><svg class="mr-1.5 h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>${s}</span>`).join(" ")}
    </div>
  `
    }

    const formattedPatientInfo = `
    <div class="space-y-3 mb-4">
      <p class="mb-1">${patientInfoMatch[1].trim()}</p>
      <p class="mb-1">${patientInfoMatch[2].trim()}</p>
      <p class="flex items-center mb-1">${patientInfoMatch[3].trim()}</p>
      ${primarySymptomsBadges}
      <p class="mb-1">${patientInfoMatch[4].trim()}</p>
      <p class="flex items-center mb-1">${patientInfoMatch[5].trim()}</p>
    </div>
    ${patientInfoMatch[6]}
  `
    formatted = formatted.replace(patientInfoMatch[0], formattedPatientInfo)
  }

  // Convert other markdown-like syntax to HTML with proper spacing
  formatted = formatted
    // Convert other bold text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Convert emojis to larger size with proper spacing
    .replace(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g, '<span class="text-xl mr-1">$1</span>')

  // Add paragraph tags for better spacing for the intro text
  const introRegex = /<hr class="my-4 border-gray-200 dark:border-gray-700" \/>(.+?)(?=<h3|🩺)/s
  const introMatch = formatted.match(introRegex)
  if (introMatch) {
    const introText = introMatch[1].trim()
    const formattedIntro = `<p class="my-4 leading-relaxed">${introText}</p>`
    formatted = formatted.replace(introMatch[1], formattedIntro)
  }

  // Format the "Get well soon" message with proper spacing
  formatted = formatted.replace(
    /(Get well soon.*?)$/s,
    '<p class="mt-5 pt-2 text-teal-600 dark:text-teal-400 font-medium">$1</p>',
  )

  // Add this code to detect if this is a diagnosis message and add the appointment button with proper spacing
  if (
    !isUser &&
    message.content.includes("👤 Patient Name:") &&
    (message.content.includes("🩺 Possible Causes:") || message.content.includes("🩺 Possible Explanations:"))
  ) {
    formatted += `
    <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <button onclick="window.bookAppointment()" class="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        Book Appointment with Doctor
      </button>
      <p class="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
        Based on your symptoms, we recommend consulting with a healthcare professional for proper diagnosis and treatment.
      </p>
    </div>
  `
  }

  // Fix any broken HTML
  formatted = formatted.replace(/<\/ul><\/p>/g, "</ul>")
  formatted = formatted.replace(/<p><ul/g, "<ul")

  return formatted
}

// Replace the extractSection function with this improved version:

function extractSection(content: string, sectionHeader: string): string {
  const sections = [
    {
      header: "🩺 Possible Causes:",
      regex:
        /🩺 Possible (Causes|Explanations):.*?(?=(🏠 Home Remedies:|🏠 Self-Care Suggestions:|🚨 Emergency Alert:|🚨 When to See a Doctor:|🔔 Important Notes:|Get well soon|$))/s,
    },
    {
      header: "🏠 Home Remedies:",
      regex:
        /🏠 (Home Remedies|Self-Care Suggestions):.*?(?=(🚨 Emergency Alert:|🚨 When to See a Doctor:|🔔 Important Notes:|Get well soon|$))/s,
    },
    {
      header: "🚨 Emergency Alert:",
      regex: /🚨 (Emergency Alert|When to See a Doctor):.*?(?=(🔔 Important Notes:|Get well soon|$))/s,
    },
    {
      header: "🔔 Important Notes:",
      regex: /🔔 Important Notes:.*?(?=(Get well soon|$))/s,
    },
  ]

  // Find the matching section based on the header
  const section = sections.find(
    (s) =>
      s.header === sectionHeader ||
      (sectionHeader === "🚨 When to See a Doctor:" && s.header === "🚨 Emergency Alert:") ||
      (sectionHeader === "🏠 Self-Care Suggestions:" && s.header === "🏠 Home Remedies:"),
  )

  if (!section) return ""

  const match = content.match(section.regex)
  if (!match) return ""

  let sectionContent = match[0]

  // Format the section content with proper indentation
  sectionContent = sectionContent.replace(
    /- (🔹|🍃|⚠️|📝) (.*?)(?=\n|$)/g,
    '<li class="flex items-start mb-3"><span class="mr-2 flex-shrink-0 mt-0.5">$1</span><span class="flex-1">$2</span></li>',
  )

  sectionContent = sectionContent.replace(
    new RegExp(`(${section.header.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}).*?(<li.*?<\/li>)`, "s"),
    `<ul class="list-none pl-0 my-3 space-y-2">$2</ul>`,
  )

  sectionContent = sectionContent.replace(/<\/li>\s*<li/g, "</li><li")

  return sectionContent
}
