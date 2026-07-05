import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, User, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { scrollToSection } from './ScrollToSection';
import Button from '../ui/Button';

const sectionLinks = [
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'faq', label: 'FAQ' },
];

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isOwner, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSectionClick = (id) => {
    scrollToSection(id, navigate, location.pathname);
    setOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${isLanding ? 'bg-white/90 backdrop-blur-md border-b border-slate-100' : 'glass border-b border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="font-display font-bold text-2xl text-gradient">
            TurfBook
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/turfs" className="text-sm text-slate-600 hover:text-brand-600 transition-colors font-medium">
              Find Turfs
            </Link>
            {sectionLinks.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => handleSectionClick(l.id)}
                className="text-sm text-slate-600 hover:text-brand-600 transition-colors font-medium"
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm"><Shield className="w-4 h-4" /> Admin</Button>
                  </Link>
                )}
                {isOwner && (
                  <Link to="/owner">
                    <Button variant="ghost" size="sm"><LayoutDashboard className="w-4 h-4" /> Owner</Button>
                  </Link>
                )}
                <Link to="/dashboard">
                  <Button variant="secondary" size="sm"><User className="w-4 h-4" /> {user?.name?.split(' ')[0]}</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="w-4 h-4" /></Button>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
                <Link to="/register"><Button size="sm">Get Started</Button></Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-slate-700" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-slate-200 px-4 py-4 space-y-3">
          <Link to="/turfs" className="block py-2 text-slate-600" onClick={() => setOpen(false)}>Find Turfs</Link>
          {sectionLinks.map((l) => (
            <button key={l.id} type="button" className="block py-2 text-slate-600 w-full text-left" onClick={() => handleSectionClick(l.id)}>
              {l.label}
            </button>
          ))}
          {!isAuthenticated ? (
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="flex-1" onClick={() => setOpen(false)}><Button variant="secondary" className="w-full">Login</Button></Link>
              <Link to="/register" className="flex-1" onClick={() => setOpen(false)}><Button className="w-full">Sign Up</Button></Link>
            </div>
          ) : (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)}><Button className="w-full">Dashboard</Button></Link>
              <Button variant="ghost" className="w-full" onClick={handleLogout}>Sign Out</Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
