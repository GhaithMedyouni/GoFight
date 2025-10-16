'use client'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export function Navbar() {
  const pathname = usePathname()

  // 🎯 Déterminer le titre selon l'URL
  const getTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard'
    if (pathname === '/dashboard/kickboxing') return 'KickBoxing'
    if (pathname === '/dashboard/boxing') return 'Boxing Anglaise'
    if (pathname === '/dashboard/crossfit') return 'Crossfit'
    if (pathname === '/dashboard/athletes') return 'Athlètes'
    return 'GoFight'
  }

  return (
    <header className="h-16 bg-[#0B0B0B] text-yellow-400 shadow-[0_0_15px_rgba(255,214,10,0.3)] flex items-center justify-between px-6 border-b border-yellow-500/20">
      {/* Section gauche : titre dynamique */}
      <h2 className="text-2xl font-extrabold tracking-wide">{getTitle()}</h2>

      {/* Section droite : admin connecté */}
      <div className="flex items-center gap-4">
        <span className="font-semibold text-white">Boyka</span>
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
