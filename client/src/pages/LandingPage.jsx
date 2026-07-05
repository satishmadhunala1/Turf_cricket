import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, MapPin, Star, Shield, Clock, Zap, ChevronDown, Smartphone,
  Calendar, CreditCard, CheckCircle, Quote, TrendingUp, Users,
} from 'lucide-react';
import { turfApi } from '../api/endpoints';
import TurfCard from '../components/turf/TurfCard';
import LocationCard from '../components/turf/LocationCard';
import { TurfGridSkeleton } from '../components/ui/Skeleton';
import { FadeUp } from '../components/motion/Motion';
import Button from '../components/ui/Button';
import { HERO_IMAGE } from '../utils/images';

const faqs = [
  { q: 'How do I book a turf?', a: 'Search for turfs in your city, pick a date and time slot, and confirm your booking with secure online payment.' },
  { q: 'Can I cancel my booking?', a: 'Yes, you can cancel up to 4 hours before your slot. Refunds are processed within 3-5 business days.' },
  { q: 'What payment methods are accepted?', a: 'We support Stripe card payments and pay-at-venue (cash) options.' },
  { q: 'Are the turfs verified?', a: 'Every turf on TurfBook is verified by our team for quality, safety, and accurate availability.' },
];

const reviews = [
  { name: 'Rahul Sharma', text: 'Booked a turf in 2 minutes. The experience felt like BookMyShow but for sports!', rating: 5, city: 'Hyderabad' },
  { name: 'Priya Reddy', text: 'Love the real-time slot availability. No more calling venues back and forth.', rating: 5, city: 'Bangalore' },
  { name: 'Arjun Patel', text: 'Premium UI and seamless booking. Our corporate cricket league uses TurfBook every week.', rating: 5, city: 'Mumbai' },
];

const quickCities = ['Hyderabad', 'Mumbai', 'Bangalore', 'Chennai', 'Pune'];

export default function LandingPage() {
  const [featured, setFeatured] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    Promise.all([turfApi.getFeatured(), turfApi.getPopularLocations()])
      .then(([f, l]) => {
        setFeatured(f.data.data || []);
        setLocations(l.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-hidden bg-white">
      {/* Hero — split layout */}
      <section className="relative pt-24 lg:pt-28 pb-16 lg:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-emerald-50/40" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — copy + search */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-700 text-sm font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                India's #1 Turf Booking Platform
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-slate-900">
                Your next match starts with{' '}
                <span className="text-gradient">one booking</span>
              </h1>

              <p className="mt-6 text-lg text-slate-600 max-w-lg leading-relaxed">
                Find premium cricket turfs near you. Real-time slots, instant confirmation, and verified venues — like BookMyShow for sports.
              </p>

              {/* Search box */}
              <div className="mt-8 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-2 max-w-xl">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex items-center gap-3 px-4 py-3.5 bg-slate-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-brand-600 shrink-0" />
                    <input
                      type="text"
                      placeholder="Where do you want to play?"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="bg-transparent w-full text-slate-900 placeholder:text-slate-400 focus:outline-none text-sm"
                    />
                  </div>
                  <Link to={`/turfs${searchCity ? `?city=${encodeURIComponent(searchCity)}` : ''}`} className="shrink-0">
                    <Button className="w-full sm:w-auto h-full min-h-[48px] px-8">
                      <Search className="w-5 h-5" /> Find Turfs
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2 px-2 pt-3 pb-1">
                  <span className="text-xs text-slate-400 py-1">Popular:</span>
                  {quickCities.map((city) => (
                    <Link
                      key={city}
                      to={`/turfs?city=${city}`}
                      className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-brand-100 hover:text-brand-700 transition-colors font-medium"
                    >
                      {city}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Stats row */}
              <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
                {[
                  { icon: TrendingUp, val: '500+', label: 'Turfs' },
                  { icon: Users, val: '50K+', label: 'Bookings' },
                  { icon: Star, val: '4.8', label: 'Rating' },
                ].map(({ icon: Icon, val, label }) => (
                  <div key={label} className="text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5">
                      <Icon className="w-4 h-4 text-brand-600 hidden sm:block" />
                      <span className="text-2xl font-bold text-slate-900">{val}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — hero image + floating card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/50 aspect-[4/5] max-h-[560px]">
                <img src={HERO_IMAGE} alt="Cricket turf" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Floating booking card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute -bottom-6 -left-8 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 w-64"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Slot Confirmed!</p>
                    <p className="text-xs text-slate-500">Today · 6:00 PM</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-sm">
                  <span className="text-slate-500">Elite Cricket Arena</span>
                  <span className="font-bold text-brand-600">₹2,500</span>
                </div>
              </motion.div>

              {/* Rating pill */}
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <div>
                  <p className="text-sm font-bold text-slate-900">4.8</p>
                  <p className="text-[10px] text-slate-500">2k+ reviews</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Locations */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-brand-600 text-sm font-semibold uppercase tracking-wider">Explore Cities</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-slate-900 mt-2">Popular Locations</h2>
              <p className="text-slate-500 mt-2 max-w-md">Discover top-rated cricket turfs in India's biggest sports hubs</p>
            </div>
            <Link to="/turfs">
              <Button variant="outline" size="sm">View all cities</Button>
            </Link>
          </FadeUp>

          {locations.length === 0 && !loading ? (
            <p className="text-center text-slate-500 py-12">No locations available yet</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {locations.map((loc, i) => (
                <FadeUp key={loc.city} delay={i}>
                  <LocationCard loc={loc} index={i} />
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Turfs */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <span className="text-brand-600 text-sm font-semibold uppercase tracking-wider">Top Picks</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-slate-900 mt-2">Featured Turfs</h2>
              <p className="text-slate-500 mt-2">Handpicked premium venues loved by players</p>
            </div>
            <Link to="/turfs"><Button variant="outline">View All Turfs</Button></Link>
          </FadeUp>
          {loading ? <TurfGridSkeleton count={4} /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((turf, i) => <TurfCard key={turf._id} turf={turf} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-14">
            <span className="text-brand-600 text-sm font-semibold uppercase tracking-wider">Why TurfBook</span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-slate-900 mt-2">Built for players</h2>
            <p className="text-slate-500 mt-2">Everything you need for hassle-free turf booking</p>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: 'Instant Booking', desc: 'Book in under 60 seconds with real-time slot availability', color: 'bg-amber-100 text-amber-600' },
              { icon: Shield, title: 'Verified Venues', desc: 'Every turf is quality-checked and verified by our team', color: 'bg-blue-100 text-blue-600' },
              { icon: Clock, title: 'Flexible Slots', desc: '30-minute slots from 6 AM to 11 PM, 7 days a week', color: 'bg-purple-100 text-purple-600' },
              { icon: CreditCard, title: 'Secure Payments', desc: 'Stripe & pay-at-venue with instant confirmation', color: 'bg-brand-100 text-brand-600' },
            ].map(({ icon: Icon, title, desc, color }, i) => (
              <FadeUp key={title} delay={i}>
                <div className="bg-white rounded-2xl p-6 h-full border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-200 transition-all">
                  <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mt-4 text-slate-900">{title}</h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-14">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-slate-900">How Booking Works</h2>
            <p className="text-slate-500 mt-2">Three simple steps to your next game</p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200" />
            {[
              { icon: Search, step: '01', title: 'Search & Compare', desc: 'Find turfs by city, price, rating, and amenities' },
              { icon: Calendar, step: '02', title: 'Pick Date & Slot', desc: 'Choose your preferred date and available time slot' },
              { icon: CheckCircle, step: '03', title: 'Book & Play', desc: 'Pay securely and receive instant booking confirmation' },
            ].map(({ icon: Icon, step, title, desc }, i) => (
              <FadeUp key={step} delay={i}>
                <div className="text-center relative">
                  <div className="relative inline-flex">
                    <div className="w-20 h-20 rounded-2xl bg-brand-50 border-2 border-brand-200 flex items-center justify-center mx-auto">
                      <Icon className="w-8 h-8 text-brand-600" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center shadow-lg">{step}</span>
                  </div>
                  <h3 className="font-semibold mt-5 text-lg text-slate-900">{title}</h3>
                  <p className="text-slate-500 mt-2 text-sm max-w-xs mx-auto">{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-14">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-slate-900">What Players Say</h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <FadeUp key={r.name} delay={i}>
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-full">
                  <Quote className="w-8 h-8 text-brand-200" />
                  <p className="mt-4 text-slate-600 leading-relaxed">{r.text}</p>
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <p className="font-semibold text-slate-900">{r.name}</p>
                      <p className="text-sm text-slate-500">{r.city}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: r.rating }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* App Download */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="bg-gradient-to-br from-brand-600 to-emerald-700 rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-10 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="flex-1 relative">
                <h2 className="font-display text-3xl font-bold">Book On The Go</h2>
                <p className="text-white/80 mt-3 leading-relaxed max-w-md">Download the TurfBook app for faster bookings, push notifications, and exclusive deals.</p>
                <div className="flex gap-3 mt-6">
                  <Button variant="secondary" className="!bg-white !text-brand-700 hover:!bg-brand-50"><Smartphone className="w-4 h-4" /> App Store</Button>
                  <Button variant="secondary" className="!bg-white/20 !text-white !border-white/30 hover:!bg-white/30"><Smartphone className="w-4 h-4" /> Google Play</Button>
                </div>
              </div>
              <div className="w-44 h-80 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center relative">
                <Smartphone className="w-16 h-16 text-white/40" />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-10">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-slate-900">FAQ</h2>
            <p className="text-slate-500 mt-2">Common questions answered</p>
          </FadeUp>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FadeUp key={i} delay={i}>
                <button
                  type="button"
                  className="w-full bg-white rounded-xl p-5 text-left border border-slate-100 shadow-sm hover:border-brand-200 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-medium text-slate-900">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </div>
                  {openFaq === i && <p className="mt-3 text-sm text-slate-500 leading-relaxed">{faq.a}</p>}
                </button>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
