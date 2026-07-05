import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingApi } from '../../api/endpoints';
import { PageTransition } from '../../components/motion/Motion';
import Button from '../../components/ui/Button';
import TurfImage from '../../components/ui/TurfImage';

export default function BookingPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [loading, setLoading] = useState(false);

  const { date, slot, turf } = state || {};

  if (!date || !slot || !turf) {
    return (
      <div className="pt-32 text-center px-4">
        <p className="text-slate-500">Invalid booking session</p>
        <Button className="mt-4" onClick={() => navigate(`/turfs/${id}`)}>Go Back</Button>
      </div>
    );
  }

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const { data } = await bookingApi.create({
        turfId: id,
        bookingDate: date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        paymentMethod,
      });

      const { booking, payment } = data.data;

      if (payment?.url) {
        toast.loading('Redirecting to secure payment...');
        window.location.href = payment.url;
      } else {
        toast.success('Booking created!');
        navigate(`/booking/success/${booking._id}`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold mb-8 text-slate-900">Booking Summary</h1>

      <div className="glass-card rounded-2xl overflow-hidden">
        <TurfImage src={turf.coverImage} alt={turf.name} className="w-full h-48 object-cover" />
        <div className="p-6 space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{turf.name}</h2>
            <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" /> {turf.location?.area}, {turf.location?.city}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <Calendar className="w-5 h-5 text-brand-600 mb-2" />
              <p className="text-xs text-slate-400">Date</p>
              <p className="font-medium text-slate-800">{new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <Clock className="w-5 h-5 text-brand-600 mb-2" />
              <p className="text-xs text-slate-400">Time</p>
              <p className="font-medium text-slate-800">{slot.startTime} – {slot.endTime}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Payment Method
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'stripe', label: 'Card (Stripe)' },
                { id: 'cash', label: 'Pay at Venue' },
              ].map(({ id: method, label }) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`p-3 rounded-xl text-sm transition-all border ${
                    paymentMethod === method
                      ? 'bg-brand-50 border-brand-500 text-brand-700 font-medium'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
            <span className="text-lg font-semibold text-slate-800">Total Amount</span>
            <span className="text-2xl font-bold text-brand-600">₹{slot.price}</span>
          </div>

          <Button className="w-full" size="lg" loading={loading} onClick={handleConfirm}>
            Confirm Booking
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
