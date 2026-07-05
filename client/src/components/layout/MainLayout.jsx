import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToSection from './ScrollToSection';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <ScrollToSection />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
