"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Users, Calendar, TrendingUp, MapPin, Star, Clock, CheckCircle, Moon, Sun } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Mock data for admin dashboard
const mockStats = {
  totalBookings: 1247,
  totalUsers: 856,
  totalRevenue: 125000,
  activeTurfs: 10,
}

const mockRecentBookings = [
  {
    id: 1,
    user: "John Doe",
    turf: "Elite Sports Arena",
    date: "2024-01-20",
    time: "09:00 AM",
    amount: 236,
    status: "confirmed",
  },
  {
    id: 2,
    user: "Priya Sharma",
    turf: "Champions Cricket Ground",
    date: "2024-01-20",
    time: "02:00 PM",
    amount: 295,
    status: "confirmed",
  },
  {
    id: 3,
    user: "Rahul Kumar",
    turf: "Pro Basketball Courts",
    date: "2024-01-21",
    time: "07:00 PM",
    amount: 142,
    status: "pending",
  },
  {
    id: 4,
    user: "Sneha Patel",
    turf: "Tennis Excellence Center",
    date: "2024-01-21",
    time: "10:00 AM",
    amount: 177,
    status: "confirmed",
  },
  {
    id: 5,
    user: "Arjun Singh",
    turf: "Mumbai Sports Complex",
    date: "2024-01-22",
    time: "06:00 PM",
    amount: 212,
    status: "pending",
  },
]

const mockTurfs = [
  {
    id: 1,
    name: "Elite Sports Arena",
    location: "Bandra West",
    sport: "Football",
    bookings: 45,
    revenue: 9450,
    rating: 4.9,
  },
  {
    id: 2,
    name: "Champions Cricket Ground",
    location: "Andheri East",
    sport: "Cricket",
    bookings: 38,
    revenue: 11210,
    rating: 4.8,
  },
  {
    id: 3,
    name: "Pro Basketball Courts",
    location: "Powai",
    sport: "Basketball",
    bookings: 52,
    revenue: 6240,
    rating: 4.7,
  },
  {
    id: 4,
    name: "Tennis Excellence Center",
    location: "Juhu",
    sport: "Tennis",
    bookings: 41,
    revenue: 7257,
    rating: 4.9,
  },
  {
    id: 5,
    name: "Mumbai Sports Complex",
    location: "Goregaon West",
    sport: "Football",
    bookings: 33,
    revenue: 5940,
    rating: 4.6,
  },
]

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [bookings, setBookings] = useState(mockRecentBookings)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [isViewBookingOpen, setIsViewBookingOpen] = useState(false)
  const [selectedTurf, setSelectedTurf] = useState<any>(null)
  const [isEditTurfOpen, setIsEditTurfOpen] = useState(false)
  const [isAddTurfOpen, setIsAddTurfOpen] = useState(false)
  const [newTurf, setNewTurf] = useState({
    name: "",
    location: "",
    sport: "",
    pricePerHour: "",
    facilities: "",
  })

  useEffect(() => {
    // Check if user is admin
    const userType = localStorage.getItem("userType")
    if (userType !== "admin") {
      router.push("/login")
    }

    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setIsDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [router])

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
    router.push("/login")
  }

  // Handle approve booking
  const handleApproveBooking = (bookingId: number) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "confirmed" } : booking)),
    )
    setSuccessMessage(`Booking #${bookingId} has been approved successfully!`)
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  // Handle view booking
  const handleViewBooking = (booking: any) => {
    setSelectedBooking(booking)
    setIsViewBookingOpen(true)
  }

  // Handle edit turf
  const handleEditTurf = (turf: any) => {
    setSelectedTurf(turf)
    setIsEditTurfOpen(true)
  }

  // Handle add new turf
  const handleAddTurf = () => {
    setIsAddTurfOpen(true)
  }

  // Handle save new turf
  const handleSaveNewTurf = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate adding new turf
    setSuccessMessage("New turf has been added successfully!")
    setIsAddTurfOpen(false)
    setNewTurf({
      name: "",
      location: "",
      sport: "",
      pricePerHour: "",
      facilities: "",
    })
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  // Handle save turf changes
  const handleSaveTurfChanges = () => {
    setSuccessMessage(`${selectedTurf?.name} has been updated successfully!`)
    setIsEditTurfOpen(false)
    setSelectedTurf(null)
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isDarkMode ? "dark" : ""}`}>
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
                <div className="bg-red-600 rounded-full p-2">
                  <span className="text-white font-bold text-sm">TB</span>
                </div>
                <span className="text-xl font-bold dark:text-white">TurfBook Admin</span>
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
              <Button
                variant="outline"
                className="dark:border-gray-600 dark:text-gray-300 bg-transparent"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your turf booking platform</p>
        </div>

        {successMessage && (
          <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-400">{successMessage}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 dark:bg-gray-800">
            <TabsTrigger value="overview" className="dark:data-[state=active]:bg-gray-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="bookings" className="dark:data-[state=active]:bg-gray-700">
              Bookings
            </TabsTrigger>
            <TabsTrigger value="turfs" className="dark:data-[state=active]:bg-gray-700">
              Turfs
            </TabsTrigger>
            <TabsTrigger value="users" className="dark:data-[state=active]:bg-gray-700">
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-300">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">{mockStats.totalBookings.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-300">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">{mockStats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">+8% from last month</p>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-300">Total Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">₹{mockStats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">+15% from last month</p>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-300">Active Turfs</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">{mockStats.activeTurfs}</div>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">All operational</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="dark:border-gray-700">
                      <TableHead className="dark:text-gray-300">User</TableHead>
                      <TableHead className="dark:text-gray-300">Turf</TableHead>
                      <TableHead className="dark:text-gray-300">Date & Time</TableHead>
                      <TableHead className="dark:text-gray-300">Amount</TableHead>
                      <TableHead className="dark:text-gray-300">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.slice(0, 5).map((booking) => (
                      <TableRow key={booking.id} className="dark:border-gray-700">
                        <TableCell className="font-medium dark:text-white">{booking.user}</TableCell>
                        <TableCell className="dark:text-gray-300">{booking.turf}</TableCell>
                        <TableCell className="dark:text-gray-300">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {booking.date}
                            <Clock className="w-4 h-4 ml-4 mr-2 text-gray-400" />
                            {booking.time}
                          </div>
                        </TableCell>
                        <TableCell className="dark:text-gray-300">₹{booking.amount}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="dark:border-gray-700">
                      <TableHead className="dark:text-gray-300">ID</TableHead>
                      <TableHead className="dark:text-gray-300">User</TableHead>
                      <TableHead className="dark:text-gray-300">Turf</TableHead>
                      <TableHead className="dark:text-gray-300">Date & Time</TableHead>
                      <TableHead className="dark:text-gray-300">Amount</TableHead>
                      <TableHead className="dark:text-gray-300">Status</TableHead>
                      <TableHead className="dark:text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id} className="dark:border-gray-700">
                        <TableCell className="dark:text-gray-300">#{booking.id}</TableCell>
                        <TableCell className="font-medium dark:text-white">{booking.user}</TableCell>
                        <TableCell className="dark:text-gray-300">{booking.turf}</TableCell>
                        <TableCell className="dark:text-gray-300">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {booking.date}
                            <Clock className="w-4 h-4 ml-4 mr-2 text-gray-400" />
                            {booking.time}
                          </div>
                        </TableCell>
                        <TableCell className="dark:text-gray-300">₹{booking.amount}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="dark:border-gray-600 dark:text-gray-300 bg-transparent"
                              onClick={() => handleViewBooking(booking)}
                            >
                              View
                            </Button>
                            {booking.status === "pending" && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApproveBooking(booking.id)}
                              >
                                Approve
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="turfs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold dark:text-white">Turf Management</h2>
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleAddTurf}>
                Add New Turf
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTurfs.map((turf) => (
                <Card key={turf.id} className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg dark:text-white">{turf.name}</CardTitle>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4 mr-1" />
                      {turf.location}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
                        {turf.sport}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-semibold dark:text-white">{turf.rating}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">Bookings</div>
                        <div className="font-semibold dark:text-white">{turf.bookings}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">Revenue</div>
                        <div className="font-semibold dark:text-white">₹{turf.revenue.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent dark:border-gray-600 dark:text-gray-300"
                        onClick={() => handleEditTurf(turf)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent dark:border-gray-600 dark:text-gray-300"
                        onClick={() => handleViewBooking(turf)}
                      >
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="dark:border-gray-700">
                      <TableHead className="dark:text-gray-300">Name</TableHead>
                      <TableHead className="dark:text-gray-300">Email</TableHead>
                      <TableHead className="dark:text-gray-300">Phone</TableHead>
                      <TableHead className="dark:text-gray-300">Total Bookings</TableHead>
                      <TableHead className="dark:text-gray-300">Joined</TableHead>
                      <TableHead className="dark:text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="dark:border-gray-700">
                      <TableCell className="font-medium dark:text-white">John Doe</TableCell>
                      <TableCell className="dark:text-gray-300">john@example.com</TableCell>
                      <TableCell className="dark:text-gray-300">+91-9876543210</TableCell>
                      <TableCell className="dark:text-gray-300">12</TableCell>
                      <TableCell className="dark:text-gray-300">Jan 15, 2024</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="dark:border-gray-600 dark:text-gray-300 bg-transparent"
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="dark:border-gray-600 dark:text-gray-300 bg-transparent"
                          >
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="dark:border-gray-700">
                      <TableCell className="font-medium dark:text-white">Priya Sharma</TableCell>
                      <TableCell className="dark:text-gray-300">priya@example.com</TableCell>
                      <TableCell className="dark:text-gray-300">+91-9876543212</TableCell>
                      <TableCell className="dark:text-gray-300">8</TableCell>
                      <TableCell className="dark:text-gray-300">Jan 10, 2024</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="dark:border-gray-600 dark:text-gray-300 bg-transparent"
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="dark:border-gray-600 dark:text-gray-300 bg-transparent"
                          >
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="dark:border-gray-700">
                      <TableCell className="font-medium dark:text-white">Rahul Kumar</TableCell>
                      <TableCell className="dark:text-gray-300">rahul@example.com</TableCell>
                      <TableCell className="dark:text-gray-300">+91-9876543213</TableCell>
                      <TableCell className="dark:text-gray-300">15</TableCell>
                      <TableCell className="dark:text-gray-300">Jan 5, 2024</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="dark:border-gray-600 dark:text-gray-300 bg-transparent"
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="dark:border-gray-600 dark:text-gray-300 bg-transparent"
                          >
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* View Booking Modal */}
        <Dialog open={isViewBookingOpen} onOpenChange={setIsViewBookingOpen}>
          <DialogContent className="max-w-2xl dark:bg-gray-800 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="dark:text-white">Booking Details</DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="dark:text-gray-300">Booking ID</Label>
                    <p className="font-semibold dark:text-white">#{selectedBooking.id}</p>
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">Status</Label>
                    <Badge className={getStatusColor(selectedBooking.status)}>{selectedBooking.status}</Badge>
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">Customer Name</Label>
                    <p className="font-semibold dark:text-white">{selectedBooking.user}</p>
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">Turf</Label>
                    <p className="font-semibold dark:text-white">{selectedBooking.turf}</p>
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">Date</Label>
                    <p className="font-semibold dark:text-white">{selectedBooking.date}</p>
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">Time</Label>
                    <p className="font-semibold dark:text-white">{selectedBooking.time}</p>
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">Amount</Label>
                    <p className="font-semibold dark:text-white">₹{selectedBooking.amount}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  {selectedBooking.status === "pending" && (
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        handleApproveBooking(selectedBooking.id)
                        setIsViewBookingOpen(false)
                      }}
                    >
                      Approve Booking
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setIsViewBookingOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Turf Modal */}
        <Dialog open={isEditTurfOpen} onOpenChange={setIsEditTurfOpen}>
          <DialogContent className="max-w-2xl dark:bg-gray-800 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="dark:text-white">Edit Turf</DialogTitle>
            </DialogHeader>
            {selectedTurf && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="dark:text-gray-300">Turf Name</Label>
                    <Input
                      defaultValue={selectedTurf.name}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">Location</Label>
                    <Input
                      defaultValue={selectedTurf.location}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">Sport</Label>
                    <Input
                      defaultValue={selectedTurf.sport}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">Rating</Label>
                    <Input
                      defaultValue={selectedTurf.rating}
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="dark:text-gray-300">Facilities</Label>
                  <Textarea
                    defaultValue="Floodlights, Parking, Changing Rooms"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveTurfChanges}>
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditTurfOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add New Turf Modal */}
        <Dialog open={isAddTurfOpen} onOpenChange={setIsAddTurfOpen}>
          <DialogContent className="max-w-2xl dark:bg-gray-800 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="dark:text-white">Add New Turf</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveNewTurf} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="dark:text-gray-300">Turf Name</Label>
                  <Input
                    value={newTurf.name}
                    onChange={(e) => setNewTurf({ ...newTurf, name: e.target.value })}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="dark:text-gray-300">Location</Label>
                  <Input
                    value={newTurf.location}
                    onChange={(e) => setNewTurf({ ...newTurf, location: e.target.value })}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="dark:text-gray-300">Sport</Label>
                  <Input
                    value={newTurf.sport}
                    onChange={(e) => setNewTurf({ ...newTurf, sport: e.target.value })}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="dark:text-gray-300">Price per Hour (₹)</Label>
                  <Input
                    value={newTurf.pricePerHour}
                    onChange={(e) => setNewTurf({ ...newTurf, pricePerHour: e.target.value })}
                    type="number"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <Label className="dark:text-gray-300">Facilities (comma separated)</Label>
                <Textarea
                  value={newTurf.facilities}
                  onChange={(e) => setNewTurf({ ...newTurf, facilities: e.target.value })}
                  placeholder="e.g., Floodlights, Parking, Changing Rooms"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Add Turf
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAddTurfOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
