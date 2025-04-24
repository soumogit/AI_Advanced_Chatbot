// Simple NLP utilities for the medical voice assistant

// Extract symptoms from user input
export function extractSymptoms(input: string): string[] {
  const lowerInput = input.toLowerCase()
  const commonSymptoms = [
    "headache",
    "fever",
    "cough",
    "sore throat",
    "runny nose",
    "congestion",
    "nausea",
    "vomiting",
    "diarrhea",
    "constipation",
    "fatigue",
    "dizziness",
    "chest pain",
    "shortness of breath",
    "back pain",
    "joint pain",
    "rash",
    "itching",
    "swelling",
    "pain",
    "ache",
    "stomach pain",
    "abdominal pain",
  ]

  return commonSymptoms.filter((symptom) => lowerInput.includes(symptom))
}

// Detect if input contains emergency keywords
export function isEmergencyMention(input: string): boolean {
  const lowerInput = input.toLowerCase()
  const emergencyKeywords = [
    "emergency",
    "911",
    "ambulance",
    "can't breathe",
    "chest pain",
    "heart attack",
    "stroke",
    "severe bleeding",
    "unconscious",
    "collapsed",
    "seizure",
    "suicide",
  ]

  return emergencyKeywords.some((keyword) => lowerInput.includes(keyword))
}

// Detect greeting
export function isGreeting(input: string): boolean {
  const lowerInput = input.toLowerCase()
  const greetings = ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening"]

  return greetings.some((greeting) => lowerInput.includes(greeting))
}

// Detect farewell
export function isFarewell(input: string): boolean {
  const lowerInput = input.toLowerCase()
  const farewells = ["goodbye", "bye", "see you", "farewell", "thanks", "thank you"]

  return farewells.some((farewell) => lowerInput.includes(farewell))
}

// Detect question about a condition
export function isConditionQuestion(input: string): boolean {
  const lowerInput = input.toLowerCase()
  const questionPatterns = [
    "what is",
    "what are",
    "what causes",
    "how do you treat",
    "how to treat",
    "symptoms of",
    "signs of",
    "treatment for",
    "cure for",
    "remedy for",
  ]

  return questionPatterns.some((pattern) => lowerInput.includes(pattern))
}

// Extract medical conditions mentioned
export function extractConditions(input: string): string[] {
  const lowerInput = input.toLowerCase()
  const commonConditions = [
    "cold",
    "flu",
    "covid",
    "diabetes",
    "hypertension",
    "high blood pressure",
    "asthma",
    "allergies",
    "migraine",
    "depression",
    "anxiety",
    "arthritis",
    "cancer",
    "heart disease",
    "stroke",
    "pneumonia",
    "bronchitis",
    "infection",
  ]

  return commonConditions.filter((condition) => lowerInput.includes(condition))
}

// Generate a more natural response with some variation
export function generateNaturalResponse(responses: string[]): string {
  // Add some natural language fillers
  const starters = [
    "",
    "I understand. ",
    "I see. ",
    "Based on what you've told me, ",
    "Thank you for sharing that. ",
    "Let me help you with that. ",
  ]

  const selectedResponse = responses[Math.floor(Math.random() * responses.length)]
  const selectedStarter = starters[Math.floor(Math.random() * starters.length)]

  return selectedStarter + selectedResponse
}
