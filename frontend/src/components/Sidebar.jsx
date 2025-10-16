'use client'
import Image from 'next/image'
import { Users, LogOut, Activity, Dumbbell, Shield, Flame, Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function Sidebar({ collapsed, setCollapsed }) {
  const router = useRouter()

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-[#0B0B0B] text-white flex flex-col justify-between shadow-[0_0_25px_rgba(255,214,10,0.3)] border-r border-yellow-500/20 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* === Header === */}
      <div className="p-4 flex flex-col items-center">
        {/* Bouton collapse */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="self-end text-yellow-400 hover:text-yellow-300 mb-4 transition"
          title={collapsed ? 'Ouvrir le menu' : 'Réduire le menu'}
        >
          {collapsed ? <Menu size={24} /> : <X size={24} />}
        </button>

        {/* Logo + titre */}
        {!collapsed && (
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
      </div>

      {/* === Menu === */}
      <nav className="flex flex-col gap-2 text-base font-medium px-3">
        {[
          { icon: Activity, label: 'Dashboard', route: '/dashboard' },
          { icon: Shield, label: 'KickBoxing', route: '/dashboard/kickboxing' },
          { icon: Dumbbell, label: 'Boxing Anglaise', route: '/dashboard/boxing' },
          { icon: Flame, label: 'Crossfit', route: '/dashboard/crossfit' },
          
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => router.push(item.route)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-yellow-500 hover:text-black transition-all duration-200 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* === Footer / Logout === */}
      <div className={`p-4 border-t border-yellow-500/10 ${collapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={() => router.push('/login')}
          className="flex items-center gap-2 text-yellow-400 hover:text-yellow-200 transition-colors duration-200"
        >
          <LogOut size={18} />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  )
}
