import { useEffect, useState } from 'react';
import { MapPin, Calendar, DollarSign, Star } from 'lucide-react';
import { ownerApi } from '../../api/endpoints';
import Badge from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ownerApi.getDashboard().then(({ data: res }) => setData(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pt-24 px-4 max-w-7xl mx-auto"><Skeleton className="h-64 w-full" /></div>;

  const { stats, turfs, upcomingBookings } = data || {};

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="font-display text-3xl font-bold">Owner Dashboard</h1>
      <p className="text-slate-400 mt-1">Manage your turfs and bookings</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {[
          { icon: MapPin, label: 'My Turfs', value: stats?.turfs || 0 },
          { icon: Calendar, label: 'Bookings', value: stats?.bookings || 0 },
          { icon: DollarSign, label: 'Revenue', value: `₹${stats?.revenue || 0}` },
          { icon: Star, label: 'Reviews', value: stats?.reviews || 0 },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="glass-card rounded-2xl p-5">
            <Icon className="w-6 h-6 text-brand-400" />
            <p className="text-sm text-slate-500 mt-3">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Your Turfs</h2>
          {(turfs || []).map((t) => (
            <div key={t._id} className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
              <img src={t.coverImage} alt="" className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-medium">{t.name}</p>
                <p className="text-sm text-slate-500">₹{t.pricePerHour}/hr</p>
              </div>
              <Badge variant={t.isActive ? 'success' : 'danger'}>{t.isActive ? 'Active' : 'Inactive'}</Badge>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Upcoming Bookings</h2>
          {(upcomingBookings || []).length === 0 ? (
            <p className="text-slate-500 text-sm">No upcoming bookings</p>
          ) : (
            upcomingBookings.map((b) => (
              <div key={b._id} className="py-3 border-b border-white/5 last:border-0">
                <p className="font-medium">{b.user?.name}</p>
                <p className="text-sm text-slate-400">{b.turf?.name} · {new Date(b.bookingDate).toLocaleDateString('en-IN')} · {b.startTime}–{b.endTime}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
