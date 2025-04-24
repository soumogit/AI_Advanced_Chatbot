import PatientReport from "@/components/patient-report"

export default function ReportExamplePage() {
  // Sample data for demonstration
  const sampleData = {
    patientName: "John Doe",
    patientId: "HC-2023-0045",
    assessmentDate: "April 21, 2025",
    age: 42,
    gender: "Male",
    contactInfo: "(555) 123-4567",
    primarySymptoms: [
      {
        name: "Headache",
        duration: "3 days",
        severity: "Moderate",
      },
      {
        name: "Fatigue",
        duration: "1 week",
        severity: "Mild to moderate",
      },
    ],
    secondarySymptoms: ["Mild fever (99.1°F)", "Occasional dizziness", "Reduced appetite"],
    diagnoses: [
      {
        condition: "Tension Headache",
        likelihood: "High" as const,
        evidence: [
          "Pattern of pain consistent with tension headache",
          "Associated with stress and fatigue",
          "No neurological symptoms",
        ],
      },
      {
        condition: "Viral Infection",
        likelihood: "Medium" as const,
        evidence: ["Presence of mild fever", "Fatigue and reduced appetite", "Common during current season"],
      },
    ],
    immediateActions: [
      "Rest and adequate hydration",
      "Over-the-counter pain reliever as directed",
      "Monitor temperature and symptoms",
    ],
    followUpPlan: [
      "Schedule appointment with primary care physician if symptoms persist beyond 5 days",
      "Consider telehealth consultation if symptoms worsen",
    ],
    resources: {
      educational: [
        "Understanding Headaches: Types and Management",
        "Stress Management Techniques",
        "When to Seek Medical Attention for Headaches",
      ],
      support: [
        {
          name: "24/7 Nurse Hotline",
          contact: "(800) 555-7890",
        },
        {
          name: "Telehealth Services",
          contact: "www.healthchat.com/telehealth",
        },
      ],
    },
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <PatientReport {...sampleData} />
    </div>
  )
}
