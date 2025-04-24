"use client"

import type React from "react"

import { useState } from "react"
import {
  Search,
  MapPin,
  Phone,
  Clock,
  Star,
  Filter,
  ChevronDown,
  Stethoscope,
  Heart,
  Brain,
  Bone,
  Baby,
  Eye,
  Pill,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Hospital {
  id: string
  name: string
  distance: number
  address: string
  phone: string
  rating: number
  reviewCount: number
  hours: string
  emergency: boolean
  services: string[]
  specialties: string[]
}

interface ServiceCategory {
  id: string
  name: string
  icon: React.ReactNode
  description: string
}

export function HospitalServiceFinder() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null)
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false)
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt">("prompt")
  const [isLoading, setIsLoading] = useState(false)

  // Sample data for hospitals
  const hospitals: Hospital[] = [
    {
      id: "1",
      name: "Christian Medical College & Hospital",
      distance: 3.2,
      address: "Ida Scudder Rd, Vellore, Tamil Nadu 632004",
      phone: "0416 228 2010",
      rating: 4.4,
      reviewCount: 7800,
      hours: "Open 24 hours",
      emergency: true,
      services: ["Emergency Care", "ICU", "Surgery", "Radiology", "Laboratory", "Pharmacy"],
      specialties: ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Ophthalmology"],
    },
    {
      id: "2",
      name: "Government Vellore Medical College Hospital",
      distance: 4.5,
      address: "Adukkamparai, Vellore, Tamil Nadu 632011",
      phone: "0416 222 2222",
      rating: 4.0,
      reviewCount: 3227,
      hours: "Open 24 hours",
      emergency: true,
      services: ["Emergency Care", "ICU", "Surgery", "Radiology", "Laboratory"],
      specialties: ["General Medicine", "Cardiology", "Neurology", "Orthopedics"],
    },
    {
      id: "3",
      name: "Naruvi Hospitals",
      distance: 2.7,
      address: "Chennai - Bengaluru Highway, 72, Collector Office Road, Vellore",
      phone: "0416 666 1111",
      rating: 4.8,
      reviewCount: 1800,
      hours: "Open 24 hours",
      emergency: true,
      services: ["Emergency Care", "ICU", "Surgery", "Radiology", "Laboratory", "Pharmacy", "Telemedicine"],
      specialties: ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Ophthalmology", "Oncology"],
    },
    {
      id: "4",
      name: "Sri Narayani Hospital & Research Centre",
      distance: 5.2,
      address: "Sripuram, Thirumalaikodi, Vellore, Tamil Nadu 632055",
      phone: "0416 220 6300",
      rating: 4.3,
      reviewCount: 2200,
      hours: "Open 24 hours",
      emergency: true,
      services: ["Emergency Care", "ICU", "Surgery", "Radiology", "Laboratory", "Pharmacy"],
      specialties: ["Cardiology", "Neurology", "Orthopedics", "Pediatrics"],
    },
    {
      id: "5",
      name: "Ranipet Government Hospital",
      distance: 7.8,
      address: "Walajah Rd, Ranipet, Tamil Nadu 632401",
      phone: "04172 273 377",
      rating: 3.9,
      reviewCount: 980,
      hours: "Open 24 hours",
      emergency: true,
      services: ["Emergency Care", "ICU", "Surgery", "Laboratory"],
      specialties: ["General Medicine", "Pediatrics"],
    },
    {
      id: "6",
      name: "Apollo Hospitals Vellore",
      distance: 3.5,
      address: "Vellore, Tamil Nadu 632004",
      phone: "0416 246 1111",
      rating: 4.6,
      reviewCount: 3500,
      hours: "8:00 AM - 8:00 PM",
      emergency: false,
      services: ["Outpatient Care", "Laboratory", "Pharmacy", "Telemedicine"],
      specialties: ["General Medicine", "Dermatology", "ENT", "Ophthalmology"],
    },
    {
      id: "7",
      name: "Vellore Diabetes Specialty Centre",
      distance: 2.1,
      address: "Gandhi Nagar, Vellore, Tamil Nadu 632006",
      phone: "0416 224 5555",
      rating: 4.2,
      reviewCount: 850,
      hours: "9:00 AM - 6:00 PM",
      emergency: false,
      services: ["Outpatient Care", "Laboratory", "Pharmacy", "Diabetes Education"],
      specialties: ["Endocrinology", "Diabetology", "Nutrition"],
    },
  ]

  // Service categories
  const serviceCategories: ServiceCategory[] = [
    {
      id: "cardiology",
      name: "Cardiology",
      icon: <Heart className="h-5 w-5" />,
      description: "Heart and cardiovascular system care",
    },
    {
      id: "neurology",
      name: "Neurology",
      icon: <Brain className="h-5 w-5" />,
      description: "Brain, spinal cord, and nervous system treatment",
    },
    {
      id: "orthopedics",
      name: "Orthopedics",
      icon: <Bone className="h-5 w-5" />,
      description: "Bone, joint, and muscle care",
    },
    {
      id: "pediatrics",
      name: "Pediatrics",
      icon: <Baby className="h-5 w-5" />,
      description: "Medical care for infants, children, and adolescents",
    },
    {
      id: "ophthalmology",
      name: "Ophthalmology",
      icon: <Eye className="h-5 w-5" />,
      description: "Eye care and vision health",
    },
    {
      id: "general",
      name: "General Medicine",
      icon: <Stethoscope className="h-5 w-5" />,
      description: "Primary healthcare services",
    },
  ]

  const requestLocation = async () => {
    setIsLoading(true)
    try {
      if (navigator.geolocation) {
        const permission = await navigator.permissions.query({ name: "geolocation" as PermissionName })
        setLocationPermission(permission.state as "granted" | "denied" | "prompt")

        if (permission.state === "granted") {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log("Location obtained:", position.coords.latitude, position.coords.longitude)
              // In a real app, we would use these coordinates to sort hospitals by actual distance
              setIsLoading(false)
            },
            (error) => {
              console.error("Error getting location:", error)
              setIsLoading(false)
            },
          )
        } else if (permission.state === "prompt") {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log("Location obtained:", position.coords.latitude, position.coords.longitude)
              setLocationPermission("granted")
              setIsLoading(false)
            },
            (error) => {
              console.error("Error getting location:", error)
              setLocationPermission("denied")
              setIsLoading(false)
            },
          )
        } else {
          setIsLoading(false)
        }
      } else {
        console.error("Geolocation is not supported by this browser")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error requesting location:", error)
      setIsLoading(false)
    }
  }

  const filteredHospitals = hospitals.filter((hospital) => {
    // Filter by search query
    const matchesSearch =
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.services.some((service) => service.toLowerCase().includes(searchQuery.toLowerCase())) ||
      hospital.specialties.some((specialty) => specialty.toLowerCase().includes(searchQuery.toLowerCase()))

    // Filter by specialty
    const matchesSpecialty = selectedSpecialty
      ? hospital.specialties.some((specialty) => specialty.toLowerCase() === selectedSpecialty.toLowerCase())
      : true

    // Filter by emergency services
    const matchesEmergency = showEmergencyOnly ? hospital.emergency : true

    return matchesSearch && matchesSpecialty && matchesEmergency
  })

  const callHospital = (phone: string) => {
    window.location.href = `tel:${phone.replace(/[^\d]/g, "")}`
  }

  const getDirections = (hospital: Hospital) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hospital.address)}&travelmode=driving`,
      "_blank",
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Hospital Services</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Find healthcare services in Vellore</p>
          </div>

          {locationPermission !== "granted" && (
            <Button onClick={requestLocation} disabled={isLoading} className="flex items-center gap-2">
              {isLoading ? (
                <span className="animate-pulse">Requesting...</span>
              ) : (
                <>
                  <MapPin className="h-4 w-4" />
                  Use my location
                </>
              )}
            </Button>
          )}
        </div>

        {/* Search and filters */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="Search for hospitals, services, or specialties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={showEmergencyOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowEmergencyOnly(!showEmergencyOnly)}
              className="flex items-center gap-1"
            >
              <Pill className="h-4 w-4" />
              Emergency Services
            </Button>

            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setSelectedSpecialty(null)}
              >
                <Filter className="h-4 w-4" />
                {selectedSpecialty || "All Specialties"}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Specialty categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {serviceCategories.map((category) => (
            <Card
              key={category.id}
              className={cn(
                "cursor-pointer hover:shadow-md transition-all",
                selectedSpecialty === category.name ? "ring-2 ring-teal-500" : "",
              )}
              onClick={() => setSelectedSpecialty(selectedSpecialty === category.name ? null : category.name)}
            >
              <CardContent className="p-3 flex flex-col items-center text-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center mb-2",
                    selectedSpecialty === category.name
                      ? "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
                  )}
                >
                  {category.icon}
                </div>
                <h3 className="text-sm font-medium">{category.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Hospital listings */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              {filteredHospitals.length} {filteredHospitals.length === 1 ? "Hospital" : "Hospitals"} Found
            </h3>
            {locationPermission === "granted" && (
              <div className="text-sm text-teal-600 dark:text-teal-400 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>Sorted by distance</span>
              </div>
            )}
          </div>

          {filteredHospitals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No hospitals match your search criteria</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedSpecialty(null)
                  setShowEmergencyOnly(false)
                }}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 pb-2">
              {filteredHospitals.map((hospital) => (
                <Card
                  key={hospital.id}
                  className={cn(
                    "overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer",
                    hospital.emergency ? "border-l-4 border-l-red-500" : "",
                    selectedHospital === hospital.id ? "ring-2 ring-teal-500" : "",
                  )}
                  onClick={() => setSelectedHospital(hospital.id === selectedHospital ? null : hospital.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{hospital.name}</h4>

                        <div className="flex items-center">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-3 w-3",
                                  i < Math.floor(hospital.rating)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : i < hospital.rating
                                      ? "text-yellow-400 fill-yellow-400 opacity-50"
                                      : "text-gray-300 dark:text-gray-600",
                                )}
                              />
                            ))}
                          </div>
                          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                            {hospital.rating} ({hospital.reviewCount})
                          </span>
                          {hospital.emergency && (
                            <>
                              <span className="mx-1 text-gray-300">•</span>
                              <span className="text-xs text-red-500 font-medium">Emergency Services</span>
                            </>
                          )}
                        </div>

                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          {hospital.address}
                        </div>

                        <div className="text-sm text-green-600 dark:text-green-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                          {hospital.hours}
                        </div>

                        <div className="text-sm text-gray-500 dark:text-gray-400">{hospital.phone}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-teal-600 dark:text-teal-400">
                          {hospital.distance.toFixed(1)} km
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-gray-400 mt-2 transition-transform",
                            selectedHospital === hospital.id ? "transform rotate-180" : "",
                          )}
                        />
                      </div>
                    </div>

                    {selectedHospital === hospital.id && (
                      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="mb-3">
                          <h5 className="text-sm font-medium mb-1">Specialties</h5>
                          <div className="flex flex-wrap gap-1">
                            {hospital.specialties.map((specialty, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h5 className="text-sm font-medium mb-1">Services</h5>
                          <div className="flex flex-wrap gap-1">
                            {hospital.services.map((service, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              callHospital(hospital.phone)
                            }}
                          >
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              getDirections(hospital)
                            }}
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            Directions
                          </Button>
                          <Button variant="default" size="sm" className="flex-1 text-xs">
                            Book Appointment
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
