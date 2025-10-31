'use client';

import { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? 80 : 260; // Sidebar width (responsive toggle)

  return (
    <div className="min-h-screen flex bg-[#0B0B0B] text-white overflow-hidden">
      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 h-full border-r border-yellow-500/20 transition-all duration-300 bg-[#0B0B0B]"
        style={{ width: `${sidebarWidth}px` }}
      >
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>

      {/* Main content area */}
      <div
        className="flex flex-col flex-1 transition-all duration-300"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <Navbar collapsed={collapsed} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 bg-[#0B0B0B] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
