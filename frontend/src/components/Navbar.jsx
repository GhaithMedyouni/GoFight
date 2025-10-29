'use client'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export function Navbar() {
  const pathname = usePathname()

  // 🎯 Déterminer le titre selon l'URL
  const getTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard'
    if (pathname === '/kickboxing') return 'KickBoxing'
    if (pathname === '/boxing-anglaise') return 'Boxing Anglaise'
    if (pathname === '/crossfit') return 'Crossfit'
    
    return 'GoFight'
  }

  return (
    <header className="h-16 bg-[#0B0B0B] text-yellow-400 shadow-[0_0_15px_rgba(255,214,10,0.3)] flex items-center justify-between px-6 border-b border-yellow-500/20">
      {/* Section gauche : titre dynamique */}
      <h2 className="text-2xl font-extrabold tracking-wide">{getTitle()}</h2>

      {/* Section droite : admin connecté */}
      <div className="flex items-center gap-4">
        <span className="font-semibold text-white">Grioui Yassine</span>
        <div className="relative w-15 h-15">
          <Image
            src="/Boyka1.png"
            alt="Admin Avatar"
            fill
            className="rounded-full border border-yellow-400 object-contain bg-black p-1"
          />
        </div>
      </div>
    </header>
  )
}
