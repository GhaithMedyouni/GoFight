'use client'
export function Navbar() {
  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
      <h2 className="text-xl font-semibold text-gym-secondary">Dashboard</h2>
      <div className="flex items-center gap-3">
        <span className="font-large">Ziyed</span>
        <img src="" alt="Admin" className="w-12 h-12 rounded-full border" />
      </div>
    </header>
  )
}