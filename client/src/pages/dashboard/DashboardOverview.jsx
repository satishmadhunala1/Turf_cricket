import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Heart, Wallet, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookingApi, userApi } from '../../api/endpoints';
import Button from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';

export default function DashboardOverview() {
  const { user } = useAuth();
  const [upcoming, setUpcoming] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      bookingApi.getMy({ upcoming: 'true' }),
      userApi.getWallet(),
    ]).then(([b, w]) => {
      setUpcoming((b.data.data || []).slice(0, 3));
      setWallet(w.data.data?.balance || 0);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
      <p className="text-slate-400 mt-1">Here's what's happening with your bookings</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        {[
          { icon: Calendar, label: 'Upcoming', value: upcoming.length, color: 'text-brand-400' },
          { icon: Wallet, label: 'Wallet Balance', value: `₹${wallet}`, color: 'text-emerald-400' },
          { icon: Heart, label: 'Quick Action', value: 'Book Now', color: 'text-pink-400', link: '/turfs' },
        ].map(({ icon: Icon, label, value, color, link }) => (
          <div key={label} className="glass-card rounded-2xl p-5">
            <Icon className={`w-6 h-6 ${color} mb-3`} />
            <p className="text-sm text-slate-500">{label}</p>
            {link ? (
              <Link to={link} className="font-semibold text-brand-400 hover:underline">{value}</Link>
            ) : (
              <p className="text-2xl font-bold mt-1">{value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Upcoming Bookings</h2>
          <Link to="/dashboard/bookings"><Button variant="ghost" size="sm">View All</Button></Link>
        </div>
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
        ) : upcoming.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-slate-400 mt-3">No upcoming bookings</p>
            <Link to="/turfs"><Button className="mt-4" size="sm">Book a Turf</Button></Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((b) => (
              <div key={b._id} className="glass-card rounded-xl p-4 flex items-center gap-4">
                <img src={b.turf?.coverImage} alt="" className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-medium">{b.turf?.name}</p>
                  <p className="text-sm text-slate-400">{new Date(b.bookingDate).toLocaleDateString('en-IN')} · {b.startTime} – {b.endTime}</p>
                </div>
                <span className="text-brand-400 font-semibold">₹{b.totalAmount}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
