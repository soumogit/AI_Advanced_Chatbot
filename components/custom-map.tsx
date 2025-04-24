"use client"

import type React from "react"

import { useState, useRef } from "react"
import { MapPin, Plus, Minus, Layers, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MapMarker {
  id: string
  name: string
  position: { x: number; y: number }
  type: "hospital" | "university" | "clinic"
}

interface CustomMapProps {
  markers: MapMarker[]
  center?: { x: number; y: number }
  onMarkerClick?: (id: string) => void
  selectedMarkerId?: string | null
  className?: string
}

export function CustomMap({
  markers,
  center = { x: 50, y: 50 },
  onMarkerClick,
  selectedMarkerId,
  className,
}: CustomMapProps) {
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 })
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 })
  const mapRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartDragPos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const dx = e.clientX - startDragPos.x
    const dy = e.clientY - startDragPos.y
    setMapOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
    setStartDragPos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const getMarkerColor = (type: string, isSelected: boolean) => {
    if (isSelected) return "bg-teal-500 text-white"

    switch (type) {
      case "hospital":
        return "bg-red-500 text-white"
      case "university":
        return "bg-blue-500 text-white"
      case "clinic":
        return "bg-orange-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800", className)} ref={mapRef}>
      {/* Map background with grid */}
      <div
        className="absolute inset-0 bg-blue-50 dark:bg-gray-700 cursor-grab active:cursor-grabbing"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 128, 128, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 128, 128, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          transform: `scale(${zoom}) translate(${mapOffset.x / zoom}px, ${mapOffset.y / zoom}px)`,
          transformOrigin: "center",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Map roads */}
        <div className="absolute inset-0">
          {/* Main roads */}
          <div className="absolute left-0 right-0 top-1/2 h-4 bg-yellow-400 transform -translate-y-1/2"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-4 bg-yellow-400 transform -translate-x-1/2"></div>

          {/* Secondary roads */}
          <div className="absolute left-0 right-0 top-1/4 h-2 bg-gray-300 transform -translate-y-1/2"></div>
          <div className="absolute left-0 right-0 top-3/4 h-2 bg-gray-300 transform -translate-y-1/2"></div>
          <div className="absolute top-0 bottom-0 left-1/4 w-2 bg-gray-300 transform -translate-x-1/2"></div>
          <div className="absolute top-0 bottom-0 left-3/4 w-2 bg-gray-300 transform -translate-x-1/2"></div>

          {/* Buildings */}
          <div className="absolute left-[20%] top-[30%] w-[5%] h-[8%] bg-gray-400 rounded-sm"></div>
          <div className="absolute left-[70%] top-[25%] w-[7%] h-[5%] bg-gray-400 rounded-sm"></div>
          <div className="absolute left-[40%] top-[60%] w-[6%] h-[7%] bg-gray-400 rounded-sm"></div>
          <div className="absolute left-[75%] top-[65%] w-[8%] h-[6%] bg-gray-400 rounded-sm"></div>
          <div className="absolute left-[25%] top-[75%] w-[5%] h-[5%] bg-gray-400 rounded-sm"></div>

          {/* Green areas */}
          <div className="absolute left-[10%] top-[10%] w-[15%] h-[15%] bg-green-300 rounded-full opacity-60"></div>
          <div className="absolute left-[60%] top-[40%] w-[10%] h-[10%] bg-green-300 rounded-full opacity-60"></div>
          <div className="absolute left-[30%] top-[80%] w-[12%] h-[12%] bg-green-300 rounded-full opacity-60"></div>
        </div>
      </div>

      {/* Map markers */}
      <div className="absolute inset-0 pointer-events-none">
        {markers.map((marker) => (
          <div
            key={marker.id}
            className={cn(
              "absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer transition-all duration-200",
              selectedMarkerId === marker.id ? "z-10 scale-110" : "z-0",
            )}
            style={{
              left: `${marker.position.x}%`,
              top: `${marker.position.y}%`,
              transform: `translate(-50%, -50%) scale(${zoom})`,
            }}
            onClick={() => onMarkerClick && onMarkerClick(marker.id)}
          >
            <div className="relative">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center shadow-md",
                  getMarkerColor(marker.type, selectedMarkerId === marker.id),
                )}
              >
                {marker.type === "hospital" ? (
                  <MapPin className="h-5 w-5" />
                ) : marker.type === "university" ? (
                  <div className="text-xs font-bold">VIT</div>
                ) : (
                  <MapPin className="h-5 w-5" />
                )}
              </div>
              {selectedMarkerId === marker.id && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-md text-xs font-medium whitespace-nowrap max-w-[150px] truncate z-20">
                  {marker.name}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Map controls */}
      <div className="absolute left-4 top-4 right-4 flex items-center">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Search on map"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <X className="h-4 w-4 text-gray-400 cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-16 flex flex-col gap-2">
        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white shadow-md">
          <Layers className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute right-4 bottom-4 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 rounded-full bg-white shadow-md"
          onClick={handleZoomIn}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 rounded-full bg-white shadow-md"
          onClick={handleZoomOut}
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      {/* Google Maps attribution */}
      <div className="absolute bottom-1 left-1 text-[10px] text-gray-500 bg-white/80 dark:bg-gray-800/80 px-1 rounded">
        Map data ©2023
      </div>
    </div>
  )
}
