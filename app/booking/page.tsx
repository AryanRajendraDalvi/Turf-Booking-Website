"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CalendarIcon, Clock, MapPin, Users, Star, CheckCircle, XCircle, Moon, Sun } from "lucide-react"

// Mock turf data
const turfs = [
  {
    id: 1,
    name: "Elite Sports Arena",
    location: "Bandra West, Mumbai",
    sport: "Football",
    capacity: 22,
    pricePerHour: 200,
    rating: 4.9,
    image: "/placeholder.svg?height=200&width=300",
    facilities: ["Floodlights", "Parking", "Changing Rooms"],
  },
  {
    id: 2,
    name: "Champions Cricket Ground",
    location: "Andheri East, Mumbai",
    sport: "Cricket",
    capacity: 22,
    pricePerHour: 250,
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=300",
    facilities: ["Professional Pitch", "Pavilion", "Scoreboard"],
  },
  {
    id: 3,
    name: "Pro Basketball Courts",
    location: "Powai, Mumbai",
    sport: "Basketball",
    capacity: 10,
    pricePerHour: 120,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=300",
    facilities: ["Indoor", "AC", "Sound System"],
  },
  {
    id: 4,
    name: "Tennis Excellence Center",
    location: "Juhu, Mumbai",
    sport: "Tennis",
    capacity: 4,
    pricePerHour: 150,
    rating: 4.9,
    image: "/placeholder.svg?height=200&width=300",
    facilities: ["Clay Court", "Coaching", "Equipment"],
  },
  {
    id: 5,
    name: "Mumbai Sports Complex",
    location: "Goregaon West, Mumbai",
    sport: "Football",
    capacity: 22,
    pricePerHour: 180,
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=300",
    facilities: ["Synthetic Turf", "Parking", "Cafeteria"],
  },
  {
    id: 6,
    name: "Victory Cricket Academy",
    location: "Thane, Mumbai",
    sport: "Cricket",
    capacity: 22,
    pricePerHour: 220,
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=300",
    facilities: ["Net Practice", "Coaching", "Equipment"],
  },
  {
    id: 7,
    name: "Slam Dunk Basketball Arena",
    location: "Malad West, Mumbai",
    sport: "Basketball",
    capacity: 10,
    pricePerHour: 100,
    rating: 4.4,
    image: "/placeholder.svg?height=200&width=300",
    facilities: ["Indoor", "Wooden Floor", "Scoreboard"],
  },
  {
    id: 8,
    name: "Ace Tennis Club",
    location: "Versova, Mumbai",
    sport: "Tennis",
    capacity: 4,
    pricePerHour: 180,
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=300",
    facilities: ["Hard Court", "Coaching", "Equipment Rental"],
  },
  {
    id: 9,
    name: "Striker Football Ground",
    location: "Kandivali East, Mumbai",
    sport: "Football",
    capacity: 22,
    pricePerHour: 160,
    rating: 4.3,
    image: "/placeholder.svg?height=200&width=300",
    facilities: ["Natural Grass", "Parking", "First Aid"],
  },
  {
    id: 10,
    name: "Royal Cricket Stadium",
    location: "Borivali West, Mumbai",
    sport: "Cricket",
    capacity: 22,
    pricePerHour: 300,
    rating: 4.9,
    image: "/placeholder.svg?height=200&width=300",
    facilities: ["Stadium Seating", "Professional Pitch", "Live Streaming"],
  },
]

// Mock time slots
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

// Replace the existing bookedSlots object with this function
const getBookedSlotsForTurf = (turfId: number, date: Date) => {
  const today = new Date()
  const diffDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return [] // Past dates
  if (diffDays > 10) return [] // After 10 days, all slots available

  // For the next 10 days, generate different booked slots for each turf
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

  // Use turfId and date as seed for consistent results
  const seed = turfId + date.getDate() + date.getMonth() * 31 + diffDays
  const random = () => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  const numBookedSlots = Math.floor(random() * 6) + 2 // 2-7 booked slots per day
  const shuffled = [...baseSlots].sort(() => random() - 0.5)

  return shuffled.slice(0, numBookedSlots)
}

// Update the isSlotBooked function to use the new function:
const isSlotBooked = (turfId: number, date: Date, time: string) => {
  const bookedSlots = getBookedSlotsForTurf(turfId, date)
  return bookedSlots.includes(time)
}

export default function BookingPage() {
  const router = useRouter()
  const [selectedTurf, setSelectedTurf] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [filteredTurfs, setFilteredTurfs] = useState(turfs)
  const [filters, setFilters] = useState({
    sport: "All Sports",
    location: "",
    priceRange: "All Prices",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [userType, setUserType] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Check login status and dark mode on component mount
  useEffect(() => {
    const type = localStorage.getItem("userType")
    const email = localStorage.getItem("userEmail")
    setUserType(type)
    setUserEmail(email)

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

  // Read URL parameters and set initial filters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const location = urlParams.get("location")
    const date = urlParams.get("date")
    const sport = urlParams.get("sport")

    if (location || date || sport) {
      setFilters((prev) => ({
        ...prev,
        location: location || prev.location,
        sport: sport ? sport.charAt(0).toUpperCase() + sport.slice(1) : prev.sport,
      }))

      if (date) {
        setSelectedDate(new Date(date))
      }
    }
  }, [])

  useEffect(() => {
    let filtered = turfs

    if (filters.sport !== "All Sports") {
      filtered = filtered.filter((turf) => turf.sport.toLowerCase() === filters.sport.toLowerCase())
    }

    if (filters.location) {
      filtered = filtered.filter((turf) => turf.location.toLowerCase().includes(filters.location.toLowerCase()))
    }

    if (filters.priceRange !== "All Prices") {
      const [min, max] = filters.priceRange.split("-").map(Number)
      filtered = filtered.filter((turf) => turf.pricePerHour >= min && turf.pricePerHour <= max)
    }

    setFilteredTurfs(filtered)
  }, [filters])

  const handleBooking = () => {
    setError("")
    setSuccess("")

    // Check if user is logged in before booking
    if (!userType) {
      setError("Please login to book a turf")
      router.push("/login")
      return
    }

    if (!selectedTurf || !selectedDate || !selectedTime) {
      setError("Please select a turf, date, and time slot")
      return
    }

    const dateString = selectedDate.toISOString().split("T")[0]
    // In the handleBooking function, replace the existing booking validation with:
    const bookedSlots = getBookedSlotsForTurf(selectedTurf, selectedDate)
    if (bookedSlots.includes(selectedTime)) {
      setError("This time slot is not available. Please select a different time.")
      return
    }

    // Store booking details in localStorage for payment page
    const bookingDetails = {
      turfId: selectedTurf,
      turfName: turfs.find((t) => t.id === selectedTurf)?.name,
      date: dateString,
      time: selectedTime,
      price: turfs.find((t) => t.id === selectedTurf)?.pricePerHour,
    }

    localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails))
    router.push("/payment")
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isDarkMode ? "dark" : ""}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
              <div className="flex items-center space-x-2">
                <div className="bg-green-600 rounded-full p-2">
                  <span className="text-white font-bold text-sm">TB</span>
                </div>
                <span className="text-xl font-bold dark:text-white">TurfBook</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              {userType ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {userType === "admin" ? "Admin" : "User"}: {userEmail}
                  </span>
                  {userType === "admin" && (
                    <Link href="/admin">
                      <Button
                        variant="ghost"
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      >
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button variant="outline" className="dark:border-gray-600 dark:text-gray-300 bg-transparent">
                    Login to Book
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Book Your Turf</h1>
          <p className="text-gray-600 dark:text-gray-300">Select your preferred turf, date, and time slot</p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-800 dark:text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-400">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sport-filter" className="dark:text-gray-300">
                    Sport
                  </Label>
                  <Select value={filters.sport} onValueChange={(value) => setFilters({ ...filters, sport: value })}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="All Sports" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="All Sports" className="dark:text-white dark:focus:bg-gray-700">
                        All Sports
                      </SelectItem>
                      <SelectItem value="Football" className="dark:text-white dark:focus:bg-gray-700">
                        Football
                      </SelectItem>
                      <SelectItem value="Cricket" className="dark:text-white dark:focus:bg-gray-700">
                        Cricket
                      </SelectItem>
                      <SelectItem value="Basketball" className="dark:text-white dark:focus:bg-gray-700">
                        Basketball
                      </SelectItem>
                      <SelectItem value="Tennis" className="dark:text-white dark:focus:bg-gray-700">
                        Tennis
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location-filter" className="dark:text-gray-300">
                    Location
                  </Label>
                  <Input
                    id="location-filter"
                    placeholder="Enter location"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="price-filter" className="dark:text-gray-300">
                    Price Range
                  </Label>
                  <Select
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="All Prices" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="All Prices" className="dark:text-white dark:focus:bg-gray-700">
                        All Prices
                      </SelectItem>
                      <SelectItem value="0-150" className="dark:text-white dark:focus:bg-gray-700">
                        ₹0 - ₹150
                      </SelectItem>
                      <SelectItem value="150-200" className="dark:text-white dark:focus:bg-gray-700">
                        ₹150 - ₹200
                      </SelectItem>
                      <SelectItem value="200-300" className="dark:text-white dark:focus:bg-gray-700">
                        ₹200 - ₹300
                      </SelectItem>
                      <SelectItem value="300-500" className="dark:text-white dark:focus:bg-gray-700">
                        ₹300+
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => setFilters({ sport: "All Sports", location: "", priceRange: "All Prices" })}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>

            {/* Date Selection - Fixed spacing */}
            <Card className="mt-6 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center dark:text-white text-base">
                  <CalendarIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Select Date</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border dark:border-gray-600 w-full"
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
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Turf Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {filteredTurfs.map((turf) => (
                <Card
                  key={turf.id}
                  className={`cursor-pointer transition-all hover:shadow-lg dark:bg-gray-800 dark:border-gray-700 ${
                    selectedTurf === turf.id ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20" : ""
                  }`}
                  onClick={() => setSelectedTurf(turf.id)}
                >
                  <div className="relative">
                    <img
                      src={turf.image || "/placeholder.svg"}
                      alt={turf.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-2 left-2 bg-green-600">{turf.sport}</Badge>
                    {selectedTurf === turf.id && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-6 h-6 text-green-600 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2 dark:text-white">{turf.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {turf.location}
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 font-semibold dark:text-white">{turf.rating}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Users className="w-4 h-4 mr-1" />
                        {turf.capacity} players
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {turf.facilities.map((facility, index) => (
                        <Badge key={index} variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      ₹{turf.pricePerHour}
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/hour</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Time Slot Selection */}
            {selectedTurf && selectedDate && (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center dark:text-white">
                    <Clock className="w-4 h-4 mr-2" />
                    Available Time Slots
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedDate.toDateString()} - {turfs.find((t) => t.id === selectedTurf)?.name}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                    {timeSlots.map((time) => {
                      const isBooked = isSlotBooked(selectedTurf, selectedDate, time)
                      const isSelected = selectedTime === time

                      return (
                        <Button
                          key={time}
                          variant={isSelected ? "default" : "outline"}
                          className={`p-3 h-auto flex flex-col items-center transition-all ${
                            isBooked
                              ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
                              : isSelected
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:border-gray-600 dark:text-gray-300 dark:hover:text-white"
                          }`}
                          disabled={isBooked}
                          onClick={() => setSelectedTime(time)}
                        >
                          <Clock className="w-4 h-4 mb-1" />
                          {time}
                          {isBooked && <span className="text-xs mt-1">Booked</span>}
                        </Button>
                      )
                    })}
                  </div>

                  {selectedTime && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-green-800 dark:text-green-400 mb-2">Booking Summary</h4>
                      <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                        <p>
                          <strong>Turf:</strong> {turfs.find((t) => t.id === selectedTurf)?.name}
                        </p>
                        <p>
                          <strong>Date:</strong> {selectedDate.toDateString()}
                        </p>
                        <p>
                          <strong>Time:</strong> {selectedTime}
                        </p>
                        <p>
                          <strong>Price:</strong> ₹{turfs.find((t) => t.id === selectedTurf)?.pricePerHour}/hour
                        </p>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleBooking}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={!selectedTurf || !selectedDate || !selectedTime}
                  >
                    {userType ? "Proceed to Payment" : "Login to Book"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
