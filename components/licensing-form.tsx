"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronDown } from "lucide-react"

export default function LicensingForm() {
  const [firstCheck, setFirstCheck] = useState(false) // Now the "I have read" checkbox
  const [secondCheck, setSecondCheck] = useState(false) // Now the "I represent and warrant" checkbox
  const [thirdCheck, setThirdCheck] = useState(false) // Now the "I filmed this video" checkbox
  const [fourthCheck, setFourthCheck] = useState(false)
  const [hasReadAgreement, setHasReadAgreement] = useState(false)
  const [showValidation, setShowValidation] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [showSignatureValidation, setShowSignatureValidation] = useState(false)
  const [agreementTimestamp, setAgreementTimestamp] = useState<string | null>(null)
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const checkboxRef = useRef<HTMLButtonElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
        // Set canvas size
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        // Set drawing styles
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.strokeStyle = "#000"
      }
    }
  }, [])

  const handleFirstCheckboxClick = () => {
    if (firstCheck) {
      // If currently checked, uncheck and reset the read state
      setFirstCheck(false)
      setHasReadAgreement(false)
      setHasScrolledToEnd(false)
      setAgreementTimestamp(null)
    } else {
      // If not checked, check if they've read the agreement
      if (!hasReadAgreement) {
        setIsModalOpen(true)
        setShowValidation(false)
      } else {
        setFirstCheck(true)
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

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const handleConfirmAccept = () => {
    setHasReadAgreement(true)
    setIsModalOpen(false)
    setFirstCheck(true)
    setAgreementTimestamp(new Date().toISOString())
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
      {/* Confirm Below Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Confirm Below: <span className="text-red-500">*</span>
        </h2>

        <div className="space-y-4">
          {/* First Checkbox */}
          <div className="flex items-start space-x-3">
            <Checkbox
              ref={checkboxRef}
              checked={firstCheck}
              onCheckedChange={handleFirstCheckboxClick}
              className="mt-0.5"
            />
            <label className="text-sm text-gray-700 leading-relaxed cursor-pointer" onClick={handleFirstCheckboxClick}>
              I have read and fully agree to the{" "}
              <span className="text-blue-600 hover:text-blue-800 underline">Exclusive License Agreement.</span>
            </label>
          </div>

          {/* Second Checkbox */}
          <div className="flex items-start space-x-3">
            <Checkbox checked={secondCheck} onCheckedChange={setSecondCheck} className="mt-0.5" />
            <label
              className="text-sm text-gray-700 leading-relaxed cursor-pointer"
              onClick={() => setSecondCheck(!secondCheck)}
            >
              I confirm this video has not been licensed, assigned, or granted to others.
            </label>
          </div>

          {/* Third Checkbox */}
          <div className="flex items-start space-x-3">
            <Checkbox checked={thirdCheck} onCheckedChange={setThirdCheck} className="mt-0.5" />
            <label
              className="text-sm text-gray-700 leading-relaxed cursor-pointer"
              onClick={() => setThirdCheck(!thirdCheck)}
            >
              I filmed this video, solely own all rights, and have authority to enter this agreement.
            </label>
          </div>

          {/* Fourth Checkbox */}
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

        {/* Legal Text */}
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-700 leading-relaxed">
            By signing below, I confirm that all information provided in this form is true and accurate. I acknowledge
            that I am granting BVIRAL the exclusive rights and license to the submitted content, as set forth in the
            Licensing Agreement I have read and agreed to. I understand that BVIRAL's content clearance team may contact
            me by text message to verify licensing information, and that standard messaging rates may apply. I agree
            that my electronic signature on this form is the legal equivalent of my handwritten signature on the
            Licensing Agreement.
          </p>
        </div>

        {/* Digital Signature Section */}
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

        {/* Submit Button */}
        <div className="pt-4">
          <Button onClick={handleSubmit} className="w-full">
            Submit Form
          </Button>
        </div>

        {/* Licensing Agreement Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>Licensing Agreement</DialogTitle>
            </DialogHeader>

            <div className="flex-1 relative overflow-hidden">
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="h-full overflow-y-auto pr-4 space-y-4 text-sm text-gray-700"
              >
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 text-center">Exclusive License Agreement</h3>

                  <p>
                    This AGREEMENT ("Agreement") by and between Licensor (You) and SocialCoaster Inc., a Delaware
                    Corporation D/B/A BVIRAL ('Licensee') is for the exclusive license of Licensor's material, as
                    further detailed in Video Submission Form ("Licensed Material") and Exhibit A. The parties agree as
                    follows:
                  </p>

                  <h4 className="font-semibold text-gray-900">
                    I. LICENSEE SHALL HAVE THE EXCLUSIVE RIGHT TO ADMINISTER LICENSED MATERIAL FOR ALL PURPOSES.
                  </h4>

                  <p>
                    Licensor grants to Licensee, and Licensee accepts, subject to the terms of this Agreement, for the
                    Licensed Material during the Term and throughout the Territory:
                  </p>

                  <p>
                    (1) an exclusive, sub-licensable, transferable, royalty-free and irrevocable license of the Licensed
                    Material;
                  </p>

                  <p>(2) the exclusive and unlimited right in perpetuity to:</p>

                  <div className="ml-4 space-y-2">
                    <p>
                      i. manage, use, refrain from using, or alter the Licensed Material by any and all methods or
                      means;
                    </p>
                    <p>
                      ii. allow others, by any and all methods or means, to exploit the Licensed Material by any and all
                      methods or means, whether now known or hereafter devised, including without limitation in Media
                      and throughout Distribution Channels, by itself, its successors or assigns, for any purpose
                      whatsoever as Licensee in its sole discretion may determine;
                    </p>
                    <p>
                      iii. re-produce, distribute, modify, edit, adapt, publish, translate, incorporate, prepare
                      derivative or collective works utilizing, display, and perform any portion of the Licensed
                      Material including, but not limited to, in connection with the training or tuning of, ingestion
                      into, analysis by, or any other manipulation of or use by, any machine-learning based assembly,
                      large-language model, or other so-called artificial intelligence application or artificial
                      intelligence engine (in each case whether or not generative, reactive, limited-memory,
                      theory-of-mind, or self-aware, and whether or not image-, video-, or audio-based (diffusion-based
                      or otherwise)), in each case for any purpose.
                    </p>
                  </div>

                  <p>(3) the exclusive right to irrevocably appoint Licensee as its attorney-in-fact to:</p>

                  <div className="ml-4 space-y-2">
                    <p>
                      i. take any such action as may from time to time be necessary to effect, transfer, or assign the
                      rights granted to Licensee herein, including without limitation copyright-related actions;
                    </p>
                    <p>
                      ii. enforce all claims and prosecute actions against any and all claims from the past, present,
                      and future use of the Licensed Material by unauthorized third parties; and
                    </p>
                    <p>
                      iii. filing applications for registration of claims to copyright in the Licensed Material with the
                      U.S. Copyright Office or any other foreign jurisdiction at such times as it deems necessary.
                    </p>
                  </div>

                  <p>
                    (4) the non-exclusive worldwide right to use and publish and to permit others to use and publish
                    Licensor's name and any other related third-party names, likeness, appearance, voice and
                    biographical material, in any manner and in any medium solely in relation to the purposes of this
                    Agreement.
                  </p>

                  <p>
                    (5) the sole right to prosecute, defend, settle and compromise all suits and actions respecting the
                    Licensed Material and to do and perform all things necessary to prevent and restrain the
                    infringement of copyright or other rights herein, and nothing herein shall obligate or authorize
                    Licensee to institute any such proceedings.
                  </p>

                  <h4 className="font-semibold text-gray-900">II. LICENSOR COMPENSATION.</h4>

                  <p>
                    (1) In consideration of the rights granted herein by Licensor, Licensor shall be entitled to the
                    following fees:
                  </p>

                  <div className="ml-4 space-y-2">
                    <p>
                      i. in the event that an unaffiliated third party specifically requests the use of the Licensed
                      Material, and Licensee, in its sole discretion, accepts such request, Licensee shall pay Licensor
                      Fifty Percent (50%) of the fee obtained by Licensee for such use ("Third Party Fee"). The Third
                      Party Fee shall be due to Licensor within thirty (30) days of receipt of the Third Party Fee by
                      Licensee. For the avoidance of doubt, a Third Party Fee shall specifically exclude any use of the
                      Licensed Materials by BVIRAL partners.
                    </p>
                    <p>
                      ii. in the event monies are actually received by Licensee from the resolution of any copyright
                      infringement claims relating to the Licensed Material, Licensee shall pay Licensor Thirty Percent
                      (30%) of the net sums actually by Licensee for such resolution ("Infringement Fee"). Such
                      Infringement Fee shall be recovered through the use of manual Copyright Infringement collection.
                      The Infringement Fee shall be due to Licensor within thirty (30) days of receipt of the
                      Infringement Fee by Licensee. For purposes of clarification, the Infringement Fee shall be subject
                      to the deduction of all out-of-pocket costs incurred by Licensee, including, but not limited to,
                      reasonable outside attorneys' fees, and all other related litigation costs.
                    </p>
                    <p>
                      iii. in the event that any portion of any Third Party Fee or Infringement Fee owed to Licensor is
                      less than ten dollars ($10.00), such payment shall not accrue and shall not be paid and/or owed by
                      Licensor. For the avoidance of doubt, only payments that are equal to or greater than ten dollars
                      ($10.00) shall be owed and paid to Licensor.
                    </p>
                  </div>

                  <p>
                    (2) Licensor acknowledges and agrees that there will be no other residuals, revenue splits or
                    payments of any kind due to Licensee in connection with this Agreement or any uses set forth herein.
                  </p>

                  <div className="ml-4">
                    <p>
                      i. For the avoidance of doubt, Licensee shall not be entitled to royalties, residuals, revenue
                      splits or payments of any kind for the Licensed Material: (1) on Licensor's channels or through
                      Licensor's use on social media platforms; (2) on Licensor's partners' channels and such partners'
                      use on social media platforms; (3) via Licensor's licensing agreements with third parties that
                      allow such third party access to Licensor's library; and (4) on third party platforms that utilize
                      automatic, and/or non-manual, rights management applications and tools.
                    </p>
                  </div>

                  <p>
                    (3) Licensor acknowledges and agrees that (i) Licensor is able to accept the fee set forth above in
                    section II(1)(i) via PayPal; (ii) Licensee will only pay such fee to Licensor via PayPal; and (iii)
                    Licensee is under no obligation to pay Licensor such fee via any other payment platform or payment
                    method (unless otherwise agreed in writing between the parties).
                  </p>

                  <h4 className="font-semibold text-gray-900">
                    III. LICENSOR IS FREE TO ENTER INTO THIS AGREEMENT FOR LICENSEE TO EXPLOIT LICENSED MATERIAL.
                  </h4>

                  <p>Licensor represents and warrants the following:</p>

                  <p>
                    (1) Licensor has the full right, power and authority to enter into, fully perform, and grant the
                    rights under Section I.
                  </p>

                  <p>
                    (2) Licensor hereby warrants and represents that Licensor is the sole and exclusive owner of the
                    entire worldwide right, title and interest (including the copyrights and all property rights) in and
                    to the Licensed Material.
                  </p>

                  <p>(3) Licensor has:</p>

                  <div className="ml-4 space-y-2">
                    <p>
                      i. obtained all consents, permissions, licenses, and clearances, including but not limited to any
                      appearance and location releases, and paid all monies necessary for Licensee to exercise its
                      exclusive rights hereunder, including but not limited to, the unlimited right for Licensee (and
                      its licensees, successors, affiliates, parents, subsidiaries, and assigns) to use any
                      individual's, entity's, or location's name, appearance, voice, likeness, biographical information
                      (as applicable) in connection with the Licensed Material, without any additional consents,
                      permissions, licenses, and clearances required to be procured by Licensee;
                    </p>
                    <p>
                      ii. provided full disclosure and delivered to Licensee any and all relevant information in
                      connection with individuals and and/or entities in which Licensee has granted any type of right
                      and/or permission to use the Licensed Material prior to the execution of this Agreement or will be
                      provided shortly thereafter; and
                    </p>
                    <p>
                      iii. verified that there will not be any other rights to be cleared or any payments required to be
                      made by Licensee as a result of any use of the Licensed Material pursuant to the rights and
                      licenses herein granted to Licensee (including without limitation, payments in connection with
                      other participations, agreements, and licensing rights).
                    </p>
                  </div>

                  <p>
                    (4) Licensor has not entered into (and will not enter into), any other agreement in connection with
                    the Licensed Material or otherwise, including but not limited to any non-exclusive or exclusive
                    third party license agreements, and has not done or permitted (and will not do or permit) anything
                    which may curtail or impair any of the rights granted to Licensee hereunder. In the event that
                    Licensor receives any licensing requests in connection with the Licensed Material from a third
                    party, Licensor shall immediately send such licensing request to Licensee at support@bviral.com.
                    Licensor shall have the sole discretion to review and/or consider any such request.
                  </p>

                  <p>
                    (5) All of the individuals and entities connected with the production of the Licensed Material, and
                    all of the individuals and entities whose names, voices, photographs, likenesses, appearance, works,
                    services and other materials appear or have been used in the Licensed Material, have authorized and
                    approved Licensor's use thereof and Licensee shall be free and clear to exploit the Licensed
                    Material.
                  </p>

                  <p>
                    (6) No part of the Licensed Material, any materials contained therein, or the exercise by Licensee
                    of the Licensed Rights violates or will violate, or infringes or will infringe, any trademark, trade
                    name, contract, agreement, copyright (whether common law or statutory), patent, literary, artistic,
                    music, dramatic, personal, private, civil, property, privacy or publicity right or "moral rights of
                    authors" or any other right of any person or entity, and shall not give rise to a claim of slander
                    or libel. There are no existing, anticipated, or threatened claims or litigation that would
                    adversely affect or impair any of the Licensed Rights.
                  </p>

                  <p>
                    (7) No part of the Licensed Material or any materials contained therein, contain, were created or
                    partially created by, or created with the assistance of, any machine-learning based assembly,
                    large-language model, or other so-called artificial intelligence application or artificial
                    intelligence engine (in each case whether or not generative, reactive, limited-memory,
                    theory-of-mind, or self-aware, and whether or not image-, video-, or audio-based (diffusion-based or
                    otherwise)).
                  </p>

                  <p>
                    (8) Upon execution of this Agreement, Licensor agrees that it shall not: (i) have the authority to
                    enforce any rights in connection with the Licensed Material, (ii) bring any claims or actions,
                    and/or (iii) threaten to bring any claims or actions, against any third party for infringement of
                    any rights in connection with the Licensed Material, including but not limited to, any copyright
                    infringement claims or DMCA takedown requests. Licensor further agrees that any such claims,
                    actions, or requests may only be brought by Licensee, in Licensee's sole discretion. Licensor agrees
                    and acknowledges that any claims, actions, or enforcement requests brought by Licensor against any
                    third party for infringement of any rights in connection with the Licensed Material are
                    unauthorized, shall be deemed a breach of this Agreement, and Licensor shall be liable for any and
                    all expenses and/or damages arising out of such unauthorized claims or actions.
                  </p>

                  <h4 className="font-semibold text-gray-900">IV. MISCELLANEOUS.</h4>

                  <p>
                    (1) RIGHT OF FIRST REFUSAL. Throughout the Term of the Agreement and for an additional three (3)
                    months following the expiration of the Term, Licensor shall not license any additional Licensor
                    material ("Additional Material") to any other third party (an "Interested Party") for exploitation
                    by any means without first offering to Licensee, by written notice, the right to negotiate and/or
                    enter into an agreement to license the Additional Materials ("Further Agreement").
                  </p>

                  <p>
                    (2) MUTUAL CONSENT REQUIRED FOR TERMINATION. This Agreement shall only be terminated upon the mutual
                    written agreement of the parties, the consent of which may be granted or denied in Licensee's sole
                    discretion. No termination shall impact any prior license of the Licensed Material by Licensee prior
                    to termination.
                  </p>

                  <p>
                    (3) LICENSEE SHALL NOT BE HELD LIABLE FOR BREACH BY LICENSOR. Licensor hereby agrees to indemnify,
                    release and hold harmless Licensee, its successors, licensees, sub distributors and assigns, and the
                    directors, officers, employees, representatives and agents of each of the foregoing, from any and
                    all claims, demands, causes of action, damages, judgments, liabilities, losses, costs, expenses, and
                    attorney's fees arising out of or resulting from any breach by Licensor of any warranty,
                    representation or any other provision of this Agreement.
                  </p>

                  <p>
                    (4) LICENSOR AGREES TO KEEP AGREEMENT CONFIDENTIAL. Licensor shall not release or cause the release
                    of any information concerning the Licensed Material, Licensee, or this Agreement without Licensee's
                    prior specific written consent and acknowledges that this Agreement is confidential in nature.
                  </p>

                  <p className="text-xs text-gray-500 mt-8 border-t pt-4">
                    This Agreement contains the entire understanding of the parties and shall not be modified or amended
                    except by a written document executed by both parties. By signing below, you acknowledge that you
                    have read, understood, and agree to be bound by all terms and conditions of this Exclusive License
                    Agreement.
                  </p>
                </div>
              </div>

              {showScrollIndicator && (
                <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
                  {/* Fade gradient only for the indicator text */}
                  <div className="h-8 bg-gradient-to-t from-white/90 to-transparent" />
                  <div
                    onClick={scrollToBottom}
                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 px-4 py-2 rounded-full shadow-sm border cursor-pointer hover:shadow-md transition-shadow pointer-events-auto w-auto max-w-sm"
                    style={{ backgroundColor: "#d8e6fd" }}
                  >
                    <ChevronDown className="w-4 h-4 text-gray-500 animate-bounce" />
                    <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
                      Scroll down to read full agreement
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-shrink-0 flex flex-col items-center space-y-3 pt-4 border-t bg-white">
              <Button
                onClick={handleConfirmAccept}
                disabled={!hasScrolledToEnd}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed w-full max-w-xs"
              >
                I Have Read & Accept the Licensing Terms
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
