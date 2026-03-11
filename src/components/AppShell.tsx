import { type ReactNode } from 'react'

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      {/* ── Desktop background ── */}
      <div className="hidden md:block fixed inset-0 -z-10 bg-[#030806]">
        {/* Grid lines */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,210,106,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,210,106,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
        {/* Radial glow top-center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px]"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0,210,106,0.10) 0%, transparent 65%)' }}
        />
        {/* Corner glows */}
        <div className="absolute bottom-0 left-0 w-96 h-96"
          style={{ background: 'radial-gradient(ellipse at bottom-left, rgba(0,210,106,0.06) 0%, transparent 60%)' }}
        />
        <div className="absolute bottom-0 right-0 w-96 h-96"
          style={{ background: 'radial-gradient(ellipse at bottom-right, rgba(0,210,106,0.06) 0%, transparent 60%)' }}
        />

        {/* Desktop left panel */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-center pl-16 pr-8 max-w-sm xl:max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-brand">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-none stroke-white stroke-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" />
              </svg>
            </div>
            <span className="font-extrabold text-white text-2xl tracking-tight">NanoGPT</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-5">
            Earn Daily<br />
            with <span className="text-brand-400">AI Power</span>
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-10">
            Decentralized AI computing platform. Put your idle device to work and earn USDT automatically — every day.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-10">
            {[
              { v: '2.8M+',  l: 'Active Nodes'   },
              { v: '$12M+',  l: 'Paid Out'        },
              { v: '150%',   l: 'Max Return'      },
              { v: '24/7',   l: 'Auto Earning'    },
            ].map(({ v, l }) => (
              <div key={l} className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4">
                <p className="text-brand-400 font-extrabold text-xl">{v}</p>
                <p className="text-gray-500 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <p className="text-xs text-gray-600 font-semibold uppercase tracking-widest mb-3">Partners</p>
          <div className="flex gap-4 flex-wrap">
            {['NVIDIA', 'AWS', 'Google', 'Microsoft'].map(p => (
              <span key={p} className="text-xs font-extrabold text-gray-600 tracking-wider">{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Phone frame (desktop) + full-screen (mobile) ── */}
      <div className="
        w-full h-screen overflow-hidden
        md:w-[430px] md:h-[88vh] md:max-h-[900px]
        md:rounded-[44px] md:overflow-hidden
        md:fixed md:right-[8%] lg:right-[12%] xl:right-[16%] md:top-1/2 md:-translate-y-1/2
        md:shadow-[0_0_0_8px_#08100a,0_0_0_9px_rgba(0,210,106,0.15),0_40px_100px_rgba(0,0,0,0.8),0_0_80px_rgba(0,210,106,0.12)]
        md:border md:border-brand-500/20
      ">
        {children}
      </div>
    </>
  )
}
