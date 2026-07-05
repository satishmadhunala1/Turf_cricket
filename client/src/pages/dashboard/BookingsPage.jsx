import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingApi } from '../../api/endpoints';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';

const statusVariant = { pending: 'warning', confirmed: 'success', cancelled: 'danger', completed: 'default' };

export default function BookingsPage({ upcoming = false }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingApi.getMy({ upcoming: upcoming ? 'true' : undefined })
      .then(({ data }) => setBookings(data.data || []))
      .finally(() => setLoading(false));
  }, [upcoming]);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await bookingApi.cancel(id);
      setBookings((b) => b.map((bk) => bk._id === id ? { ...bk, status: 'cancelled' } : bk));
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>;

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16">
        <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
        <p className="text-slate-400 mt-4">No bookings yet</p>
        <Link to="/turfs"><Button className="mt-4">Find Turfs</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((b) => (
        <div key={b._id} className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row gap-4">
          <img src={b.turf?.coverImage} alt="" className="w-full sm:w-32 h-24 object-cover rounded-xl" />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold">{b.turf?.name}</h3>
                <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" /> {b.turf?.location?.area}
                </p>
              </div>
              <Badge variant={statusVariant[b.status]}>{b.status}</Badge>
            </div>
            <p className="text-sm mt-2">
              {new Date(b.bookingDate).toLocaleDateString('en-IN')} · {b.startTime} – {b.endTime}
            </p>
            <div className="flex items-center justify-between mt-3">
              <span className="font-semibold text-brand-400">₹{b.totalAmount}</span>
              <div className="flex gap-2">
                <Link to={`/booking/success/${b._id}`}><Button variant="ghost" size="sm">Details</Button></Link>
                {['pending', 'confirmed'].includes(b.status) && (
                  <Button variant="danger" size="sm" onClick={() => handleCancel(b._id)}><X className="w-3.5 h-3.5" /> Cancel</Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
