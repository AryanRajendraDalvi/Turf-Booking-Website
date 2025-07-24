"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import {
  CalendarIcon,
  Clock,
  MapPin,
  Star,
  Users,
  Heart,
  Play,
  Search,
  Phone,
  Mail,
  ChevronRight,
  Trophy,
  Shield,
  Zap,
  Wifi,
  Car,
  Camera,
  Moon,
  Sun,
  CheckCircle,
} from "lucide-react"

// Counter animation hook
function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById(`counter-${end}`)
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [end, isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return count
}

// Mock time slots for quick booking
const timeSlots = [
  "06:00 AM",
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
]

// Quick Booking Modal Component
function QuickBookingModal({ turf, isOpen, onClose }: { turf: any; isOpen: boolean; onClose: () => void }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")

  const handleQuickBook = () => {
    if (!selectedDate || !selectedTime) return

    // Store booking details and redirect
    const bookingDetails = {
      turfId: turf.id,
      turfName: turf.name,
      date: selectedDate.toISOString().split("T")[0],
      time: selectedTime,
      price: turf.pricePerHour,
    }

    localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails))

    // Check if user is logged in
    const userType = localStorage.getItem("userType")
    if (userType) {
      window.location.href = "/payment"
    } else {
      window.location.href = "/login"
    }
  }

  if (!isOpen) return null

  // In the QuickBookingModal component, replace the bookedSlots constant with:
  const getBookedSlotsForDate = (date: Date) => {
    const today = new Date()
    const diffDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return [] // Past dates
    if (diffDays > 10) return [] // After 10 days, all slots available

    // For the next 10 days, generate different booked slots
    const baseSlots = [
      "06:00 AM",
      "07:00 AM",
      "08:00 AM",
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "01:00 PM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM",
      "05:00 PM",
      "06:00 PM",
      "07:00 PM",
      "08:00 PM",
      "09:00 PM",
      "10:00 PM",
    ]

    // Use date as seed for consistent results
    const seed = date.getDate() + date.getMonth() * 31 + diffDays
    const random = () => {
      const x = Math.sin(seed) * 10000
      return x - Math.floor(x)
    }

    const numBookedSlots = Math.floor(random() * 6) + 3 // 3-8 booked slots per day
    const shuffled = [...baseSlots].sort(() => random() - 0.5)

    return shuffled.slice(0, numBookedSlots)
  }

  const bookedSlots = selectedDate ? getBookedSlotsForDate(selectedDate) : []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Quick Book - {turf?.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Selection */}
          <div>
            <h3 className="font-semibold mb-3 dark:text-white">Select Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border dark:border-gray-600"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center dark:text-white",
                caption_label: "text-sm font-medium dark:text-white",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 dark:text-white",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] dark:text-gray-400",
                row: "flex w-full mt-2",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 dark:text-white dark:hover:bg-gray-700",
                day_selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground dark:bg-gray-700 dark:text-white",
                day_outside: "text-muted-foreground opacity-50 dark:text-gray-500",
                day_disabled: "text-muted-foreground opacity-50 dark:text-gray-500",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </div>

          {/* Time Selection */}
          <div>
            <h3 className="font-semibold mb-3 dark:text-white">Available Time Slots</h3>
            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
              {timeSlots.map((time) => {
                const isBooked = bookedSlots.includes(time)
                const isSelected = selectedTime === time

                return (
                  <Button
                    key={time}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={`${
                      isBooked
                        ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        : isSelected
                          ? "bg-green-600 hover:bg-green-700"
                          : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                    disabled={isBooked}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                    {isBooked && <span className="ml-1 text-xs">(Booked)</span>}
                  </Button>
                )
              })}
            </div>

            {selectedTime && selectedDate && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-400 mb-2">Booking Summary</h4>
                <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <p>
                    <strong>Date:</strong> {selectedDate.toDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong> {selectedTime}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{turf?.pricePerHour}/hour
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={handleQuickBook}
              className="w-full mt-4 bg-green-600 hover:bg-green-700"
              disabled={!selectedDate || !selectedTime}
            >
              Book Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Add this new component before the LiveBookingActivity component
function FullCalendarModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTurf, setSelectedTurf] = useState(1)

  // Generate different booked slots for each day
  const getBookedSlotsForDate = (date: Date) => {
    const dayIndex = Math.floor((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    const today = new Date()
    const diffDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return [] // Past dates
    if (diffDays > 10) return [] // After 10 days, all slots available

    // For the next 10 days, generate different booked slots
    const baseSlots = [
      "06:00 AM",
      "07:00 AM",
      "08:00 AM",
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "01:00 PM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM",
      "05:00 PM",
      "06:00 PM",
      "07:00 PM",
      "08:00 PM",
      "09:00 PM",
      "10:00 PM",
    ]
    const numBookedSlots = Math.floor(Math.random() * 6) + 3 // 3-8 booked slots per day

    // Use date as seed for consistent results
    const seed = date.getDate() + date.getMonth() * 31
    const shuffled = baseSlots.sort(() => seed * Math.random() - 0.5)

    return shuffled.slice(0, numBookedSlots)
  }

  const bookedSlots = selectedDate ? getBookedSlotsForDate(selectedDate) : []

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Full Calendar - Elite Sports Arena</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Selection */}
          <div>
            <h3 className="font-semibold mb-3 dark:text-white">Select Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border dark:border-gray-600"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center dark:text-white",
                caption_label: "text-sm font-medium dark:text-white",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 dark:text-white",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] dark:text-gray-400",
                row: "flex w-full mt-2",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 dark:text-white dark:hover:bg-gray-700",
                day_selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground dark:bg-gray-700 dark:text-white",
                day_outside: "text-muted-foreground opacity-50 dark:text-gray-500",
                day_disabled: "text-muted-foreground opacity-50 dark:text-gray-500",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </div>

          {/* Time Selection */}
          <div>
            <h3 className="font-semibold mb-3 dark:text-white">
              Available Time Slots - {selectedDate?.toDateString()}
            </h3>
            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
              {timeSlots.map((time) => {
                const isBooked = bookedSlots.includes(time)

                return (
                  <Button
                    key={time}
                    variant={isBooked ? "secondary" : "outline"}
                    size="sm"
                    className={`${
                      isBooked
                        ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 hover:bg-green-50 hover:border-green-300"
                    }`}
                    disabled={isBooked}
                    onClick={() => {
                      // Close modal and redirect to booking page
                      onClose()
                      window.location.href = `/booking?date=${selectedDate?.toISOString().split("T")[0]}&sport=football`
                    }}
                  >
                    {time}
                    {isBooked && <span className="ml-1 text-xs">(Booked)</span>}
                  </Button>
                )
              })}
            </div>

            {selectedDate && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {bookedSlots.length > 0
                    ? `${timeSlots.length - bookedSlots.length} slots available out of ${timeSlots.length}`
                    : `All ${timeSlots.length} slots available for booking!`}
                </p>
              </div>
            )}

            <Button
              onClick={() => {
                onClose()
                window.location.href = `/booking?date=${selectedDate?.toISOString().split("T")[0]}&sport=football`
              }}
              className="w-full mt-4 bg-green-600 hover:bg-green-700"
              disabled={!selectedDate}
            >
              Go to Booking Page
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Add this new component for live booking updates with rotating time slots
function LiveBookingActivity() {
  const [activities, setActivities] = useState([
    "• Rahul K. just booked 08:00 AM slot",
    "• Priya S. confirmed 11:00 AM booking",
    "• Team Warriors reserved 02:00 PM slot",
  ])

  const [timeSlots, setTimeSlots] = useState([
    { time: "06:00 AM", status: "booked" },
    { time: "07:00 AM", status: "available" },
    { time: "08:00 AM", status: "available" },
    { time: "09:00 AM", status: "selected" },
    { time: "10:00 AM", status: "booked" },
    { time: "11:00 AM", status: "available" },
    { time: "12:00 PM", status: "booked" },
    { time: "01:00 PM", status: "available" },
    { time: "02:00 PM", status: "available" },
    { time: "03:00 PM", status: "selected" },
    { time: "04:00 PM", status: "available" },
    { time: "05:00 PM", status: "available" },
  ])

  const mockActivities = [
    "• Arjun M. just booked 09:00 AM slot",
    "• Sneha P. confirmed 03:00 PM booking",
    "• Mumbai FC reserved 07:00 PM slot",
    "• Ravi K. just booked 06:00 AM slot",
    "• Team Strikers confirmed 04:00 PM booking",
    "• Anita D. reserved 10:00 AM slot",
    "• Cricket Club booked 01:00 PM slot",
    "• Vikram S. confirmed 05:00 PM booking",
    "• Team Phoenix reserved 08:00 PM slot",
    "• Meera J. just booked 12:00 PM slot",
  ]

  // Add this state to the LiveBookingActivity component
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // Update activities every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomActivity = mockActivities[Math.floor(Math.random() * mockActivities.length)]
      setActivities((prev) => {
        const newActivities = [randomActivity, ...prev.slice(0, 2)]
        return newActivities
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Update time slots every 20 minutes (1200000 ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSlots((prev) => {
        return prev.map((slot) => {
          const random = Math.random()
          if (random < 0.3) {
            return { ...slot, status: "booked" }
          } else if (random < 0.6) {
            return { ...slot, status: "available" }
          } else if (random < 0.8) {
            return { ...slot, status: "selected" }
          } else {
            return { ...slot, status: "progress" }
          }
        })
      })
    }, 1200000) // 20 minutes

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Time Slots */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        {timeSlots.map((slot, index) => (
          <Button
            key={index}
            variant="outline"
            className={`p-3 h-auto flex flex-col items-center border-2 transition-all ${
              slot.status === "available"
                ? "bg-green-400 border-green-500 text-black hover:bg-green-300"
                : slot.status === "booked"
                  ? "bg-gray-600 border-gray-700 text-white cursor-not-allowed"
                  : slot.status === "selected"
                    ? "bg-green-600 border-green-700 text-white"
                    : "bg-yellow-400 border-yellow-500 text-black"
            }`}
            disabled={slot.status === "booked"}
          >
            <Clock className="w-4 h-4 mb-1" />
            {slot.time}
          </Button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <Link href="/booking">
          <Button className="bg-green-600 hover:bg-green-700">Select a Time Slot</Button>
        </Link>
        <Button
          variant="outline"
          className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent"
          onClick={() => setIsCalendarOpen(true)}
        >
          View Full Calendar
        </Button>
      </div>

      {/* Live Activity */}
      <div className="bg-white rounded-lg p-6">
        <h4 className="font-bold text-lg mb-4 flex items-center text-gray-900">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          Live Booking Activity
        </h4>
        <div className="space-y-3 text-sm text-gray-600">
          {activities.map((activity, index) => (
            <div
              key={`${activity}-${index}`}
              className={`transition-all duration-500 ${index === 0 ? "text-green-600 font-medium" : ""}`}
            >
              {activity}
            </div>
          ))}
        </div>
      </div>
      <FullCalendarModal isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} />
    </>
  )
}

// Animated text component
function AnimatedText() {
  const texts = [
    "Book Premium Sports Turfs",
    "Play Anytime, Anywhere",
    "Your Game, Our Turf",
    "Premium Quality Guaranteed",
  ]
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 transition-all duration-500">
      {texts[currentIndex]}
    </h1>
  )
}

// Counter component
function Counter({ end, label, suffix = "" }: { end: number; label: string; suffix?: string }) {
  const count = useCounter(end)

  return (
    <div id={`counter-${end}`} className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-white mb-2">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-green-200 dark:text-gray-200">{label}</div>
    </div>
  )
}

export default function HomePage() {
  // Add state for search form, dark mode, and quick booking
  const [searchForm, setSearchForm] = useState({
    location: "",
    date: "",
    sport: "",
  })
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [userType, setUserType] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [selectedTurfForBooking, setSelectedTurfForBooking] = useState<any>(null)
  const [isQuickBookingOpen, setIsQuickBookingOpen] = useState(false)
  // Add these states to the main component
  const [showPhoneNumber, setShowPhoneNumber] = useState(false)
  const [showEmailAddress, setShowEmailAddress] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)

  // Mock turf data for popular section
  const popularTurfs = [
    {
      id: 1,
      name: "Elite Sports Arena",
      location: "Downtown Sports Complex",
      sport: "Football",
      capacity: 22,
      pricePerHour: 200,
      rating: 4.9,
      reviews: 234,
      image: "/placeholder.svg?height=200&width=300",
      facilities: ["Floodlights", "Parking", "Changing Rooms"],
    },
    {
      id: 2,
      name: "Champions Cricket Ground",
      location: "North Zone Sports Hub",
      sport: "Cricket",
      capacity: 22,
      pricePerHour: 250,
      rating: 4.8,
      reviews: 189,
      image: "/placeholder.svg?height=200&width=300",
      facilities: ["Professional Pitch", "Pavilion", "Scoreboard"],
    },
    {
      id: 3,
      name: "Pro Basketball Courts",
      location: "Central Sports District",
      sport: "Basketball",
      capacity: 10,
      pricePerHour: 120,
      rating: 4.7,
      reviews: 156,
      image: "/placeholder.svg?height=200&width=300",
      facilities: ["Indoor", "AC", "Sound System"],
    },
    {
      id: 4,
      name: "Tennis Excellence Center",
      location: "Premium Sports Zone",
      sport: "Tennis",
      capacity: 4,
      pricePerHour: 150,
      rating: 4.9,
      reviews: 298,
      image: "/placeholder.svg?height=200&width=300",
      facilities: ["Clay Court", "Coaching", "Equipment"],
    },
  ]

  // Check login status on component mount
  useEffect(() => {
    const type = localStorage.getItem("userType")
    const email = localStorage.getItem("userEmail")
    setUserType(type)
    setUserEmail(email)

    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setIsDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem("darkMode", newDarkMode.toString())

    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("userEmail")
    setUserType(null)
    setUserEmail(null)
  }

  // Handle turf click for quick booking
  const handleTurfClick = (turf: any) => {
    setSelectedTurfForBooking(turf)
    setIsQuickBookingOpen(true)
  }

  // Add handleSearch function
  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchForm.location) params.set("location", searchForm.location)
    if (searchForm.date) params.set("date", searchForm.date)
    if (searchForm.sport) params.set("sport", searchForm.sport)

    const queryString = params.toString()
    const url = queryString ? `/booking?${queryString}` : "/booking"
    window.location.href = url
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail) return

    // Simulate newsletter subscription
    setNewsletterSubmitted(true)
    setTimeout(() => {
      setNewsletterSubmitted(false)
      setNewsletterEmail("")
    }, 3000)
  }

  return (
    <div className={`min-h-screen bg-white ${isDarkMode ? "dark" : ""}`}>
      {/* Navigation */}
      <nav className="bg-green-900 dark:bg-gray-900 text-white px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-green-600 rounded-full p-2">
              <span className="text-white font-bold">TB</span>
            </div>
            <span className="text-xl font-bold">TurfBook</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-green-300">
              Home
            </Link>
            <Link href="#turfs" className="hover:text-green-300">
              Browse Turfs
            </Link>
            <Link href="#facilities" className="hover:text-green-300">
              Facilities
            </Link>
            <Link href="#news" className="hover:text-green-300">
              News
            </Link>
            <Link href="#contact" className="hover:text-green-300">
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-white hover:text-green-300" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {userType ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-green-200">
                  {userType === "admin" ? "Admin" : "User"}: {userEmail}
                </span>
                {userType === "admin" && (
                  <Link href="/admin">
                    <Button variant="ghost" className="text-white hover:text-green-300">
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" className="text-white hover:text-green-300" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-white hover:text-green-300">
                    Login
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="bg-green-600 hover:bg-green-700">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-800 to-green-600 dark:from-gray-800 dark:to-gray-600 min-h-screen flex items-center relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-32 h-32 bg-green-400 dark:bg-gray-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-green-300 dark:bg-gray-300 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-500 dark:bg-gray-500 rounded-full animate-ping"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <AnimatedText />

          <p className="text-xl text-green-100 dark:text-gray-100 mb-8 max-w-3xl mx-auto">
            Discover premium sports facilities, book instantly, and play with confidence. Your game, our turf, unlimited
            possibilities.
          </p>

          {/* Search Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Location"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                value={searchForm.location}
                onChange={(e) => setSearchForm({ ...searchForm, location: e.target.value })}
              />
              <Input
                type="date"
                className="bg-white/20 border-white/30 text-white"
                value={searchForm.date}
                onChange={(e) => setSearchForm({ ...searchForm, date: e.target.value })}
              />
              <Select
                value={searchForm.sport}
                onValueChange={(value) => setSearchForm({ ...searchForm, sport: value })}
              >
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="Sport Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="football">Football</SelectItem>
                  <SelectItem value="cricket">Cricket</SelectItem>
                  <SelectItem value="basketball">Basketball</SelectItem>
                  <SelectItem value="tennis">Tennis</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSearch} className="w-full bg-green-600 hover:bg-green-700">
                <Search className="w-4 h-4 mr-2" />
                Find Turfs
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/booking">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Book Now - Free Trial
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-800 bg-transparent"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Counter end={500} label="Premium Turfs" suffix="+" />
            <Counter end={50000} label="Happy Players" suffix="K+" />
            <Counter end={1000000} label="Games Played" suffix="M+" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-300 mb-2">24/7</div>
              <div className="text-green-200 dark:text-gray-200">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Turfs Section - Made Interactive */}
      <section id="turfs" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Popular Sports Turfs</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover our top-rated sports facilities loved by thousands of players. Click on any turf to book
              instantly!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularTurfs.map((turf) => (
              <Card
                key={turf.id}
                className="overflow-hidden hover:shadow-lg transition-all cursor-pointer transform hover:scale-105 dark:bg-gray-700 dark:border-gray-600"
                onClick={() => handleTurfClick(turf)}
              >
                <div className="relative">
                  <img src={turf.image || "/placeholder.svg"} alt={turf.name} className="w-full h-48 object-cover" />
                  <Badge className="absolute top-2 left-2 bg-green-600">Available Now</Badge>
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-white hover:bg-white/20">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {turf.sport}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Open 24/7
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2 dark:text-white">{turf.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {turf.location}
                  </div>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-semibold dark:text-white">{turf.rating}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">({turf.reviews})</span>
                    </div>
                    <div className="ml-auto flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Users className="w-4 h-4 mr-1" />
                      {turf.capacity} players
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {turf.facilities.map((facility, index) => (
                      <Badge key={index} variant="secondary" className="text-xs dark:bg-gray-600 dark:text-gray-200">
                        {facility}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-3">
                    ₹{turf.pricePerHour}
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/hour</span>
                  </div>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTurfClick(turf)
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Quick Book
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Booking Modal */}
      <QuickBookingModal
        turf={selectedTurfForBooking}
        isOpen={isQuickBookingOpen}
        onClose={() => {
          setIsQuickBookingOpen(false)
          setSelectedTurfForBooking(null)
        }}
      />

      {/* Animated Calendar Section */}
      <section className="py-20 bg-gray-900 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Real-Time Booking System</h2>
            <p className="text-xl text-gray-300">Watch live bookings happen in real-time</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-blue-600 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  Elite Sports Arena - Today's Availability
                </h3>
              </div>
              <p className="text-green-100 dark:text-gray-100 mb-6 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Football Ground • 22 Players • Premium Facility
              </p>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mb-6 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-400 rounded mr-2"></div>
                  <span className="text-white">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-400 rounded mr-2"></div>
                  <span className="text-white">Booking in Progress</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-600 rounded mr-2"></div>
                  <span className="text-white">Booked</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
                  <span className="text-white">Your Selection</span>
                </div>
              </div>

              <LiveBookingActivity />
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">What Our Players Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Trusted by thousands of sports enthusiasts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Arjun Sharma",
                role: "Football Captain",
                rating: 5,
                review:
                  "Amazing facilities and seamless booking process. The turf quality is top-notch and the staff is very professional.",
                image: "/placeholder.svg?height=60&width=60",
              },
              {
                name: "Priya Patel",
                role: "Cricket Enthusiast",
                rating: 5,
                review:
                  "Best cricket ground in Mumbai! The pitch conditions are perfect and the booking system is so convenient.",
                image: "/placeholder.svg?height=60&width=60",
              },
              {
                name: "Rohit Mehta",
                role: "Basketball Coach",
                rating: 5,
                review:
                  "Excellent indoor courts with great lighting and sound system. My team loves playing here every weekend.",
                image: "/placeholder.svg?height=60&width=60",
              },
            ].map((review, index) => (
              <Card key={index} className="p-6 dark:bg-gray-800">
                <div className="flex items-center mb-4">
                  <img
                    src={review.image || "/placeholder.svg"}
                    alt={review.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold dark:text-white">{review.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{review.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300">"{review.review}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Book Meeting Section */}
      <section className="py-20 bg-green-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Need Custom Solutions?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Book a meeting with our team to discuss corporate bookings, tournaments, or special events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setShowPhoneNumber(!showPhoneNumber)}
            >
              <Phone className="w-4 h-4 mr-2" />
              Schedule a Call
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="dark:border-gray-600 dark:text-gray-300 bg-transparent"
              onClick={() => setShowEmailAddress(!showEmailAddress)}
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>

          {/* Add contact information display */}
          {showPhoneNumber && (
            <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-400 font-semibold">Call us at:</p>
              <a
                href="tel:+919876543210"
                className="text-green-600 dark:text-green-300 text-lg font-bold hover:underline"
              >
                +91 98765 43210
              </a>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">Available Mon-Fri, 9 AM - 6 PM</p>
            </div>
          )}

          {showEmailAddress && (
            <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-800 dark:text-blue-400 font-semibold">Send us an email:</p>
              <a
                href="mailto:corporate@turfbook.com"
                className="text-blue-600 dark:text-blue-300 text-lg font-bold hover:underline"
              >
                corporate@turfbook.com
              </a>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">We'll respond within 24 hours</p>
            </div>
          )}
        </div>
      </section>

      {/* Trusted Companies */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Trusted by Leading Companies</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Corporate partners who choose TurfBook for their events
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {["Google", "Microsoft", "Amazon", "Flipkart", "Tata", "Reliance"].map((company, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-200 dark:bg-gray-700 h-16 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-gray-600 dark:text-gray-300">{company}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Sponsors & Supporters</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            {["Nike", "Adidas", "Puma", "Decathlon"].map((sponsor, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-200 dark:bg-gray-700 h-20 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-gray-600 dark:text-gray-300">{sponsor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section id="facilities" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">World-Class Facilities</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Everything you need for the perfect game</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Trophy, title: "Premium Turfs", desc: "Professional-grade surfaces for optimal performance" },
              { icon: Shield, title: "Safety First", desc: "CCTV monitoring and first-aid facilities" },
              { icon: Zap, title: "Floodlights", desc: "Play day or night with professional lighting" },
              { icon: Wifi, title: "Free WiFi", desc: "Stay connected while you play" },
              { icon: Car, title: "Parking", desc: "Ample parking space for all players" },
              { icon: Camera, title: "Live Streaming", desc: "Stream your games live to friends and family" },
            ].map((facility, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow dark:bg-gray-800">
                <facility.icon className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-xl font-bold mb-2 dark:text-white">{facility.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{facility.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* News Articles */}
      <section id="news" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Latest News & Updates</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Stay updated with sports news and TurfBook announcements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "New Premium Turf Opens in Bandra",
                excerpt:
                  "State-of-the-art football facility with FIFA-approved synthetic grass now available for booking.",
                date: "Jan 15, 2024",
                image: "/placeholder.svg?height=200&width=300",
              },
              {
                title: "TurfBook Partners with Local Cricket Academy",
                excerpt: "Professional coaching now available at select cricket grounds across Mumbai.",
                date: "Jan 12, 2024",
                image: "/placeholder.svg?height=200&width=300",
              },
              {
                title: "Winter Tournament Series Announced",
                excerpt: "Register your team for the biggest inter-corporate sports tournament of the year.",
                date: "Jan 10, 2024",
                image: "/placeholder.svg?height=200&width=300",
              },
            ].map((article, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow dark:bg-gray-800">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{article.date}</div>
                  <h3 className="text-xl font-bold mb-3 dark:text-white">{article.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{article.excerpt}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="dark:border-gray-600 dark:text-gray-300 bg-transparent"
                  >
                    Read More
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Everything you need to know about TurfBook</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                question: "How do I book a turf?",
                answer:
                  "Simply select your preferred location, date, and time slot. Choose your sport type and confirm your booking with payment. You'll receive instant confirmation via SMS and email.",
              },
              {
                question: "Can I cancel my booking?",
                answer:
                  "Yes, you can cancel your booking up to 2 hours before the scheduled time for a full refund. Cancellations made within 2 hours will incur a 25% cancellation fee.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit/debit cards, UPI, net banking, and digital wallets like Paytm, PhonePe, and Google Pay.",
              },
              {
                question: "Are the turfs maintained regularly?",
                answer:
                  "Yes, all our partner turfs undergo daily maintenance and weekly deep cleaning. We ensure professional-grade playing surfaces at all times.",
              },
              {
                question: "Do you provide equipment?",
                answer:
                  "Basic equipment like footballs, cricket bats, and stumps are available at most venues. Premium equipment can be rented for an additional fee.",
              },
              {
                question: "Is there parking available?",
                answer:
                  "Most of our partner venues offer free parking. Parking availability is mentioned in the turf details on the booking page.",
              },
            ].map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white dark:bg-gray-700 rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold dark:text-white">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-green-600 dark:bg-green-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Stay Updated with TurfBook</h2>
          <p className="text-xl text-green-100 mb-8">
            Get the latest updates on new turfs, special offers, and sports events delivered to your inbox.
          </p>

          {newsletterSubmitted ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
              <CheckCircle className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
              <p className="text-green-100">You've successfully subscribed to our newsletter.</p>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="flex gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                  required
                />
                <Button type="submit" className="bg-white text-green-600 hover:bg-gray-100">
                  Subscribe
                </Button>
              </div>
              <p className="text-sm text-green-100 mt-4">We respect your privacy. Unsubscribe at any time.</p>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 dark:bg-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-green-600 rounded-full p-2">
                  <span className="text-white font-bold">TB</span>
                </div>
                <span className="text-xl font-bold">TurfBook</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your premier destination for booking premium sports turfs across Mumbai.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  📘
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  🐦
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  📷
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Browse Turfs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Sports</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Football
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Cricket
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Basketball
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Tennis
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +91 98765 43210
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  info@turfbook.com
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Mumbai, Maharashtra
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-gray-800" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024 TurfBook. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919876543210?text=Hi%20TurfBook%2C%20I%20need%20help%20with%20booking"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        aria-label="Contact us on WhatsApp"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
        </svg>
      </a>
    </div>
  )
}
