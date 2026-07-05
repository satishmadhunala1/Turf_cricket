import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingApi } from '../../api/endpoints';
import { PageTransition } from '../../components/motion/Motion';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

export default function BookingSuccessPage() {
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const bookingId = paramId || searchParams.get('bookingId');
  const sessionId = searchParams.get('session_id');

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        if (sessionId) {
          await bookingApi.confirmPayment({ bookingId, sessionId, method: 'stripe' });
          toast.success('Payment confirmed! Booking is now active.');
        }
        const { data } = await bookingApi.getById(bookingId);
        setBooking(data.data);
      } catch (err) {
        toast.error(err.message || 'Could not load booking');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [bookingId, sessionId]);

  if (loading) return <div className="pt-32 px-4 max-w-lg mx-auto"><Skeleton className="h-64 w-full" /></div>;

  if (!bookingId) {
    return (
      <PageTransition className="pt-32 text-center px-4">
        <p className="text-slate-500">Invalid booking link</p>
        <Link to="/turfs"><Button className="mt-4">Browse Turfs</Button></Link>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="pt-24 pb-16 px-4 max-w-lg mx-auto text-center">
      <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-brand-600" />
      </div>
      <h1 className="font-display text-3xl font-bold mt-6 text-slate-900">Booking Confirmed!</h1>
      <p className="text-slate-500 mt-2">Your turf is reserved. See you on the field!</p>

      {booking && (
        <div className="glass-card rounded-2xl p-6 mt-8 text-left space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-sm">Invoice</span>
            <Badge variant="brand">{booking.invoiceNumber}</Badge>
          </div>
          <div>
            <p className="font-semibold text-lg text-slate-900">{booking.turf?.name}</p>
            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
              <Calendar className="w-4 h-4" />
              {new Date(booking.bookingDate).toLocaleDateString('en-IN')} · {booking.startTime} – {booking.endTime}
            </p>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-4">
            <span className="text-slate-600">Total Paid</span>
            <span className="font-bold text-brand-600">₹{booking.totalAmount}</span>
          </div>
          <Badge variant={booking.status === 'confirmed' ? 'success' : 'warning'}>{booking.status}</Badge>
          {booking.payment?.status && (
            <p className="text-sm text-slate-500">Payment: <span className="font-medium text-slate-700">{booking.payment.status}</span></p>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Link to="/dashboard/bookings" className="flex-1"><Button variant="secondary" className="w-full">View Bookings</Button></Link>
        <Link to="/turfs" className="flex-1"><Button className="w-full">Book Another</Button></Link>
      </div>
    </PageTransition>
  );
}
