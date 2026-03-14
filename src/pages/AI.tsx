import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, Send, Bot, User, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const EXAMPLE_QUESTIONS = [
  'Why can idle mobile computing power earn money?',
  'What are the future opportunities of AI for everyone?',
  'How can I maximize earnings on NeoGPT?',
  'How does the referral system work?',
]

const AI_RESPONSES: Record<string, string> = {
  default: "NeoGPT harnesses idle computing power from devices worldwide to train AI models. By participating, you contribute to the AI training ecosystem and earn USDT rewards in return. The more tasks you complete and the higher your level, the greater your earnings potential.",
  earning: "You can earn on NeoGPT by: 1) Running training tasks on your device, 2) Inviting friends to join and earning team rewards (up to 10%), 3) Upgrading your level to access higher-return task types like Picture and Video tasks.",
  referral: "Our referral system rewards you with 3 tiers of team rewards. When your A-level invites earn, B-level invites earn, and C-level invites earn, you get a percentage of their yields based on your current level (ranging from 5%-10% for A-level, 3%-8% for B-level, 1%-6% for C-level).",
  ai: "Artificial intelligence is creating massive demand for computing power. Traditional centralized data centers can't scale fast enough. NeoGPT bridges this gap by aggregating idle compute from millions of devices, enabling anyone to participate in and profit from the AI revolution.",
}

function getResponse(question: string): string {
  const q = question.toLowerCase()
  if (q.includes('earn') || q.includes('money') || q.includes('profit') || q.includes('yield')) return AI_RESPONSES.earning
  if (q.includes('refer') || q.includes('invite') || q.includes('team')) return AI_RESPONSES.referral
  if (q.includes('ai') || q.includes('artificial') || q.includes('future') || q.includes('opportunit')) return AI_RESPONSES.ai
  return AI_RESPONSES.default
}

export default function AI() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showExamples, setShowExamples] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return
    setShowExamples(false)
    const userMsg: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    await new Promise(r => setTimeout(r, 1200))

    const response = getResponse(text)
    setMessages(prev => [...prev, { role: 'assistant', content: response }])
    setLoading(false)
  }

  return (
    <div className="page-container">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 bg-surface-card border-b border-surface-border sticky top-0 z-40">
        <Link to="/home" className="text-gray-400">
          <ChevronLeft size={22} />
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">NeoGPT AI</p>
            <p className="text-xs text-green-400 mt-0.5">● Online</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Welcome */}
        {messages.length === 0 && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mx-auto mb-4">
              <Bot size={32} className="text-white" />
            </div>
            <h2 className="text-white font-bold text-xl mb-1">Welcome to NeoGPT AI</h2>
            <p className="text-gray-400 text-sm">Ask anything, get your answer</p>
          </div>
        )}

        {/* Example questions */}
        {showExamples && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 text-center mb-3">Try asking:</p>
            {EXAMPLE_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="w-full text-left px-4 py-3 rounded-xl border border-surface-border bg-surface-muted text-sm text-gray-300 hover:border-brand-500/40 hover:text-white transition-all"
              >
                "{q}"
              </button>
            ))}
          </div>
        )}

        {/* Chat messages */}
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
              msg.role === 'assistant'
                ? 'bg-gradient-to-br from-brand-500 to-brand-600'
                : 'bg-surface-muted'
            }`}>
              {msg.role === 'assistant' ? <Bot size={14} className="text-white" /> : <User size={14} className="text-gray-300" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-brand-500 text-white rounded-tr-sm'
                : 'bg-surface-card text-gray-200 rounded-tl-sm border border-surface-border'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex-shrink-0 flex items-center justify-center">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-surface-card border border-surface-border rounded-2xl rounded-tl-sm px-4 py-3">
              <Loader2 size={16} className="text-brand-400 animate-spin" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-surface-card border-t border-surface-border">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask anything..."
            className="input-field flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white disabled:opacity-40 transition-all"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
