'use client'

import { useState } from 'react'
import { Sidebar } from '../../components/Sidebar'
import { Navbar } from '../../components/Navbar'

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex transition-all duration-300">
      {/* === Sidebar === */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* === Main Content === */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          collapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {/* Navbar (fixée en haut) */}
        <Navbar />

        {/* Contenu principal */}
        <main className="min-h-screen pt-16">
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
