import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { adminApi } from '../../api/endpoints';
import Badge from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-sm text-slate-500 mt-4">{label}</p>
      <p className="text-2xl font-bold mt-1 text-slate-900">{value}</p>
    </div>
  );
}

const statusVariant = { pending: 'warning', confirmed: 'success', cancelled: 'danger', completed: 'default' };
const paymentVariant = { pending: 'warning', completed: 'success', failed: 'danger', processing: 'warning', refunded: 'default' };

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard().then(({ data: res }) => setData(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pt-24 px-4 max-w-7xl mx-auto grid grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>;

  const { stats, recentBookings } = data || {};

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <h1 className="font-display text-3xl font-bold text-slate-900">Admin Dashboard</h1>
      <p className="text-slate-500 mt-1">Platform overview and management</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <StatCard icon={Users} label="Total Users" value={stats?.users || 0} color="bg-blue-100 text-blue-600" />
        <StatCard icon={MapPin} label="Active Turfs" value={stats?.turfs || 0} color="bg-brand-100 text-brand-600" />
        <StatCard icon={Calendar} label="Total Bookings" value={stats?.bookings || 0} color="bg-purple-100 text-purple-600" />
        <StatCard icon={DollarSign} label="Revenue" value={`₹${stats?.revenue || 0}`} color="bg-amber-100 text-amber-600" />
      </div>

      <div className="glass-card rounded-2xl p-6 mt-8">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-slate-900">
          <TrendingUp className="w-5 h-5 text-brand-600" /> Recent Bookings
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 border-b border-slate-100">
                <th className="text-left py-3 px-2">User</th>
                <th className="text-left py-3 px-2">Turf</th>
                <th className="text-left py-3 px-2">Date</th>
                <th className="text-left py-3 px-2">Amount</th>
                <th className="text-left py-3 px-2">Booking</th>
                <th className="text-left py-3 px-2">Payment</th>
              </tr>
            </thead>
            <tbody>
              {(recentBookings || []).map((b) => (
                <tr key={b._id} className="border-b border-slate-50">
                  <td className="py-3 px-2 text-slate-800">{b.user?.name}</td>
                  <td className="py-3 px-2 text-slate-600">{b.turf?.name}</td>
                  <td className="py-3 px-2 text-slate-600">{new Date(b.bookingDate).toLocaleDateString('en-IN')}</td>
                  <td className="py-3 px-2 text-brand-600 font-medium">₹{b.totalAmount}</td>
                  <td className="py-3 px-2"><Badge variant={statusVariant[b.status]}>{b.status}</Badge></td>
                  <td className="py-3 px-2">
                    <Badge variant={paymentVariant[b.payment?.status] || 'warning'}>
                      {b.payment?.status || 'pending'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
