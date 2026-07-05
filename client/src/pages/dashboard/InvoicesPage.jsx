import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { bookingApi } from '../../api/endpoints';
import Badge from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

export default function InvoicesPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingApi.getMy().then(({ data }) => setBookings(data.data || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Invoices</h1>
      {bookings.length === 0 ? (
        <div className="text-center py-16 text-slate-400"><FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />No invoices yet</div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b._id} className="glass-card rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-medium">{b.invoiceNumber}</p>
                <p className="text-sm text-slate-400">{b.turf?.name} · {new Date(b.bookingDate).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-brand-400">₹{b.totalAmount}</span>
                <Badge variant={b.status === 'confirmed' ? 'success' : 'default'}>{b.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
