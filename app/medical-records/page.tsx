"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  Activity,
  FlaskRoundIcon as Flask,
  TreesIcon as Lungs,
  Search,
  Filter,
  Plus,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

// Sample medical records data
const labReports = [
  {
    id: "LR-2023-0045",
    title: "Complete Blood Count (CBC)",
    date: "Oct 15, 2023",
    doctor: "Dr. Priya Sharma",
    facility: "City General Hospital",
    status: "normal",
    description: "Routine blood work to check overall health status",
    results: [
      { name: "Hemoglobin", value: "14.2 g/dL", range: "13.5-17.5 g/dL", status: "normal" },
      { name: "White Blood Cells", value: "7.5 x10^9/L", range: "4.5-11.0 x10^9/L", status: "normal" },
      { name: "Platelets", value: "250 x10^9/L", range: "150-450 x10^9/L", status: "normal" },
      { name: "Red Blood Cells", value: "5.2 x10^12/L", range: "4.5-5.9 x10^12/L", status: "normal" },
    ],
  },
  {
    id: "LR-2023-0078",
    title: "Lipid Panel",
    date: "Oct 15, 2023",
    doctor: "Dr. Priya Sharma",
    facility: "City General Hospital",
    status: "attention",
    description: "Cholesterol and triglycerides test",
    results: [
      { name: "Total Cholesterol", value: "210 mg/dL", range: "<200 mg/dL", status: "high" },
      { name: "HDL Cholesterol", value: "45 mg/dL", range: ">40 mg/dL", status: "normal" },
      { name: "LDL Cholesterol", value: "130 mg/dL", range: "<100 mg/dL", status: "high" },
      { name: "Triglycerides", value: "150 mg/dL", range: "<150 mg/dL", status: "borderline" },
    ],
  },
  {
    id: "LR-2023-0112",
    title: "Liver Function Test",
    date: "Nov 05, 2023",
    doctor: "Dr. Rajesh Kumar",
    facility: "MedLife Diagnostics",
    status: "normal",
    description: "Assessment of liver health and function",
    results: [
      { name: "ALT", value: "25 U/L", range: "7-56 U/L", status: "normal" },
      { name: "AST", value: "22 U/L", range: "5-40 U/L", status: "normal" },
      { name: "Albumin", value: "4.2 g/dL", range: "3.5-5.0 g/dL", status: "normal" },
      { name: "Bilirubin", value: "0.8 mg/dL", range: "0.1-1.2 mg/dL", status: "normal" },
    ],
  },
]

const imagingReports = [
  {
    id: "IR-2023-0034",
    title: "Chest X-Ray",
    date: "Sep 20, 2023",
    doctor: "Dr. Anand Verma",
    facility: "City General Hospital",
    status: "normal",
    description: "Routine chest examination",
    findings: "No abnormalities detected. Heart size normal. Lung fields clear. No pleural effusion.",
    recommendation: "No follow-up required.",
  },
  {
    id: "IR-2023-0067",
    title: "Abdominal Ultrasound",
    date: "Nov 10, 2023",
    doctor: "Dr. Meera Patel",
    facility: "MedLife Diagnostics",
    status: "attention",
    description: "Evaluation of abdominal organs",
    findings: "Mild fatty liver changes noted. All other abdominal organs appear normal in size and echo texture.",
    recommendation: "Dietary modifications recommended. Follow-up in 6 months.",
  },
]

const consultations = [
  {
    id: "CON-2023-0089",
    title: "Annual Physical Examination",
    date: "Oct 15, 2023",
    doctor: "Dr. Priya Sharma",
    specialty: "General Medicine",
    facility: "City General Hospital",
    notes:
      "Patient is in good overall health. Mild elevation in cholesterol levels noted. Recommended dietary changes and increased physical activity.",
    followUp: "Annual check-up in 12 months.",
  },
  {
    id: "CON-2023-0112",
    title: "Cardiology Consultation",
    date: "Nov 15, 2023",
    doctor: "Dr. Vikram Mehta",
    specialty: "Cardiology",
    facility: "Heart Care Center",
    notes:
      "Patient reports occasional palpitations. ECG normal. Stress test shows good cardiac function. No significant cardiovascular concerns at this time.",
    followUp: "Return if symptoms worsen. Routine follow-up in 6 months.",
  },
]

export default function MedicalRecordsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("lab")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)

  const handleViewDetails = (record: any) => {
    setSelectedRecord(record)
    setShowDetails(true)
  }

  const handleCloseDetails = () => {
    setShowDetails(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
      case "attention":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
      case "critical":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
    }
  }

  const getValueStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600 dark:text-green-400"
      case "high":
      case "low":
        return "text-red-600 dark:text-red-400"
      case "borderline":
        return "text-amber-600 dark:text-amber-400"
      default:
        return ""
    }
  }

  const renderLabReportDetails = (report: any) => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">{report.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {report.date} • {report.facility}
            </p>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
            {report.status === "normal" ? "Normal" : report.status === "attention" ? "Needs Attention" : "Critical"}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm">{report.description}</p>
          <p className="text-sm">
            <span className="font-medium">Ordered by:</span> {report.doctor}
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="font-medium mb-3">Results</h4>
          <div className="space-y-3">
            {report.results.map((result: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{result.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Reference Range: {result.range}</p>
                </div>
                <div className={`font-medium ${getValueStatusColor(result.status)}`}>{result.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            View Full Report
          </Button>
        </div>
      </div>
    )
  }

  const renderImagingReportDetails = (report: any) => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">{report.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {report.date} • {report.facility}
            </p>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
            {report.status === "normal" ? "Normal" : report.status === "attention" ? "Needs Attention" : "Critical"}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm">{report.description}</p>
          <p className="text-sm">
            <span className="font-medium">Ordered by:</span> {report.doctor}
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium mb-1">Findings</h4>
              <p className="text-sm">{report.findings}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Recommendation</h4>
              <p className="text-sm">{report.recommendation}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            View Full Report
          </Button>
        </div>
      </div>
    )
  }

  const renderConsultationDetails = (consultation: any) => {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">{consultation.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {consultation.date} • {consultation.facility}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Doctor:</span> {consultation.doctor}
          </p>
          <p className="text-sm">
            <span className="font-medium">Specialty:</span> {consultation.specialty}
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium mb-1">Consultation Notes</h4>
              <p className="text-sm">{consultation.notes}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Follow-up</h4>
              <p className="text-sm">{consultation.followUp}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Summary
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            View Full Notes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 px-4 md:px-6 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/health-dashboard" className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <span className="font-medium text-gray-800 dark:text-gray-200">Back to Dashboard</span>
            </Link>
          </div>
          <div className="text-xl font-bold text-teal-600 dark:text-teal-400">Medical Records</div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Medical Records</h1>
            <p className="text-gray-500 dark:text-gray-400">View and manage your health records</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search records..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Upload Record
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="lab" className="flex items-center">
              <Flask className="h-4 w-4 mr-2" />
              Lab Reports
            </TabsTrigger>
            <TabsTrigger value="imaging" className="flex items-center">
              <Lungs className="h-4 w-4 mr-2" />
              Imaging
            </TabsTrigger>
            <TabsTrigger value="consultations" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Consultations
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              All Records
            </TabsTrigger>
          </TabsList>

          {showDetails ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Record Details</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleCloseDetails}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to List
                </Button>
              </CardHeader>
              <CardContent>
                {activeTab === "lab" && renderLabReportDetails(selectedRecord)}
                {activeTab === "imaging" && renderImagingReportDetails(selectedRecord)}
                {activeTab === "consultations" && renderConsultationDetails(selectedRecord)}
              </CardContent>
            </Card>
          ) : (
            <>
              <TabsContent value="lab" className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {labReports.map((report) => (
                    <Card key={report.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{report.title}</CardTitle>
                            <CardDescription>{report.date}</CardDescription>
                          </div>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}
                          >
                            {report.status === "normal"
                              ? "Normal"
                              : report.status === "attention"
                                ? "Needs Attention"
                                : "Critical"}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{report.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <span className="font-medium">Doctor:</span> {report.doctor}
                          </div>
                          <Button size="sm" onClick={() => handleViewDetails(report)}>
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="imaging" className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {imagingReports.map((report) => (
                    <Card key={report.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{report.title}</CardTitle>
                            <CardDescription>{report.date}</CardDescription>
                          </div>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}
                          >
                            {report.status === "normal"
                              ? "Normal"
                              : report.status === "attention"
                                ? "Needs Attention"
                                : "Critical"}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{report.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <span className="font-medium">Doctor:</span> {report.doctor}
                          </div>
                          <Button size="sm" onClick={() => handleViewDetails(report)}>
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="consultations" className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {consultations.map((consultation) => (
                    <Card key={consultation.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{consultation.title}</CardTitle>
                            <CardDescription>{consultation.date}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center mb-4">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                            <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">{consultation.doctor}</span>
                            <p className="text-gray-500 dark:text-gray-400">{consultation.specialty}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <span className="font-medium">Facility:</span> {consultation.facility}
                          </div>
                          <Button size="sm" onClick={() => handleViewDetails(consultation)}>
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="all" className="m-0">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium mb-3 flex items-center">
                      <Flask className="h-5 w-5 mr-2 text-teal-500" />
                      Lab Reports
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {labReports.slice(0, 2).map((report) => (
                        <Card key={report.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{report.title}</CardTitle>
                                <CardDescription>{report.date}</CardDescription>
                              </div>
                              <div
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}
                              >
                                {report.status === "normal"
                                  ? "Normal"
                                  : report.status === "attention"
                                    ? "Needs Attention"
                                    : "Critical"}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{report.description}</p>
                            <div className="flex justify-between items-center">
                              <div className="text-sm">
                                <span className="font-medium">Doctor:</span> {report.doctor}
                              </div>
                              <Button size="sm" onClick={() => handleViewDetails(report)}>
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-medium mb-3 flex items-center">
                      <Lungs className="h-5 w-5 mr-2 text-teal-500" />
                      Imaging Reports
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {imagingReports.map((report) => (
                        <Card key={report.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{report.title}</CardTitle>
                                <CardDescription>{report.date}</CardDescription>
                              </div>
                              <div
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}
                              >
                                {report.status === "normal"
                                  ? "Normal"
                                  : report.status === "attention"
                                    ? "Needs Attention"
                                    : "Critical"}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{report.description}</p>
                            <div className="flex justify-between items-center">
                              <div className="text-sm">
                                <span className="font-medium">Doctor:</span> {report.doctor}
                              </div>
                              <Button size="sm" onClick={() => handleViewDetails(report)}>
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 md:mb-0">
            © 2025 HealthChat. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/privacy"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
