'use client'
import { useState } from 'react'
import { Sidebar } from '../../components/Sidebar'
import { Navbar } from '../../components/Navbar'

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#0B0B0B] text-white transition-all duration-300">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Contenu principal */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          collapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
