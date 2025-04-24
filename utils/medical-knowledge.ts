// Common symptoms and their information
export const symptomInfo = {
  headache: {
    description: "Pain in any region of the head.",
    possibleCauses: [
      "Tension or stress",
      "Dehydration",
      "Lack of sleep",
      "Eye strain",
      "Sinus congestion",
      "Migraine",
      "Medication side effects",
    ],
    homeRemedies: [
      "Rest in a quiet, dark room",
      "Apply a cold or warm compress to your head",
      "Stay hydrated",
      "Over-the-counter pain relievers if appropriate",
    ],
    whenToSeekHelp: [
      "Sudden, severe headache",
      "Headache with fever, stiff neck, confusion, seizures, double vision, weakness, numbness or difficulty speaking",
      "Headache after a head injury",
      "Chronic or recurring headaches",
    ],
  },
  fever: {
    description: "A temporary increase in body temperature, often due to an illness.",
    possibleCauses: [
      "Viral infections",
      "Bacterial infections",
      "Inflammatory conditions",
      "Certain medications",
      "Heat exhaustion",
    ],
    homeRemedies: ["Rest", "Stay hydrated", "Take fever-reducing medications if appropriate", "Use a cool compress"],
    whenToSeekHelp: [
      "Temperature above 103°F (39.4°C) in adults",
      "Fever lasting more than three days",
      "Fever with severe headache, stiff neck, confusion, or difficulty breathing",
      "Fever with rash",
    ],
  },
  cough: {
    description: "A sudden, often repetitive reflex that helps clear the throat and breathing passages.",
    possibleCauses: [
      "Common cold or flu",
      "Allergies",
      "Asthma",
      "Acid reflux",
      "Respiratory infections",
      "Environmental irritants",
    ],
    homeRemedies: [
      "Stay hydrated",
      "Use honey (for adults and children over 1 year)",
      "Use a humidifier",
      "Avoid irritants like smoke",
    ],
    whenToSeekHelp: [
      "Cough lasting more than 3 weeks",
      "Coughing up blood or yellow-green phlegm",
      "Shortness of breath or wheezing",
      "Fever above 100.4°F (38°C)",
    ],
  },
  soreThroat: {
    description: "Pain, scratchiness or irritation of the throat that often worsens when swallowing.",
    possibleCauses: [
      "Viral infections like the common cold",
      "Bacterial infections like strep throat",
      "Allergies",
      "Dry air",
      "Irritants like smoke or pollution",
    ],
    homeRemedies: ["Gargle with warm salt water", "Drink warm liquids", "Use throat lozenges", "Stay hydrated"],
    whenToSeekHelp: [
      "Severe pain when swallowing",
      "Sore throat lasting more than a week",
      "Difficulty breathing or swallowing",
      "Unusual drooling (in children)",
      "Fever above 101°F (38.3°C)",
    ],
  },
  stomachPain: {
    description: "Pain or discomfort in the abdomen.",
    possibleCauses: [
      "Indigestion",
      "Gas",
      "Food poisoning",
      "Stomach virus",
      "Constipation",
      "Menstrual cramps",
      "Ulcers",
    ],
    homeRemedies: [
      "Rest",
      "Clear liquids",
      "Avoid solid foods temporarily",
      "Avoid NSAIDs if possible",
      "Apply heat for cramps",
    ],
    whenToSeekHelp: [
      "Severe pain",
      "Pain lasting more than a few days",
      "Fever",
      "Bloody stools",
      "Persistent nausea and vomiting",
      "Yellowing of skin or eyes",
      "Swelling of the abdomen",
    ],
  },
}

// Emergency conditions that require immediate attention
export const emergencyConditions = [
  "chest pain",
  "difficulty breathing",
  "severe bleeding",
  "head injury",
  "stroke symptoms",
  "heart attack",
  "severe allergic reaction",
  "seizure",
  "severe burn",
  "poisoning",
  "suicidal thoughts",
]

// General health advice
export const generalHealthAdvice = [
  "Stay hydrated by drinking plenty of water throughout the day.",
  "Aim for 7-9 hours of quality sleep each night.",
  "Eat a balanced diet rich in fruits, vegetables, whole grains, and lean proteins.",
  "Engage in regular physical activity, aiming for at least 150 minutes of moderate exercise per week.",
  "Practice stress management techniques such as deep breathing, meditation, or yoga.",
  "Maintain regular check-ups with your healthcare provider.",
  "Stay up to date on vaccinations.",
  "Limit alcohol consumption and avoid tobacco products.",
  "Wash your hands frequently to prevent the spread of infections.",
  "Use sun protection when outdoors.",
]

// Medical disclaimer
export const medicalDisclaimer =
  "Please note that this information is not a substitute for professional medical advice, diagnosis, or treatment. " +
  "Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. " +
  "Never disregard professional medical advice or delay in seeking it because of something you have read or heard here."
