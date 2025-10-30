'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Activity, Dumbbell, Shield, Flame, Menu, X, LogOut } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.sidebar') && !e.target.closest('.menu-button')) {
        setOpen(false)
      }
    }
    
    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [open])

  const menuItems = [
    { icon: Activity, label: 'Dashboard', route: '/dashboard' },
    { icon: Shield, label: 'KickBoxing', route: '/kickboxing' },
    { icon: Dumbbell, label: 'Boxing Anglaise', route: '/boxing-anglaise' },
    { icon: Flame, label: 'Crossfit', route: '/crossfit' },
  ]

  const handleNavigation = (route) => {
    router.push(route)
    setOpen(false)
  }

  const handleLogout = () => {
    router.push('/login')
    setOpen(false)
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setOpen(!open)}
        className="menu-button fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-yellow-500 text-black shadow-lg hover:bg-yellow-600 transition-all md:hidden"
        aria-label="Toggle menu"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`sidebar fixed top-0 left-0 h-full bg-[#0B0B0B] text-white flex flex-col justify-between
          shadow-[0_0_25px_rgba(255,214,10,0.3)] border-r border-yellow-500/20 transition-all duration-300 ease-in-out z-40
          w-64 md:w-20 lg:w-64
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* === Header === */}
        <div className="pt-16 md:pt-4 p-4 flex flex-col items-center">
          <Image
            src="/GoFight.png"
            alt="GoFight Logo"
            width={70}
            height={70}
            className="mb-3 drop-shadow-[0_0_10px_rgba(255,214,10,0.4)] md:w-12 md:h-12 lg:w-[70px] lg:h-[70px]"
            priority
          />
          <h1 className="text-lg font-extrabold text-yellow-400 tracking-wide mb-6 text-center md:hidden lg:block">
            GoFight Admin
          </h1>
        </div>

        {/* === Menu === */}
        <nav className="flex-1 flex flex-col gap-2 text-base font-medium px-3 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.route
            return (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.route)}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg 
                  transition-all duration-200
                  md:justify-center lg:justify-start
                  ${isActive 
                    ? 'bg-yellow-500 text-black font-semibold shadow-lg' 
                    : 'text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-400'
                  }
                `}
                title={item.label}
              >
                <item.icon size={20} className="flex-shrink-0" />
                <span className="truncate md:hidden lg:block">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* === Footer / Logout === */}
        <div className="p-4 border-t border-yellow-500/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-yellow-400 hover:text-yellow-200 
              transition-colors duration-200 md:justify-center lg:justify-start"
            title="Déconnexion"
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className="md:hidden lg:block">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Overlay pour mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}