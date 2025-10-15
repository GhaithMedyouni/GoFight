'use client'
import { Dumbbell, Users, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export function Sidebar() {
  const router = useRouter()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white flex flex-col justify-between shadow-2xl border-r border-white/10">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-10 tracking-tight flex items-center gap-2 text-gym-accent">
          🏋️ <span className="text-white">Gym Admin</span>
        </h1>

        {/* Menu */}
        <nav className="space-y-3 text-base font-medium">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#2563eb] hover:text-white transition-colors duration-200"
          >
            <Dumbbell size={20} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => router.push('/users')}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#2563eb] hover:text-white transition-colors duration-200"
          >
            <Users size={20} />
            <span>Users</span>
          </button>
        </nav>
      </div>

      {/* Logout */}
      <div className="p-6 border-t border-white/10">
        <button
          onClick={() => router.push('/login')}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors duration-200"
        >
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}