import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PatientReportProps {
  patientName: string
  patientId: string
  assessmentDate: string
  age: number
  gender: string
  contactInfo: string
  primarySymptoms: Array<{
    name: string
    duration: string
    severity: string
  }>
  secondarySymptoms: string[]
  diagnoses: Array<{
    condition: string
    likelihood: "High" | "Medium" | "Low"
    evidence: string[]
  }>
  immediateActions: string[]
  followUpPlan: string[]
  resources: {
    educational: string[]
    support: Array<{
      name: string
      contact: string
    }>
  }
}

export default function PatientReport({
  patientName,
  patientId,
  assessmentDate,
  age,
  gender,
  contactInfo,
  primarySymptoms,
  secondarySymptoms,
  diagnoses,
  immediateActions,
  followUpPlan,
  resources,
}: PatientReportProps) {
  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center text-teal-600 dark:text-teal-400">HEALTHCARE ASSESSMENT REPORT</h1>

      {/* 1. PATIENT INFORMATION */}
      <Card>
        <CardHeader>
          <CardTitle>1. PATIENT INFORMATION</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>
                <span className="font-medium">Patient Name:</span> {patientName}
              </p>
              <p>
                <span className="font-medium">Patient ID:</span> {patientId}
              </p>
            </div>
            <div>
              <p>
                <span className="font-medium">Date of Assessment:</span> {assessmentDate}
              </p>
            </div>
          </div>

          <div className="ml-6">
            <h3 className="text-md font-semibold mb-2">1.1 Demographics</h3>
            <div className="ml-6 space-y-1">
              <p>
                <span className="font-medium">Age:</span> {age}
              </p>
              <p>
                <span className="font-medium">Gender:</span> {gender}
              </p>
              <p>
                <span className="font-medium">Contact:</span> {contactInfo}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. SYMPTOM ANALYSIS */}
      <Card>
        <CardHeader>
          <CardTitle>2. SYMPTOM ANALYSIS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="ml-6">
            <h3 className="text-md font-semibold mb-2">2.1 Primary Symptoms</h3>
            <ul className="ml-6 space-y-3">
              {primarySymptoms.map((symptom, index) => (
                <li key={index} className="list-disc ml-4">
                  <span className="font-medium">{symptom.name}</span>
                  <ul className="ml-6 mt-1">
                    <li className="list-['-'] ml-4">
                      <span className="text-sm">Duration: {symptom.duration}</span>
                    </li>
                    <li className="list-['-'] ml-4">
                      <span className="text-sm">Severity: {symptom.severity}</span>
                    </li>
                  </ul>
                </li>
              ))}
            </ul>
          </div>

          <div className="ml-6">
            <h3 className="text-md font-semibold mb-2">2.2 Secondary Symptoms</h3>
            <ul className="ml-6 space-y-1">
              {secondarySymptoms.map((symptom, index) => (
                <li key={index} className="list-disc ml-4">
                  {symptom}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 3. DIAGNOSTIC ASSESSMENT */}
      <Card>
        <CardHeader>
          <CardTitle>3. DIAGNOSTIC ASSESSMENT</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="ml-6">
            <h3 className="text-md font-semibold mb-2">3.1 Preliminary Diagnosis</h3>
            <p className="ml-6 mb-2">Based on the symptoms presented, the following conditions are being considered:</p>

            <ol className="ml-6 space-y-4">
              {diagnoses.map((diagnosis, index) => (
                <li key={index} className="ml-4">
                  <span className="font-medium">
                    {index + 1}. {diagnosis.condition}
                  </span>
                  <ul className="ml-6 mt-1">
                    <li className="list-['-'] ml-4">
                      <span className="text-sm">Likelihood: {diagnosis.likelihood}</span>
                    </li>
                    <li className="list-['-'] ml-4">
                      <span className="text-sm">Supporting evidence:</span>
                      <ul className="ml-6 mt-1">
                        {diagnosis.evidence.map((item, i) => (
                          <li key={i} className="list-['*'] ml-4 text-sm">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* 4. RECOMMENDATIONS */}
      <Card>
        <CardHeader>
          <CardTitle>4. RECOMMENDATIONS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="ml-6">
            <h3 className="text-md font-semibold mb-2">4.1 Immediate Actions</h3>
            <ul className="ml-6 space-y-1">
              {immediateActions.map((action, index) => (
                <li key={index} className="list-disc ml-4">
                  {action}
                </li>
              ))}
            </ul>
          </div>

          <div className="ml-6">
            <h3 className="text-md font-semibold mb-2">4.2 Follow-up Plan</h3>
            <ul className="ml-6 space-y-1">
              {followUpPlan.map((plan, index) => (
                <li key={index} className="list-disc ml-4">
                  {plan}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 5. RESOURCES */}
      <Card>
        <CardHeader>
          <CardTitle>5. RESOURCES</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="ml-6">
            <h3 className="text-md font-semibold mb-2">5.1 Educational Materials</h3>
            <ul className="ml-6 space-y-1">
              {resources.educational.map((resource, index) => (
                <li key={index} className="list-disc ml-4">
                  {resource}
                </li>
              ))}
            </ul>
          </div>

          <div className="ml-6">
            <h3 className="text-md font-semibold mb-2">5.2 Support Services</h3>
            <ul className="ml-6 space-y-1">
              {resources.support.map((service, index) => (
                <li key={index} className="list-disc ml-4">
                  <span className="font-medium">{service.name}:</span> {service.contact}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-500 mt-8">
        This report is generated by HealthChat AI and should be reviewed by a healthcare professional.
        <br />
        It is not a substitute for professional medical advice, diagnosis, or treatment.
      </div>
    </div>
  )
}
