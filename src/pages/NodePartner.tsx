import { ChevronLeft, Globe2, Star, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NodePartner() {
  return (
    <div className="page-container">
      <header className="flex items-center gap-3 px-4 py-3 bg-surface-card border-b border-surface-border sticky top-0 z-40">
        <Link to="/home" className="text-gray-400"><ChevronLeft size={22} /></Link>
        <h1 className="text-white font-semibold">Node Partner</h1>
      </header>

      <div className="px-4 py-6 space-y-6 pb-10">
        {/* Hero */}
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4">
            <Globe2 size={36} className="text-white" />
          </div>
          <h2 className="text-white font-bold text-xl mb-2">Global Computing Power Building</h2>
          <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
            Join the world's largest decentralized compute infrastructure and advance the global AI training ecosystem
          </p>
        </div>

        {/* Apply button */}
        <button className="btn-primary">Apply Now</button>

        {/* Vision */}
        <div className="card">
          <p className="section-title">Vision & Mission</p>
          <p className="text-gray-300 text-sm leading-relaxed">
            The AI age is reshaping our view of software and services. Compute resources and data training are emerging as core enablers of the AI sector. NanoGPT empowers people to engage with AI at scale and earn ongoing financial rewards from their participation.
          </p>
        </div>

        {/* Rights */}
        <div className="card">
          <p className="section-title">Partner Benefits</p>
          <div className="space-y-3">
            {[
              'Rewards tied to completed accelerator tasks',
              'On-the-ground assistance for compute communities',
              'Birthday bonuses and welfare support',
              'Resources to strengthen team culture',
            ].map((benefit) => (
              <div key={benefit} className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="card">
          <p className="section-title">We Hope You Are</p>
          <div className="space-y-3">
            {[
              'Aligned with NanoGPT\'s platform vision and values',
              'Able to navigate platform operations and business models',
              'Informed about AI fundamentals and industry opportunities',
              'Diligent, trustworthy and dedicated',
              'Capable of planning and executing growth strategies',
              'Ready to meet NanoGPT node partner goals',
            ].map((req) => (
              <div key={req} className="flex items-start gap-2">
                <Star size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm">{req}</p>
              </div>
            ))}
          </div>
        </div>

        <button className="btn-primary">Apply Now</button>
      </div>
    </div>
  )
}
