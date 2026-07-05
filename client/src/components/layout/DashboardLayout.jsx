import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Heart, Bell, Wallet, User, FileText, Settings, Menu, X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/dashboard/bookings', icon: Calendar, label: 'My Bookings' },
  { to: '/dashboard/favorites', icon: Heart, label: 'Favourites' },
  { to: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
  { to: '/dashboard/wallet', icon: Wallet, label: 'Wallet' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
  { to: '/dashboard/invoices', icon: FileText, label: 'Invoices' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function DashboardLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 glass-card rounded-2xl p-4 h-fit lg:block ${sidebarOpen ? 'block' : 'hidden'}`}>
            <div className="mb-6 px-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Dashboard</p>
              <p className="font-semibold text-white mt-1">{user?.name}</p>
            </div>
            <nav className="space-y-1">
              {links.map(({ to, icon: Icon, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      isActive ? 'bg-brand-500/20 text-brand-400' : 'text-slate-400 hover:text-black'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </aside>

          <div className="flex-1 min-w-0">
            <button className="lg:hidden mb-4 p-2 glass rounded-lg" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
