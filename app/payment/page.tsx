"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CreditCard, Shield, CheckCircle, Calendar, Clock } from "lucide-react"

export default function PaymentPage() {
  const router = useRouter()
  const [bookingDetails, setBookingDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })

  useEffect(() => {
    const details = localStorage.getItem("bookingDetails")
    if (!details) {
      router.push("/booking")
      return
    }
    setBookingDetails(JSON.parse(details))
  }, [router])

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Clear booking details and redirect to success
      localStorage.removeItem("bookingDetails")
      router.push("/booking-success")
    } catch (error) {
      console.error("Payment failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!bookingDetails) {
    return <div>Loading...</div>
  }

  const total = bookingDetails.price
  const tax = Math.round(total * 0.18)
  const finalTotal = total + tax

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/booking" className="inline-flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Booking
            </Link>
            <div className="flex items-center space-x-2">
              <div className="bg-green-600 rounded-full p-2">
                <span className="text-white font-bold text-sm">TB</span>
              </div>
              <span className="text-xl font-bold">TurfBook</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
          <p className="text-gray-600">Secure payment powered by industry-leading encryption</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-6">
                  {/* Payment Method Selection */}
                  <div>
                    <Label className="text-base font-semibold">Payment Method</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <Button
                        type="button"
                        variant={paymentMethod === "card" ? "default" : "outline"}
                        className="h-auto p-4 flex flex-col items-center"
                        onClick={() => setPaymentMethod("card")}
                      >
                        <CreditCard className="w-6 h-6 mb-2" />
                        <span className="text-sm">Card</span>
                      </Button>
                      <Button
                        type="button"
                        variant={paymentMethod === "upi" ? "default" : "outline"}
                        className="h-auto p-4 flex flex-col items-center"
                        onClick={() => setPaymentMethod("upi")}
                      >
                        <div className="w-6 h-6 mb-2 bg-orange-500 rounded"></div>
                        <span className="text-sm">UPI</span>
                      </Button>
                      <Button
                        type="button"
                        variant={paymentMethod === "wallet" ? "default" : "outline"}
                        className="h-auto p-4 flex flex-col items-center"
                        onClick={() => setPaymentMethod("wallet")}
                      >
                        <div className="w-6 h-6 mb-2 bg-blue-500 rounded"></div>
                        <span className="text-sm">Wallet</span>
                      </Button>
                    </div>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="card-name">Cardholder Name</Label>
                        <Input
                          id="card-name"
                          placeholder="John Doe"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <div>
                      <Label htmlFor="upi-id">UPI ID</Label>
                      <Input id="upi-id" placeholder="yourname@upi" required />
                    </div>
                  )}

                  {paymentMethod === "wallet" && (
                    <div>
                      <Label htmlFor="wallet-number">Wallet Number</Label>
                      <Input id="wallet-number" placeholder="Enter wallet number" required />
                    </div>
                  )}

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 h-12" disabled={isLoading}>
                    {isLoading ? "Processing Payment..." : `Pay ₹${finalTotal}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{bookingDetails.turfName}</h3>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(bookingDetails.date).toDateString()}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {bookingDetails.time}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Turf Booking (1 hour)</span>
                    <span>₹{bookingDetails.price}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>GST (18%)</span>
                    <span>₹{tax}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>

                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Free cancellation up to 2 hours before your booking
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
