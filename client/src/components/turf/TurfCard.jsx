import { Link } from 'react-router-dom';
import { Star, MapPin, Clock } from 'lucide-react';
import { HoverLift } from '../motion/Motion';
import Badge from '../ui/Badge';
import TurfImage from '../ui/TurfImage';

export default function TurfCard({ turf, index = 0 }) {
  return (
    <HoverLift>
      <Link to={`/turfs/${turf._id}`} className="group block glass-card rounded-2xl overflow-hidden hover:border-brand-300 hover:shadow-lg transition-all">
        <div className="relative h-52 overflow-hidden bg-slate-100">
          <TurfImage
            src={turf.coverImage}
            alt={turf.name}
            index={index}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {turf.isFeatured && (
            <Badge variant="brand" className="absolute top-3 left-3">Featured</Badge>
          )}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
              <h3 className="font-display font-bold text-base text-slate-900">{turf.name}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                {turf.location?.area}, {turf.location?.city}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-semibold text-slate-800">{turf.rating?.toFixed(1) || 'New'}</span>
            </div>
          </div>
        </div>
        <div className="p-4 flex items-center justify-between bg-white">
          <div className="flex flex-wrap gap-1.5">
            {turf.amenities?.slice(0, 3).map((a) => (
              <Badge key={a}>{a}</Badge>
            ))}
          </div>
          <div className="text-right shrink-0 ml-3">
            <p className="text-brand-600 font-bold text-lg">₹{turf.pricePerHour}</p>
            <p className="text-xs text-slate-400 flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3" /> per hour
            </p>
          </div>
        </div>
      </Link>
    </HoverLift>
  );
}
