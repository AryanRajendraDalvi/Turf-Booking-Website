"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Calendar, Clock, MapPin, Download, Share } from "lucide-react"

export default function BookingSuccessPage() {
  useEffect(() => {
    // Confetti animation or success sound could be added here
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <CardTitle className="text-3xl text-green-800">Booking Confirmed!</CardTitle>
          <p className="text-gray-600 mt-2">Your turf has been successfully booked. Get ready for an amazing game!</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-800 mb-4">Booking Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-3 text-green-600" />
                <span className="font-medium">Elite Sports Arena</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-3 text-green-600" />
                <span>Today, January 20, 2024</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-3 text-green-600" />
                <span>09:00 AM - 10:00 AM</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Important Information</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Please arrive 15 minutes before your booking time</li>
              <li>• Bring valid ID for verification</li>
              <li>• Contact support for any changes or cancellations</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <Share className="w-4 h-4 mr-2" />
              Share Booking
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/booking" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Book Another Turf
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
