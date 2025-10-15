'use client'
import { Sidebar } from '../../components/Sidebar'
import { Navbar } from '../../components/Navbar'

export default function DashboardLayout({ children }) {
  return (
    <div className="bg-gray-50 min-h-screen flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}