import { Link } from 'react-router-dom';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { TURF_IMAGES } from '../../utils/images';

const CITY_GRADIENTS = {
  Hyderabad: 'from-emerald-600 to-teal-800',
  Mumbai: 'from-blue-600 to-indigo-800',
  Bangalore: 'from-green-600 to-emerald-800',
  Delhi: 'from-orange-500 to-red-700',
  Chennai: 'from-cyan-600 to-blue-800',
  Pune: 'from-violet-600 to-purple-800',
};

export default function LocationCard({ loc, index = 0 }) {
  const gradient = CITY_GRADIENTS[loc.city] || 'from-brand-600 to-brand-800';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
    >
      <Link
        to={`/turfs?city=${encodeURIComponent(loc.city)}`}
        className="group relative block h-56 sm:h-64 rounded-3xl overflow-hidden shadow-lg shadow-slate-200/80 hover:shadow-xl hover:shadow-brand-500/15 transition-shadow"
      >
        <img
          src={TURF_IMAGES[index % TURF_IMAGES.length]}
          alt={loc.city}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-80 group-hover:opacity-75 transition-opacity`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="relative h-full flex flex-col justify-between p-6 text-white">
          <div className="flex justify-between items-start">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium">
              <MapPin className="w-3.5 h-3.5" />
              {loc.count} {loc.count === 1 ? 'venue' : 'venues'}
            </span>
            <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white group-hover:text-brand-700 transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>

          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold">{loc.city}</h3>
            <p className="text-white/80 text-sm mt-1">From ₹{loc.avgPrice?.toLocaleString('en-IN')}/hour</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
