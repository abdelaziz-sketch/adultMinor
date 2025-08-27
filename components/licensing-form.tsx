"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type FlowType = "adult" | "minor"

export default function LicensingForm() {
  const [flowType, setFlowType] = useState<"adult" | "minor">("minor")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false)
  const [hasReadAgreement, setHasReadAgreement] = useState(false)

  // Drawing states
  const [isDrawing, setIsDrawing] = useState(false)
  const [isGuardianDrawing, setIsGuardianDrawing] = useState(false)
  const [isMinorDrawing, setIsMinorDrawing] = useState(false)

  // Common states
  const [showSignatureValidation, setShowSignatureValidation] = useState(false)
  const [agreementTimestamp, setAgreementTimestamp] = useState<string | null>(null)
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)

  // Adult flow states (existing)
  const [firstCheck, setFirstCheck] = useState(false)
  const [secondCheck, setSecondCheck] = useState(false)
  const [thirdCheck, setThirdCheck] = useState(false)
  const [fourthCheck, setFourthCheck] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [showValidation, setShowValidation] = useState(false)

  // Minor flow states
  const [minorFirstCheck, setMinorFirstCheck] = useState(false)
  const [minorSecondCheck, setMinorSecondCheck] = useState(false)
  const [minorThirdCheck, setMinorThirdCheck] = useState(false)
  const [minorLicenseCheck, setMinorLicenseCheck] = useState(false)
  const [guardianFirstCheck, setGuardianFirstCheck] = useState(false)
  const [guardianSecondCheck, setGuardianSecondCheck] = useState(false)
  const [guardianThirdCheck, setGuardianThirdCheck] = useState(false)
  const [guardianFourthCheck, setGuardianFourthCheck] = useState(false)
  const [guardianName, setGuardianName] = useState("")
  const [guardianEmail, setGuardianEmail] = useState("")
  const [hasGuardianSignature, setHasGuardianSignature] = useState(false)

  const [minorFirstName, setMinorFirstName] = useState("")
  const [minorLastName, setMinorLastName] = useState("")
  const [minorContactEmail, setMinorContactEmail] = useState("")
  const [minorPaypalEmail, setMinorPaypalEmail] = useState("")
  const [minorPhoneNumber, setMinorPhoneNumber] = useState("")
  const [hasMinorSignature, setHasMinorSignature] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const checkboxRef = useRef<HTMLButtonElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const guardianCanvasRef = useRef<HTMLCanvasElement>(null)
  const minorCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (isModalOpen && scrollRef.current) {
      const checkScrollable = () => {
        if (scrollRef.current) {
          const { scrollHeight, clientHeight } = scrollRef.current
          const isScrollable = scrollHeight > clientHeight
          console.log(
            "[v0] Modal opened - scrollHeight:",
            scrollHeight,
            "clientHeight:",
            clientHeight,
            "isScrollable:",
            isScrollable,
          )
          setShowScrollIndicator(isScrollable && !hasScrolledToEnd)
        }
      }

      // Check immediately
      checkScrollable()

      // Also check after a brief delay to ensure content is fully rendered
      const timeoutId = setTimeout(checkScrollable, 50)

      return () => clearTimeout(timeoutId)
    }
  }, [isModalOpen, hasScrolledToEnd])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.strokeStyle = "#000"
      }
    }

    const guardianCanvas = guardianCanvasRef.current
    if (guardianCanvas) {
      const ctx = guardianCanvas.getContext("2d")
      if (ctx) {
        guardianCanvas.width = guardianCanvas.offsetWidth
        guardianCanvas.height = guardianCanvas.offsetHeight
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.strokeStyle = "#000"
      }
    }

    const minorCanvas = minorCanvasRef.current
    if (minorCanvas) {
      const ctx = minorCanvas.getContext("2d")
      if (ctx) {
        minorCanvas.width = minorCanvas.offsetWidth
        minorCanvas.height = minorCanvas.offsetHeight
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.strokeStyle = "#000"
      }
    }
  }, [])

  const handleFirstCheckboxClick = () => {
    const isAdultFlow = flowType === "adult"
    const currentCheck = isAdultFlow ? firstCheck : guardianFirstCheck
    const setCurrentCheck = isAdultFlow ? setFirstCheck : setGuardianFirstCheck

    if (currentCheck) {
      setCurrentCheck(false)
      setHasReadAgreement(false)
      setHasScrolledToEnd(false)
      setAgreementTimestamp(null)
    } else {
      if (!hasReadAgreement) {
        setIsModalOpen(true)
        setShowValidation(false)
      } else {
        setCurrentCheck(true)
      }
    }
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10
      console.log("[v0] Scrolling - scrollTop:", scrollTop, "isAtBottom:", isAtBottom)
      setHasScrolledToEnd(isAtBottom)
      if (isAtBottom) {
        setShowScrollIndicator(false)
      } else {
        // Show indicator if content is scrollable and not at bottom
        const isScrollable = scrollHeight > clientHeight
        setShowScrollIndicator(isScrollable)
      }
    }
  }

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }

  const handleSubmit = () => {
    let hasErrors = false

    if (flowType === "adult") {
      if (!firstCheck) {
        setShowValidation(true)
        hasErrors = true
      }
      if (!fourthCheck) {
        alert("You must acknowledge that this video is to be managed only through BVIRAL.")
        hasErrors = true
      }
      if (!hasSignature) {
        setShowSignatureValidation(true)
        hasErrors = true
      }
    } else {
      // Minor flow validation
      if (!minorLicenseCheck) {
        alert("You must read and agree to the Exclusive License Agreement.")
        hasErrors = true
      }
      if (!minorThirdCheck) {
        alert("You must confirm you are at least 13 years old.")
        hasErrors = true
      }
      if (!guardianFirstCheck) {
        setShowValidation(true)
        hasErrors = true
      }
      if (!guardianFourthCheck) {
        alert("Guardian must acknowledge that this video is to be managed only through BVIRAL.")
        hasErrors = true
      }
      if (!guardianName.trim()) {
        alert("Guardian full name is required.")
        hasErrors = true
      }
      if (!guardianEmail.trim()) {
        alert("Guardian email is required.")
        hasErrors = true
      }
      if (!hasMinorSignature) {
        alert("Minor signature is required.")
        hasErrors = true
      }
      if (!hasGuardianSignature) {
        alert("Guardian signature is required.")
        hasErrors = true
      }
    }

    if (!hasErrors) {
      alert("Form submitted successfully!")
    }
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setHasSignature(false)
        setShowSignatureValidation(false)
      }
    }
  }

  const clearGuardianSignature = () => {
    const canvas = guardianCanvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setHasGuardianSignature(false)
      }
    }
  }

  const clearMinorSignature = () => {
    const canvas = minorCanvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setHasMinorSignature(false)
      }
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setIsDrawing(true)

    const rect = canvas.getBoundingClientRect()
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const startGuardianDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = guardianCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setIsGuardianDrawing(true)

    const rect = canvas.getBoundingClientRect()
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const startMinorDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = minorCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setIsMinorDrawing(true)

    const rect = canvas.getBoundingClientRect()
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.strokeStyle = "#000"
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)

    setHasSignature(true)
    setShowSignatureValidation(false)
  }

  const drawGuardian = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isGuardianDrawing) return

    const canvas = guardianCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.strokeStyle = "#000"
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)

    setHasGuardianSignature(true)
  }

  const drawMinor = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isMinorDrawing) return

    const canvas = minorCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.strokeStyle = "#000"
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)

    setHasMinorSignature(true)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const stopGuardianDrawing = () => {
    setIsGuardianDrawing(false)
  }

  const stopMinorDrawing = () => {
    setIsMinorDrawing(false)
  }

  const handleAccept = () => {
    setHasReadAgreement(true)
    setIsModalOpen(false)
    if (flowType === "adult") {
      setFirstCheck(true)
    } else {
      setGuardianFirstCheck(true)
    }
    setAgreementTimestamp(new Date().toISOString())
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Are You At Least 18 Years Old?<span className="text-red-500">*</span>
          </h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="ageVerification"
                value="adult"
                checked={flowType === "adult"}
                onChange={() => setFlowType("adult")}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700">Yes, I am at least 18 years old and signing for myself</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="ageVerification"
                value="minor"
                checked={flowType === "minor"}
                onChange={() => setFlowType("minor")}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700">No, I am younger than 18 years and need a guardian to cosign</span>
            </label>
          </div>
        </div>
      </div>

      {flowType === "adult" ? (
        // Adult Flow (existing form)
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Confirm Below: <span className="text-red-500">*</span>
          </h2>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                ref={checkboxRef}
                checked={firstCheck}
                onCheckedChange={() => {
                  setIsModalOpen(true)
                  setShowValidation(false)
                }}
                className="mt-0.5"
              />
              <label
                className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                onClick={() => {
                  setIsModalOpen(true)
                  setShowValidation(false)
                }}
              >
                I have read and fully agree to the{" "}
                <a
                  href="https://sda-assets.s3.us-east-1.amazonaws.com/Minor+BVIRAL_Exclusive+Agreement+1.27.25.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Exclusive License Agreement.
                </a>
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox checked={secondCheck} onCheckedChange={setSecondCheck} className="mt-0.5" />
              <label
                className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                onClick={() => setSecondCheck(!secondCheck)}
              >
                I confirm this video has not been licensed, assigned, or granted to others.
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox checked={thirdCheck} onCheckedChange={setThirdCheck} className="mt-0.5" />
              <label
                className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                onClick={() => setThirdCheck(!thirdCheck)}
              >
                I filmed this video, solely own all rights, and have authority to enter this agreement.
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox checked={fourthCheck} onCheckedChange={setFourthCheck} className="mt-0.5" />
              <label
                className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                onClick={() => setFourthCheck(!fourthCheck)}
              >
                I agree BVIRAL will manage this video on my behalf, and I will not submit, share, license, or assert
                rights to it anywhere else without BVIRAL's prior approval.
              </label>
            </div>

            {showValidation && <p className="text-red-500 text-sm mt-2 ml-8">You need to read the full agreement.</p>}
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700 leading-relaxed">
              By signing below, I confirm that all information provided in this form is true and accurate. I acknowledge
              that I am granting BVIRAL the exclusive rights and license to the submitted content, as set forth in the
              Licensing Agreement I have read and agreed to. I understand that BVIRAL's content clearance team may
              contact me by text message to verify licensing information, and that standard messaging rates may apply. I
              agree that my electronic signature on this form is the legal equivalent of my handwritten signature on the
              Licensing Agreement.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              My Digital Signature: <span className="text-red-500">*</span>
            </h2>

            <div className="border-2 border-gray-300 rounded-md bg-white relative">
              {hasSignature && (
                <button
                  onClick={clearSignature}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors z-10"
                  title="Clear signature"
                >
                  ×
                </button>
              )}
              <canvas
                ref={canvasRef}
                className="w-full h-48 cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={(e) => {
                  e.preventDefault()
                  startDrawing(e)
                }}
                onTouchMove={(e) => {
                  e.preventDefault()
                  draw(e)
                }}
                onTouchEnd={(e) => {
                  e.preventDefault()
                  stopDrawing()
                }}
              />
              {!hasSignature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-gray-400 text-lg">Draw your signature here</p>
                </div>
              )}
            </div>

            {showSignatureValidation && (
              <div className="flex justify-center mt-2">
                <p className="text-red-500 text-sm">Please provide your signature</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Minor Confirmation Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Minor Confirmation: <span className="text-red-500">*</span>
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={minorLicenseCheck}
                  onCheckedChange={(checked) => {
                    setIsModalOpen(true)
                  }}
                  className="mt-0.5"
                />
                <label className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                  I have read and fully agree to the{" "}
                  <a
                    href="https://sda-assets.s3.us-east-1.amazonaws.com/Minor+BVIRAL_Exclusive+Agreement+1.27.25.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Exclusive License Agreement
                  </a>
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox checked={minorFirstCheck} onCheckedChange={setMinorFirstCheck} className="mt-0.5" />
                <label
                  className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                  onClick={() => setMinorFirstCheck(!minorFirstCheck)}
                >
                  I confirm this video has not been licensed, assigned, or granted to others.
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox checked={minorSecondCheck} onCheckedChange={setMinorSecondCheck} className="mt-0.5" />
                <label
                  className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                  onClick={() => setMinorSecondCheck(!minorSecondCheck)}
                >
                  I filmed this video, solely own all rights, and have authority to enter this agreement.
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox checked={minorThirdCheck} onCheckedChange={setMinorThirdCheck} className="mt-0.5" />
                <label
                  className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                  onClick={() => setMinorThirdCheck(!minorThirdCheck)}
                >
                  I am at least 13 years old.
                </label>
              </div>

              <p className="text-sm text-gray-600 mt-2">(All checkboxes must be selected.)</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minorFirstName">
                  My First Name: <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="minorFirstName"
                  value={minorFirstName}
                  onChange={(e) => setMinorFirstName(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  For this video to be published we need your full legal first name.
                </p>
              </div>
              <div>
                <Label htmlFor="minorLastName">
                  My Last Name: <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="minorLastName"
                  value={minorLastName}
                  onChange={(e) => setMinorLastName(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  For this video to be published we need your full legal last name.
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="minorContactEmail">
                My Contact Email: <span className="text-red-500">*</span>
              </Label>
              <Input
                id="minorContactEmail"
                type="email"
                value={minorContactEmail}
                onChange={(e) => setMinorContactEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="minorPaypalEmail">My Paypal Email:</Label>
              <Input
                id="minorPaypalEmail"
                type="email"
                value={minorPaypalEmail}
                onChange={(e) => setMinorPaypalEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="minorPhoneNumber">
                My Phone Number: <span className="text-red-500">*</span>
              </Label>
              <Input
                id="minorPhoneNumber"
                type="tel"
                value={minorPhoneNumber}
                onChange={(e) => setMinorPhoneNumber(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-600 mt-1">
                I agree to receive important text notifications from BVIRAL at the number listed above regarding my
                video license, including content clearance, payout notifications, and related matters. Standard message
                rates apply. Reply STOP to opt out.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 leading-relaxed">
              By signing, I agree that any and all information I submitted through this form is accurate, and I
              understand that I am transferring the exclusive rights and the exclusive license to the submitted content.
              I understand that BVIRAL's content clearance team may send a text to verify licensing information, and
              that standard messaging rates may apply. I have reviewed and agree to the Licensing Agreement.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Digital Signature: <span className="text-red-500">*</span>
            </h2>

            <div className="border-2 border-gray-300 rounded-md bg-white relative">
              {hasMinorSignature && (
                <button
                  onClick={clearMinorSignature}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors z-10"
                  title="Clear signature"
                >
                  ×
                </button>
              )}
              <canvas
                ref={minorCanvasRef}
                className="w-full h-48 cursor-crosshair"
                onMouseDown={startMinorDrawing}
                onMouseMove={drawMinor}
                onMouseUp={stopMinorDrawing}
                onMouseLeave={stopMinorDrawing}
                onTouchStart={(e) => {
                  e.preventDefault()
                  startMinorDrawing(e)
                }}
                onTouchMove={(e) => {
                  e.preventDefault()
                  drawMinor(e)
                }}
                onTouchEnd={(e) => {
                  e.preventDefault()
                  stopMinorDrawing()
                }}
              />
              {!hasMinorSignature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-gray-400 text-lg">Draw your signature here</p>
                </div>
              )}
            </div>
          </div>

          {/* Guardian Confirmation Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Guardian Confirmation: <span className="text-red-500">*</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="guardianFullName">
                  Guardian's Full Name: <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="guardianFullName"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="guardianEmail">
                  Guardian's Email: <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="guardianEmail"
                  type="email"
                  value={guardianEmail}
                  onChange={(e) => setGuardianEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="space-y-4 mb-4">
              <div className="flex items-start space-x-3">
                <Checkbox checked={guardianFirstCheck} onCheckedChange={handleFirstCheckboxClick} className="mt-0.5" />
                <label
                  className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                  onClick={() => {
                    setIsModalOpen(true)
                    setShowValidation(false)
                  }}
                >
                  I have read and fully agree to the{" "}
                  <a
                    href="https://sda-assets.s3.us-east-1.amazonaws.com/Minor+BVIRAL_Exclusive+Agreement+1.27.25.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Exclusive License Agreement
                  </a>{" "}
                  on behalf of the minor child.
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox checked={guardianSecondCheck} onCheckedChange={setGuardianSecondCheck} className="mt-0.5" />
                <label
                  className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                  onClick={() => setGuardianSecondCheck(!guardianSecondCheck)}
                >
                  I confirm this video has not been licensed, assigned, or granted to others.
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox checked={guardianThirdCheck} onCheckedChange={setGuardianThirdCheck} className="mt-0.5" />
                <label
                  className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                  onClick={() => setGuardianThirdCheck(!guardianThirdCheck)}
                >
                  I confirm the minor child filmed this video, solely owns all rights, and that I have full legal
                  authority to enter this agreement on the minor's behalf.
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox checked={guardianFourthCheck} onCheckedChange={setGuardianFourthCheck} className="mt-0.5" />
                <label
                  className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                  onClick={() => setGuardianFourthCheck(!guardianFourthCheck)}
                >
                  I agree BVIRAL will manage this video on behalf of the minor, and that neither I nor the minor will
                  submit, share, license, or assert rights to it anywhere else without BVIRAL's prior approval.
                </label>
              </div>
            </div>

            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                By signing, I represent and warrant that I am either a parent or legal guardian of the minor child, and
                that I have complete authority to grant this Agreement on the minor child's behalf. I hereby agree that
                I and the said minor will be bound by all the provisions contained herein.
              </p>
            </div>

            {showValidation && (
              <p className="text-red-500 text-sm mt-2 ml-8">Guardian needs to read the full agreement.</p>
            )}
          </div>

          {/* Guardian Digital Signature */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Guardian's Digital Signature: <span className="text-red-500">*</span>
            </h2>

            <div className="border-2 border-gray-300 rounded-md bg-white relative">
              {hasGuardianSignature && (
                <button
                  onClick={clearGuardianSignature}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors z-10"
                  title="Clear signature"
                >
                  ×
                </button>
              )}
              <canvas
                ref={guardianCanvasRef}
                className="w-full h-48 cursor-crosshair"
                onMouseDown={startGuardianDrawing}
                onMouseMove={drawGuardian}
                onMouseUp={stopGuardianDrawing}
                onMouseLeave={stopGuardianDrawing}
                onTouchStart={(e) => {
                  e.preventDefault()
                  startGuardianDrawing(e)
                }}
                onTouchMove={(e) => {
                  e.preventDefault()
                  drawGuardian(e)
                }}
                onTouchEnd={(e) => {
                  e.preventDefault()
                  stopGuardianDrawing()
                }}
              />
              {!hasGuardianSignature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-gray-400 text-lg">Draw guardian's signature here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal for Agreement */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 gap-0">
          <DialogHeader className="flex-shrink-0 px-6 py-4 border-b">
            <DialogTitle className="text-lg font-medium text-center">Licensing Agreement</DialogTitle>
          </DialogHeader>

          <div className="flex-1 relative overflow-hidden">
            <div ref={scrollRef} onScroll={handleScroll} className="h-full overflow-y-auto px-6 py-4">
              <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                <h3 className="font-bold text-base text-center">Exclusive License Agreement</h3>

                {flowType === "adult" ? (
                  <div className="space-y-4">
                    <p>
                      This AGREEMENT ("Agreement") by and between Licensor (You) and SocialCoaster Inc., a Delaware
                      Corporation D/B/A BVIRAL ('Licensee') is for the exclusive license of Licensor's material, as
                      further detailed in Video Submission Form ("Licensed Material") and Exhibit A. The parties agree
                      as follows:
                    </p>

                    <h4 className="font-bold">
                      I. LICENSEE SHALL HAVE THE EXCLUSIVE RIGHT TO ADMINISTER LICENSED MATERIAL FOR ALL PURPOSES.
                    </h4>
                    <p>
                      Licensor grants to Licensee, and Licensee accepts, subject to the terms of this Agreement, for the
                      Licensed Material during the Term and throughout the Territory:
                    </p>
                    <p>
                      (1) an exclusive, sub-licensable, transferable, royalty-free and irrevocable license of the
                      Licensed Material;
                    </p>
                    <p>(2) the exclusive and unlimited right in perpetuity to:</p>
                    <p className="ml-4">
                      i. manage, use, refrain from using, or alter the Licensed Material by any and all methods or
                      means;
                    </p>
                    <p className="ml-4">
                      ii. allow others, by any and all methods or means, to exploit the Licensed Material by any and all
                      methods or means, whether now known or hereafter devised, including without limitation in Media
                      and throughout Distribution Channels, by itself, its successors or assigns, for any purpose
                      whatsoever as Licensee in its sole discretion may determine;
                    </p>
                    <p className="ml-4">
                      iii. re-produce, distribute, modify, edit, adapt, publish, translate, incorporate, prepare
                      derivative or collective works utilizing, display, and perform any portion of the Licensed
                      Material including, but not limited to, in connection with the training or tuning of, ingestion
                      into, analysis by, or any other manipulation of or use by, any machine-learning based assembly,
                      large-language model, or other so-called artificial intelligence application or artificial
                      intelligence engine (in each case whether or not generative, reactive, limited-memory,
                      theory-of-mind, or self-aware, and whether or not image-, video-, or audio-based (diffusion-based
                      or otherwise)), in each case for any purpose.
                    </p>
                    <p>(3) the exclusive right to irrevocably appoint Licensee as its attorney-in-fact to:</p>
                    <p className="ml-4">
                      i. take any such action as may from time to time be necessary to effect, transfer, or assign the
                      rights granted to Licensee herein, including without limitation copyright-related actions;
                    </p>
                    <p className="ml-4">
                      ii. enforce all claims and prosecute actions against any and all claims from the past, present,
                      and future use of the Licensed Material by unauthorized third parties; and
                    </p>
                    <p className="ml-4">
                      iii. filing applications for registration of claims to copyright in the Licensed Material with the
                      U.S. Copyright Office or any other foreign jurisdiction at such times as it deems necessary.
                    </p>
                    <p>
                      (4) the non-exclusive worldwide right to use and publish and to permit others to use and publish
                      Licensor's name and any other related third-party names, likeness, appearance, voice and
                      biographical material, in any manner and in any medium solely in relation to the purposes of this
                      Agreement.
                    </p>
                    <p>
                      (5) the sole right to prosecute, defend, settle and compromise all suits and actions respecting
                      the Licensed Material and to do and perform all things necessary to prevent and restrain the
                      infringement of copyright or other rights herein, and nothing herein shall obligate or authorize
                      Licensee to institute any such proceedings.
                    </p>

                    <h4 className="font-bold">II. LICENSOR COMPENSATION.</h4>
                    <p>
                      (1) In consideration of the rights granted herein by Licensor, Licensor shall be entitled to the
                      following fees:
                    </p>
                    <p className="ml-4">
                      i. in the event that an unaffiliated third party specifically requests the use of the Licensed
                      Material, and Licensee, in its sole discretion, accepts such request, Licensee shall pay Licensor
                      Fifty Percent (50%) of the fee obtained by Licensee for such use ("Third Party Fee"). The fee
                      shall be paid to Licensor within thirty (30) days of Licensee's receipt of such fee.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p>
                      This AGREEMENT ("Agreement") by and between Licensor (Minor) and SocialCoaster Inc., a Delaware
                      Corporation D/B/A BVIRAL ('Licensee') is for the exclusive license of Licensor's material, as
                      further detailed in Video Submission Form ("Licensed Material") and Exhibit A. The parties agree
                      as follows:
                    </p>

                    <h4 className="font-bold">
                      I. LICENSEE SHALL HAVE THE EXCLUSIVE RIGHT TO ADMINISTER LICENSED MATERIAL FOR ALL PURPOSES.
                    </h4>
                    <p>
                      Licensor grants to Licensee, and Licensee accepts, subject to the terms of this Agreement, for the
                      Licensed Material during the Term and throughout the Territory:
                    </p>
                    <p>
                      (1) an exclusive, sub-licensable, transferable, royalty-free and irrevocable license of the
                      Licensed Material;
                    </p>
                    <p>(2) the exclusive and unlimited right in perpetuity to:</p>
                    <p className="ml-4">
                      i. manage, use, refrain from using, or alter the Licensed Material by any and all methods or
                      means;
                    </p>
                    <p className="ml-4">
                      ii. allow others, by any and all methods or means, to exploit the Licensed Material by any and all
                      methods or means, whether now known or hereafter devised, including without limitation in Media
                      and throughout Distribution Channels, by itself, its successors or assigns, for any purpose
                      whatsoever as Licensee in its sole discretion may determine;
                    </p>
                    <p className="ml-4">
                      iii. re-produce, distribute, modify, edit, adapt, publish, translate, incorporate, prepare
                      derivative or collective works utilizing, display, and perform any portion of the Licensed
                      Material including, but not limited to, in connection with the training or tuning of, ingestion
                      into, analysis by, or any other manipulation of or use by, any machine-learning based assembly,
                      large-language model, or other so-called artificial intelligence application or artificial
                      intelligence engine (in each case whether or not generative, reactive, limited-memory,
                      theory-of-mind, or self-aware, and whether or not image-, video-, or audio-based (diffusion-based
                      or otherwise)), in each case for any purpose.
                    </p>
                    <p>(3) the exclusive right to irrevocably appoint Licensee as its attorney-in-fact to:</p>
                    <p className="ml-4">
                      i. take any such action as may from time to time be necessary to effect, transfer, or assign the
                      rights granted to Licensee herein, including without limitation copyright-related actions;
                    </p>
                    <p className="ml-4">
                      ii. enforce all claims and prosecute actions against any and all claims from the past, present,
                      and future use of the Licensed Material by unauthorized third parties; and
                    </p>
                    <p className="ml-4">
                      iii. filing applications for registration of claims to copyright in the Licensed Material with the
                      U.S. Copyright Office or any other foreign jurisdiction at such times as it deems necessary.
                    </p>
                    <p>
                      (4) the non-exclusive worldwide right to use and publish and to permit others to use and publish
                      Licensor's name and any other related third-party names, likeness, appearance, voice and
                      biographical material, in any manner and in any medium solely in relation to the purposes of this
                      Agreement.
                    </p>
                    <p>
                      (5) the sole right to prosecute, defend, settle and compromise all suits and actions respecting
                      the Licensed Material and to do and perform all things necessary to prevent and restrain the
                      infringement of copyright or other rights herein, and nothing herein shall obligate or authorize
                      Licensee to institute any such proceedings.
                    </p>

                    <h4 className="font-bold">II. LICENSOR COMPENSATION.</h4>
                    <p>
                      (1) In consideration of the rights granted herein by Licensor, Licensor shall be entitled to the
                      following fees:
                    </p>
                    <p className="ml-4">
                      i. in the event that an unaffiliated third party specifically requests the use of the Licensed
                      Material, and Licensee, in its sole discretion, accepts such request, Licensee shall pay Licensor
                      Fifty Percent (50%) of the fee obtained by Licensee for such use ("Third Party Fee"). The fee
                      shall be paid to Licensor within thirty (30) days of Licensee's receipt of such fee.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {showScrollIndicator && (
              <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
                <div className="h-8 bg-gradient-to-t from-white/90 to-transparent"></div>
                <div className="flex justify-center pb-4">
                  <button
                    className="bg-[#d8e6fd] hover:bg-[#c5d9fc] px-4 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2 text-sm text-gray-700 pointer-events-auto transition-colors"
                    onClick={scrollToBottom}
                  >
                    <span>▼</span>
                    <span>Scroll down to read full agreement</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 flex flex-col items-center space-y-3 pt-4 pb-6 border-t bg-white">
            <Button
              onClick={handleAccept}
              disabled={!hasScrolledToEnd}
              className={`w-full max-w-xs ${
                hasScrolledToEnd
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              I Have Read & Accept the Licensing Terms
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button onClick={handleSubmit} className="bg-black hover:bg-gray-800 text-white w-full mt-6">
        Submit Video
      </Button>
    </div>
  )
}
