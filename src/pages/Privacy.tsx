import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div className="page-container">
      <header className="flex items-center gap-3 px-4 py-3 bg-surface-card border-b border-surface-border sticky top-0 z-40">
        <Link to={-1 as never} className="text-gray-400"><ChevronLeft size={22} /></Link>
        <h1 className="text-white font-semibold">Privacy Policy & Terms</h1>
      </header>

      <div className="px-4 py-6 pb-10 space-y-6">
        {[
          {
            title: 'Terms & Conditions',
            content: `Welcome to UltraGPT! By accessing or using our platform, you agree to be bound by these terms. UltraGPT provides a decentralized computing power platform that allows users to contribute idle device resources and earn rewards.`,
          },
          {
            title: '1. Acceptance of Terms',
            content: `By creating an account or using UltraGPT services, you confirm that you are at least 18 years old and accept all terms outlined in this agreement.`,
          },
          {
            title: '2. Service Description',
            content: `UltraGPT allows users to contribute idle computing power from their devices to the network. In exchange, users receive USDT rewards based on their level, participation, and task completion.`,
          },
          {
            title: '3. User Accounts',
            content: `You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.`,
          },
          {
            title: '4. Earnings & Rewards',
            content: `Earnings are determined by your account level, task type, and network participation. UltraGPT does not guarantee specific earnings. Returns may vary based on network conditions.`,
          },
          {
            title: '5. Privacy Policy',
            content: `We collect minimal personal data necessary to provide our services. We do not sell your data to third parties. Device information is used solely for network optimization and reward calculation.`,
          },
          {
            title: '6. Prohibited Activities',
            content: `Users may not attempt to manipulate the reward system, use automated tools to simulate device activity, or engage in any fraudulent behavior. Violations may result in account suspension.`,
          },
          {
            title: '7. Limitation of Liability',
            content: `UltraGPT is not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Cryptocurrency values are volatile and past returns do not guarantee future results.`,
          },
        ].map(({ title, content }) => (
          <div key={title}>
            <h3 className="text-white font-semibold mb-2">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{content}</p>
          </div>
        ))}

        <p className="text-xs text-gray-600 text-center pt-4">
          Last updated: January 2026 · UltraGPT Corporation
        </p>
      </div>
    </div>
  )
}
