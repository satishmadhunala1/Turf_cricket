import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="font-display font-bold text-2xl text-gradient">TurfBook</Link>
            <p className="mt-4 text-slate-500 text-sm leading-relaxed">
              India's premium sports venue booking platform. Book cricket turfs instantly with real-time availability.
            </p>
            <div className="flex gap-3 mt-6">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-brand-100 hover:text-brand-600 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              {['Find Turfs', 'How It Works', 'Pricing', 'Become a Partner'].map((item) => (
                <li key={item}><Link to="/turfs" className="hover:text-brand-600 transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              {['Help Center', 'Cancellation Policy', 'Terms of Service', 'Privacy Policy'].map((item) => (
                <li key={item}><a href="#" className="hover:text-brand-600 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-600" /> support@turfbook.com</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-600" /> +91 98765 43210</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-600" /> Hyderabad, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} TurfBook. All rights reserved.</p>
          <p>Made with passion for sports enthusiasts</p>
        </div>
      </div>
    </footer>
  );
}
