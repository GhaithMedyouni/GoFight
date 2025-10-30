'use client'
import { useEffect } from 'react'
import Image from 'next/image'
import { Activity, Dumbbell, Shield, Flame, Menu, X, LogOut } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

export function Sidebar({ collapsed, setCollapsed, isMobile, onMobileClose }) {
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { icon: Activity, label: 'Dashboard', route: '/dashboard' },
    { icon: Shield, label: 'KickBoxing', route: '/kickboxing' },
    { icon: Dumbbell, label: 'Boxing Anglaise', route: '/boxing-anglaise' },
    { icon: Flame, label: 'Crossfit', route: '/crossfit' },
  ]

  const handleNavigation = (route) => {
    router.push(route)
    if (isMobile && onMobileClose) onMobileClose()
  }

  const handleLogout = () => {
    router.push('/login')
    if (isMobile && onMobileClose) onMobileClose()
  }

  // Disable scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = collapsed ? 'auto' : 'hidden'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isMobile, collapsed])

  return (
    <>
      {/* === Overlay for mobile === */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onMobileClose}
        />
      )}

      {/* === Sidebar === */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-[#0B0B0B] text-white 
          flex flex-col justify-between 
          shadow-[0_0_25px_rgba(255,214,10,0.3)]
          border-r border-yellow-500/20 
          transition-all duration-300 ease-in-out z-50
          ${isMobile
            ? collapsed
              ? '-translate-x-full w-64'
              : 'translate-x-0 w-64'
            : collapsed
              ? 'w-20'
              : 'w-64'
          }
        `}
      >
        {/* === Header === */}
        <div className="p-4 flex flex-col items-center">
          {/* Collapse / Close button */}
          <button
            onClick={() => {
              if (isMobile && onMobileClose) {
                onMobileClose()
              } else {
                setCollapsed(!collapsed)
              }
            }}
            className="self-end text-yellow-400 hover:text-yellow-300 mb-4 transition"
            title={isMobile ? 'Fermer le menu' : collapsed ? 'Ouvrir le menu' : 'Réduire le menu'}
          >
            {isMobile ? <X size={24} /> : collapsed ? <Menu size={24} /> : <X size={24} />}
          </button>

          {/* Logo + Title */}
          {(!collapsed || isMobile) && (
            <>
              <Image
                src="/GoFight.png"
                alt="GoFight Logo"
                width={70}
                height={70}
                className="mb-3 drop-shadow-[0_0_10px_rgba(255,214,10,0.4)]"
                priority
              />
              <h1 className="text-lg font-extrabold text-yellow-400 tracking-wide mb-8 text-center">
                GoFight Admin
              </h1>
            </>
          )}

          {/* Collapsed Logo */}
          {collapsed && !isMobile && (
            <Image
              src="/GoFight.png"
              alt="GoFight Logo"
              width={40}
              height={40}
              className="mb-3 drop-shadow-[0_0_10px_rgba(255,214,10,0.4)]"
              priority
            />
          )}
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
                  ${collapsed && !isMobile ? 'justify-center' : ''}
                  ${
                    isActive
                      ? 'bg-yellow-500 text-black font-semibold shadow-lg'
                      : 'text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-400'
                  }
                `}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {(!collapsed || isMobile) && <span className="truncate">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* === Footer / Logout === */}
        <div
          className={`
            p-4 border-t border-yellow-500/10 
            ${collapsed && !isMobile ? 'flex justify-center' : ''}
          `}
        >
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 text-yellow-400 hover:text-yellow-200 
              transition-colors duration-200 w-full
              ${collapsed && !isMobile ? 'justify-center' : ''}
            `}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {(!collapsed || isMobile) && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
