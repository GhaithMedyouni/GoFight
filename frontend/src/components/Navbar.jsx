'use client'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export function Navbar({ collapsed }) {
  const pathname = usePathname()

  const getTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard'
    if (pathname === '/kickboxing') return 'KickBoxing'
    if (pathname === '/boxing-anglaise') return 'Boxing Anglaise'
    if (pathname === '/crossfit') return 'Crossfit'
    return 'GoFight'
  }

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-[#0B0B0B] text-yellow-400 
      shadow-[0_0_20px_rgba(255,214,10,0.4)] flex items-center justify-between 
      px-4 sm:px-6 border-b border-yellow-500/20 transition-all duration-300 z-20`}
      style={{
        left: collapsed ? '80px' : '260px', // 👈 correspond aux valeurs du layout
      }}
    >
      {/* Titre dynamique */}
      <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-wide ml-12 md:ml-0">
        {getTitle()}
      </h2>

      {/* Profil admin */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <span className="font-semibold text-white text-sm sm:text-base hidden sm:block">
          Grioui Yassine
        </span>
        <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex-shrink-0">
          <Image
            src="/Boyka1.png"
            alt="Admin Avatar"
            fill
            className="rounded-full border-2 border-yellow-400 object-cover bg-black p-[2px] shadow-[0_0_10px_rgba(255,214,10,0.5)]"
          />
        </div>
      </div>
    </header>
  )
}
