import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Extract patient info from the system message
    let name = "Patient"
    let age = ""
    let symptoms = ""
    let duration = ""
    let severity = ""

    const systemMessage = messages.find((m: any) => m.role === "system")
    if (systemMessage) {
      const patientInfo = systemMessage.content
      const nameMatch = patientInfo.match(/Name: (.*?),/)
      const ageMatch = patientInfo.match(/Age: (.*?),/)
      const symptomsMatch = patientInfo.match(/Primary Symptoms: (.*?),/)
      const durationMatch = patientInfo.match(/Duration: (.*?),/)
      const severityMatch = patientInfo.match(/Severity: (.*?)$/)

      if (nameMatch) name = nameMatch[1]
      if (ageMatch) age = ageMatch[1]
      if (symptomsMatch) symptoms = symptomsMatch[1]
      if (durationMatch) duration = durationMatch[1]
      if (severityMatch) severity = severityMatch[1]
    }

    // Get the last user message if it exists
    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop()
    const userInput = lastUserMessage ? lastUserMessage.content : ""

    // Process symptoms to create a list for the AI to consider together
    const primarySymptomsList = symptoms
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && s !== "None")
      .join(", ")

    // Count the number of symptoms
    const symptomCount = primarySymptomsList.split(",").length

    // Check if we have the API key
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set")
      return new Response(generateFallbackResponse(name, age, primarySymptomsList, duration, severity), { status: 200 })
    }

    // Construct the prompt for Gemini - more concise and with consistent font
    const prompt = `
You are an AI healthcare assistant providing medical guidance based on symptoms. You are NOT a doctor.

The patient has reported the following information:
- Name: ${name}
- Age: ${age}
- Primary Symptoms: ${symptoms} (${symptomCount} symptoms)
- Duration: ${duration}
- Severity: ${severity}

CRITICAL INSTRUCTION: The patient has reported ${symptomCount} symptoms: ${primarySymptomsList}. 
You MUST analyze how these symptoms are related and provide a diagnosis that considers ALL symptoms together as a combined condition.
DO NOT focus on just one symptom. Your analysis MUST address the relationship between ALL symptoms listed.

${
  duration.toLowerCase().includes("week") ||
  duration.toLowerCase().includes("month") ||
  duration.toLowerCase().includes("year")
    ? "IMPORTANT: The symptoms have persisted for " +
      duration +
      ". You MUST include a strong recommendation to see a doctor due to the extended duration."
    : ""
}

Format your response EXACTLY as follows with proper indentation and spacing:

👤 Patient Name: ${name}

🤝 Age: ${age}

🤒 Primary Symptoms: ${primarySymptomsList}

⏱️ Duration: ${duration}

🔍 Severity: ${severity}

<hr>

Write a brief, personalized message about their combined symptoms (2-3 lines). Use simple, non-technical language that a layperson can understand. Be empathetic and reassuring while still being informative.

🩺 Possible Explanations:
- 🔹 [First possible explanation in simple, non-technical terms]
- 🔹 [Second possible explanation in simple, non-technical terms]
- 🔹 [Third possible explanation in simple, non-technical terms]

🏠 Self-Care Suggestions:
- 🍃 [First self-care suggestion that's easy to understand and implement]
- 🍃 [Second self-care suggestion that's easy to understand and implement]
- 🍃 [Third self-care suggestion that's easy to understand and implement]

🚨 When to See a Doctor:
- ⚠️ [First clear warning sign in simple terms]
- ⚠️ [Second clear warning sign in simple terms]
${
  duration.toLowerCase().includes("week") ||
  duration.toLowerCase().includes("month") ||
  duration.toLowerCase().includes("year")
    ? "- ⚠️ Your symptoms have persisted for " +
      duration +
      ". Please consult a healthcare professional as soon as possible."
    : ""
}

🔔 Important Notes:
- 📝 [First important note in simple, clear language]
- 📝 [Second important note in simple, clear language]
${
  duration.toLowerCase().includes("week") ||
  duration.toLowerCase().includes("month") ||
  duration.toLowerCase().includes("year")
    ? "- 📝 Symptoms lasting longer than a week may indicate a condition that requires medical attention."
    : ""
}

End with a brief, reassuring "Get well soon" message.

If the user is asking a follow-up question: ${userInput ? `"${userInput}"` : ""}, respond conversationally while maintaining medical context.

IMPORTANT: Make sure to address ALL the symptoms mentioned by the patient in your response, and highlight them appropriately. Use simple, everyday language that anyone can understand.

FORMATTING INSTRUCTIONS:
1. Use consistent spacing between sections (one blank line)
2. Indent all bullet points consistently
3. Keep all text in the same font size and style
4. Ensure proper spacing after each emoji
5. Make sure lists are properly formatted with consistent indentation
`

    try {
      // Create a Gemini model instance
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

      // Use non-streaming response for reliability
      const result = await model.generateContent(prompt)
      const response = result.response
      const text = response.text()

      return new Response(text)
    } catch (genError) {
      console.error("Gemini API error:", genError)
      // Provide a fallback response if the API fails
      return new Response(generateFallbackResponse(name, age, primarySymptomsList, duration, severity), { status: 200 })
    }
  } catch (error) {
    console.error("Error in chat route:", error)
    // Return a more helpful error message
    return new Response(
      "I apologize for the technical difficulties. I'm having trouble analyzing your symptoms right now. This might be due to a temporary issue with my diagnostic system. Please try again in a moment, or consider describing your symptoms differently.",
      { status: 200 },
    )
  }
}

// Update the fallback response function to use the new format
function generateFallbackResponse(name: string, age: string, symptoms: string, duration: string, severity: string) {
  const durationWarning =
    duration.toLowerCase().includes("week") ||
    duration.toLowerCase().includes("month") ||
    duration.toLowerCase().includes("year")
      ? "- ⚠️ Your symptoms have persisted for " +
        duration +
        ". Please consult a healthcare professional as soon as possible."
      : ""

  const durationNote =
    duration.toLowerCase().includes("week") ||
    duration.toLowerCase().includes("month") ||
    duration.toLowerCase().includes("year")
      ? "- 📝 Symptoms lasting longer than a week may indicate a condition that requires medical attention."
      : ""

  return `
👤 Patient Name: ${name}

🤝 Age: ${age}

🤒 Primary Symptoms: ${symptoms}

⏱️ Duration: ${duration}

🔍 Severity: ${severity}

<hr>

I'm sorry to hear you've been experiencing ${symptoms} for ${duration}, ${name}. Having multiple symptoms together can be uncomfortable, but I'm here to help provide some general information.

🩺 Possible Explanations:
- 🔹 Your combination of symptoms could suggest several different conditions
- 🔹 These symptoms together might indicate a common viral or bacterial infection
- 🔹 Sometimes these symptoms can be related to stress, fatigue, or lifestyle factors

🏠 Self-Care Suggestions:
- 🍃 Rest and stay hydrated with plenty of fluids
- 🍃 Monitor your symptoms and note any changes
- 🍃 Over-the-counter pain relievers may help with discomfort (follow package instructions)

🚨 When to See a Doctor:
- ⚠️ If your symptoms worsen significantly
- ⚠️ If you develop difficulty breathing, severe pain, or high fever
${durationWarning}

🔔 Important Notes:
- 📝 This information is general and not a substitute for professional medical advice
- 📝 Everyone's body responds differently to conditions and treatments
${durationNote}

I hope you feel better soon, ${name}. Remember that a healthcare professional can provide personalized advice for your specific situation.
`
}
