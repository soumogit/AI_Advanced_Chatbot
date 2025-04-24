"use client"

import { HospitalServiceFinder } from "./hospital-service-finder"
import { cn } from "@/lib/utils"

interface NearbyHospitalsProps {
  className?: string
}

export function NearbyHospitals({ className }: NearbyHospitalsProps) {
  return (
    <div className={cn("", className)}>
      <HospitalServiceFinder />
    </div>
  )
}
