import LicensingForm from "@/components/licensing-form"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Video Submission Form</h1>
        <LicensingForm />
      </div>
    </div>
  )
}
