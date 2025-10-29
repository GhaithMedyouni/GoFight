'use client'
import { useState } from 'react'
import { Sidebar } from '../../components/Sidebar'
import { Navbar } from '../../components/Navbar'

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)

  const sidebarWidth = collapsed ? 80 : 260 // Largeur sidebar en px

  return (
    <div className="min-h-screen flex bg-[#0B0B0B] text-white overflow-hidden">
      {/* === SIDEBAR FIXE === */}
      <aside
        className="fixed top-0 left-0 h-full bg-[#0B0B0B] border-r border-yellow-500/20 transition-all duration-300"
        style={{ width: `${sidebarWidth}px` }}
      >
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>

      {/* === CONTENU PRINCIPAL === */}
      <div
        className="flex flex-col flex-1 transition-all duration-300"
        style={{ marginLeft: `${sidebarWidth}px`, backgroundColor: '#0B0B0B' }}
      >
        <Navbar />
        <main className="flex-1 p-6 bg-[#0B0B0B]">{children}</main>
      </div>
    </div>
  )
}
