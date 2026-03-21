import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export function AppLayout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100">
      <Navbar />
      <main className="flex-1 overflow-y-auto [scrollbar-gutter:stable]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
